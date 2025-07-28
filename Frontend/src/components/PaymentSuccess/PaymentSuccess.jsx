import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaShoppingBag, FaRegEnvelope } from "react-icons/fa";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-[#f9f5f1] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 64, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, type: "spring" }}
        className="w-full max-w-lg mx-auto rounded-3xl bg-white/90 border border-[#ecd3ba] shadow-2xl p-10 flex flex-col items-center gap-5"
      >
        {/* Animated check */}
        <motion.div
          initial={{ scale: 0.7, rotate: 0 }}
          animate={{ scale: 1.15, rotate: 10 }}
          transition={{ type: "spring", stiffness: 160, delay: 0.1 }}
        >
          <FaCheckCircle className="text-green-500 drop-shadow-lg" size={80} />
        </motion.div>
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#3c1e00] text-center"
        >
          Payment Received!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="text-[#836959] text-md text-center mb-2"
        >
          Thank you for your order.<br className="hidden sm:block" />
          Your purchase has been confirmed and is now being prepared for delivery!
        </motion.p>

        {/* Call to actions */}
        <div className="flex flex-col gap-3 w-full mt-4">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#a6763e] via-[#3c1e00] to-[#a6763e] shadow-md hover:scale-105 transition"
          >
            <FaShoppingBag size={18} />
            Continue Shopping
          </Link>
          <Link
            to="/my-orders"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2 border-[#a6763e] text-[#a6763e] bg-white hover:bg-[#f4e3d3] transition"
          >
            <FaCheckCircle size={16} className="text-[#3c1e00]" />
            View My Orders
          </Link>
        </div>

        <div className="w-full flex flex-col gap-2 mt-6 text-center text-sm text-[#96755a]">
          <div className="flex items-center justify-center gap-2">
            <FaRegEnvelope />
            <span>A confirmation email has been sent to you.</span>
          </div>
          <span>
            Need help?{" "}
            <a
              href="mailto:dryvana@gmail.com"
              className="text-[#a6763e] underline hover:text-[#3c1e00]"
            >
              Contact Support
            </a>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
