import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../../assets/dryvana_logo.png";
import dryfruitBowls from "../../assets/dryfoodbowls.jpeg";

// Custom colors for the project
const headlineColor = "#4B2E2E";
const catchyColor = "#8e6747";
const bodyColor = "#222";

// Animated stat card
const Stat = ({ number, label }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    viewport={{ once: true }}
    className="flex flex-col items-center px-6 py-4 bg-white/80 rounded-2xl shadow-xl"
  >
    <span className="text-4xl font-extrabold" style={{ color: catchyColor }}>{number}</span>
    <span className="text-lg font-semibold" style={{ color: bodyColor }}>{label}</span>
  </motion.div>
);

export default function About() {
  return (
    <div className="flex-grow w-full min-h-screen bg-[#f6e3d5] font-sans">
      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between px-8 py-20 md:py-28 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="z-10 flex-1 flex flex-col gap-7 items-start"
        >
          <img
            src={logo}
            alt="Dryvana Logo"
            className="w-24 md:w-32 h-auto mb-2 drop-shadow-lg"
          />
          <h1
            className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-2"
            style={{ color: headlineColor }}
          >
            Experience Pure{" "}
            <span style={{ color: catchyColor }}>Nepali Goodness</span>
          </h1>
          <p
            className="text-lg md:text-2xl font-medium max-w-lg mb-2"
            style={{ color: bodyColor }}
          >
            Handpicked, wholesome, and delivered fresh from Nepali farms to your door.
            <br />
            Taste the richness. Support local. Choose <b style={{ color: catchyColor }}>Dryvana</b>.
          </p>
          <Link to="/allproducts">
            <button
              className="mt-3 px-8 py-3 bg-[#e2c4a2] hover:bg-[#d2a97e] transition rounded-xl text-lg font-bold shadow-lg border-2 border-[#c39a71]"
              style={{ color: headlineColor }}
            >
              Shop Now
            </button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="hidden md:flex flex-1 items-center justify-end"
        >
          <img
            src={dryfruitBowls}
            alt="Dry Fruit Bowls"
            className="w-[380px] h-[380px] object-cover rounded-full shadow-2xl border-8 border-[#ebd1c0]"
          />
        </motion.div>
        {/* Decorative gradient blob */}
        <div className="absolute top-0 right-0 z-0 w-80 h-80 bg-gradient-to-bl from-[#efcba5]/30 to-[#f3b49f]/10 blur-2xl rounded-full opacity-60 pointer-events-none" />
      </section>

      {/* Stats/Impact Section */}
      <section className="py-8 md:py-12 bg-white/60 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8">
          <Stat number="5,000+" label="Happy Customers" />
          <Stat number="200+" label="Local Farmers" />
          <Stat number="12+" label="Dry Fruit Varieties" />
          <Stat number="98%" label="Positive Reviews" />
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="py-12 md:py-20 max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ x: -70, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: headlineColor }}
          >
            Our Story
          </h2>
          <p
            className="text-lg mb-3"
            style={{ color: bodyColor }}
          >
            Dryvana began with a vision to empower Nepali farmers while providing the healthiest snacks to every home.
            Our founders traveled across the valleys, handpicking partnerships and learning the secrets of authentic dry fruits.
            <br /><br />
            Today, each pack supports a family, preserves a tradition, and delivers unfiltered taste to you.
          </p>
          <div className="mt-7 space-y-4">
            <div>
              <h3 className="text-xl font-semibold" style={{ color: catchyColor }}>Our Mission</h3>
              <p className="" style={{ color: bodyColor }}>To elevate Nepal’s dry fruits industry through ethical sourcing, farmer partnerships, and genuine quality.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold" style={{ color: catchyColor }}>Our Vision</h3>
              <p className="" style={{ color: bodyColor }}>To make Nepali dry fruits a symbol of pride, nutrition, and sustainability—at home and abroad.</p>
            </div>
          </div>
        </motion.div>
        {/* Timeline/visual */}
        <motion.div
          initial={{ x: 70, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <div className="w-full max-w-xs flex flex-col gap-10 items-center">
            <div className="flex items-center gap-4">
              <span className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ background: catchyColor }}>1</span>
              <div className="flex-1 h-[2px]" style={{ background: "#dbc2a2" }} />
              <span className="font-medium" style={{ color: headlineColor }}>Local Farmers</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ background: catchyColor }}>2</span>
              <div className="flex-1 h-[2px]" style={{ background: "#dbc2a2" }} />
              <span className="font-medium" style={{ color: headlineColor }}>Sustainable Sourcing</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ background: catchyColor }}>3</span>
              <div className="flex-1 h-[2px]" style={{ background: "#dbc2a2" }} />
              <span className="font-medium" style={{ color: headlineColor }}>Health & Quality</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Values & Why Choose Us */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#f6e3d5] to-[#f6f1ea]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 px-4 items-center">
          {/* Cards of Value */}
          <div className="space-y-8">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-6 bg-white rounded-2xl shadow-xl border-l-8"
              style={{ borderColor: catchyColor }}
            >
              <h3 className="text-2xl font-bold mb-1" style={{ color: catchyColor }}>Rooted in Nepal</h3>
              <p className="text-lg" style={{ color: bodyColor }}>Every bite uplifts Nepali farmers, sustaining traditions and dreams.</p>
            </motion.div>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="p-6 bg-white rounded-2xl shadow-xl border-l-8 border-amber-500/80"
            >
              <h3 className="text-2xl font-bold mb-1" style={{ color: "#bc7c38" }}>Pure & Premium</h3>
              <p className="text-lg" style={{ color: bodyColor }}>Handpicked for natural taste, nutrition, and absolute freshness.</p>
            </motion.div>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="p-6 bg-white rounded-2xl shadow-xl border-l-8 border-green-500/80"
            >
              <h3 className="text-2xl font-bold mb-1" style={{ color: "#27683b" }}>Sustainable & Ethical</h3>
              <p className="text-lg" style={{ color: bodyColor }}>Transparent practices, fair pay, and eco-friendly packaging.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nutrition Facts Section */}
      <section className="py-16 px-2 md:px-0 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-10"
          style={{ color: catchyColor }}
        >
          Nutrition Highlights <span style={{ color: headlineColor }}>of Popular Dry Fruits</span>
        </motion.h2>
        {/* Nutrition Cards */}
        <div className="grid gap-7 grid-cols-1 md:grid-cols-3">
          {[
            { name: "Cashews", cal: "553 kcal", carbs: "30g", protein: "18g", fat: "44g" },
            { name: "Almonds", cal: "579 kcal", carbs: "22g", protein: "21g", fat: "50g" },
            { name: "Pistachios", cal: "562 kcal", carbs: "28g", protein: "20g", fat: "45g" },
            { name: "Walnuts", cal: "654 kcal", carbs: "14g", protein: "15g", fat: "65g" },
            { name: "Raisins", cal: "299 kcal", carbs: "79g", protein: "3g", fat: "0.5g" },
            { name: "Dates", cal: "277 kcal", carbs: "75g", protein: "2g", fat: "0.2g" },
            { name: "Anjeer", cal: "249 kcal", carbs: "64g", protein: "3g", fat: "0.9g" },
          ].map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-2 border-t-4"
              style={{ borderColor: catchyColor }}
            >
              <span className="text-lg font-semibold" style={{ color: catchyColor }}>{item.name}</span>
              <div className="flex justify-between font-medium text-gray-700 text-sm mt-1" style={{ color: bodyColor }}>
                <span>Calories: <span className="font-bold">{item.cal}</span></span>
                <span>Carbs: <span className="font-bold">{item.carbs}</span></span>
              </div>
              <div className="flex justify-between font-medium text-gray-700 text-sm" style={{ color: bodyColor }}>
                <span>Protein: <span className="font-bold">{item.protein}</span></span>
                <span>Fat: <span className="font-bold">{item.fat}</span></span>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="mt-9 text-center text-lg max-w-2xl mx-auto" style={{ color: bodyColor }}>
          <b>Note:</b> Dry fruits are natural energy boosters, loaded with healthy fats, proteins, and antioxidants. Add them to your diet for a happy heart, active brain, and stronger immunity!
        </p>
      </section>

      {/* End Section / Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-14 text-center rounded-t-3xl shadow-lg mt-10"
        style={{ background: catchyColor }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#fff" }}>
          Ready to Taste the Difference?
        </h2>
        <p className="text-lg mb-7" style={{ color: "#fceede" }}>
          Join thousands of Nepalis choosing freshness, quality, and tradition. Order your favorite dry fruits today!
        </p>
        <Link to="/allproducts">
          <button className="px-9 py-4 bg-white/90 hover:bg-white text-lg font-bold rounded-2xl shadow-xl border-2 border-white transition" style={{ color: catchyColor }}>
            Shop Dryvana Now
          </button>
        </Link>
      </motion.section>
    </div>
  );
}
