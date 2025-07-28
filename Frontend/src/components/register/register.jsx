import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, CheckCircle2 } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    token: "",
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form"); // "form" | "success"
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Validation
  const validateName = (name) => /^[A-Za-z\s]{2,}$/.test(name.trim());
  const validateEmail = (email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
  const validatePassword = (password) => {
    if (password.length < 8) return false;
    return /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  };
  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;
    if (password.length < 6) return 0;
    if (score >= 5) return 4;
    if (score === 4) return 3;
    if (score === 3) return 2;
    if (score === 2) return 1;
    return 0;
  };

  // UI colors for password strength
  const strengthLabels = ["Too short", "Weak", "Medium", "Strong", "Very strong"];
  const strengthColors = [
    "bg-gray-300",
    "bg-red-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-green-700",
  ];

  // Handle changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }
  };
  const handleRecaptchaChange = (token) => setForm({ ...form, token });

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!validateName(form.name)) newErrors.name = "Name must be at least 2 letters.";
    if (!validateEmail(form.email)) newErrors.email = "Invalid email address.";
    if (!validatePassword(form.password)) newErrors.password = "Password: 8+ chars, upper/lowercase, number, special.";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // On submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.token) {
      toast.error("🧢 Please verify you are human!");
      return;
    }
    if (!validateForm()) return;
    try {
      await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        token: form.token,
      });
      setStep("success");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      const msg = err.response?.data?.msg || "❌ Something went wrong";
      toast.error(`🥜 ${msg}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f5f1] flex items-center justify-center px-2 relative">
      {/* Floating artwork badge */}
      <motion.div
        className="absolute top-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -18, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15, type: "spring" }}
      >
        <div className="bg-white/90 shadow-xl border-2 border-[#a6763e] px-7 py-2 rounded-full flex items-center gap-2 font-bold text-lg text-[#a6763e]">
          <UserPlus className="w-6 h-6" /> New User
        </div>
      </motion.div>

      {/* Registration Card */}
      <motion.div
        className="relative w-full max-w-lg bg-white/95 border border-[#e5decf] shadow-2xl rounded-3xl px-8 py-12 flex flex-col items-center mt-24"
        initial={{ opacity: 0, y: 48, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 32 }}
              transition={{ duration: 0.45 }}
              className="w-full"
              autoComplete="off"
            >
              <h2 className="text-3xl font-extrabold mb-8 text-center text-[#3c2415]">
                Create Your Dryvana Account
              </h2>

              <div className="mb-6">
                <label className="text-xs font-semibold text-[#a6763e] block mb-2">Username</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="off"
                  className="w-full border-2 border-[#e1d2bb] bg-[#f9f5f1] py-3 px-4 rounded-xl focus:outline-none focus:border-[#a6763e] font-semibold text-lg"
                  required
                />
                {errors.name && <div className="text-xs text-red-600 mt-1">{errors.name}</div>}
              </div>
              <div className="mb-6">
                <label className="text-xs font-semibold text-[#a6763e] block mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="off"
                  className="w-full border-2 border-[#e1d2bb] bg-[#f9f5f1] py-3 px-4 rounded-xl focus:outline-none focus:border-[#a6763e] font-semibold text-lg"
                  required
                />
                {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
              </div>
              <div className="mb-6">
                <label className="text-xs font-semibold text-[#a6763e] block mb-2">Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="off"
                  className="w-full border-2 border-[#e1d2bb] bg-[#f9f5f1] py-3 px-4 rounded-xl focus:outline-none focus:border-[#a6763e] font-semibold text-lg"
                  required
                />
                {/* Strength meter */}
                <div className="flex gap-1 mt-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded ${passwordStrength > i ? strengthColors[passwordStrength] : "bg-gray-200"}`}
                    />
                  ))}
                </div>
                <div className="text-xs mt-1 text-gray-600">{strengthLabels[passwordStrength]}</div>
                {errors.password && <div className="text-xs text-red-600 mt-1">{errors.password}</div>}
              </div>
              <div className="mb-7">
                <label className="text-xs font-semibold text-[#a6763e] block mb-2">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="off"
                  className="w-full border-2 border-[#e1d2bb] bg-[#f9f5f1] py-3 px-4 rounded-xl focus:outline-none focus:border-[#a6763e] font-semibold text-lg"
                  required
                />
                {errors.confirmPassword && <div className="text-xs text-red-600 mt-1">{errors.confirmPassword}</div>}
              </div>
              <div className="mb-7">
                <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full bg-gradient-to-r from-[#a6763e] to-[#5c4033] text-white py-3 rounded-xl font-bold text-lg shadow hover:scale-105 transition-all"
              >
                Create Account 🥜
              </motion.button>
              <div className="text-sm text-center text-[#987750] mt-5">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-[#a6763e] hover:underline">
                  Sign In
                </Link>
              </div>
              <div className="text-xs text-gray-400 text-center mt-2">Use a Gmail account to register.</div>
            </motion.form>
          )}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center py-8"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-[#4a3823] mb-2">Welcome to Dryvana!</h2>
              <div className="text-[#987750] mb-5 text-center">
                Your account has been created. Redirecting to login...
              </div>
              <Link
                to="/login"
                className="bg-[#a6763e] text-white font-bold rounded-xl px-6 py-3 hover:bg-[#3c2415] transition"
              >
                Go to Login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {/* Brand line */}
      <div className="mt-10 text-[#bda685] text-xs text-center font-light absolute bottom-5 left-1/2 -translate-x-1/2 w-full">
        <span className="font-bold text-[#a6763e]">Dryvana</span> &mdash; Join, shop &amp; live healthy.
      </div>
    </div>
  );
}
