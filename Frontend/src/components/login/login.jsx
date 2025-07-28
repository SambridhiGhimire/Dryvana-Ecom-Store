import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/api";
import toast from "react-hot-toast";
import { UserContext } from "../../context/UserContext";
import ReCAPTCHA from "react-google-recaptcha";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, LockKeyhole, Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // Form state
  const [form, setForm] = useState({ email: "", password: "" });
  const [twoFARequired, setTwoFARequired] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const [pendingUser, setPendingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");

  // Brand colors
  const accent = "#a6763e"; // golden brown
  const dark = "#3c2415";

  // Submit handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!recaptchaToken) {
      toast.error("🧠 Please verify you are human");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post("/auth/login", {
        email: form.email,
        password: form.password,
        token: recaptchaToken,
      });

      if (res.data.twoFactorRequired) {
        setTwoFARequired(true);
        setPendingUser({ email: form.email, password: form.password, userId: res.data.userId });
        toast("🔐 2FA required");
        setLoading(false);
        return;
      }

      if (res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        toast.success("🍇 Welcome back!");
        navigate(res.data.user.isAdmin ? "/admin" : "/");
      } else {
        toast.error("😕 Unexpected response from server");
      }
    } catch (err) {
      if (err.response?.data?.twoFactorRequired) {
        setTwoFARequired(true);
        setPendingUser({ email: form.email, password: form.password, userId: err.response.data.userId });
        toast("🔐 2FA required");
      } else {
        toast.error(err.response?.data?.msg || "❌ Login failed");
      }
    }
    setLoading(false);
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/auth/login", {
        email: pendingUser.email,
        password: pendingUser.password,
        twoFactorCode: twoFACode,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      toast.success("🔓 Login verified!");
      navigate(res.data.user.isAdmin ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.msg || "⚠️ 2FA failed");
    }
    setLoading(false);
  };

  // Modern animated card, glassmorphism, floating artwork
  return (
    <div className="min-h-screen bg-[#f9f5f1] flex flex-col justify-center items-center relative px-2">
      {/* Floating Illustration */}
      <motion.img
        src="/assets/login-hero.svg"
        alt="Login Hero"
        className="w-36 h-36 object-contain drop-shadow-xl mb-[-48px] z-10 select-none pointer-events-none"
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
        draggable={false}
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative w-full max-w-lg bg-white/95 border border-[#e5decf] shadow-2xl rounded-3xl px-8 py-14 flex flex-col items-center backdrop-blur-[3px] z-20"
      >
        <div className="w-full flex flex-col items-center mb-8">
          <ShieldCheck className="w-12 h-12 text-[#a6763e] mb-2 drop-shadow-sm" />
          <h2 className="text-3xl font-extrabold text-[#3c2415] mb-1">Sign In to Dryvana</h2>
          <p className="text-[#bda685] font-medium text-center">
            Access your healthy habits and orders.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {twoFARequired ? (
            <motion.form
              key="2fa"
              onSubmit={handle2FASubmit}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.4 }}
              className="w-full space-y-6"
            >
              <div className="flex items-center gap-2 justify-center mb-2">
                <LockKeyhole className="w-6 h-6 text-[#a6763e]" />
                <span className="text-lg font-semibold text-[#3c2415]">2FA Required</span>
              </div>
              <p className="text-sm text-[#987750] text-center mb-2">Enter your 6-digit code from your authenticator app.</p>
              <input
                type="text"
                value={twoFACode}
                onChange={e => setTwoFACode(e.target.value)}
                placeholder="2FA Code"
                maxLength={6}
                inputMode="numeric"
                required
                autoFocus
                disabled={loading}
                className="w-full bg-[#f9f5f1] border-2 border-[#e1d2bb] px-4 py-3 rounded-xl font-semibold text-lg focus:outline-none focus:border-[#a6763e] tracking-widest text-center"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#a6763e] to-[#5c4033] text-white py-3 rounded-xl font-bold text-lg shadow hover:scale-105 transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Verify & Sign In"}
              </button>
              <div className="text-sm text-center mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setTwoFARequired(false);
                    setTwoFACode("");
                    setPendingUser(null);
                  }}
                  className="text-[#a6763e] underline font-semibold"
                  disabled={loading}
                >
                  ← Back to login
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="login"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 32 }}
              transition={{ duration: 0.4 }}
              className="w-full space-y-7"
            >
              <div>
                <label className="block text-xs font-bold text-[#987750] mb-2">Email</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={loading}
                  className="w-full bg-[#f9f5f1] border-2 border-[#e1d2bb] px-4 py-3 rounded-xl text-lg focus:outline-none focus:border-[#a6763e]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#987750] mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  disabled={loading}
                  className="w-full bg-[#f9f5f1] border-2 border-[#e1d2bb] px-4 py-3 rounded-xl text-lg focus:outline-none focus:border-[#a6763e]"
                />
              </div>

              <div className="flex justify-between items-center mb-2">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={setRecaptchaToken}
                  theme="light"
                />
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#a6763e] font-semibold hover:underline ml-4"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#a6763e] to-[#5c4033] text-white py-3 rounded-xl font-bold text-lg shadow hover:scale-105 transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Sign In"}
              </button>
              <div className="text-sm text-center text-[#8c7d6a] mt-2">
                New here?{" "}
                <Link to="/register" className="font-bold text-[#a6763e] hover:underline">
                  Create account
                </Link>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Brand Footer */}
      <div className="mt-10 text-[#bda685] text-xs text-center font-light">
        <span className="font-bold text-[#a6763e]">Dryvana</span> &mdash; Powered by passion for health & happiness.
      </div>
    </div>
  );
}
