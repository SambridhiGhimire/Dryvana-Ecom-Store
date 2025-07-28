import React, { useEffect, useState } from "react";
import { getProfile, updateProfile, addEmail, removeEmail } from "../api/api";
import toast from "react-hot-toast";
import { FaUser, FaLock, FaShieldAlt, FaEnvelope, FaPlus, FaTrashAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { key: "profile", icon: <FaUser />, label: "Profile" },
  { key: "security", icon: <FaLock />, label: "Password" },
  { key: "emails", icon: <FaEnvelope />, label: "Emails" },
  { key: "2fa", icon: <FaShieldAlt />, label: "2FA" },
];

export default function Profile() {
  const [section, setSection] = useState("profile");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", dob: "" });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [twoFA, setTwoFA] = useState({ enabled: false });
  const [qr, setQr] = useState("");
  const [twoFASetup, setTwoFASetup] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");

  useEffect(() => {
    getProfile()
      .then((data) => {
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          dob: data.dob || "",
        });
        setEmails(data.emails || []);
        setTwoFA({ enabled: !!data.twoFactorEnabled });
      })
      .catch((err) => toast.error("🚫 " + (err.message || "Failed to load profile")))
      .finally(() => setLoading(false));
  }, []);

  // ---- Profile actions ----
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success("✅ Profile updated!");
    } catch (err) {
      toast.error("🚫 " + (err.message || "Failed to update profile"));
    }
    setSaving(false);
  };

  // ---- Password actions ----
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new || !passwords.confirm)
      return toast.error("Fill all password fields");
    if (passwords.new !== passwords.confirm)
      return toast.error("Passwords do not match");
    setSavingPassword(true);
    try {
      await updateProfile({
        password: passwords.new,
        currentPassword: passwords.current,
      });
      toast.success("✅ Password changed!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      toast.error("🚫 " + (err.message || "Failed to change password"));
    }
    setSavingPassword(false);
  };

  // ---- Email actions ----
  const handleAddEmail = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    try {
      await addEmail(newEmail);
      toast.success("📨 Verification sent!");
      setEmails((prev) => [...prev, { address: newEmail, verified: false }]);
      setNewEmail("");
    } catch (err) {
      toast.error("🚫 " + (err.message || "Failed to add email"));
    }
    setEmailLoading(false);
  };

  const handleRemoveEmail = async (address) => {
    setEmailLoading(true);
    try {
      await removeEmail(address);
      setEmails((prev) => prev.filter((e) => e.address !== address));
      toast.success("🗑️ Email removed");
    } catch (err) {
      toast.error("🚫 " + (err.message || "Failed to remove email"));
    }
    setEmailLoading(false);
  };

  // ---- 2FA actions ----
  const handleEnable2FA = async () => {
    setTwoFALoading(true);
    try {
      const res = await fetch("/api/users/2fa/generate", { method: "POST" });
      const data = await res.json();
      setQr(data.qr);
      setTwoFASetup(true);
    } catch (err) {
      toast.error("🚫 2FA setup failed");
    }
    setTwoFALoading(false);
  };

  const handleConfirm2FA = async (e) => {
    e.preventDefault();
    setTwoFALoading(true);
    try {
      await fetch("/api/users/2fa/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: twoFACode }),
      });
      toast.success("🔒 2FA enabled");
      setTwoFA({ enabled: true });
      setTwoFASetup(false);
      setQr("");
      setTwoFACode("");
    } catch (err) {
      toast.error("🚫 Failed to enable 2FA");
    }
    setTwoFALoading(false);
  };

  const handleDisable2FA = async () => {
    setTwoFALoading(true);
    try {
      await fetch("/api/users/2fa/disable", { method: "POST" });
      setTwoFA({ enabled: false });
      toast.success("2FA disabled");
    } catch (err) {
      toast.error("🚫 Failed to disable 2FA");
    }
    setTwoFALoading(false);
  };

  if (loading)
    return (
      <div className="text-center py-20 text-lg text-[#a6763e]">
        🌰 Loading your profile...
      </div>
    );

  return (
    <div className="bg-[#f9f5f1] min-h-screen flex flex-col md:flex-row items-start justify-center px-2 md:px-8 py-12 gap-6">
      {/* Sidebar */}
      <aside className="w-full md:w-60 mb-6 md:mb-0">
        <div className="sticky top-28">
          <div className="bg-white/90 rounded-2xl shadow border border-[#ecd3ba] p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-[#a6763e]/10 p-2 rounded-full">
                <FaUser className="text-2xl text-[#a6763e]" />
              </div>
              <div>
                <div className="font-bold text-[#3c1e00] text-lg">
                  {form.name || "My Account"}
                </div>
                <div className="text-xs text-gray-500">{form.email}</div>
              </div>
            </div>
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-left transition
                  ${section === s.key
                    ? "bg-[#a6763e]/10 text-[#a6763e]"
                    : "text-[#412718] hover:bg-[#f4e3d3]"
                  }
                `}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>
      </aside>
      {/* Main */}
      <main className="flex-1 w-full max-w-3xl">
        <AnimatePresence mode="wait">
          {section === "profile" && (
            <motion.form
              key="profile"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              className="bg-white/95 rounded-2xl shadow-xl border border-[#ecd3ba] p-8 mb-7"
            >
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <FaUser className="text-2xl text-[#a6763e]" />
                  <h2 className="text-xl font-bold text-[#3c1e00]">Personal Info</h2>
                </div>
                <p className="text-sm text-gray-600">Update your account details below.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
                <div>
                  <label className="block text-xs font-semibold text-[#3c1e00] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md text-sm focus:ring-[#a6763e] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3c1e00] mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md text-sm focus:ring-[#a6763e] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3c1e00] mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md text-sm focus:ring-[#a6763e] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3c1e00] mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md text-sm focus:ring-[#a6763e] focus:outline-none"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#a6763e] text-white py-2 rounded-md font-bold hover:bg-[#412718] transition"
                disabled={saving}
              >
                {saving ? "Saving..." : "Update Profile"}
              </button>
            </motion.form>
          )}

          {section === "security" && (
            <motion.form
              key="security"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleChangePassword}
              className="bg-white/95 rounded-2xl shadow-xl border border-[#ecd3ba] p-8 mb-7"
            >
              <div className="mb-7 flex items-center gap-3">
                <FaLock className="text-2xl text-[#a6763e]" />
                <h2 className="text-xl font-bold text-[#3c1e00]">Change Password</h2>
              </div>
              <div className="space-y-4 mb-8">
                <input
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border rounded-md text-sm focus:ring-[#a6763e] focus:outline-none"
                  placeholder="Current Password"
                  required
                />
                <input
                  type="password"
                  name="new"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border rounded-md text-sm focus:ring-[#a6763e] focus:outline-none"
                  placeholder="New Password"
                  required
                />
                <input
                  type="password"
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border rounded-md text-sm focus:ring-[#a6763e] focus:outline-none"
                  placeholder="Confirm New Password"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#a6763e] text-white py-2 rounded-md font-bold hover:bg-[#412718] transition"
                disabled={savingPassword}
              >
                {savingPassword ? "Changing..." : "Update Password"}
              </button>
            </motion.form>
          )}

          {section === "emails" && (
            <motion.div
              key="emails"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.4 }}
              className="bg-white/95 rounded-2xl shadow-xl border border-[#ecd3ba] p-8 mb-7"
            >
              <div className="mb-7 flex items-center gap-3">
                <FaEnvelope className="text-2xl text-[#a6763e]" />
                <h2 className="text-xl font-bold text-[#3c1e00]">Login Emails</h2>
              </div>
              <ul className="mb-4">
                {emails.map((e) => (
                  <li key={e.address} className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[#412718]">{e.address}</span>
                    {e.verified ? (
                      <span className="text-green-600 text-xs">Verified</span>
                    ) : (
                      <span className="text-yellow-600 text-xs">Pending</span>
                    )}
                    <button
                      className="ml-2 text-red-600 text-xs underline"
                      onClick={() => handleRemoveEmail(e.address)}
                      disabled={emailLoading}
                    >
                      <FaTrashAlt />
                    </button>
                  </li>
                ))}
              </ul>
              <form onSubmit={handleAddEmail} className="flex gap-2 items-center">
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="Add new email"
                  className="border px-2 py-1 rounded text-sm text-[#412718] bg-[#f9f5f1]"
                  required
                  disabled={emailLoading}
                />
                <button
                  type="submit"
                  className="bg-[#a6763e] text-white px-3 py-1 rounded text-sm hover:bg-[#412718] transition"
                  disabled={emailLoading}
                >
                  <FaPlus /> {emailLoading ? "Adding..." : "Add"}
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-2">You can login from any verified email.</p>
            </motion.div>
          )}

          {section === "2fa" && (
            <motion.div
              key="2fa"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.4 }}
              className="bg-white/95 rounded-2xl shadow-xl border border-[#ecd3ba] p-8 mb-7"
            >
              <div className="mb-7 flex items-center gap-3">
                <FaShieldAlt className="text-2xl text-[#a6763e]" />
                <h2 className="text-xl font-bold text-[#3c1e00]">Two-Factor Authentication</h2>
              </div>
              {twoFA.enabled ? (
                <div className="space-y-3">
                  <div className="text-green-700 font-medium">2FA is enabled.</div>
                  <button
                    onClick={handleDisable2FA}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    disabled={twoFALoading}
                  >
                    {twoFALoading ? "Disabling..." : "Disable 2FA"}
                  </button>
                </div>
              ) : twoFASetup ? (
                <form onSubmit={handleConfirm2FA} className="space-y-4">
                  <div>
                    <div className="mb-2">Scan this QR code in your authenticator app:</div>
                    {qr && <img src={qr} alt="2FA QR Code" className="mx-auto w-40 h-40" />}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-[#3c1e00]">
                      Enter code from app
                    </label>
                    <input
                      type="text"
                      value={twoFACode}
                      onChange={e => setTwoFACode(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-[#a6763e] focus:outline-none"
                      required
                      disabled={twoFALoading}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#a6763e] text-white px-4 py-2 rounded hover:bg-[#412718] w-full font-bold transition"
                    disabled={twoFALoading}
                  >
                    {twoFALoading ? "Enabling..." : "Confirm & Enable 2FA"}
                  </button>
                  <button
                    type="button"
                    className="text-gray-500 underline block mt-2"
                    onClick={() => { setTwoFASetup(false); setQr(""); setTwoFACode(""); }}
                    disabled={twoFALoading}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="text-gray-700">
                    2FA is currently <span className="font-semibold">disabled</span> on your account.
                  </div>
                  <button
                    onClick={handleEnable2FA}
                    className="bg-[#a6763e] text-white px-4 py-2 rounded hover:bg-[#412718] font-bold transition"
                    disabled={twoFALoading}
                  >
                    {twoFALoading ? "Loading..." : "Enable 2FA"}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
