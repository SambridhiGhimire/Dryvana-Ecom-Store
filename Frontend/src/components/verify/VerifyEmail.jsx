import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyEmail } from "../../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
        setMessage("Awesome! Your email is verified. Let’s get you inside.");
      } catch (err) {
        setStatus("error");
        setMessage(
          err?.message ||
            "Verification failed or the link has expired. Please request a new verification link from your profile."
        );
      }
    })();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#f9f5f1] flex flex-col items-center justify-center px-2">
      {/* Floating Brand Illustration */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="mb-[-32px] z-10"
      >
        <img
          src="/assets/email-verify-art.svg"
          alt="Email Confirmation Art"
          className="w-32 h-32 object-contain select-none pointer-events-none drop-shadow-xl"
          draggable={false}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", delay: 0.1 }}
        className="relative w-full max-w-lg bg-white/95 border border-[#e7dcc7] shadow-2xl rounded-3xl px-8 py-14 flex flex-col items-center backdrop-blur-[4px] z-20"
        style={{
          boxShadow: "0 6px 36px 0 rgba(89,67,38,0.10), 0 2px 8px 0 rgba(172,151,123,0.08)",
        }}
      >
        <AnimatePresence mode="wait">
          {status === "verifying" && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              className="flex flex-col items-center justify-center gap-6 w-full"
            >
              <Loader2 className="w-14 h-14 text-[#b3936d] animate-spin" />
              <div>
                <div className="text-2xl font-bold text-[#836145] mb-2 tracking-wide">
                  Checking email verification…
                </div>
                <p className="text-base text-[#b9a48c] font-medium">
                  Please hang tight while we confirm your email.
                </p>
              </div>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -32 }}
              className="flex flex-col items-center gap-6 w-full"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 drop-shadow-xl" />
              <div>
                <div className="text-2xl font-bold text-[#3c2415] mb-2 tracking-wide">
                  Email Verified
                </div>
                <p className="text-base text-[#6d573a] font-medium">{message}</p>
              </div>
              <Link
                to="/login"
                className="mt-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-[#c49b68] via-[#8d6c3e] to-[#5c4033] text-white font-bold text-lg shadow-lg hover:scale-105 transition-all"
              >
                Go to Login
              </Link>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -32 }}
              className="flex flex-col items-center gap-6 w-full"
            >
              <AlertTriangle className="w-16 h-16 text-red-400 drop-shadow-xl" />
              <div>
                <div className="text-2xl font-bold text-[#b35e36] mb-2 tracking-wide">
                  Verification Failed
                </div>
                <p className="text-base text-[#b98160] font-medium">{message}</p>
              </div>
              <Link
                to="/profile"
                className="mt-2 px-7 py-3 rounded-2xl border-2 border-[#a6763e] text-[#a6763e] font-bold text-lg hover:bg-[#faeee1] transition-all"
              >
                Go to Profile
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Brand Footer or Progress */}
      <div className="mt-8 text-[#b5a28b] text-sm text-center font-light">
        Powered by <span className="font-semibold text-[#836145]">Dryvana</span> – Your healthy habit, made easy.
      </div>
    </div>
  );
}
