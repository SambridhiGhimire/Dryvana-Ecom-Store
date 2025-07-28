import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "../../api/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, MailCheck } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("🌰 Reset link sent! Check your inbox.");
      setTimeout(() => navigate("/login"), 2300);
    } catch (err) {
      toast.error(
        err.response?.data?.msg || "🥜 Failed to send reset link. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f5f1] flex flex-col items-center justify-center px-2">
      {/* Floating Badge */}
      <motion.div
        className="absolute top-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.1, type: "spring" }}
      >
        <div className="bg-white/90 shadow-md border-2 border-[#a6763e] px-7 py-2 rounded-full flex items-center gap-2 font-bold text-lg text-[#a6763e]">
          <KeyRound className="w-6 h-6" /> Password Reset
        </div>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 44, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="w-full max-w-lg bg-white/95 border border-[#e5decf] shadow-2xl rounded-3xl px-10 py-12 flex flex-col items-center mt-24"
      >
        <AnimatePresence mode="wait">
          {!sent ? (
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
              <h2 className="text-3xl font-extrabold mb-6 text-center text-[#4b2e1b]">
                Forgot Your Password?
              </h2>
              <p className="mb-6 text-center text-[#9d896c]">
                Enter your registered email and we’ll send you a secure reset link.
              </p>
              <div className="mb-8">
                <label className="text-xs font-semibold text-[#a6763e] block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full border-2 border-[#e1d2bb] bg-[#f9f5f1] py-3 px-4 rounded-xl focus:outline-none focus:border-[#a6763e] font-semibold text-lg"
                  placeholder="e.g. nutlover@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#a6763e] to-[#5c4033] text-white py-3 rounded-xl font-bold text-lg shadow hover:scale-105 transition-all"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="w-full flex flex-col items-center py-8"
            >
              <MailCheck className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-[#4b2e1b] mb-2">
                Check Your Inbox!
              </h2>
              <div className="text-[#987750] mb-4 text-center">
                We’ve sent a password reset link to your email.
                <br />
                Follow the instructions to set a new password.
              </div>
              <div className="text-xs text-[#baa585] mt-3">
                Didn’t receive it? Check your spam folder.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Brand encouragement */}
      <div className="mt-10 text-[#bda685] text-xs text-center font-light absolute bottom-5 left-1/2 -translate-x-1/2 w-full">
        <span className="font-bold text-[#a6763e]">Dryvana</span> — Your health, your way.
      </div>
    </div>
  );
}
