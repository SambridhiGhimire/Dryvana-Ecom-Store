import React, { useEffect, useState } from "react";
import { getUserBookings } from "../../api/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaBoxOpen, FaTruck, FaCheck, FaClock, FaTimesCircle } from "react-icons/fa";

const STATUS_ICONS = {
  pending: <FaClock className="text-yellow-500" />,
  shipped: <FaTruck className="text-blue-500" />,
  delivered: <FaCheck className="text-green-600" />,
  cancelled: <FaTimesCircle className="text-red-500" />,
  default: <FaBoxOpen className="text-gray-400" />,
};

const CANCEL_REASONS = [
  "Changed my mind",
  "Ordered by mistake",
  "Found cheaper elsewhere",
  "Other"
];

export default function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    getUserBookings()
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Failed to load orders");
        setLoading(false);
      });
  }, []);

  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelModal(true);
    setCancelReason("");
  };

  const confirmCancel = () => {
    toast.success("❌ Order cancelled. A walnut saved 🥜", { duration: 2200 });
    setOrders(orders => orders.map(o =>
      o._id === selectedOrderId ? { ...o, status: "cancelled" } : o
    ));
    setCancelModal(false);
  };

  return (
    <motion.div
      className="min-h-screen bg-[#f9f5f1] px-2 py-10 md:px-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="text-3xl font-extrabold text-[#3c1e00] mb-8 text-center tracking-tight">
        My Orders
      </h2>

      {loading ? (
        <div className="text-center py-24 text-[#3c1e00] text-lg animate-pulse">
          🧺 Fetching your delicious orders...
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-700">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500 py-16 text-xl">You haven’t ordered any nuts yet 🥜</div>
      ) : (
        <section className="space-y-8">
          {orders.map(order => {
            const imgSrc = order.dryfruit?.image
              ? `http://localhost:5000/uploads/${order.dryfruit.image}`
              : "http://localhost:5000/uploads/placeholder.jpg";

            const statusIcon = STATUS_ICONS[order.status] || STATUS_ICONS.default;
            let statusLabel, statusColor;
            switch (order.status) {
              case "pending":
                statusLabel = "Pending";
                statusColor = "text-yellow-600";
                break;
              case "shipped":
                statusLabel = "Shipped";
                statusColor = "text-blue-600";
                break;
              case "delivered":
                statusLabel = "Delivered";
                statusColor = "text-green-600";
                break;
              case "cancelled":
                statusLabel = "Cancelled";
                statusColor = "text-red-600";
                break;
              default:
                statusLabel = "Processing";
                statusColor = "text-gray-500";
            }

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0.7, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col md:flex-row gap-5 bg-white/90 border border-[#ecd3ba] shadow-xl rounded-2xl p-6 md:items-center transition"
              >
                {/* Product image */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <img
                    src={imgSrc}
                    alt={order.dryfruit?.name}
                    className="w-20 h-20 object-cover rounded-xl border shadow-sm"
                    onError={e => { e.target.src = "http://localhost:5000/uploads/placeholder.jpg"; }}
                  />
                  <span className="mt-2 text-xs text-[#b3957a]">#{order._id.slice(-6)}</span>
                </div>
                {/* Info section */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-bold text-lg text-[#3c1e00]">{order.dryfruit?.name}</div>
                    <div className="text-sm text-[#87665b] mt-1">
                      Qty: <b>{order.quantity}</b> &bull; Price: <b>Rs {order.totalPrice}</b>
                    </div>
                    <div className="text-xs text-[#87665b] mt-1">
                      Address: {order.address} <br />
                      Contact: {order.phone}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-start md:items-end justify-between">
                    {/* Status */}
                    <div className={`flex items-center gap-2 font-semibold text-base ${statusColor}`}>
                      {statusIcon}
                      <span>{statusLabel}</span>
                    </div>
                    {/* Cancel Button */}
                    {order.status === "pending" && (
                      <button
                        onClick={() => openCancelModal(order._id)}
                        className="px-5 py-2 rounded-lg mt-2 bg-gradient-to-r from-[#a6763e] via-[#c59c71] to-[#a6763e] text-white font-semibold shadow hover:scale-105 transition"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>
      )}

      {/* Cancel Modal */}
      <AnimatePresence>
        {cancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.96, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-[#ecd3ba] space-y-5"
            >
              <h3 className="text-lg font-extrabold text-[#3c1e00] mb-2">Cancel Order</h3>
              <p className="text-[#88674e] mb-2 text-sm">
                Why are you cancelling your dryfruit order?
              </p>
              <select
                className="w-full border border-[#ecd3ba] rounded px-3 py-2 focus:outline-none"
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
              >
                <option value="">Select a reason...</option>
                {CANCEL_REASONS.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setCancelModal(false)}
                  className="px-4 py-2 rounded font-semibold text-[#3c1e00] bg-[#ecd3ba] hover:bg-[#f9f5f1] border transition"
                >
                  Back
                </button>
                <button
                  onClick={confirmCancel}
                  disabled={!cancelReason}
                  className={`px-4 py-2 rounded font-semibold text-white transition 
                    ${cancelReason
                      ? "bg-[#a6763e] hover:bg-[#3c1e00]"
                      : "bg-gray-300 cursor-not-allowed"
                    }`}
                >
                  Confirm Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
