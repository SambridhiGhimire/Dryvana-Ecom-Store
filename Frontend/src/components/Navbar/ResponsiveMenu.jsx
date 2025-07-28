import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaInfoCircle,
  FaEnvelopeOpenText,
} from "react-icons/fa";

const PRIMARY = "#caa465";
const DARK_BG = "#20150a";
const TEXT = "#e7dac8";

const navItems = [
  { to: "/", icon: <FaHome color={PRIMARY} />, label: "Home" },
  { to: "/allproducts", icon: <FaShoppingCart color={PRIMARY} />, label: "Shop" },
  { to: "/about", icon: <FaInfoCircle color={PRIMARY} />, label: "About" },
  { to: "/contact", icon: <FaEnvelopeOpenText color={PRIMARY} />, label: "Contact" },
];

export default function ResponsiveMenu({ isOpen, onClose, children }) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 64 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 64 }}
          transition={{ duration: 0.32, ease: "easeInOut" }}
          className="fixed top-0 right-0 w-72 h-full z-[999] shadow-2xl border-l border-[#caa465]/30 flex flex-col"
          style={{
            background: DARK_BG,
            boxShadow: "0 4px 40px 0 #3c1e0055",
          }}
        >
          {/* Header / Close */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#caa465]/30">
            <span className="text-lg font-bold text-[#caa465] tracking-wide">Menu</span>
            {onClose && (
              <button
                className="text-[#caa465] p-2 hover:bg-[#caa465]/10 rounded"
                onClick={onClose}
              >
                <svg width={22} height={22} viewBox="0 0 20 20">
                  <line x1="5" y1="5" x2="15" y2="15" stroke={PRIMARY} strokeWidth={2} />
                  <line x1="15" y1="5" x2="5" y2="15" stroke={PRIMARY} strokeWidth={2} />
                </svg>
              </button>
            )}
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-2 px-6 pt-6 text-base font-semibold">
            {navItems.map(({ to, icon, label }) => (
              <Link
                key={label}
                to={to}
                onClick={onClose}
                className="flex items-center gap-3 px-2 py-2 rounded text-[#e7dac8] hover:bg-[#caa465]/10 hover:text-white transition font-semibold"
                style={{ fontSize: 18, letterSpacing: ".01em" }}
              >
                {icon}
                {label}
              </Link>
            ))}
          </nav>

          {/* Optional: place for login/signup or user actions */}
          {children && (
            <div className="mt-auto px-6 pb-8">{children}</div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
