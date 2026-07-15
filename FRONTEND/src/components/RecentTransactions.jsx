import { useMemo } from "react";
import { FiCheckCircle } from "react-icons/fi";

const StatusBadge = ({ status }) => {
  const isDone = status?.toLowerCase() === "selesai";
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold border",
        isDone
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : "bg-gray-50 text-gray-600 border-gray-200",
      ].join(" ")}
    >
      {isDone ? <FiCheckCircle className="text-emerald-600" /> : null}
      {status}
    </span>
  );
};

const RecentTransactions = ({ rows = [] }) => {
  const data = useMemo(() => rows.slice(0, 6), [rows]);

  return (
    <div className="bg-white rounded-3xl border border-white/70 shadow-soft p-5 transition duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-extrabold text-mokkaDark">
            Transaksi Terbaru
          </h3>
          <p className="text-sm text-gray-500 mt-1">Ringkasan aktivitas terbaru</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase text-gray-500 font-extrabold">
              <th className="py-3 px-2">No Transaksi</th>
              <th className="py-3 px-2">Pelanggan</th>
              <th className="py-3 px-2">Total</th>
              <th className="py-3 px-2">Tanggal</th>
              <th className="py-3 px-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((r, idx) => (
              <tr
                key={r.id ?? idx}
                className="border-t border-gray-100 hover:bg-mokkaCream/60 transition duration-300"
              >
                <td className="py-3 px-2 text-sm font-extrabold text-gray-800">
                  {r.no}
                </td>
                <td className="py-3 px-2 text-sm font-semibold text-gray-700 truncate max-w-[180px]">
                  {r.customer}
                </td>
                <td className="py-3 px-2 text-sm font-extrabold text-mokkaCoffee">
                  {r.total}
                </td>
                <td className="py-3 px-2 text-sm font-semibold text-gray-600">
                  {r.date}
                </td>
                <td className="py-3 px-2">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
