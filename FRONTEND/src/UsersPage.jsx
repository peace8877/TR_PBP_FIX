import { useMemo, useState } from "react";

const initialUsers = [
  { id: "USR-01", name: "Admin Moka", email: "admin@moka.com", role: "Pemilik", status: "Aktif" },
  { id: "USR-02", name: "Kasir Pagi", email: "kasir.pagi@moka.com", role: "Kasir", status: "Aktif" },
  { id: "USR-03", name: "Kasir Malam", email: "kasir.malam@moka.com", role: "Kasir", status: "Nonaktif" },
];

const UsersPage = () => {
  const [users] = useState(initialUsers);
  const [query, setQuery] = useState("");


  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, query]);

  const StatusBadge = ({ status }) => {
    const isGood = status === "Aktif";
    return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${isGood ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>{status}</span>;
  };

  return (
    <div className="min-w-0 flex flex-col gap-5">
      <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 mb-3">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              <span className="text-sm font-semibold">Akses & Keamanan</span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Manajemen Pengguna</h1>
            <p className="text-sm text-gray-500 mt-2">Kelola akun dan peran pengguna sistem kasir Anda.</p>
          </div>
          <button className="h-11 px-5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition shadow-sm">
            + Undang Pengguna
          </button>
        </div>
        <div className="mt-5 md:col-span-6">
          <label className="text-xs font-bold text-gray-600">Cari Nama / Email</label>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Contoh: Kasir Pagi" className="mt-2 w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30" />
        </div>
      </div>

      <div className="overflow-x-auto bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-sm">
        <table className="min-w-[700px] w-full">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-gray-600 bg-white/60 border-b border-white/60">
              <th className="px-4 py-3">Nama Pengguna</th>
              <th className="px-4 py-3">Peran</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-b border-white/50">
                <td className="px-4 py-4">
                  <p className="font-extrabold text-gray-800">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </td>
                <td className="px-4 py-4 text-sm font-bold text-gray-800">{u.role}</td>
                <td className="px-4 py-4"><StatusBadge status={u.status} /></td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button className="h-9 px-3 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition">Edit</button>
                    <button className="h-9 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold border border-rose-200 transition">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-gray-500">Pengguna tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
