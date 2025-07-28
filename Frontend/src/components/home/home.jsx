import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { getAllDryfruits } from "../../api/api";
import logo from "../../assets/dryvana_logo.png";
import storage from "../../assets/storage.jpg";
import bowl from "../../assets/dryfruits-home.jpg";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getAllDryfruits()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch products");
        setLoading(false);
      });
  }, []);

  // Separate products into categories for demo
  const bestSeller = products.slice(0, 4);
  const trending = products.slice(4, 8);
  const featured = products.slice(8, 12);

  return (
    <div className="bg-[#f9f5f1] text-[#412718] font-sans">
      <HeroBanner />
      <BrandStats />
      <CategorySpotlight navigate={navigate} />
      <HorizontalProductScroll
        title="🔥 Trending Now"
        products={trending}
        loading={loading}
        error={error}
      />
      <HorizontalProductScroll
        title="🌟 Best Sellers"
        products={bestSeller}
        loading={loading}
        error={error}
      />
      <BrandValueSection />
      <ImageCallout />
      <FeaturedSection
        title="✨ Featured Collections"
        products={featured}
        loading={loading}
        error={error}
      />
      <FAQSnippet />
      <TestimonialBanner />
      <FloatingCTA />
    </div>
  );
}

// --- HERO BANNER ---
function HeroBanner() {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-16 md:py-24 bg-[#f9f5f1]">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9 }}
        className="flex-1 flex flex-col gap-7 items-start z-10"
      >
        <img
          src={logo}
          alt="Dryvana Logo"
          className="w-24 md:w-32 h-auto mb-3 drop-shadow-lg"
        />
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-[#4e311f]">
          Experience <span className="text-[#a6763e]">Pure Nepali Goodness</span>
        </h1>
        <p className="text-lg md:text-2xl text-[#61402c] font-medium max-w-xl">
          Healthy, handpicked dry fruits delivered from local Nepali farms to your door. Choose freshness, support local, and taste the best.
        </p>
        <Link
          to="/allproducts"
          className="mt-3 px-8 py-3 bg-[#a6763e] hover:bg-[#4B2E2E] transition rounded-xl text-lg text-white font-bold shadow-lg"
        >
          Shop Now
        </Link>
      </motion.div>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="hidden md:flex flex-1 items-center justify-end"
      >
        <img
          src={bowl}
          alt="Dry Fruits Bowl"
          className="w-[380px] h-[380px] object-cover rounded-full shadow-2xl border-8 border-[#ebd1c0]"
        />
      </motion.div>
      {/* Decorative blob */}
      <div className="absolute top-0 right-0 z-0 w-80 h-80 bg-gradient-to-bl from-[#efcba5]/30 to-[#f3b49f]/10 blur-2xl rounded-full opacity-60 pointer-events-none" />
    </section>
  );
}

// --- BRAND STATS ---
function BrandStats() {
  const stats = [
    { label: "Happy Customers", value: "5,000+" },
    { label: "Local Farmers", value: "200+" },
    { label: "Dry Fruit Varieties", value: "12+" },
    { label: "Positive Reviews", value: "98%" },
  ];
  return (
    <section className="max-w-5xl mx-auto py-8 px-4 grid grid-cols-2 sm:grid-cols-4 gap-6">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: i * 0.13 }}
          className="rounded-2xl bg-white/90 shadow p-6 flex flex-col items-center"
        >
          <span className="text-3xl font-extrabold text-[#a6763e] mb-1">{s.value}</span>
          <span className="text-md font-semibold text-[#4B2E2E]">{s.label}</span>
        </motion.div>
      ))}
    </section>
  );
}

// --- CATEGORY SPOTLIGHT ---
function CategorySpotlight({ navigate }) {
  const categories = [
    { name: "Premium Almonds", img: bowl, link: "/allproducts?search=almonds" },
    { name: "Local Cashews", img: storage, link: "/allproducts?search=cashew" },
    { name: "Juicy Raisins", img: bowl, link: "/allproducts?search=raisins" },
    { name: "Assorted Packs", img: storage, link: "/allproducts?search=mix" },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-16 py-10">
      <h2 className="text-2xl font-bold mb-5 text-[#4e311f]">Explore By Category</h2>
      <div className="flex flex-nowrap gap-6 overflow-x-auto pb-2">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.7, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="min-w-[230px] max-w-xs rounded-2xl bg-white shadow-md hover:shadow-xl overflow-hidden cursor-pointer"
            onClick={() => navigate(cat.link)}
          >
            <img
              src={cat.img}
              alt={cat.name}
              className="h-40 w-full object-cover"
            />
            <div className="p-4 text-center font-bold text-[#a6763e]">{cat.name}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// --- HORIZONTAL PRODUCT SCROLL ---
function HorizontalProductScroll({ title, products, loading, error }) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-16 py-10">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-[#4B2E2E]">{title}</h2>
        <Link
          to="/allproducts"
          className="text-sm px-4 py-2 border border-[#a6763e] text-[#a6763e] hover:bg-[#a6763e] hover:text-white transition rounded"
        >
          Shop All
        </Link>
      </div>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="flex gap-7 overflow-x-auto pb-2">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

// --- FEATURED GRID (OPTIONAL) ---
function FeaturedSection({ title, products, loading, error }) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-16 py-14">
      <h2 className="text-2xl font-bold mb-8 text-[#4e311f]">{title}</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-7">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

// --- PRODUCT CARD ---
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { _id, name, pricePerGram, stock, image } = product;
  const [weight, setWeight] = useState(100);
  const navigate = useNavigate();

  const imgSrc = image
    ? `http://localhost:5000/uploads/${image}`
    : "http://localhost:5000/uploads/placeholder.jpg";
  const price = Math.round(pricePerGram * weight);
  const originalPrice = Math.round(price * 1.08);
  const pricePerGramDisplay = pricePerGram.toFixed(2);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: _id,
      title: `${name} ${weight}g`,
      price: price,
      image: imgSrc,
      stock,
    });
    // You can show a toast here
  };

  const handleCardClick = () => {
    navigate(`/product/${_id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0.7, scale: 0.97 }}
      whileHover={{ scale: 1.03, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="min-w-[220px] max-w-xs bg-white/95 border border-[#f4e3d3] rounded-2xl shadow hover:shadow-2xl transition-all group cursor-pointer"
      onClick={handleCardClick}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          backgroundImage: `url(${imgSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "320px",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0" />
        <div className="absolute top-2 left-2 bg-[#a6763e]/90 text-white text-xs font-semibold px-2 py-0.5 rounded">
          PREMIUM
        </div>
        <div className="absolute top-2 right-2 bg-white text-[#a6763e] text-xs font-semibold px-2 py-0.5 rounded-full">
          8% OFF
        </div>
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10">
          <h3 className="text-lg font-bold text-white">{name}</h3>
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-4 pt-3 pb-4 z-10 flex flex-col">
          <div className="flex justify-between items-end mb-2">
            <div className="text-left">
              <label className="text-xs text-white mb-1 block">Weight</label>
              <select
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/20 border border-white text-white text-sm px-2 py-1 rounded backdrop-blur-sm"
              >
                <option className="bg-[#a6763e] text-white" value={100}>100g</option>
                <option className="bg-[#a6763e] text-white" value={250}>250g</option>
                <option className="bg-[#a6763e] text-white" value={500}>500g</option>
                <option className="bg-[#a6763e] text-white" value={1000}>1kg</option>
              </select>
            </div>
            <div className="text-right text-sm text-white">
              <span className="line-through text-gray-200 block text-xs">Rs {originalPrice}</span>
              <div className="flex items-center justify-end gap-1 text-sm">
                <span>4.9</span>
                <Heart size={14} className="text-white fill-white" />
              </div>
              <span className="text-lg font-bold block">Rs {price}</span>
              <span className="text-xs text-gray-100">(Rs {pricePerGramDisplay}/g)</span>
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className="w-full bg-[#a6763e] text-white text-sm py-2 px-4 rounded hover:bg-[#4B2E2E] transition font-semibold"
          >
            🛒 {stock === 0 ? "Out of Stock" : "Add To Cart"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// --- BRAND VALUE SECTION ---
function BrandValueSection() {
  const values = [
    {
      title: "Rooted in Nepal",
      desc: "Every purchase supports Nepali farmers and rural communities.",
      icon: "🌱"
    },
    {
      title: "Pure & Premium",
      desc: "Handpicked, naturally dried, and curated for top quality.",
      icon: "🥇"
    },
    {
      title: "Sustainable & Ethical",
      desc: "Eco-friendly packaging and fair-trade sourcing.",
      icon: "🌍"
    },
  ];
  return (
    <section className="py-12 px-4 md:px-16 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#4e311f]">Our Promise</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {values.map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.12 }}
            className="bg-white border-l-8 border-[#a6763e]/60 rounded-2xl shadow p-8"
          >
            <div className="text-3xl mb-3">{v.icon}</div>
            <h3 className="text-xl font-bold mb-1">{v.title}</h3>
            <p className="text-[#6b4632]">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// --- IMAGE CALLOUT (INFO) ---
function ImageCallout() {
  return (
    <section className="px-4 md:px-16 py-12 max-w-6xl mx-auto">
      <div className="bg-white border border-[#ecd3ba] rounded-2xl shadow flex flex-col md:flex-row items-center gap-8 p-7">
        <motion.div
          initial={{ opacity: 0.9 }}
          whileHover={{ scale: 1.04, opacity: 1 }}
          className="overflow-hidden rounded-xl w-full md:w-80"
        >
          <img src={storage} alt="Storage" className="object-cover w-full h-52" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold mb-3 text-[#4e311f]">How to Store Your Dry Fruits</h2>
          <ul className="space-y-2 text-[#6b4632] leading-relaxed text-md">
            <li>• Use airtight containers</li>
            <li>• Keep in a cool, dry place</li>
            <li>• Avoid direct sunlight</li>
            <li>• Refrigerate for longer freshness</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// --- FAQ SNIPPET ---
function FAQSnippet() {
  const faqs = [
    { q: "Where do you source your dry fruits?", a: "Directly from local Nepali farmers and trusted importers." },
    { q: "Is delivery available outside Kathmandu?", a: "Yes! We deliver all over Nepal." },
    { q: "How fast is delivery?", a: "Most orders reach your door within 1-3 business days." }
  ];
  const [open, setOpen] = useState(null);
  return (
    <section className="py-12 px-4 md:px-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#4e311f]">Frequently Asked</h2>
      <div className="bg-white rounded-2xl shadow-lg p-7">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-[#f4e3d3] last:border-none py-3">
            <button
              className="w-full text-left flex justify-between items-center font-semibold text-[#4B2E2E]"
              onClick={() => setOpen(open === i ? null : i)}
            >
              {faq.q}
              <span className="ml-4 text-xl">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-[#6b4632] bg-[#f9f5f1] p-3 rounded text-sm"
              >
                {faq.a}
              </motion.p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// --- TESTIMONIAL BANNER ---
function TestimonialBanner() {
  const testimonials = [
    { quote: "Dryvana truly stands out! The quality and freshness are unmatched.", name: "Aarav Shrestha" },
    { quote: "Beautiful packaging, quick delivery, and amazing taste.", name: "Nisha Gurung" },
    { quote: "The best shop for authentic dry fruits in Nepal.", name: "Hari Bhattarai" },
  ];
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);
  return (
    <section className="max-w-3xl mx-auto my-14 px-4">
      <motion.div
        className="rounded-2xl bg-gradient-to-r from-[#a6763e]/90 via-[#4B2E2E]/90 to-[#a6763e]/80 shadow-xl py-8 px-4 sm:px-14 text-center text-white"
        initial={{ opacity: 0.7, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <blockquote className="italic text-lg mb-3">“{testimonials[current].quote}”</blockquote>
        <p className="text-md font-semibold">{testimonials[current].name}</p>
      </motion.div>
    </section>
  );
}

// --- FLOATING CTA BANNER ---
function FloatingCTA() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        to="/allproducts"
        className="bg-[#a6763e] text-white font-bold px-7 py-3 rounded-2xl shadow-lg hover:bg-[#4B2E2E] transition"
      >
        🛒 Shop All Dry Fruits
      </Link>
    </div>
  );
}
