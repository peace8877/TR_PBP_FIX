import { useMemo } from "react";
import { FiTrendingUp } from "react-icons/fi";

const TopSelling = ({ items = [] }) => {
  const topItems = useMemo(() => items.slice(0, 5), [items]);

  return (
    <div className="bg-white rounded-3xl border border-white/70 shadow-soft p-5 transition duration-300 hover:shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-11 w-11 rounded-2xl bg-mokkaCoffee/10 border border-mokkaCoffee/20 flex items-center justify-center">
          <FiTrendingUp className="text-mokkaCoffee text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-mokkaDark">Penjualan Teratas</h3>
          <p className="text-sm text-gray-500 mt-1">5 menu terlaris hari ini</p>
        </div>
      </div>

      <div className="space-y-3">
        {topItems.map((it, idx) => (
          <div
            key={it.name}
            className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3 transition duration-300 hover:bg-mokkaCream/60"
          >
            <div className="w-6 text-center text-xs font-extrabold text-mokkaCoffee">
              #{idx + 1}
            </div>

            <div className="h-12 w-12 rounded-2xl bg-mokkaCream/70 border border-mokkaCoffee/10 flex items-center justify-center overflow-hidden">
              <img
                src={it.thumbnail}
                alt={it.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-gray-900 truncate">{it.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                Terjual: <span className="font-bold text-gray-700">{it.quantity}</span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500">Total</p>
              <p className="font-extrabold text-mokkaCoffee">
                {it.sales}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSelling;
