import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import logo from "../../assets/dryvana_logo.png";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-[#3a2314] text-[#e5dacb] pt-0 pb-0 font-sans">
      {/* Floating Social Bar (desktop only) */}
      <div className="hidden md:flex flex-col gap-3 fixed left-7 bottom-32 z-30">
        {[{
          href: "https://instagram.com/", icon: FaInstagram, color: "#f0b07e"
        }, {
          href: "https://facebook.com/", icon: FaFacebookF, color: "#f0b07e"
        }, {
          href: "https://twitter.com/", icon: FaTwitter, color: "#f0b07e"
        }, {
          href: "https://youtube.com/", icon: FaYoutube, color: "#f0b07e"
        }].map(({ href, icon: Icon, color }, i) => (
          <motion.a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.18, rotate: 8 }}
            className="rounded-full shadow-xl bg-[#25150c] hover:bg-[#4a2a14] transition p-3"
            style={{ color }}
          >
            <Icon size={22} />
          </motion.a>
        ))}
      </div>

      {/* Main footer bar */}
      <div className="max-w-7xl mx-auto px-5 md:px-12 py-12 flex flex-col md:flex-row gap-10 md:gap-0 justify-between">
        {/* Left: Brand */}
        <div className="flex-1 flex flex-col gap-5 pr-8 min-w-[220px]">
          <img src={logo} alt="Dryvana Logo" className="w-36 mb-1 select-none pointer-events-none" />
          <div className="text-md text-[#c2a27d]">
            <span className="font-bold text-[#e0c195] text-lg">Dryvana:</span><br />
            Elevating Nepali wellness with the finest local dry fruits, delivered fresh. Taste tradition, fuel your health.
          </div>
          <div className="flex gap-3 mt-2 md:hidden">
            {/* Show socials horizontally on mobile */}
            {[FaInstagram, FaFacebookF, FaTwitter, FaYoutube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="rounded-full bg-[#4a2a14] text-[#f0b07e] p-2 hover:bg-[#d1a06a] hover:text-[#2b170c] transition"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
        {/* Center: Navigation */}
        <div className="flex-[1.2] grid grid-cols-2 gap-8 md:gap-14 justify-items-start min-w-[210px]">
          {/* Shop */}
          <nav>
            <h3 className="uppercase text-[#d1a06a] tracking-wide font-extrabold text-xs mb-2">Shop</h3>
            <ul className="space-y-2 text-md">
              <li><Link to="/allproducts" className="hover:text-[#e0c195] transition">All Products</Link></li>
              <li><Link to="/" className="hover:text-[#e0c195] transition">Home</Link></li>
              <li><Link to="/cart" className="hover:text-[#e0c195] transition">Cart</Link></li>
            </ul>
          </nav>
          {/* Company */}
          <nav>
            <h3 className="uppercase text-[#d1a06a] tracking-wide font-extrabold text-xs mb-2">Company</h3>
            <ul className="space-y-2 text-md">
              <li><Link to="/about" className="hover:text-[#e0c195] transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#e0c195] transition">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-[#e0c195] transition">FAQs</Link></li>
            </ul>
          </nav>
        </div>
        {/* Right: Newsletter */}
        <div className="flex-1 flex flex-col justify-between min-w-[270px]">
          <div className="mb-6">
            <h3 className="uppercase text-[#d1a06a] tracking-wide font-extrabold text-xs mb-3">Stay Updated</h3>
            <div className="text-[#ccb495] text-sm mb-3">Get exclusive offers and health tips in your inbox:</div>
            <form
              className="flex w-full bg-[#25150c] rounded-lg shadow-inner overflow-hidden"
              onSubmit={e => {
                e.preventDefault();
                // You can trigger a toast here if needed
              }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent text-[#eedbb5] px-4 py-2 outline-none placeholder-[#b4956b]"
              />
              <button
                type="submit"
                className="bg-[#d1a06a] text-[#2b170c] px-6 py-2 font-bold text-sm hover:bg-[#e0c195] transition"
              >
                Join
              </button>
            </form>
          </div>
          {/* App download, remove if not needed */}
          <div className="mt-3 flex gap-3">
            <span className="bg-[#2b170c] px-3 py-1.5 rounded text-[#ccb495] text-xs font-medium select-none">App Coming Soon</span>
          </div>
        </div>
      </div>

      {/* Modern copyright bar */}
      <div className="bg-[#25150c] text-[#ccb495] py-5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center">
          <span>© {new Date().getFullYear()} Dryvana. All rights reserved.</span>
          <div className="flex gap-5 mt-1 md:mt-0">
            <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link to="/cookie-settings" className="hover:underline">Cookie Settings</Link>
            <Link to="/terms" className="hover:underline">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
