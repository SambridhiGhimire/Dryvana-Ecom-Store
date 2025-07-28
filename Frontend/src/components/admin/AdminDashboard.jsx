import React, { useState, useEffect } from "react";
import api, {
  getAllDryfruits,
  getAllBookings,
  getAllUsers,
  createDryfruit,
  updateDryfruit,
  deleteDryfruit,
  updateBookingStatus,
  blockUser,
  unblockUser,
  getProfile,
  updateProfile,
} from "../../api/api";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserCircle,
  ShoppingCart,
  Package,
  Users,
  BookOpen,
  Settings,
  ClipboardList,
  LogOut,
  Activity,
  Mail,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";

const sections = [
  { key: "overview", label: "Overview", icon: <BookOpen /> },
  { key: "products", label: "Products", icon: <Package /> },
  { key: "orders", label: "Orders", icon: <ShoppingCart /> },
  { key: "users", label: "Users", icon: <Users /> },
  { key: "contacts", label: "Contacts", icon: <Mail /> },
  { key: "activity", label: "Activity", icon: <Activity /> },
  { key: "profile", label: "Profile", icon: <Settings /> },
];

function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-4 mb-4 shadow animate-pulse">
        {error.toString()}
      </div>
    );
  }
  return React.cloneElement(children, { setError });
}

function StatCard({ label, value, icon, color }) {
  return (
    <div
      className="rounded-2xl flex flex-col items-center gap-2 p-6 shadow group bg-white/70 hover:bg-white border border-gray-100 transition"
      style={{
        boxShadow: "0 6px 36px -8px #e3dac7",
        borderColor: color + "33",
      }}
    >
      <div className="text-3xl mb-1" style={{ color }}>{icon}</div>
      <div className="text-3xl font-extrabold tracking-tight" style={{ color }}>
        {value}
      </div>
      <div className="text-sm uppercase text-gray-600 group-hover:text-black tracking-wider">{label}</div>
    </div>
  );
}

function DashboardOverview({ setError }) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([getAllBookings(), getAllUsers(), getAllDryfruits()])
      .then(([orders, users, products]) => {
        setOrders(orders);
        setUsers(users);
        setProducts(products);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load dashboard data");
        setLoading(false);
      });
  }, [setError]);

  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalUsers = users.length;
  const totalProducts = products.length;
  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recentOrders = sortedOrders.slice(0, 5);

  if (loading)
    return <div className="py-14 text-center text-[#a58a6c] animate-pulse">Loading dashboard…</div>;

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-[#614726]">Admin Dashboard</h2>
      <div className="grid gap-6 grid-cols-2 md:grid-cols-4 mb-12">
        <StatCard label="Total Orders" value={totalOrders} icon={<ShoppingCart />} color="#ae8625" />
        <StatCard label="Total Sales (Rs)" value={totalSales} icon={<ClipboardList />} color="#d4af37" />
        <StatCard label="Total Users" value={totalUsers} icon={<Users />} color="#7e5e38" />
        <StatCard label="Products" value={totalProducts} icon={<Package />} color="#3d2c16" />
      </div>
      <div className="bg-white/80 rounded-xl shadow p-6 border border-[#eee3cd]">
        <h3 className="text-lg font-semibold mb-4 text-[#805d3a]">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#f9f5f1] text-[#614726]">
                <th className="px-3 py-2">Order ID</th>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Total (Rs)</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o._id} className="border-b hover:bg-[#f5eee5]">
                  <td className="px-3 py-2">{o._id.slice(-6)}</td>
                  <td className="px-3 py-2">{o.user?.name || "-"}</td>
                  <td className="px-3 py-2">{o.dryfruit?.name || "-"}</td>
                  <td className="px-3 py-2">Rs {o.totalPrice}</td>
                  <td className="px-3 py-2 capitalize">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// -------------------- PRODUCTS --------------------
function ProductManagement({ setError }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", pricePerGram: "", stock: "", image: "" });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    getAllDryfruits()
      .then(setProducts)
      .catch((err) => setError(err.message || "Failed to load products"))
      .finally(() => setLoading(false));
  };
  useEffect(fetchProducts, [setError]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateDryfruit(editing, form);
        toast.success("Product updated.");
      } else {
        await createDryfruit(form);
        toast.success("Product added.");
      }
      setForm({ name: "", description: "", pricePerGram: "", stock: "", image: "" });
      setEditing(null);
      fetchProducts();
    } catch (err) {
      setError(err.message || "Failed to save product");
      toast.error(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name,
      description: product.description,
      pricePerGram: product.pricePerGram,
      stock: product.stock,
      image: product.image,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setSaving(true);
    try {
      await deleteDryfruit(id);
      fetchProducts();
      toast.success("Product deleted.");
    } catch (err) {
      setError(err.message || "Failed to delete product");
      toast.error(err.message || "Failed to delete product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-[#705937]">Product Management</h2>
      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/80 rounded-2xl p-6 shadow">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border px-3 py-2 rounded" required disabled={saving} />
        <input name="pricePerGram" value={form.pricePerGram} onChange={handleChange} placeholder="Price Per Gram (Rs)" type="number" className="border px-3 py-2 rounded" required disabled={saving} />
        <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" className="border px-3 py-2 rounded" required disabled={saving} />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image filename (e.g. almonds.jpg)" className="border px-3 py-2 rounded" required disabled={saving} />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border px-3 py-2 rounded md:col-span-2" required disabled={saving} />
        <button type="submit" className="bg-[#ae8625] text-white py-2 rounded hover:bg-[#7e5e38] transition md:col-span-2" disabled={saving}>{editing ? "Update" : "Add"} Product</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: "", description: "", pricePerGram: "", stock: "", image: "" }); }} className="text-sm text-gray-500 underline md:col-span-2">Cancel Edit</button>}
      </form>
      {loading ? <div>Loading...</div> : products.length === 0 ? <div>No products found.</div> : (
        <div className="overflow-x-auto rounded-2xl shadow bg-white/80 p-6">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#f9f5f1] text-[#614726]">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Price/Gram</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const imgSrc = p.image
                  ? `http://localhost:5000/uploads/${p.image}`
                  : "http://localhost:5000/uploads/placeholder.jpg";
                return (
                  <tr key={p._id} className="border-t hover:bg-[#f9f5f1]">
                    <td className="px-4 py-3 font-semibold">{p.name}</td>
                    <td className="px-4 py-3">
                      <img
                        src={imgSrc}
                        alt={p.name}
                        className="h-10 w-10 object-contain rounded"
                        onError={(e) => {
                          e.target.src = "http://localhost:5000/uploads/placeholder.jpg";
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">Rs {p.pricePerGram}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => handleEdit(p)} className="p-2 bg-[#d4af37] text-white rounded hover:bg-[#a58a6c]"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(p._id)} className="p-2 bg-[#ba382f] text-white rounded hover:bg-[#a83225]"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ------------- ORDERS --------------
function OrderManagement({ setError }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    getAllBookings()
      .then(setOrders)
      .catch((err) => setError(err.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  };
  useEffect(fetchOrders, [setError]);

  const handleStatus = async (id, status) => {
    setSaving(true);
    try {
      await updateBookingStatus(id, status);
      fetchOrders();
      toast.success("Order status updated.");
    } catch (err) {
      setError(err.message || "Failed to update status");
      toast.error(err.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const statusOptions = ["pending", "shipped", "delivered", "cancelled"];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-[#705937]">Order Management</h2>
      {loading ? <div>Loading...</div> : orders.length === 0 ? <div>No orders found.</div> : (
        <div className="overflow-x-auto rounded-2xl shadow bg-white/80 p-6">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#f9f5f1] text-[#614726]">
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Weight (g)</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Total Price</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t hover:bg-[#f9f5f1]">
                  <td className="px-4 py-2">{o._id.slice(-6)}</td>
                  <td className="px-4 py-2">{o.user?.name || "-"}</td>
                  <td className="px-4 py-2">{o.dryfruit?.name || "-"}</td>
                  <td className="px-4 py-2">{o.weight}</td>
                  <td className="px-4 py-2">{o.quantity}</td>
                  <td className="px-4 py-2">Rs {o.totalPrice}</td>
                  <td className="px-4 py-2">
                    <span className="capitalize font-semibold">{o.status}</span>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      className="border rounded px-2 py-1 text-xs"
                      value={o.status}
                      onChange={e => handleStatus(o._id, e.target.value)}
                      disabled={saving}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ------------- USERS --------------
function UserManagement({ setError }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers()
      .then(setUsers)
      .catch((err) => setError(err.message || "Failed to load users"))
      .finally(() => setLoading(false));
  };
  useEffect(fetchUsers, [setError]);

  const handleBlock = async (id, block) => {
    setSaving(true);
    try {
      if (block) {
        await blockUser(id);
        toast.success("User blocked.");
      } else {
        await unblockUser(id);
        toast.success("User unblocked.");
      }
      fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to update user");
      toast.error(err.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-[#705937]">User Management</h2>
      {loading ? <div>Loading...</div> : users.length === 0 ? <div>No users found.</div> : (
        <div className="overflow-x-auto rounded-2xl shadow bg-white/80 p-6">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#f9f5f1] text-[#614726]">
                <th className="px-4 py-2">User ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-[#f9f5f1]">
                  <td className="px-4 py-2">{u._id.slice(-6)}</td>
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.isAdmin ? "Admin" : "Customer"}</td>
                  <td className="px-4 py-2">{u.blocked ? <span className="text-red-600 font-semibold">Blocked</span> : <span className="text-green-600 font-semibold">Active</span>}</td>
                  <td className="px-4 py-2">
                    {u.isAdmin ? (
                      <span className="text-xs text-gray-400">-</span>
                    ) : u.blocked ? (
                      <button onClick={() => handleBlock(u._id, false)} className="text-xs bg-[#7e5e38] text-white px-2 py-1 rounded" disabled={saving}>Unblock</button>
                    ) : (
                      <button onClick={() => handleBlock(u._id, true)} className="text-xs bg-[#ba382f] text-white px-2 py-1 rounded" disabled={saving}>Block</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ------------- CONTACTS --------------
function ContactManagement({ setError }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  const fetchContacts = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/contact", { headers })
      .then(res => setContacts(res.data))
      .catch((err) => setError(err.response?.data?.msg || err.message || "Failed to load messages"))
      .finally(() => setLoading(false));
  };
  useEffect(fetchContacts, [setError]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    setSaving(true);
    try {
      await axios.delete(`http://localhost:5000/api/contact/${id}`, { headers });
      fetchContacts();
      toast.success("Message deleted.");
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Failed to delete message");
      toast.error(err.response?.data?.msg || err.message || "Failed to delete message");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-[#705937]">Contact/Inquiry Management</h2>
      {loading ? <div>Loading...</div> : contacts.length === 0 ? <div>No messages found.</div> : (
        <div className="overflow-x-auto rounded-2xl shadow bg-white/80 p-6">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#f9f5f1] text-[#614726]">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c._id} className="border-t hover:bg-[#f9f5f1]">
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.email}</td>
                  <td className="px-4 py-2 max-w-xs truncate">{c.message}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleDelete(c._id)} className="text-xs bg-[#ba382f] text-white px-2 py-1 rounded" disabled={saving}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ------------- ACTIVITY LOGS --------------
function ActivityLogs({ setError }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setLoading(true);
    const url = userFilter ? `/users/activity-logs?user=${userFilter}` : "/users/activity-logs";
    Promise.all([
      api.get(url),
      getAllUsers()
    ])
      .then(([logRes, users]) => {
        setLogs(Array.isArray(logRes.data) ? logRes.data : []);
        setUsers(users);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load activity logs");
        setLoading(false);
      });
  }, [setError, userFilter]);

  if (!Array.isArray(logs)) return <div>Error: Activity logs data is not an array.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-[#705937]">Activity Logs</h2>
      <div className="mb-4 flex gap-2 items-center">
        <label className="text-sm">Filter by user:</label>
        <select value={userFilter} onChange={e => setUserFilter(e.target.value)} className="border px-2 py-1 rounded">
          <option value="">All</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
        </select>
      </div>
      {loading ? <div>Loading logs...</div> : logs.length === 0 ? <div>No activity logs found.</div> : (
        <div className="overflow-x-auto rounded-2xl shadow bg-white/80 p-6">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="bg-[#f9f5f1] text-[#614726]">
                <th className="px-2 py-2">Time</th>
                <th className="px-2 py-2">User</th>
                <th className="px-2 py-2">IP</th>
                <th className="px-2 py-2">Action</th>
                <th className="px-2 py-2">Method</th>
                <th className="px-2 py-2">URL</th>
                <th className="px-2 py-2">Info</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id} className="border-t hover:bg-[#f9f5f1]">
                  <td className="px-2 py-2 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-2 py-2">{
                    log.user && typeof log.user === 'object'
                      ? `${log.user.name || ''} (${log.user.email || log.user._id || ''})`
                      : log.user
                        ? log.user
                        : <span className="text-gray-400">Visitor</span>
                  }</td>
                  <td className="px-2 py-2">{log.ip}</td>
                  <td className="px-2 py-2">{log.action}</td>
                  <td className="px-2 py-2">{log.method}</td>
                  <td className="px-2 py-2">{log.url}</td>
                  <td className="px-2 py-2">{log.info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ------------- PROFILE --------------
function AdminProfileSettings({ setError }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setLoading(true);
    getProfile()
      .then((data) => {
        setProfile(data);
        setForm({ email: data.email, password: "" });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load profile");
        setLoading(false);
      });
  }, [setError]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    try {
      await updateProfile(form);
      setSuccess("Profile updated successfully.");
      setForm(f => ({ ...f, password: "" }));
      toast.success("Profile updated.");
    } catch (err) {
      setError(err.message || "Failed to update profile");
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-[#705937]">Admin Profile & Settings</h2>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4 bg-white/80 rounded-2xl p-6 shadow">
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input name="email" value={form.email} onChange={handleChange} type="email" className="border px-3 py-2 rounded w-full" required disabled={saving} />
        </div>
        <div>
          <label className="block font-semibold mb-1">New Password</label>
          <input name="password" value={form.password} onChange={handleChange} type="password" className="border px-3 py-2 rounded w-full" placeholder="Leave blank to keep current password" disabled={saving} />
        </div>
        <button type="submit" className="bg-[#ae8625] text-white py-2 rounded hover:bg-[#7e5e38] transition w-full" disabled={saving}>Update Profile</button>
        {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
      </form>
      <div className="mt-8">
        <button onClick={handleLogout} className="bg-[#ba382f] text-white py-2 px-6 rounded hover:bg-[#a83225] transition">Logout</button>
      </div>
    </div>
  );
}

// ------------- ADMIN DASHBOARD WRAPPER --------------
export default function AdminDashboard() {
  const [section, setSection] = useState("overview");
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#f9f5f1] flex flex-row">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <aside className={`${
        open ? "w-60" : "w-16"
      } bg-white/80 border-r border-[#e6dac3] shadow-2xl h-screen flex flex-col transition-all duration-300 z-10`}>
        <div className="flex items-center gap-3 px-6 pt-8 pb-12">
          <div className="text-2xl font-extrabold text-[#ae8625] tracking-wider">Dryvana</div>
          <button
            className="ml-auto p-1 text-[#9c7e54] hover:text-black transition"
            onClick={() => setOpen((v) => !v)}
            title={open ? "Collapse" : "Expand"}
          >
            <span className="text-lg">{open ? "⏴" : "⏵"}</span>
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={`flex items-center gap-4 px-6 py-3 font-medium rounded-xl text-lg transition
                ${
                  section === s.key
                    ? "bg-gradient-to-r from-[#ae8625]/90 to-[#f9f5f1] text-black shadow-lg"
                    : "hover:bg-[#fffbe8] text-[#876c48]"
                }`}
            >
              <span className="text-xl">{s.icon}</span>
              {open && <span>{s.label}</span>}
            </button>
          ))}
        </nav>
        <div className="px-6 pb-8 mt-auto">
          <button
            className="flex items-center gap-3 text-[#b6502b] font-bold py-2 w-full hover:bg-[#fae4e4] rounded-xl transition"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            <LogOut /> {open && "Logout"}
          </button>
          <div className="mt-4 text-xs text-[#cab795] text-center">&copy; {new Date().getFullYear()} Dryvana Admin</div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 min-h-screen px-4 md:px-12 py-10">
        <div className="max-w-7xl mx-auto">
          {section === "overview" && <ErrorBoundary><DashboardOverview /></ErrorBoundary>}
          {section === "products" && <ErrorBoundary><ProductManagement /></ErrorBoundary>}
          {section === "orders" && <ErrorBoundary><OrderManagement /></ErrorBoundary>}
          {section === "users" && <ErrorBoundary><UserManagement /></ErrorBoundary>}
          {section === "contacts" && <ErrorBoundary><ContactManagement /></ErrorBoundary>}
          {section === "activity" && <ErrorBoundary><ActivityLogs /></ErrorBoundary>}
          {section === "profile" && <ErrorBoundary><AdminProfileSettings /></ErrorBoundary>}
        </div>
      </main>
    </div>
  );
}
