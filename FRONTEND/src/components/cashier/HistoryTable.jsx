import { useMemo, useState } from "react";


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
  const [localPageSize] = useState(8);

  const pageRows = useMemo(() => {
    const start = (pagination.page - 1) * localPageSize;
    return rows.slice(start, start + localPageSize);
  }, [rows, pagination.page, localPageSize]);

  const totalPages = Math.max(1, Math.ceil(rows.length / localPageSize));

  return (
    <div className="min-w-0 flex flex-col gap-5">
      <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 mb-3">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              <span className="text-sm font-semibold">Riwayat</span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Riwayat Transaksi
            </h1>
            <p className="text-sm text-gray-500 mt-2">Lihat detail transaksi kasir</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className="h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30"
            />
            <span className="font-semibold text-gray-600">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className="h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30"
            />
          </div>
        </div>

        <div className="mt-5 md:col-span-6">
          <label className="text-xs font-bold text-gray-600">
            Cari Invoice / Pelanggan
          </label>
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Contoh: INV-1001 / Alya Putri"
            className="mt-2 w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-sm">
        <table className="min-w-[850px] w-full">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-gray-600 bg-white/60 border-b border-white/60">
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Pelanggan</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Jam</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((t, idx) => (
              <tr key={t.id} className="border-b border-white/50">
                <td className="px-4 py-4 font-bold text-gray-800">{(pagination.page - 1) * localPageSize + idx + 1}</td>
                <td className="px-4 py-4 font-bold text-gray-800">{t.invoice}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{t.customer}</td>
                <td className="px-4 py-4 text-sm font-bold text-mokkaCoffee">Rp {t.totals.grandTotal.toLocaleString("id-ID")}</td>
                <td className="px-4 py-4">
                  <span
                    className={[
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border",
                      t.status === "Selesai"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200",
                    ].join(" ")}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">{t.date}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{t.time}</td>
                <td className="px-4 py-4">
                  <button
                    className="h-9 px-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold border border-gray-200 transition"
                    onClick={() => onOpenDetail(t)}
                    type="button"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                  Transaksi tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Menampilkan halaman <span className="font-extrabold text-gray-700">{pagination.page}</span> dari <span className="font-extrabold text-gray-700">{totalPages}</span>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
            className="h-10 px-4 rounded-2xl bg-white/70 border border-white/60 hover:bg-white disabled:opacity-50"
            disabled={pagination.page <= 1}
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, pagination.page + 1))}
            className="h-10 px-4 rounded-2xl bg-white/70 border border-white/60 hover:bg-white disabled:opacity-50"
            disabled={pagination.page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistoryTable;

