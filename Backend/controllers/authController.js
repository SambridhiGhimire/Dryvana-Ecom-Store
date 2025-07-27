const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const validator = require("validator");

// Register Controller
const register = async (req, res) => {
  try {
    let { name, email, password, token } = req.body;
    // Sanitize inputs
    name = validator.trim(name || "");
    name = validator.escape(name);
    email = validator.trim(email || "");
    email = validator.normalizeEmail(email);
    password = validator.trim(password || "");
    // Validate name
    if (!/^[A-Za-z\s]{2,}$/.test(name)) {
      return res.status(400).json({ msg: "Name must be at least 2 letters and only contain letters and spaces." });
    }
    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format." });
    }
    // Validate password
    const strongPassword = password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    if (!strongPassword) {
      return res.status(400).json({ msg: "Password must be at least 8 characters, include upper, lower, number, and special character." });
    }
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });
    // Recaptcha
    const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`);
    const recaptchaData = await recaptchaResponse.json();
    if (!recaptchaData.success) return res.status(400).json({ msg: "Recaptcha verification failed" });
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emails: [{ address: email, verified: true }],
      passwordHistory: [hashedPassword],
      passwordLastChanged: now
    });
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password, twoFactorCode } = req.body;

    // Find user by any verified email
    const user = await User.findOne({
      $or: [
        { email },
        { emails: { $elemMatch: { address: email, verified: true } } }
      ]
    });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    if (user.isBlocked) return res.status(403).json({ msg: "User is blocked. Please contact support." });

    // Password expiry: 90 days
    if (user.passwordLastChanged && (Date.now() - new Date(user.passwordLastChanged).getTime()) > 90*24*60*60*1000) {
      return res.status(403).json({ msg: "Password expired. Please reset your password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // If 2FA is enabled, require code
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        // Frontend should prompt for 2FA code
        return res.status(206).json({ msg: "2FA required", twoFactorRequired: true, userId: user._id });
      }
      const speakeasy = require("speakeasy");
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: twoFactorCode
      });
      if (!verified) return res.status(400).json({ msg: "Invalid 2FA code" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Forgot Password Controller
const forgotPassword = async (req, res) => {
  console.log("Forgot password route hit", req.body);
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    // Email setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: "Password reset link sent to your email." });
  } catch (err) {
    res.status(500).json({ msg: "Failed to send reset email. Try again later." });
  }
};

// Reset Password Controller
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });
    // Validate password
    const strongPassword = password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    if (!strongPassword) {
      return res.status(400).json({ msg: "Password must be at least 8 characters, include upper, lower, number, and special character." });
    }
    // Prevent password reuse (last 5 passwords)
    for (const oldHash of (user.passwordHistory || [])) {
      if (await bcrypt.compare(password, oldHash)) {
        return res.status(400).json({ msg: "You cannot reuse your last 5 passwords." });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.passwordLastChanged = new Date();
    user.passwordHistory = [hashedPassword, ...(user.passwordHistory || [])].slice(0, 5);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ msg: "Password reset successful. Please login." });
  } catch (err) {
    res.status(500).json({ msg: "Failed to reset password. Try again later." });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword
};
