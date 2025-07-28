import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUserCircle,
  FaChevronDown,
  FaShoppingCart,
  FaClipboardList,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaInfoCircle,
  FaHome,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import dryvanaLogo from "../../assets/dryvana_logo.png";

// Colors
const DARK_BG = "rgba(60,32,8,0.92)"; // very dark brown with alpha
const PRIMARY = "#a6763e"; // gold brown accent
const LIGHT = "#f6e3d5";
const WHITE = "#fff";

export default function Navbar() {
  const { user, logout, loading } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const [navbarSearch, setNavbarSearch] = useState("");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Animate logo text
  const logoTextVariants = {
    initial: { x: -12, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { delay: 0.4, duration: 0.7 } },
  };

  const handleDropdownClick = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  const handleNavbarSearch = (e) => {
    e.preventDefault();
    if (navbarSearch.trim()) {
      navigate(`/allproducts?search=${encodeURIComponent(navbarSearch.trim())}`);
    } else {
      navigate("/allproducts");
    }
  };

  // Cart badge count - demo
  // Replace with actual cart context if needed
  const cartCount = user && user.cartCount ? user.cartCount : 0;

  if (loading) return null;

  return (
    <header
      className="sticky top-0 z-[100] w-full backdrop-blur-lg"
      style={{
        background: DARK_BG,
        borderBottom: `1.5px solid ${PRIMARY}22`,
        boxShadow: "0 2px 24px 0 #452a0f30",
      }}
    >
      {/* Top accent bar */}
      <div
        className="w-full h-1"
        style={{
          background:
            "linear-gradient(90deg, #caa465 0%, #f7e0c0 50%, #b0783f 100%)",
          opacity: 0.9,
        }}
      ></div>
      {/* Main nav */}
      <div className="max-w-screen-xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group select-none"
          style={{ minWidth: 115 }}
        >
          <img
            src={dryvanaLogo}
            alt="Dryvana Logo"
            className="h-10 w-auto drop-shadow-lg group-hover:scale-105 transition"
          />
          <motion.span
            className="text-2xl font-extrabold tracking-wide ml-1"
            style={{
              color: "#fff",
              textShadow: "1px 2px 4px #3c1e00a8",
              letterSpacing: ".04em",
            }}
            variants={logoTextVariants}
            initial="initial"
            animate="animate"
          >
            Dryvana
          </motion.span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex flex-1 justify-center gap-8 text-base font-semibold">
          <NavLink icon={<FaHome />} to="/" text="Home" />
          <NavLink icon={<FaShoppingCart />} to="/allproducts" text="Shop" />
          <NavLink icon={<FaInfoCircle />} to="/about" text="About" />
          <NavLink icon={<FaEnvelopeOpenText />} to="/contact" text="Contact" />
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <form
            onSubmit={handleNavbarSearch}
            className="hidden md:flex items-center border border-[#caa465] rounded-lg bg-[#fff9f5]/20 shadow px-3 py-1"
          >
            <input
              type="text"
              placeholder="Search dryfruits..."
              value={navbarSearch}
              onChange={(e) => setNavbarSearch(e.target.value)}
              className="bg-transparent focus:outline-none text-base text-[#fff] placeholder:text-[#d4bb9d] font-medium w-36"
              style={{ color: "#fff" }}
            />
            <button type="submit" className="ml-2 text-[#caa465] hover:text-white">
              <FaSearch />
            </button>
          </form>

          {/* Cart */}
          {user && (
            <Link
              to="/cart"
              className="relative text-[#caa465] hover:text-white transition group"
              title="Cart"
            >
              <FaShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1 bg-red-600 text-xs text-white rounded-full px-1.5 py-0.5 shadow font-bold animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* User dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 cursor-pointer text-base font-semibold text-[#fff] px-3 py-1 rounded-lg hover:bg-[#7b542d]/20 transition"
                style={{ background: dropdownOpen ? "#b0783f22" : "transparent" }}
              >
                <FaUserCircle size={22} className="text-[#caa465]" />
                <span className="hidden sm:inline-block">{user.name}</span>
                <FaChevronDown size={14} />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 min-w-[170px] bg-[#292115] text-[#f5e5ce] border border-[#caa465]/40 rounded-lg shadow-xl overflow-hidden z-50"
                  >
                    <DropdownBtn
                      icon={<FaClipboardList size={14} />}
                      text="Orders"
                      onClick={() => handleDropdownClick("/my-orders")}
                    />
                    <DropdownBtn
                      icon={<FaUserCircle size={14} />}
                      text="Profile"
                      onClick={() => handleDropdownClick("/profile")}
                    />
                    <DropdownBtn
                      icon={<FaSignOutAlt size={14} />}
                      text="Logout"
                      onClick={handleLogout}
                      color="red"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="text-base px-4 py-1.5 border border-[#caa465] rounded-lg hover:bg-[#caa465] hover:text-[#2e1706] bg-[#fff9f5]/20 text-white font-semibold transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-base px-4 py-1.5 border border-[#caa465] rounded-lg hover:bg-[#caa465] hover:text-[#2e1706] bg-[#fff9f5]/20 text-white font-semibold transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Hamburger for mobile */}
          <button
            className="lg:hidden ml-2 p-2 rounded-md text-[#caa465] hover:bg-[#caa465]/10"
            onClick={() => setDrawerOpen(true)}
          >
            <FaBars size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="fixed top-0 right-0 w-72 h-full z-[999] bg-[#20150a] shadow-2xl border-l border-[#caa465]/30 flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#caa465]/30">
              <span className="text-lg font-bold text-[#caa465]">Menu</span>
              <button
                className="text-[#caa465] p-2 hover:bg-[#caa465]/10 rounded"
                onClick={() => setDrawerOpen(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-2 px-6 pt-5 text-base font-semibold">
              <MobileLink to="/" icon={<FaHome />} text="Home" onClose={() => setDrawerOpen(false)} />
              <MobileLink to="/allproducts" icon={<FaShoppingCart />} text="Shop" onClose={() => setDrawerOpen(false)} />
              <MobileLink to="/about" icon={<FaInfoCircle />} text="About" onClose={() => setDrawerOpen(false)} />
              <MobileLink to="/contact" icon={<FaEnvelopeOpenText />} text="Contact" onClose={() => setDrawerOpen(false)} />
              <hr className="border-[#caa465]/30 my-3" />
              {user ? (
                <>
                  <MobileLink to="/my-orders" icon={<FaClipboardList />} text="Orders" onClose={() => setDrawerOpen(false)} />
                  <MobileLink to="/profile" icon={<FaUserCircle />} text="Profile" onClose={() => setDrawerOpen(false)} />
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-2 py-2 rounded text-[#f36c6c] hover:bg-[#caa465]/10 transition"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <MobileLink to="/login" text="Sign In" onClose={() => setDrawerOpen(false)} />
                  <MobileLink to="/register" text="Sign Up" onClose={() => setDrawerOpen(false)} />
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// Desktop nav link
function NavLink({ to, text, icon }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1 px-3 py-2 rounded-lg text-[#e7dac8] hover:bg-[#caa465]/20 hover:text-[#fff] transition"
      style={{ fontWeight: 600 }}
    >
      {icon && <span className="text-[#caa465]">{icon}</span>}
      <span>{text}</span>
    </Link>
  );
}

// Dropdown button
function DropdownBtn({ icon, text, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex justify-between items-center px-4 py-3 text-left hover:bg-[#3c2915] transition font-semibold ${
        color === "red" ? "text-red-400" : ""
      }`}
    >
      {text} {icon}
    </button>
  );
}

// Mobile nav link
function MobileLink({ to, icon, text, onClose }) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className="flex items-center gap-3 px-2 py-2 rounded text-[#e7dac8] hover:bg-[#caa465]/10 transition font-semibold"
    >
      {icon && <span className="text-[#caa465]">{icon}</span>}
      {text}
    </Link>
  );
}
