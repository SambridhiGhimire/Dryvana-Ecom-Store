import React, { useState, useEffect, useMemo } from "react";
import { Heart, Search, Filter, ShoppingCart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { getAllDryfruits } from "../../api/api";
import { Link, useLocation, useNavigate } from "react-router-dom";

// --- Debounce hook
function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const sortOptions = [
  { label: "Best Match", value: "default" },
  { label: "Price: Low to High", value: "asc" },
  { label: "Price: High to Low", value: "desc" },
  { label: "Alphabetical (A-Z)", value: "az" },
  { label: "Alphabetical (Z-A)", value: "za" }
];

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const query = useQuery();

  const debouncedSearch = useDebouncedValue(search, 250);

  useEffect(() => {
    setLoading(true);
    getAllDryfruits()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load products");
        setLoading(false);
      });
  }, []);

  // --- Categories: Use .category if available, else .name
  const categories = useMemo(() => {
    const setCat = new Set(products.map((p) => p.category || p.name));
    return ["All", ...Array.from(setCat)];
  }, [products]);

  // --- Filtering & Sorting Logic
  const categoryFiltered =
    selectedCategory === "All"
      ? products
      : products.filter((p) => (p.category || p.name) === selectedCategory);

  const searched = useMemo(() => {
    if (!debouncedSearch.trim()) return categoryFiltered;
    const term = debouncedSearch.trim().toLowerCase();
    return categoryFiltered.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.keywords && p.keywords.toLowerCase().includes(term))
    );
  }, [categoryFiltered, debouncedSearch]);

  const sorted = useMemo(() => {
    let arr = [...searched];
    switch (sortBy) {
      case "asc":
        arr.sort((a, b) => a.pricePerGram - b.pricePerGram);
        break;
      case "desc":
        arr.sort((a, b) => b.pricePerGram - a.pricePerGram);
        break;
      case "az":
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        arr.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    return arr;
  }, [searched, sortBy]);

  return (
    <div className="bg-[#f7f3ef] min-h-screen px-2 sm:px-4 md:px-8 py-7 font-sans">
      <Toaster position="top-right" />
      {/* Hero/Intro */}
      <div className="max-w-7xl mx-auto flex flex-col gap-3 items-center mb-7">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#4B2E2E] text-center">
          Discover the <span className="text-[#a6763e]">Finest Dry Fruits</span>
        </h1>
        <p className="text-md text-[#49392e] text-center max-w-lg">
          Explore our premium, locally sourced collection. Filter, search, and shop the best of Dryvana!
        </p>
      </div>
      {/* --- Filter & Sort Bar */}
      <div className="max-w-7xl mx-auto sticky top-2 z-10 bg-[#f7f3ef] mb-4 rounded-xl shadow flex flex-wrap items-center gap-3 px-4 py-3">
        <button
          className="flex items-center gap-2 border rounded-full px-4 py-1.5 font-medium text-[#4B2E2E] border-[#c1ab8e] hover:bg-[#f2e0c7] transition"
          onClick={() => setShowFilter((v) => !v)}
        >
          <Filter size={16} /> Category
        </button>
        {showFilter && (
          <div className="flex flex-wrap gap-2 items-center bg-white rounded-xl p-3 shadow border border-[#e2c4a2]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowFilter(false);
                }}
                className={`px-3 py-1.5 rounded-full font-semibold border
                  ${selectedCategory === cat
                    ? "bg-[#4B2E2E] text-white scale-105 border-[#a6763e]"
                    : "border-[#dac8b1] text-[#4B2E2E] hover:bg-[#4B2E2E] hover:text-white"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Search Bar */}
        <div className="flex-1 flex items-center relative max-w-xs">
          <Search className="absolute left-3 top-2.5 text-[#a6763e]" size={18} />
          <input
            className="w-full border rounded-full py-2 pl-10 pr-4 bg-white text-[#49392e] placeholder-[#9d7b54] outline-[#a6763e]"
            placeholder="Search dry fruits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-full px-3 py-2 font-medium text-[#4B2E2E] bg-white hover:border-[#a6763e] transition"
        >
          {sortOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* --- Product Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-lg text-[#4B2E2E]">Loading products...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {sorted.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Real World Modern Product Card
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { _id, name, pricePerGram, stock, image, description } = product;
  const [weight, setWeight] = useState(100);
  const [liked, setLiked] = useState(false);

  const imgSrc = image
    ? `http://localhost:5000/uploads/${image}`
    : "http://localhost:5000/uploads/placeholder.jpg";
  const price = Math.round(pricePerGram * weight);
  const originalPrice = Math.round(price * 1.08);

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
    toast.success(`🛒 ${name} (${weight}g) added to cart!`);
  };

  const handleCardClick = () => {
    navigate(`/product/${_id}`);
  };

  return (
    <div
      className="group relative rounded-3xl bg-white shadow-xl hover:shadow-2xl cursor-pointer overflow-hidden transition-all border border-[#edd9c1] flex flex-col"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      role="button"
    >
      {/* -- Card Image */}
      <div className="relative w-full h-60 overflow-hidden flex items-center justify-center">
        <img
          src={imgSrc}
          alt={name}
          className="object-cover w-full h-full scale-100 group-hover:scale-105 transition-transform"
          loading="lazy"
        />
        {/* Quick Like button */}
        <button
          className={`absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-[#f3dfbb] shadow
            ${liked ? "text-red-500" : "text-[#b8a58e]"}`}
          onClick={e => {
            e.stopPropagation(); setLiked((v) => !v);
            if (!liked) toast.success("Added to wishlist!");
          }}
          aria-label="Add to wishlist"
        >
          <Heart fill={liked ? "#f43f5e" : "none"} size={22} />
        </button>
        {/* Ribbon */}
        <div className="absolute top-5 left-0 bg-[#4B2E2E] text-white text-xs px-3 py-1 rounded-e-full font-bold shadow">
          Premium
        </div>
        {stock === 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
            Out of Stock
          </div>
        )}
      </div>
      {/* -- Card Body */}
      <div className="flex-1 flex flex-col p-5 pt-4 gap-2">
        <h3 className="font-extrabold text-lg text-[#4B2E2E] mb-1">{name}</h3>
        <p className="text-sm text-[#685144] min-h-[38px] line-clamp-2 mb-2">{description || "Premium Nepali dry fruits, farm-fresh and full of nutrition."}</p>
        {/* Price, Weight & Rating */}
        <div className="flex justify-between items-end mt-auto mb-1">
          <div>
            <span className="block text-xs text-[#8e6747]">Weight</span>
            <select
              value={weight}
              onChange={e => setWeight(parseInt(e.target.value))}
              onClick={e => e.stopPropagation()}
              className="mt-1 border bg-[#f9f6ef] border-[#dac8b1] rounded px-2 py-1 text-xs focus:outline-none"
            >
              <option value={100}>100g</option>
              <option value={250}>250g</option>
              <option value={500}>500g</option>
              <option value={1000}>1kg</option>
            </select>
          </div>
          <div className="text-right">
            <span className="block line-through text-gray-400 text-xs">Rs {originalPrice}</span>
            <span className="block font-extrabold text-lg text-[#a6763e]">Rs {price}</span>
            <span className="block text-xs text-gray-400">Rs {pricePerGram.toFixed(2)}/g</span>
            <div className="flex items-center gap-1 text-xs mt-0.5">
              <span>4.9</span>
              <Heart size={13} className="text-[#f3c183]" fill="#f3c183" />
            </div>
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className={`w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition font-bold shadow
            ${stock === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#4B2E2E] text-white hover:bg-[#a6763e] hover:text-white"
            }`}
        >
          <ShoppingCart size={17} />
          {stock === 0 ? "Out of Stock" : "Add To Cart"}
        </button>
      </div>
    </div>
  );
}
