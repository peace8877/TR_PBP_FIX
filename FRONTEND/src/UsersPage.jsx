import { useMemo, useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";

// --- API Base URL ---
const API_BASE_URL = "http://127.0.0.1:8000/api";

const UsersPage = () => {
  // --- States ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // State untuk loading submit

  // States untuk Form Modal (Tambah / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // Hanya diperlukan saat user baru
    role: "Kasir", // Default role sesuai use case karyawan
    status: "Aktif",
  });

  // --- Helper: Ambil Header Autentikasi ---
  const getAuthHeaders = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      return {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      };
    } catch (err) {
      console.error("Gagal mengambil token", err);
      return null;
    }
  };

  // --- Ambil Data Users dari API ---
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const headers = getAuthHeaders();

    if (!headers) {
      setError("Sesi Anda telah berakhir. Mengalihkan ke halaman login...");
      setLoading(false);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: headers,
      });

      if (response.status === 401) {
        throw new Error("Sesi login kedaluwarsa. Silakan login kembali.");
      }

      if (response.status === 403) {
        throw new Error("Akses ditolak. Hanya Manajer yang dapat mengelola pengguna.");
      }

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson.message || "Gagal mengambil data pengguna.");
      }

      setUsers(resJson.data ?? resJson);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Submit Form (Tambah / Edit) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = getAuthHeaders();
    if (!headers) return;

    setIsSubmitting(true); // Mulai loading submit

    const url = isEditing 
      ? `${API_BASE_URL}/users/${currentUserId}` 
      : `${API_BASE_URL}/users`;
    
    const method = isEditing ? "PUT" : "POST";

    const payload = { ...formData };
    if (isEditing || !payload.password) {
      delete payload.password;
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(payload),
      });

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson.message || "Gagal memproses data.");
      }

      // Tampilkan feedback sukses
      alert(isEditing ? "Data pengguna berhasil diperbarui!" : "Pengguna baru berhasil ditambahkan!");
      
      // Refresh data & tutup modal
      fetchUsers();
      closeModal();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false); // Selesai loading submit
    }
  };

  // --- Hapus Pengguna ---
  const handleDelete = async (id, name) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${name}"?`)) return;

    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: headers,
      });

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson.message || "Gagal menghapus pengguna.");
      }

      alert(`Pengguna "${name}" berhasil dihapus.`);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- Filter Pencarian ---
  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
    );
  }, [users, query]);

  // --- Modal Helpers ---
  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ name: "", email: "", password: "", role: "Kasir", status: "Aktif" });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setIsEditing(true);
    setCurrentUserId(user.id);
    setFormData({
      name: user.name || "",
      // Tambahkan || "" agar jika email null, form tetap terisi string kosong (bukan undefined)
      email: user.email || "", 
      password: "",
      role: user.role || "Kasir",
      status: user.status || "Aktif",
    });
    setIsModalOpen(true);
};

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUserId(null);
  };

  const StatusBadge = ({ status }) => {
    const isGood = status === "Aktif" || status === "active" || status === 1;
    const label = isGood ? "Aktif" : "Nonaktif";
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${isGood ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center gap-4 bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
        <p className="text-gray-800 font-bold text-base animate-pulse">Sinkronisasi Data Karyawan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center gap-4 bg-white/70 backdrop-blur rounded-3xl border border-red-100 shadow-soft p-6 text-center">
        <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100">
          <AlertCircle size={32} className="text-rose-500" />
        </div>
        <div className="max-w-md">
          <p className="text-gray-900 font-extrabold text-lg">Gagal Memuat Manajemen Pengguna</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
        </div>
        <button onClick={fetchUsers} className="px-6 h-10 mt-2 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl text-xs font-bold transition">
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="min-w-0 flex flex-col gap-5 relative">
      {/* Header Panel */}
      <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 mb-3">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              <span className="text-sm font-semibold">Akses & Keamanan</span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Manajemen Pengguna</h1>
            <p className="text-sm text-gray-500 mt-2">Kelola akun, peran (Admin/Kasir), dan status login staf Shiro Cafe.</p>
          </div>
          <button 
            onClick={openAddModal}
            className="h-11 px-5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition shadow-sm"
          >
            + Tambah Pengguna
          </button>
        </div>
        <div className="mt-5">
          <label className="text-xs font-bold text-gray-600">Cari Nama / Email / Peran</label>
          <input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Contoh: Kasir Pagi atau Manajer" 
            className="mt-2 w-full h-11 rounded-2xl bg-white/80 border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-teal-500/20" 
          />
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-sm">
        <table className="min-w-[700px] w-full">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-gray-600 bg-white/60 border-b border-white/60">
              <th className="px-5 py-4">Nama Pengguna</th>
              <th className="px-5 py-4">Peran</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-b border-white/50 hover:bg-white/20 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-extrabold text-gray-800">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </td>
                <td className="px-5 py-4 text-sm font-bold text-gray-800">
                  <span className={`px-2.5 py-1 rounded-lg text-xs ${u.role === 'Admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={u.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex gap-2 justify-end">
                    <button 
                      onClick={() => openEditModal(u)}
                      className="h-9 px-4 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-extrabold border border-gray-200 shadow-sm transition active:scale-95 text-xs"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(u.id, u.name)}
                      className="h-9 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold border border-rose-100 transition active:scale-95 text-xs"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-gray-400 font-bold">
                  Pengguna tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- FORM MODAL (TAMBAH / EDIT USER) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl max-w-md w-full p-6 sm:p-7">
            <h2 className="text-xl font-black text-gray-900 mb-1">
              {isEditing ? "Edit Profil Pengguna" : "Undang Pengguna Baru"}
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              {isEditing ? "Perbarui role atau status akses karyawan." : "Buat akun akses kredensial baru untuk karyawan."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  disabled={isSubmitting}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Damai Dian"
                  className="mt-1.5 w-full h-11 rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600">Email Kerja</label>
                <input 
                  type="email" 
                  required
                  disabled={isSubmitting}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@shirocafe.com"
                  className="mt-1.5 w-full h-11 rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 disabled:bg-gray-50"
                />
              </div>

              {!isEditing && (
                <div>
                  <label className="text-xs font-bold text-gray-600">Password Sementara</label>
                  <input 
                    type="password" 
                    required={!isEditing}
                    disabled={isSubmitting}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min. 8 karakter"
                    className="mt-1.5 w-full h-11 rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 disabled:bg-gray-50"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600">Hak Akses (Role)</label>
                  <select 
                    disabled={isSubmitting}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="mt-1.5 w-full h-11 rounded-2xl border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 disabled:bg-gray-50"
                  >
                    {/* Ubah value menjadi 'Kasir' dan 'Admin' agar sesuai dengan label */}
                    <option value="Kasir">Kasir</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600">Status Akun</label>
                  <select 
                    disabled={isSubmitting}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mt-1.5 w-full h-11 rounded-2xl border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 disabled:bg-gray-50"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="flex-1 h-11 rounded-2xl border border-gray-200 text-gray-700 font-extrabold text-xs transition hover:bg-gray-50 active:scale-95 disabled:opacity-50"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 h-11 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold text-xs transition active:scale-95 disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Proses...
                    </>
                  ) : (
                    isEditing ? "Simpan Perubahan" : "Tambah User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;