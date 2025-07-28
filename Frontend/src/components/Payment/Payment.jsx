import { useEffect, useState } from "react";
import KhaltiCheckout from "khalti-checkout-web";
import { useAuth } from "../../context/useAuth";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../../api/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaMoneyBill, FaCreditCard, FaMobileAlt, FaCheckCircle, FaSpinner } from "react-icons/fa";

const publicTestKey = "test_public_key_402c2b0e98364222bb1c1ab02369cefd";

const paymentOptions = [
  { id: "cod", label: "Cash on Delivery", icon: <FaMoneyBill className="text-green-700" /> },
  { id: "khalti", label: "Khalti", icon: <FaMobileAlt className="text-purple-600" /> },
  { id: "esewa", label: "eSewa", icon: <FaCreditCard className="text-green-600" /> },
];

export default function Payment({
  cart,
  address,
  contact,
  paymentMethod,
  total,
  setError,
  setLoading,
  onSuccess,
}) {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [checkout, setCheckout] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(false);

  // Khalti Config
  useEffect(() => {
    setCheckout(new KhaltiCheckout({
      publicKey: publicTestKey,
      productIdentity: "dryvana-order",
      productName: "Dryvana Dry Fruits",
      productUrl: "http://localhost:5173",
      eventHandler: {
        onSuccess: (payload) => {
          setStatus("Khalti payment successful!");
          handlePaymentSuccess("khalti", payload.token);
        },
        onError: (error) => {
          setStatus("");
          setError("Payment failed. Try again.");
          toast.error("❌ Payment failed.");
          setLoading(false);
        },
        onClose: () => setLoading(false),
      },
      paymentPreference: [
        "KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"
      ],
    }));
  }, []);

  // Main payment/booking handler
  const handlePaymentSuccess = async (method, token = null) => {
    try {
      setProgress(true);
      for (const item of cart) {
        const bookingData = {
          dryfruit: item.id,
          quantity: item.quantity,
          totalPrice: item.totalPrice * item.quantity,
          address,
          phone: contact,
          weight: item.weight,
          pricePerGram: item.totalPrice,
          paymentMethod: method,
          ...(method === "khalti" && { khaltiTransactionId: token }),
        };
        await createBooking(bookingData);
      }
      clearCart();
      onSuccess();
      setStatus("success");
      toast.success("🎉 Payment successful! Order placed.");
      setTimeout(() => navigate("/success"), 1200);
    } catch (err) {
      setError(err.message || "Failed to complete order");
      toast.error("❌ " + (err.message || "Order failed"));
    } finally {
      setLoading(false);
      setProgress(false);
    }
  };

  const handleOrder = async () => {
    if (!contact || !address) {
      setError("Please enter address and contact.");
      return;
    }
    if (!cart.length) return;

    setLoading(true);
    setStatus("");
    setProgress(true);

    if (paymentMethod === "khalti") {
      if (checkout) {
        checkout.show({ amount: total * 100 });
      } else {
        setError("Payment not ready. Try again.");
        setLoading(false);
        setProgress(false);
      }
    } else if (paymentMethod === "cod") {
      handlePaymentSuccess("cod");
    } else if (paymentMethod === "esewa") {
      handlePaymentSuccess("esewa");
    }
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="bg-[#f9f5f1] rounded-2xl shadow-lg border border-[#ecd3ba] px-5 py-6 mt-2"
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          {paymentOptions.map(opt => (
            <div
              key={opt.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold shadow border
                ${paymentMethod === opt.id
                  ? "bg-[#a6763e] text-white border-[#a6763e]"
                  : "bg-white text-[#a6763e] border-[#ecd3ba] opacity-70"
                }
              `}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
        <button
          onClick={handleOrder}
          disabled={progress || !cart.length}
          className={`w-full py-3 rounded-xl text-lg font-bold tracking-wide transition-all
            ${
              progress
                ? "bg-gray-300 cursor-not-allowed"
                : paymentMethod === "khalti"
                ? "bg-gradient-to-r from-[#6946a3] to-[#bb5bdc] text-white"
                : paymentMethod === "esewa"
                ? "bg-gradient-to-r from-[#57a66b] to-[#89e190] text-white"
                : "bg-[#a6763e] text-white hover:bg-[#5c4033]"
            }
          `}
        >
          {progress ? (
            <span className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" /> Processing...
            </span>
          ) : paymentMethod === "khalti" ? (
            "Pay with Khalti"
          ) : paymentMethod === "esewa" ? (
            "Pay with eSewa"
          ) : (
            "Place Order (Cash on Delivery)"
          )}
        </button>
        <AnimatePresence>
          {status === "success" && (
            <motion.div
              className="flex items-center justify-center mt-4 text-green-700 gap-2 text-md font-semibold"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
            >
              <FaCheckCircle /> Payment Successful!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
