import { useMemo } from "react";

function HistoryTable({
  rows,
  onOpenDetail,
  query,
  onQueryChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  pagination,
  onPageChange,
}) {
  const localPageSize = 8;

  const pageRows = useMemo(() => {
    const start = (pagination.page - 1) * localPageSize;
    return rows.slice(start, start + localPageSize);
  }, [rows, pagination.page]);

  const totalPages = Math.max(1, Math.ceil(rows.length / localPageSize));

  return (
    <div className="min-w-0 flex flex-col gap-5">
      {/* Bagian Filter */}
      <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Riwayat Transaksi</h1>
          </div>
          <div className="flex items-center gap-3">
            <input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} className="h-11 rounded-2xl bg-white/80 border border-white/70 px-4" />
            <input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} className="h-11 rounded-2xl bg-white/80 border border-white/70 px-4" />
          </div>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-sm">
        <table className="min-w-[850px] w-full">
          <thead>
            <tr className="text-left text-xs uppercase text-gray-600 bg-white/60 border-b border-white/60">
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Staf</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((t, idx) => (
              <tr key={t.id} className="border-b border-white/50">
                <td className="px-4 py-4 font-bold text-gray-800">{(pagination.page - 1) * localPageSize + idx + 1}</td>
                <td className="px-4 py-4 font-bold text-gray-800">{t.invoice}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{t.staf}</td>
                <td className="px-4 py-4 text-sm font-bold text-mokkaCoffee">
                  Rp {Number(t.totals.grandTotal).toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">{t.date}</td>
                <td className="px-4 py-4">
                  <button onClick={() => onOpenDetail(t)} className="h-9 px-3 rounded-2xl bg-gray-100 hover:bg-gray-200 font-extrabold text-gray-800">
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoryTable;