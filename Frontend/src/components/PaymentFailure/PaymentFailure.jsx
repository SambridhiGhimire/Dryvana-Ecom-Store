import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTimesCircle, FaShoppingBag, FaHeadset } from "react-icons/fa";

export default function PaymentFailure() {
  return (
    <div className="min-h-screen bg-[#f9f5f1] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 64, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-lg mx-auto rounded-3xl bg-white/90 border border-[#ecd3ba] shadow-2xl p-10 flex flex-col items-center gap-5"
      >
        {/* Animated failure icon */}
        <motion.div
          initial={{ scale: 0.8, rotate: 0 }}
          animate={{ scale: 1.15, rotate: -8 }}
          transition={{ type: "spring", stiffness: 140, delay: 0.1 }}
        >
          <FaTimesCircle className="text-red-500 drop-shadow-lg" size={78} />
        </motion.div>
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#902020] text-center"
        >
          Payment Failed
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="text-[#7e5244] text-md text-center mb-2"
        >
          Sorry, your payment couldn’t be processed.<br className="hidden sm:block" />
          Don’t worry, your cart is safe—try again or contact us for help!
        </motion.p>

        {/* Call to actions */}
        <div className="flex flex-col gap-3 w-full mt-4">
          <Link
            to="/cart"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#e26e6e] via-[#902020] to-[#e26e6e] shadow-md hover:scale-105 transition"
          >
            <FaTimesCircle size={18} />
            Try Payment Again
          </Link>
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2 border-[#902020] text-[#902020] bg-white hover:bg-[#f4e3d3] transition"
          >
            <FaShoppingBag size={16} />
            Continue Shopping
          </Link>
        </div>

        <div className="w-full flex flex-col gap-2 mt-6 text-center text-sm text-[#87665b]">
          <div className="flex items-center justify-center gap-2">
            <FaHeadset />
            <span>
              Still not working?{" "}
              <a
                href="mailto:dryvana@gmail.com"
                className="text-[#902020] underline hover:text-[#b54242]"
              >
                Contact Support
              </a>
            </span>
          </div>
          <span>🍂 Your items are still in your cart for checkout anytime.</span>
        </div>
      </motion.div>
    </div>
  );
}
