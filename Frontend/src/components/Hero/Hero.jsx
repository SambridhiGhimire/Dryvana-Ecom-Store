import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage1 from "../../assets/hero.jpg";
import heroImage2 from "../../assets/move1.png";
import heroImage3 from "../../assets/move2.jpg";

const images = [heroImage1, heroImage2, heroImage3];

export default function Hero() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => setCurrentIndex(index);

  return (
    <motion.div
      className="relative w-full min-h-[80vh] overflow-hidden bg-[#f4e3d3]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Slides */}
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`Slide ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Text Content */}
      <motion.div
        className="relative z-10 h-full flex items-center justify-end px-6 md:px-16 text-white"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <div className="text-right max-w-xl mt-56 mr-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-2xl leading-tight">
            A Bite Full of Love and Goodness
          </h1>
          <p className="text-base md:text-lg font-light mt-4 mb-6 text-gray-100 drop-shadow-md">
            Discover Nepal’s premium dry fruits curated just for you — health meets heritage.
          </p>
          <button
            onClick={() => navigate("/all")}
            className="bg-[#4B2E2E] text-white px-6 py-2 rounded-md hover:bg-white hover:text-[#4B2E2E] border transition-all duration-300"
          >
            🛒 Shop Now
          </button>
        </div>
      </motion.div>

      {/* Navigation Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentIndex ? "bg-[#4B2E2E]" : "bg-white/60"
            }`}
            onClick={() => goToSlide(i)}
          />
        ))}
      </div>
    </motion.div>
  );
}
