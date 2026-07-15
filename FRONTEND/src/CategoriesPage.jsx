import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  FolderHeart,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

// Taruh URL API secara global agar sinkron dengan backend Laravel Anda
const API_BASE_URL = "http://127.0.0.1:8000/api"; 

export default function CategoriesPage() {
  // --- States ---
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("tambah"); // tambah | edit

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    id: "",
    name: "",
  });

  // --- Helper: Mengambil Authorization Header (Bearer Token) ---
  const getAuthHeaders = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return { "Accept": "application/json", "Content-Type": "application/json" };
      return { 
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      };
    } catch {
      return { "Accept": "application/json", "Content-Type": "application/json" };
    }
  };

  // --- Fetch Data ---
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: getAuthHeaders(),
      });
      const resData = await response.json();
      
      // Mengatasi response yang dibungkus data: [] maupun array langsung
      const actualData = resData?.data ?? resData;
      setCategories(Array.isArray(actualData) ? actualData : []);
    } catch (error) {
      showToast("Gagal memuat kategori dari server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Toast Helper ---
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Filter Logic ---
  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;

    return categories.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) || 
        String(c.id).toLowerCase().includes(q)
      );
    });
  }, [categories, query]);

  // --- Handlers ---
  const openAddModal = () => {
    setModalMode("tambah");
    setForm({
      id: "Otomatis", // Backend Laravel akan otomatis meng-increment ID baru di DB
      name: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setModalMode("edit");
    setForm({
      id: category.id,
      name: category.name,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const validateForm = () => {
    if (!form.name.trim()) return "Nama kategori wajib diisi.";
    return null;
  };

  const handleSave = async () => {
    const err = validateForm();
    if (err) {
      showToast(err, "error");
      return;
    }

    const payload = {
      name: form.name.trim(),
    };

    try {
      let response;
      if (modalMode === "tambah") {
        response = await fetch(`${API_BASE_URL}/categories`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/categories/${form.id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) throw new Error("Gagal menyimpan data");

      showToast(
        modalMode === "tambah" 
          ? "Kategori baru berhasil ditambahkan!" 
          : "Kategori berhasil diperbarui!"
      );
      closeModal();
      fetchCategories(); // Refresh data dari server
    } catch (error) {
      showToast("Terjadi kesalahan saat menyimpan kategori", "error");
    }
  };

  const handleDelete = async (category) => {
    const ok = window.confirm(`Hapus kategori "${category.name}"?`);
    if (!ok) return;

    try {
      const response = await fetch(`${API_BASE_URL}/categories/${category.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("Gagal menghapus kategori");

      showToast("Kategori berhasil dihapus!");
      fetchCategories(); // Refresh data dari server
    } catch (error) {
      showToast("Gagal menghapus kategori. Pastikan tidak ada produk yang terkait.", "error");
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
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Kategori Produk</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola kategori utama untuk menu produk Anda</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-2xl shadow-md transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Filter & Bar Pencarian */}
      <div className="bg-white/80 backdrop-blur-md border border-white p-5 rounded-3xl shadow-sm mb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <label className="text-xs font-bold text-gray-500 block mb-2">Cari Kategori</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Contoh: Kopi / Makanan..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Tabel Data / Loading State */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border shadow-sm">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm font-medium animate-pulse">Menghubungkan ke server...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border shadow-sm p-6 text-center">
          <FolderHeart size={48} className="text-gray-300" />
          <p className="text-gray-600 font-bold text-lg">Kategori tidak ditemukan</p>
          <p className="text-gray-400 text-sm">Coba masukkan kata kunci pencarian yang lain.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6 w-1/4">ID Kategori</th>
                  <th className="py-4 px-6 w-2/4">Nama Kategori</th>
                  <th className="py-4 px-6 text-right w-1/4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCategories.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-all">
                    {/* ID Kategori */}
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg text-xs">
                        {c.id}
                      </span>
                    </td>
                    {/* Nama Kategori */}
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-800 text-sm">{c.name}</p>
                    </td>
                    {/* Aksi */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-2 hover:bg-amber-50 text-amber-600 rounded-xl transition-all"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(c)}
                          className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition-all"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODAL TAMBAH / EDIT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-black text-gray-800">
                {modalMode === "tambah" ? "Tambah Kategori" : "Edit Kategori"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-all text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">ID Kategori</label>
                <input
                  type="text"
                  value={form.id}
                  disabled
                  className="w-full h-11 px-4 rounded-2xl bg-gray-100 border border-gray-200 outline-none text-sm text-gray-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Nama Kategori *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full h-11 px-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  placeholder="Contoh: Makanan Ringan"
                />
              </div>

              {/* Tombol Simpan */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 h-11 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all font-semibold text-sm text-gray-600"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}