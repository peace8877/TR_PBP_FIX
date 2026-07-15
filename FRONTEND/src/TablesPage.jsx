import { useMemo, useState } from "react";

const initialTables = [
  { id: "T-01", name: "Meja 1", status: "Tersedia" },
  { id: "T-02", name: "Meja 2", status: "Digunakan" },
  { id: "T-03", name: "Meja 3", status: "Tersedia" },
  { id: "T-04", name: "Meja 4", status: "Tersedia" },
  { id: "T-05", name: "Meja 5", status: "Reservasi" },
];

const TablesPage = () => {
  const [tables, setTables] = useState(initialTables);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("tambah"); // tambah | edit
  const [form, setForm] = useState({ id: "", name: "", status: "Tersedia" });

  const filteredTables = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tables;
    return tables.filter((t) => t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
  }, [tables, query]);

  const openAddModal = () => {
    setModalMode("tambah");
    const nextId = `T-${String(tables.length + 1).padStart(2, "0")}`;
    setForm({ id: nextId, name: `Meja ${tables.length + 1}`, status: "Tersedia" });
    setIsModalOpen(true);
  };

  const openEditModal = (table) => {
    setModalMode("edit");
    setForm(table);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!form.name.trim()) {
      alert("Nama meja wajib diisi.");
      return;
    }
    if (modalMode === "tambah") {
      setTables((prev) => [...prev, form]);
    } else {
      setTables((prev) => prev.map((t) => (t.id === form.id ? form : t)));
    }
    closeModal();
  };

  const handleDelete = (table) => {
    if (window.confirm(`Anda yakin ingin menghapus meja "${table.name}"?`)) {
      setTables((prev) => prev.filter((t) => t.id !== table.id));
    }
  };

  const StatusBadge = ({ status }) => {
    const variants = {
      Tersedia: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Digunakan: "bg-amber-50 text-amber-700 border-amber-200",
      Reservasi: "bg-sky-50 text-sky-700 border-sky-200",
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-bold border ${variants[status] || 'bg-gray-50'}`}>{status}</span>;
  };

  return (
    <div className="min-w-0 flex flex-col gap-5">
      <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 mb-3">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              <span className="text-sm font-semibold">Operasional</span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Manajemen Meja</h1>
            <p className="text-sm text-gray-500 mt-2">Kelola daftar dan status meja di kafe Anda.</p>
          </div>
          <button onClick={openAddModal} className="h-11 px-5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition shadow-sm">
            + Tambah Meja
          </button>
        </div>
        <div className="mt-5 md:col-span-6">
          <label className="text-xs font-bold text-gray-600">Cari Nama / ID</label>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Contoh: Meja 1 / T-01" className="mt-2 w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30" />
        </div>
      </div>

      <div className="overflow-x-auto bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-sm">
        <table className="min-w-[600px] w-full">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-gray-600 bg-white/60 border-b border-white/60">
              <th className="px-4 py-3">ID Meja</th>
              <th className="px-4 py-3">Nama Meja</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTables.map((t) => (
              <tr key={t.id} className="border-b border-white/50">
                <td className="px-4 py-4 text-sm text-gray-500">{t.id}</td>
                <td className="px-4 py-4 text-sm font-bold text-gray-800">{t.name}</td>
                <td className="px-4 py-4"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(t)} className="h-9 px-3 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition">Edit</button>
                    <button onClick={() => handleDelete(t)} className="h-9 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold border border-rose-200 transition">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredTables.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-gray-500">Meja tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">{modalMode === "tambah" ? "Tambah Meja" : "Edit Meja"}</h2>
                <p className="text-sm text-gray-500 mt-1">Form ini untuk demo (front-end).</p>
              </div>
              <button onClick={closeModal} className="h-10 w-10 rounded-2xl border border-white/70 bg-white/60 hover:bg-white">✕</button>
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600">ID Meja</label>
                <input value={form.id} className="mt-2 w-full h-11 rounded-2xl bg-gray-100/80 border border-gray-200/70 px-4" disabled />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Nama Meja</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Contoh: Meja 6" className="mt-2 w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Status</label>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="mt-2 w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none">
                  <option>Tersedia</option>
                  <option>Digunakan</option>
                  <option>Reservasi</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeModal} className="h-11 px-5 rounded-2xl bg-white hover:bg-gray-50 text-gray-900 font-extrabold border border-gray-200 transition">Batal</button>
              <button onClick={handleSave} className="h-11 px-5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablesPage;