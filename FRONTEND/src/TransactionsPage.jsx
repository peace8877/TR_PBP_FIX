import { useMemo, useState } from "react";

const initialTransactions = [
  { id: "TRX-0192", customer: "Alya Putri", total: 120000, date: "2026-07-11", status: "Selesai" },
  { id: "TRX-0191", customer: "Bima Pratama", total: 76000, date: "2026-07-11", status: "Selesai" },
  { id: "TRX-0190", customer: "Guest", total: 45000, date: "2026-07-11", status: "Dibatalkan" },
  { id: "TRX-0189", customer: "Citra Lestari", total: 148000, date: "2026-07-10", status: "Selesai" },
  { id: "TRX-0188", customer: "Dimas Arya", total: 92000, date: "2026-07-10", status: "Selesai" },
  { id: "TRX-0187", customer: "Eka Nurhasanah", total: 134000, date: "2026-07-09", status: "Selesai" },
];

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

const TransactionsPage = () => {
  const [transactions] = useState(initialTransactions);
  const [query, setQuery] = useState("");


  const filteredTransactions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter(t => t.id.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q));
  }, [transactions, query]);

  const StatusBadge = ({ status }) => {
    const variants = {
      Selesai: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Dibatalkan: "bg-rose-50 text-rose-700 border-rose-200",
      Pending: "bg-amber-50 text-amber-700 border-amber-200",
    };
    return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${variants[status] || 'bg-gray-50'}`}>{status}</span>;
  };

  return (
    <div className="min-w-0 flex flex-col gap-5">
      <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 mb-3">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              <span className="text-sm font-semibold">Penjualan</span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Riwayat Transaksi</h1>
            <p className="text-sm text-gray-500 mt-2">Lihat semua catatan transaksi yang pernah terjadi.</p>
          </div>
          <div className="flex items-center gap-3">
             <input type="date" defaultValue="2026-07-01" className="h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30" />
            <span className="font-semibold text-gray-600">to</span>
            <input type="date" defaultValue="2026-07-11" className="h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30" />
          </div>
        </div>
        <div className="mt-5 md:col-span-6">
          <label className="text-xs font-bold text-gray-600">Cari No. Transaksi / Nama Pelanggan</label>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Contoh: TRX-0192 / Alya Putri" className="mt-2 w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30" />
        </div>
      </div>

      <div className="overflow-x-auto bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-sm">
        <table className="min-w-[800px] w-full">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-gray-600 bg-white/60 border-b border-white/60">
              <th className="px-4 py-3">No. Transaksi</th>
              <th className="px-4 py-3">Pelanggan</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="border-b border-white/50">
                <td className="px-4 py-4 font-bold text-gray-800">{t.id}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{t.customer}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{t.date}</td>
                <td className="px-4 py-4 text-sm font-bold text-mokkaCoffee">{formatRupiah(t.total)}</td>
                <td className="px-4 py-4"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button className="h-9 px-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold border border-gray-200 transition">Detail</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                  Transaksi tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;
