import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../../api/api";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaQuestionCircle } from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/contact", form);
      toast.success("Thank you! We'll get back to you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    { question: "What are your business hours?", answer: "Monday to Friday, 9:00 AM to 6:00 PM." },
    { question: "How can I contact customer support?", answer: "Email dryvana@gmail.com or call 9825956956." },
    { question: "Where is your store located?", answer: "Dot Trade, Kapan, Kathmandu, Nepal." },
    { question: "Do you offer international shipping?", answer: "Currently, we ship within Nepal only." },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f9f5f1] py-14 px-2">
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* --- LEFT COLUMN: Contact Info & Map --- */}
        <div className="flex flex-col gap-8">
          {/* Info Card */}
          <motion.div
            className="backdrop-blur-xl bg-white/90 rounded-2xl shadow-xl p-7 flex flex-col gap-5 border border-[#ecd3ba]"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <FaEnvelope className="text-[#a6763e] text-2xl" />
              <span className="font-bold text-lg text-[#4B2E2E]">Contact Us</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-[#a6763e]" />
                <span>dryvana@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhoneAlt className="text-[#a6763e]" />
                <span>9825956956</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#a6763e]" />
                <span>Dot Trade, Kapan, Kathmandu</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-[#4B2E2E]">
              <b>Customer Support:</b><br />
              Mon–Fri: 9am–6pm
            </div>
          </motion.div>

          {/* Map Card */}
          <motion.div
            className="overflow-hidden rounded-2xl shadow-lg bg-white/90 backdrop-blur-lg border border-[#ecd3ba]"
            whileHover={{ scale: 1.01 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8098721310366!2d85.35553837534103!3d27.692567376192988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1bb297270d3f%3A0x7bce0075d98f7859!2sDot%20Trade!5e0!3m2!1sen!2snp!4v1719828582076!5m2!1sen!2snp"
              width="100%"
              height="200"
              allowFullScreen
              loading="lazy"
              title="Dot Trade, Kapan"
              className="w-full h-48 border-0"
              style={{ minHeight: "180px" }}
            ></iframe>
          </motion.div>
        </div>

        {/* --- MIDDLE COLUMN: Modern Contact Form --- */}
        <motion.div
          className="flex flex-col h-full justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
        >
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl p-10 flex flex-col gap-5 border border-[#ecd3ba]"
          >
            <h2 className="text-2xl font-extrabold text-[#4B2E2E] text-center mb-2">Send Us a Message</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="px-4 py-2 rounded-lg bg-white border border-[#e2c4a2] text-[#4B2E2E] focus:ring-2 focus:ring-[#a6763e] outline-none"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="px-4 py-2 rounded-lg bg-white border border-[#e2c4a2] text-[#4B2E2E] focus:ring-2 focus:ring-[#a6763e] outline-none"
              />
            </div>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone (optional)"
              className="px-4 py-2 rounded-lg bg-white border border-[#e2c4a2] text-[#4B2E2E] focus:ring-2 focus:ring-[#a6763e] outline-none"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="5"
              placeholder="How can we help you?"
              required
              className="px-4 py-2 rounded-lg bg-white border border-[#e2c4a2] text-[#4B2E2E] focus:ring-2 focus:ring-[#a6763e] outline-none"
            ></textarea>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#a6763e] via-[#4B2E2E] to-[#a6763e] text-white font-bold py-2.5 rounded-lg hover:shadow-xl transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </motion.div>

        {/* --- RIGHT COLUMN: Interactive FAQ --- */}
        <motion.div
          className="flex flex-col h-full gap-8"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="backdrop-blur-xl bg-white/90 rounded-2xl shadow-xl p-7 border border-[#ecd3ba]">
            <div className="flex items-center gap-3 mb-3">
              <FaQuestionCircle className="text-[#a6763e] text-2xl" />
              <span className="font-bold text-lg text-[#4B2E2E]">FAQs</span>
            </div>
            <div className="divide-y divide-[#f4e3d3]">
              {faqs.map((faq, idx) => (
                <div key={idx} className="py-3">
                  <button
                    className="w-full flex justify-between items-center text-left font-semibold text-[#4B2E2E] hover:text-[#a6763e] text-base focus:outline-none"
                    onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  >
                    <span>{faq.question}</span>
                    <span className="ml-4 text-xl">
                      {openFAQ === idx ? "−" : "+"}
                    </span>
                  </button>
                  {openFAQ === idx && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 bg-[#f7f3ef] p-3 rounded text-[#3a2314] text-sm shadow"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Call-to-Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="max-w-2xl mx-auto mt-16"
      >
        <div className="rounded-2xl bg-gradient-to-r from-[#a6763e]/90 via-[#4B2E2E]/90 to-[#a6763e]/80 shadow-2xl py-8 px-5 sm:px-14 text-center text-white">
          <h2 className="text-2xl font-bold mb-2 tracking-wide">
            Not finding what you need?
          </h2>
          <p className="mb-5 text-base">
            Our support team is always ready to help. Email or call us anytime.
          </p>
          <a
            href="mailto:dryvana@gmail.com"
            className="inline-block px-8 py-3 bg-white text-[#4B2E2E] rounded-lg font-bold shadow hover:bg-[#e2c4a2] transition"
          >
            Email Us Directly
          </a>
        </div>
      </motion.div>
    </div>
  );
}
