import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Upload, 
  FileText, 
  Eye, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

// Taruh URL API secara global di sini agar semua fungsi fetch mengarah ke backend yang sama
const API_BASE_URL = "http://127.0.0.1:8000/api"; 

export default function ProductsPage() {
  // --- States ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter & Search States
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Toast Notification State
  const [toast, setToast] = useState(null);

  // Form State untuk Tambah/Edit
  const [form, setForm] = useState({
    id: null,
    name: "",
    category_id: "",
    price: "",
    stock: "",
    description: "",
    image: null,
    image_preview: null,
  });

  const fileInputRef = useRef(null);

  // 1. Deklarasikan Helper Header Terlebih Dahulu
  const getAuthHeaders = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return { "Accept": "application/json" };
      return { 
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      };
    } catch {
      return { "Accept": "application/json" };
    }
  };

  // 2. Baru Tulis Fungsi handleDelete di Bawahnya
  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

    try {
      const headers = {
        ...getAuthHeaders(),
        "Content-Type": "application/json"
      };

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal menghapus produk dari server");
      }

      showToast("Produk berhasil dihapus!");
      fetchData();
    } catch (error) {
      console.error("Delete Error:", error);
      showToast(error.message || "Gagal menghapus produk", "error");
    }
  };

  // --- Helper: Mengonversi Nama File Gambar ke URL Storage Laravel ---
  const getImageUrl = (imageName) => {
    if (!imageName) return "https://placehold.co/100x100?text=No+Image";
    // Menghapus '/api' dari basis URL untuk mengarah ke root public Laravel
    const baseUrl = API_BASE_URL.replace("/api", "");
    return `${baseUrl}/storage/${imageName}`;
  };

  // --- Fetch Data ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products`, { headers }).then((res) => res.json()),
        fetch(`${API_BASE_URL}/categories`, { headers }).then((res) => res.json()),
      ]);

      const prodData = prodRes?.data ?? prodRes;
      const catData = catRes?.data ?? catRes;

      setProducts(Array.isArray(prodData) ? prodData : []);
      setCategories(Array.isArray(catData) ? catData : []);

      // Set default category_id untuk form dari data pertama jika tersedia
      if (Array.isArray(catData) && catData.length > 0) {
        setForm((f) => ({ ...f, category_id: String(catData[0].id) }));
      }
    } catch (error) {
      showToast("Gagal memuat data dari server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Toast Helper ---
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Dropdown Options (MEMOIZED) ---
  const categoryFilterOptions = useMemo(() => {
    return [
      { id: "all", name: "Semua Kategori" },
      ...categories.map((c) => ({ id: String(c.id), name: c.name })),
    ];
  }, [categories]);

  const categoryFormOptions = useMemo(() => {
    return categories.map((c) => ({ id: String(c.id), name: c.name }));
  }, [categories]);

  // --- Filter & Sorting Logic ---
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = categoryId === "all" || String(p.category_id) === categoryId;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (sortBy === "price" || sortBy === "stock") {
          valA = Number(valA);
          valB = Number(valB);
        } else {
          valA = String(valA).toLowerCase();
          valB = String(valB).toLowerCase();
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [products, search, categoryId, sortBy, sortOrder]);

  // --- Handlers ---
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((f) => ({
        ...f,
        image: file,
        image_preview: URL.createObjectURL(file),
      }));
    }
  };

  const openAddModal = () => {
    setForm({
      id: null,
      name: "",
      category_id: categories.length > 0 ? String(categories[0].id) : "",
      price: "",
      stock: "",
      description: "",
      image: null,
      image_preview: null,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      category_id: String(product.category_id),
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      image: null,
      image_preview: product.image ? getImageUrl(product.image) : null,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.price || !form.stock || !form.category_id) {
      showToast("Harap isi semua kolom wajib!", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category_id", form.category_id);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("description", form.description);
    if (form.image) {
      formData.append("image", form.image);
    }

    const url = form.id ? `${API_BASE_URL}/products/${form.id}` : `${API_BASE_URL}/products`;
    
    if (form.id) {
      formData.append("_method", "PUT");
    }

    try {
      const response = await fetch(url, {
        method: "POST", // POST + _method agar Laravel file upload lancar
        body: formData,
        headers: getAuthHeaders() // Otomatis mengirim Bearer Token
      });

      if (!response.ok) throw new Error("Gagal menyimpan data");

      showToast(form.id ? "Produk berhasil diperbarui" : "Produk baru berhasil ditambahkan!");
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      showToast("Terjadi kesalahan saat menyimpan data", "error");
    }
  };

  

  return (
    <div className="min-h-screen bg-stone-100 p-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg transition-all transform translate-y-0 duration-300 ${
          toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-600 text-white"
        }`}>
          {toast.type === "error" ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Kelola Produk</h1>
          <p className="text-gray-500 text-sm mt-1">Sistem Manajemen Inventaris & Produk Toko</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-2xl shadow-md transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Tambah Produk</span>
        </button>
      </div>

      {/* Filter & Bar Pencarian */}
      <div className="bg-white/80 backdrop-blur-md border border-white p-5 rounded-3xl shadow-sm mb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <label className="text-xs font-bold text-gray-500 block mb-2">Cari Produk</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Masukkan nama produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* Dropdown Filter Kategori */}
        <div className="md:col-span-4">
          <label className="text-xs font-bold text-gray-500 block mb-2">Kategori</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full h-11 rounded-2xl bg-white border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
          >
            {categoryFilterOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="md:col-span-3">
          <label className="text-xs font-bold text-gray-500 block mb-2">Urutkan Berdasarkan</label>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-11 rounded-2xl bg-white border border-gray-200 px-4 outline-none text-sm"
            >
              <option value="name">Nama Produk</option>
              <option value="price">Harga</option>
              <option value="stock">Stok</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="h-11 w-11 flex items-center justify-center bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all active:scale-95"
            >
              <ArrowUpDown size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabel Data / Loading State */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border shadow-sm">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm font-medium animate-pulse">Menghubungkan ke server...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border shadow-sm p-6 text-center">
          <FileText size={48} className="text-gray-300" />
          <p className="text-gray-600 font-bold text-lg">Tidak ada produk ditemukan</p>
          <p className="text-gray-400 text-sm">Coba ubah kata kunci pencarian atau kategori filter Anda.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Produk</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">Harga</th>
                  <th className="py-4 px-6 text-center">Stok</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((p) => {
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-all">
                      {/* Nama & Gambar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={getImageUrl(p.image)}
                            alt={p.name}
                            onError={(e) => { 
                              e.target.onerror = null; 
                              e.target.src = "https://placehold.co/100x100?text=No+Image"; 
                            }}
                            className="w-12 h-12 object-cover rounded-xl bg-gray-100 border border-gray-200/50"
                          />
                          <div>
                            <p className="font-bold text-gray-800 text-sm leading-snug">{p.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{p.description || "Tidak ada deskripsi"}</p>
                          </div>
                        </div>
                      </td>
                      {/* Kategori */}
                      <td className="py-4 px-6">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                          {p.category?.name || "Tanpa Kategori"}
                        </span>
                      </td>
                      {/* Harga */}
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-800 text-sm">
                          Rp {Number(p.price).toLocaleString("id-ID")}
                        </p>
                      </td>
                      {/* Stok */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          p.stock > 10 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
                        }`}>
                          {p.stock ?? 0} pcs
                        </span>
                      </td>
                      {/* Aksi */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => { setSelectedProduct(p); setIsDetailOpen(true); }}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-all"
                            title="Detail"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 hover:bg-amber-50 text-amber-600 rounded-xl transition-all"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition-all"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODAL TAMBAH / EDIT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-black text-gray-800">
                {form.id ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-all text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Gambar */}
              <div className="flex flex-col items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200">
                {form.image_preview ? (
                  <div className="relative group w-32 h-32 rounded-2xl overflow-hidden border">
                    <img
                      src={form.image_preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/100x100?text=No+Image"; 
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, image: null, image_preview: null }))}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all text-xs font-semibold"
                    >
                      Ganti Gambar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-2xl bg-white border flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-500/50 hover:bg-emerald-50/20 transition-all shadow-sm"
                  >
                    <Upload size={24} />
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <span className="text-xs text-gray-400 font-medium">Format: JPG, PNG, atau WEBP. Max 2MB</span>
              </div>

              {/* Nama Produk */}
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Nama Produk *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full h-11 px-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  placeholder="Masukkan nama produk..."
                />
              </div>

              {/* Grid Baris (Kategori & Harga) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Kategori */}
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Kategori *</label>
                  <select
                    value={String(form.category_id ?? "")}
                    onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                    className="w-full h-11 px-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  >
                    {categoryFormOptions.length === 0 ? (
                      <option disabled value="">Tidak ada kategori</option>
                    ) : (
                      categoryFormOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Harga */}
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Harga (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="w-full h-11 px-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                    placeholder="Contoh: 15000"
                  />
                </div>
              </div>

              {/* Stok */}
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Stok Awal *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                  className="w-full h-11 px-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  placeholder="Contoh: 50"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm h-24 resize-none"
                  placeholder="Keterangan atau spesifikasi produk..."
                />
              </div>

              {/* Tombol Simpan */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 h-11 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all font-semibold text-sm text-gray-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
                >
                  {form.id ? "Simpan Perubahan" : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DETAIL --- */}
      {isDetailOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header Detail */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-800">Detail Produk</h2>
              <button
                onClick={() => { setSelectedProduct(null); setIsDetailOpen(false); }}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-all text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              <img
                src={getImageUrl(selectedProduct.image)}
                alt={selectedProduct.name}
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = "https://placehold.co/100x100?text=No+Image"; 
                }}
                className="w-full h-48 object-cover rounded-2xl border"
              />
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold text-gray-400">Nama Produk</p>
                  <p className="text-base font-bold text-gray-800">{selectedProduct.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400">Kategori</p>
                    <span className="inline-block px-2.5 py-0.5 mt-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                      {selectedProduct.category?.name || "Tanpa Kategori"}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400">Stok</p>
                    <p className="text-sm font-bold text-gray-800 mt-0.5">{selectedProduct.stock ?? 0} pcs</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400">Harga</p>
                  <p className="text-lg font-black text-emerald-600">
                    Rp {Number(selectedProduct.price).toLocaleString("id-ID")}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400">Deskripsi</p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                    {selectedProduct.description || "Tidak ada deskripsi untuk produk ini."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}