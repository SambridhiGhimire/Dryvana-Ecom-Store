import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { getDryfruitById, getAllDryfruits } from "../../api/api";
import { useCart } from "../../context/CartContext";
import { Heart } from "lucide-react";

// New: Visually rich, softer feature icons
const featureData = [
  { icon: "💪", label: "High Protein" },
  { icon: "❤️", label: "Cardio Friendly" },
  { icon: "🌾", label: "Gluten Free" },
  { icon: "🚫", label: "No Preservatives" },
];

const weights = [100, 250, 500, 1000];

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [weight, setWeight] = useState(100);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch product and related
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const prod = await getDryfruitById(id);
        setProduct(prod);
        const all = await getAllDryfruits();
        setRelated(all.filter((p) => p._id !== id).slice(0, 4));
      } catch (err) {
        toast.error("🥲 Product not found");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading || !product)
    return <div className="min-h-screen bg-[#f9f5f1] flex items-center justify-center"><span className="text-[#a6763e] text-xl">Loading product...</span></div>;

  const totalPrice = Math.round((product.pricePerGram || 1) * weight);
  const imageSrc = product.image
    ? `http://localhost:5000/uploads/${product.image}`
    : "http://localhost:5000/uploads/placeholder.jpg";

  // -- New Buy Now: Always go to cart, direct checkout --
  const handleBuyNow = () => {
    addToCart({
      id: product._id,
      title: product.name,
      pricePerGram: product.pricePerGram,
      weight,
      totalPrice,
      image: imageSrc,
      stock: product.stock,
    });
    toast.success(`🌰 ${product.name} added to cart!`);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-[#f9f5f1] px-2 md:px-16 py-10 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12"
      >
        {/* Left: Product Image */}
        <div className="w-full md:w-[46%] flex flex-col gap-6">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="rounded-3xl shadow-xl overflow-hidden bg-white border-2 border-[#ecd3ba] p-6 flex items-center justify-center"
          >
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full max-h-[390px] object-contain"
              onError={e => { e.target.src = "http://localhost:5000/uploads/placeholder.jpg"; }}
            />
          </motion.div>
          <div className="flex gap-2 justify-center">
            {/* Social share / wishlist etc. (optionally) */}
            <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#fff7e9] border border-[#ecd3ba] text-[#a6763e] font-medium text-sm hover:bg-[#a6763e] hover:text-white transition">
              <Heart size={16} className="inline" /> Wishlist
            </button>
            <a
              href={`https://wa.me/?text=Check out this Dryvana product: ${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded bg-[#fff7e9] border border-[#ecd3ba] text-[#a6763e] font-medium text-sm hover:bg-[#25D366] hover:text-white transition"
            >
              Share
            </a>
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="w-full md:w-[54%] flex flex-col gap-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#3c1e00] mb-2 tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-[#a6763e] font-semibold">Rs {totalPrice}</span>
              <span className="text-xs ml-2 px-2 py-1 rounded bg-[#e8dbcb] text-[#3c1e00]">{weight}g</span>
              {product.stock > 0
                ? <span className="text-green-700 text-xs font-semibold ml-3">In Stock</span>
                : <span className="text-red-600 text-xs font-semibold ml-3">Out of Stock</span>
              }
            </div>
            <div className="flex gap-2 mt-2">
              <select
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
                className="border border-[#ecd3ba] rounded px-3 py-2 text-sm text-[#3c1e00] bg-[#f9f5f1] w-36 font-semibold"
              >
                {weights.map(w => (
                  <option key={w} value={w}>
                    {w === 1000 ? "1kg" : `${w}g`}
                  </option>
                ))}
              </select>
              <button
                className="bg-[#a6763e]/10 px-2 py-2 rounded text-xs text-[#a6763e] font-bold border border-[#ecd3ba]"
                disabled
              >
                Rs {product.pricePerGram}/g
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featureData.map(f => (
              <FeatureCard key={f.label} icon={f.icon} label={f.label} />
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-1">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                addToCart({
                  id: product._id,
                  title: product.name,
                  pricePerGram: product.pricePerGram,
                  weight,
                  totalPrice,
                  image: imageSrc,
                  stock: product.stock,
                });
                toast.success(`🛒 ${product.name} added to cart!`);
              }}
              disabled={product.stock === 0}
              className="flex-1 py-3 rounded-md bg-[#a6763e] text-white font-bold hover:bg-[#3c1e00] shadow-md transition disabled:bg-[#d8cab6] disabled:text-gray-500"
            >
              Add to Cart
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 py-3 rounded-md border-2 border-[#a6763e] text-[#a6763e] font-bold hover:bg-[#a6763e] hover:text-white shadow-md transition disabled:border-[#ecd3ba] disabled:text-gray-400"
            >
              Buy Now
            </motion.button>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-[#3c1e00] mb-2">Description</h2>
            <div className="w-14 h-[2px] bg-[#a6763e] mb-4" />
            <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
            {product.bulletPoints?.length > 0 && (
              <ul className="list-disc list-inside text-sm text-[#836959] mt-2 space-y-1">
                {product.bulletPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}
            {/* Delivery */}
            <div className="mt-6 text-sm bg-[#f9f5f1] rounded p-3 border border-[#ecd3ba] text-[#3c1e00] flex items-center gap-2">
              🚚 <span className="font-semibold">Delivery:</span> All Nepal - usually within 2-3 days.
            </div>
          </div>
        </div>
      </motion.div>

      {/* Related products */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-6xl mx-auto mt-20"
      >
        <h2 className="text-2xl font-extrabold text-[#3c1e00] mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {related.map((prod) => (
            <RelatedProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Feature card for product benefits
function FeatureCard({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-[#ecd3ba] shadow-sm">
      <div className="text-2xl">{icon}</div>
      <div className="text-xs font-bold text-[#3c1e00]">{label}</div>
    </div>
  );
}

// Minimal related product card
function RelatedProductCard({ product }) {
  const navigate = useNavigate();
  const imgSrc = product.image
    ? `http://localhost:5000/uploads/${product.image}`
    : "http://localhost:5000/uploads/placeholder.jpg";
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="bg-white rounded-xl border border-[#ecd3ba] shadow p-3 flex flex-col items-center cursor-pointer"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <img
        src={imgSrc}
        alt={product.name}
        className="w-full max-w-[130px] h-[110px] object-contain rounded mb-2"
      />
      <div className="font-bold text-[#3c1e00]">{product.name}</div>
      <div className="text-xs text-[#a6763e] font-semibold mt-1">Rs {product.pricePerGram}/g</div>
    </motion.div>
  );
}
