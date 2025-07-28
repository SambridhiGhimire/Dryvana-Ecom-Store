import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../api/api";
import { motion } from "framer-motion";
import { LockReset } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form"); // "form" | "success"
  const navigate = useNavigate();

  // Password strength utility
  const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)) score++;
    return score;
  };
  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("🥜 Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`/auth/reset-password/${token}`, { password });
      setStep("success");
      toast.success("🌰 Password reset successful!");
      setTimeout(() => navigate("/login"), 2100);
    } catch (err) {
      toast.error(
        err.response?.data?.msg || "❌ Failed to reset password. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Colors and labels for password strength
  const bars = [
    "bg-gray-300",
    "bg-red-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-green-600",
  ];
  const labels = [
    "Too short",
    "Weak",
    "Medium",
    "Strong",
    "Very strong"
  ];

  return (
    <div className="min-h-screen bg-[#f9f5f1] flex flex-col items-center justify-center px-2">
      {/* Floating Badge */}
      <motion.div
        className="absolute top-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, type: "spring" }}
      >
        <div className="bg-white/90 shadow border-2 border-[#a6763e] px-6 py-2 rounded-full flex items-center gap-2 font-bold text-lg text-[#a6763e]">
          <LockReset className="w-5 h-5" /> New Password
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 38, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="w-full max-w-lg bg-white/95 border border-[#e5decf] shadow-2xl rounded-3xl px-10 py-12 flex flex-col items-center mt-24"
      >
        {step === "form" ? (
          <motion.form
            key="reset"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 28 }}
            transition={{ duration: 0.5 }}
            className="w-full"
            autoComplete="off"
          >
            <h2 className="text-3xl font-extrabold mb-6 text-center text-[#422908]">
              Set a New Password
            </h2>
            <p className="mb-6 text-center text-[#ad986e]">
              Please choose a strong password and confirm it below.
            </p>
            <div className="mb-4">
              <label className="text-xs font-semibold text-[#a6763e] block mb-2">
                New Password
              </label>
              <input
                type="password"
                className="w-full border-2 border-[#e1d2bb] bg-[#f9f5f1] py-3 px-4 rounded-xl font-semibold text-lg focus:outline-none focus:border-[#a6763e]"
                placeholder="At least 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                autoFocus
              />
              <div className="flex gap-1 mt-2">
                {bars.map((bar, idx) => (
                  <div
                    key={bar}
                    className={`h-2 flex-1 rounded ${strength > idx ? bars[strength] : "bg-gray-200"}`}
                  />
                ))}
              </div>
              <div className="text-xs text-[#a6763e] mt-1 font-semibold">
                {labels[strength]}
              </div>
            </div>
            <div className="mb-8">
              <label className="text-xs font-semibold text-[#a6763e] block mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full border-2 border-[#e1d2bb] bg-[#f9f5f1] py-3 px-4 rounded-xl font-semibold text-lg focus:outline-none focus:border-[#a6763e]"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#a6763e] to-[#5c4033] text-white py-3 rounded-xl font-bold text-lg shadow hover:scale-105 transition-all"
            >
              {loading ? "Resetting..." : "Set New Password"}
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center py-10"
          >
            <LockReset className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-[#4b2e1b] mb-2">
              Password Reset!
            </h2>
            <div className="text-[#9d8667] mb-3 text-center">
              Your password has been changed.<br />
              Please log in with your new credentials.
            </div>
            <button
              onClick={() => navigate("/login")}
              className="mt-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#a6763e] to-[#5c4033] text-white font-bold text-md hover:scale-105 transition-all shadow-lg"
            >
              Go to Login
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Encouragement */}
      <div className="mt-10 text-[#bda685] text-xs text-center font-light absolute bottom-5 left-1/2 -translate-x-1/2 w-full">
        <span className="font-bold text-[#a6763e]">Dryvana</span> — A secure basket for your digital health.
      </div>
    </div>
  );
}
