import { useMemo, useState } from "react";

const initialCustomers = [
  { id: "CUST-001", name: "Alya Putri", email: "alya.p@example.com", joinDate: "2026-01-15", totalVisits: 12 },
  { id: "CUST-002", name: "Bima Pratama", email: "bima.p@example.com", joinDate: "2026-02-20", totalVisits: 8 },
  { id: "CUST-003", name: "Citra Lestari", email: "citra.l@example.com", joinDate: "2026-03-05", totalVisits: 15 },
  { id: "CUST-004", name: "Dimas Arya", email: "dimas.a@example.com", joinDate: "2026-04-11", totalVisits: 5 },
  { id: "CUST-005", name: "Eka Nurhasanah", email: "eka.n@example.com", joinDate: "2026-05-19", totalVisits: 21 },
];

const CustomersPage = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("tambah");
  const [form, setForm] = useState({ id: "", name: "", email: "", joinDate: "", totalVisits: 0 });

  const filteredCustomers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }, [customers, query]);

  const openAddModal = () => {
    setModalMode("tambah");
    const nextId = `CUST-${String(customers.length + 1).padStart(3, "0")}`;
    setForm({ id: nextId, name: "", email: "", joinDate: new Date().toISOString().split('T')[0], totalVisits: 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setModalMode("edit");
    setForm(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      alert("Nama dan Email wajib diisi.");
      return;
    }
    if (modalMode === "tambah") {
      setCustomers((prev) => [...prev, form]);
    } else {
      setCustomers((prev) => prev.map((c) => (c.id === form.id ? form : c)));
    }
    closeModal();
  };

  const handleDelete = (customer) => {
    if (window.confirm(`Anda yakin ingin menghapus pelanggan "${customer.name}"?`)) {
      setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
    }
  };

  return (
    <div className="min-w-0 flex flex-col gap-5">
      <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 mb-3">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              <span className="text-sm font-semibold">CRM</span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Manajemen Pelanggan</h1>
            <p className="text-sm text-gray-500 mt-2">Kelola data pelanggan setia Anda.</p>
          </div>
          <button onClick={openAddModal} className="h-11 px-5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition shadow-sm">
            + Tambah Pelanggan
          </button>
        </div>
        <div className="mt-5 md:col-span-6">
          <label className="text-xs font-bold text-gray-600">Cari Nama / Email</label>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Contoh: Bima / bima.p@example.com" className="mt-2 w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30" />
        </div>
      </div>

      <div className="overflow-x-auto bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-sm">
        <table className="min-w-[700px] w-full">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-gray-600 bg-white/60 border-b border-white/60">
              <th className="px-4 py-3">Nama Pelanggan</th>
              <th className="px-4 py-3">Tanggal Bergabung</th>
              <th className="px-4 py-3">Total Kunjungan</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => (
              <tr key={c.id} className="border-b border-white/50">
                <td className="px-4 py-4">
                  <p className="font-extrabold text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.email}</p>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">{c.joinDate}</td>
                <td className="px-4 py-4 text-sm font-bold text-gray-800">{c.totalVisits}</td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(c)} className="h-9 px-3 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition">Edit</button>
                    <button onClick={() => handleDelete(c)} className="h-9 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold border border-rose-200 transition">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-gray-500">Pelanggan tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6">
            <h2 className="text-lg font-extrabold text-gray-900">{modalMode === "tambah" ? "Tambah Pelanggan" : "Edit Pelanggan"}</h2>
            <div className="mt-5 space-y-4">
              <div><label className="text-xs font-bold text-gray-600">Nama</label><input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="mt-2 w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4" /></div>
              <div><label className="text-xs font-bold text-gray-600">Email</label><input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} className="mt-2 w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4" /></div>
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

export default CustomersPage;
