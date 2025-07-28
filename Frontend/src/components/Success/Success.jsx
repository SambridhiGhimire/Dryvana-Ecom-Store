import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

function Confetti({ show }) {
  // Minimal animated confetti for 🎉
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Confetti emojis for now (replace with package if you want real confetti) */}
          <div className="absolute w-full h-full flex flex-wrap gap-4 justify-center items-center opacity-70 select-none text-4xl pointer-events-none">
            {["🎉", "🍇", "🥜", "🍫", "🥥", "🌰", "🍍"].map((e, i) => (
              <motion.span
                key={i}
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1, rotate: Math.random() * 60 - 30 }}
                transition={{ delay: 0.13 * i, type: "spring" }}
                className="drop-shadow-2xl"
              >
                {e}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const Success = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
      navigate("/");
    }, 4800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5f1] px-2 relative">
      <Confetti show={showConfetti} />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="relative z-10 w-full max-w-lg bg-white/90 border border-[#e7dacb] shadow-2xl rounded-3xl px-10 py-12 flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0.7, rotate: 12 }}
          animate={{ scale: 1.15, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.15 }}
          className="mb-8"
        >
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto drop-shadow-xl animate-bounce" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-4xl font-extrabold text-[#36210a] tracking-tight mb-3 text-center"
        >
          Payment Complete!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-[#6e4325] mb-6 text-center"
        >
          Thank you for shopping with us. Your order is confirmed and on its way! <span className="inline-block animate-pulse">🛒</span>
        </motion.p>

        <div className="bg-[#fcf7f1] border border-[#ecd3ba] rounded-xl shadow-inner p-6 mb-8 w-full">
          <div className="text-[#543715] font-semibold text-base mb-1">Next steps:</div>
          <ul className="list-disc list-inside text-sm text-[#7c654d] space-y-1">
            <li>Order & payment confirmation sent to your email</li>
            <li>Delivery scheduled within 2–3 business days</li>
            <li>Our support is available anytime if needed</li>
          </ul>
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-[#a6763e] to-[#5c4033] text-white hover:scale-105 transition shadow-lg text-lg"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/myorder")}
            className="w-full py-3 rounded-xl font-semibold border-2 border-[#a6763e] text-[#a6763e] hover:bg-[#fcf7f1] hover:border-[#5c4033] transition text-lg"
          >
            View My Orders
          </button>
        </div>

        <motion.p
          className="text-xs text-[#aa9277] mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          You will be redirected home in a few seconds...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Success;
