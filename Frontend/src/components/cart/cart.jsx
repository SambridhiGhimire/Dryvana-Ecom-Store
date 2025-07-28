import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getProfile } from "../../api/api";
import toast from "react-hot-toast";
import Payment from "../Payment/Payment";
import { v4 as uuidv4 } from "uuid";
import { generateEsewaSignature } from "../../utils/esewaSignature";
import { motion } from "framer-motion";

const weightOptions = [100, 250, 500, 1000];

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    updateWeight,
  } = useCart();

  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const esewaFormRef = useRef(null);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setAddress(data.address || "");
        setPhone(data.phone || "");
      })
      .catch((err) => {
        toast.error(err.message || "Failed to fetch profile info");
      });
  }, []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.totalPrice || 0) * Number(item.quantity || 1),
    0
  );
  const shipping = cartItems.length > 0 ? 40 : 0;
  const total = subtotal + shipping;

  const handlePaymentSuccess = () => {
    setShowModal(true);
    toast.success("🎉 Your Dryvana order is confirmed!");
    setTimeout(() => {
      clearCart();
      navigate("/");
    }, 2600);
  };

  return (
    <motion.div
      className="min-h-screen bg-[#f9f5f1] px-2 py-10 md:px-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {/* Page Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#4B2E2E]">
              🛒 Your Shopping Cart
            </h1>
            <p className="text-[#836959] mt-1 text-base">
              Quality Nepali dryfruits, handpicked for you.
            </p>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm bg-[#a6763e]/10 text-[#a6763e] px-4 py-1.5 rounded-full border border-[#a6763e]/30 font-bold hover:bg-[#a6763e]/30 transition"
            >
              Clear Cart
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-9">
          {/* Cart Items List */}
          <motion.section
            className="lg:col-span-2 bg-white/90 backdrop-blur-xl border border-[#ecd3ba] shadow-lg rounded-2xl p-6 md:p-9 mb-8 lg:mb-0"
            initial={{ x: -40, opacity: 0.85 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-xl font-bold mb-5 text-[#4B2E2E]">Bag Items</h2>
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-2 text-[#836959]">
                <span className="text-4xl mb-3">👜</span>
                <span>Your cart is empty.</span>
                <button
                  onClick={() => navigate("/allproducts")}
                  className="mt-4 text-[#a6763e] hover:underline font-bold"
                >
                  ← Continue shopping
                </button>
              </div>
            ) : (
              <ul className="space-y-7">
                {cartItems.map((item) => (
                  <motion.li
                    key={item.id + "-" + item.weight}
                    className="flex flex-col sm:flex-row gap-7 items-center bg-[#f9f5f1] rounded-xl px-3 py-4 shadow border border-[#e8dbcb]/60"
                    whileHover={{ scale: 1.018 }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg shadow"
                    />
                    <div className="flex-1 w-full">
                      <p className="font-bold text-lg text-[#4B2E2E]">{item.title}</p>
                      <div className="flex flex-wrap gap-4 items-center my-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#8a775b]">Weight:</span>
                          <select
                            value={item.weight}
                            onChange={(e) => updateWeight(item.id, item.weight, Number(e.target.value))}
                            className="bg-white/70 border border-[#e8dbcb] text-sm px-2 py-1 rounded"
                          >
                            {weightOptions.map((w) => (
                              <option key={w} value={w}>
                                {w === 1000 ? "1kg" : `${w}g`}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#8a775b]">Qty:</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.weight, Math.max(1, item.quantity - 1))}
                            className="w-7 h-7 rounded bg-[#e8dbcb] text-lg font-bold hover:bg-[#d4b188] transition"
                          >−</button>
                          <span className="mx-1">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.weight, item.quantity + 1)}
                            className="w-7 h-7 rounded bg-[#e8dbcb] text-lg font-bold hover:bg-[#d4b188] transition"
                          >+</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-md font-semibold text-[#3c1e00]">
                          Rs {Number(item.totalPrice || 0) * Number(item.quantity || 1)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id, item.weight)}
                          className="text-xs text-red-600 hover:underline ml-5"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.section>

          {/* Order Summary / Checkout */}
          <motion.section
            className="bg-white/90 backdrop-blur-xl border border-[#ecd3ba] shadow-xl rounded-2xl p-6 md:p-8"
            initial={{ x: 40, opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-xl font-bold mb-4 text-[#4B2E2E]">Order Summary</h3>
            {/* Address & Phone */}
            <div className="mb-5">
              <input
                type="text"
                placeholder="Full Address"
                className="w-full mb-3 px-4 py-2 border border-[#ecd3ba] rounded text-sm focus:ring-[#a6763e] bg-[#f9f5f1] focus:outline-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-4 py-2 border border-[#ecd3ba] rounded text-sm focus:ring-[#a6763e] bg-[#f9f5f1] focus:outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Price summary */}
            <div className="space-y-2 text-sm mb-5">
              <div className="flex justify-between border-b border-[#ecd3ba] pb-1">
                <span>Subtotal</span>
                <span>Rs {subtotal}</span>
              </div>
              <div className="flex justify-between border-b border-[#ecd3ba] pb-1">
                <span>Shipping</span>
                <span>Rs {shipping}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>Rs {total}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-2">Payment Options</h4>
              <div className="space-y-2">
                {[
                  { id: "cod", label: "Cash on Delivery" },
                  { id: "khalti", label: "Khalti" },
                  { id: "esewa", label: "eSewa" },
                ].map(({ id, label }) => (
                  <label key={id} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="payment"
                      value={id}
                      checked={paymentMethod === id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            {/* Payment Components */}
            {paymentMethod !== "esewa" && cartItems.length > 0 && (
              <Payment
                cart={cartItems}
                address={address}
                contact={phone}
                paymentMethod={paymentMethod}
                total={total}
                setError={setError}
                setLoading={setLoading}
                onSuccess={handlePaymentSuccess}
              />
            )}

            {/* eSewa Logic */}
            {paymentMethod === "esewa" && cartItems.length > 0 && (() => {
              const transaction_uuid = uuidv4();
              const { signedFieldNames, signature } = generateEsewaSignature({
                total_amount: total,
                transaction_uuid,
                product_code: "EPAYTEST",
              });
              return (
                <form
                  ref={esewaFormRef}
                  action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
                  method="POST"
                  className="mt-4"
                >
                  <input type="hidden" name="amount" value={subtotal} />
                  <input type="hidden" name="tax_amount" value="0" />
                  <input type="hidden" name="total_amount" value={total} />
                  <input type="hidden" name="transaction_uuid" value={transaction_uuid} />
                  <input type="hidden" name="product_code" value="EPAYTEST" />
                  <input type="hidden" name="product_service_charge" value="0" />
                  <input type="hidden" name="product_delivery_charge" value={shipping} />
                  <input type="hidden" name="success_url" value="http://localhost:5173/paymentsuccess" />
                  <input type="hidden" name="failure_url" value="http://localhost:5173/paymentfailure" />
                  <input type="hidden" name="signed_field_names" value={signedFieldNames} />
                  <input type="hidden" name="signature" value={signature} />
                  <button
                    type="submit"
                    className="w-full py-2 px-4 mt-2 bg-[#4B2E2E] text-white font-semibold rounded hover:bg-[#a6763e] transition"
                  >
                    Pay with eSewa
                  </button>
                </form>
              );
            })()}

            <button
              onClick={() => navigate("/allproducts")}
              className="mt-6 w-full text-center py-2 text-[#a6763e] bg-[#f9f5f1] border border-[#a6763e]/30 rounded-full font-bold hover:bg-[#a6763e]/10 transition"
            >
              ← Continue shopping
            </button>
          </motion.section>
        </div>
      </motion.div>

      {/* Modal - Success */}
      {showModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <h3 className="text-lg font-bold text-[#4B2E2E]">Thank you for shopping with Dryvana!</h3>
            <p className="text-sm text-[#836959] mt-2">Redirecting to home...</p>
            <div className="mt-4 w-full h-1.5 bg-gray-200 rounded">
              <div className="h-full bg-[#a6763e] w-full animate-pulse rounded"></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
