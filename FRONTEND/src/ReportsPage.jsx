import SalesChart from "./components/SalesChart";
import { useMemo } from "react";
import StatCard from "./components/StatCard";

const salesData = [
  { label: "Mon", value: 1200000 }, { label: "Tue", value: 1650000 }, { label: "Wed", value: 980000 },
  { label: "Thu", value: 2100000 }, { label: "Fri", value: 1870000 }, { label: "Sat", value: 2250000 }, { label: "Sun", value: 2540000 },
];

const topSelling = [
  { name: "Caffe Latte", quantity: 62, sales: "Rp 3.110.000" },
  { name: "Americano", quantity: 54, sales: "Rp 2.420.000" },
  { name: "Cappuccino", quantity: 48, sales: "Rp 2.015.000" },
];

const ReportsPage = () => {
  const stats = useMemo(() => [
      { title: "Total Penjualan", value: "Rp 12.450.000", growthPercent: "+12,5%", growthLabel: "vs minggu lalu" },
      { title: "Total Transaksi", value: "248", growthPercent: "+8,1%", growthLabel: "vs minggu lalu" },
      { title: "Produk Terjual", value: "532", growthPercent: "+4,7%", growthLabel: "vs minggu lalu" },
      { title: "Pelanggan Baru", value: "18", growthPercent: "+2,9%", growthLabel: "vs minggu lalu" },
    ], []);

  return (
    <div className="min-w-0 flex flex-col gap-5">
      <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Laporan Penjualan</h1>
            <p className="text-sm text-gray-500 mt-2">Analisis performa bisnis Anda secara mendalam.</p>
          </div>
          <div className="flex items-center gap-3">
            <input type="date" defaultValue="2026-07-01" className="h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30" />
            <span className="font-semibold text-gray-600">to</span>
            <input type="date" defaultValue="2026-07-11" className="h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30" />
            <button className="h-11 px-5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition">Filter</button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} growthPercent={s.growthPercent} growthLabel={s.growthLabel} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8">
          <SalesChart data={salesData} title="Grafik Tren Penjualan" />
        </div>
        <div className="xl:col-span-4">
          <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-5 h-full">
            <h3 className="text-lg font-extrabold text-mokkaDark">Produk Terlaris</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">Berdasarkan pendapatan.</p>
            <div className="space-y-3">
              {topSelling.map((it, idx) => (
                <div key={it.name} className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3">
                  <div className="w-6 text-center text-xs font-extrabold text-mokkaCoffee">#{idx + 1}</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-gray-900 truncate">{it.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Terjual: <span className="font-bold text-gray-700">{it.quantity}</span></p>
                  </div>
                  <p className="font-extrabold text-mokkaCoffee">{it.sales}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6 sm:p-7">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-extrabold text-mokkaDark">Unduh Laporan</h3>
          <div className="flex gap-3">
            <button className="h-11 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold transition">Export ke Excel</button>
            <button className="h-11 px-5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold transition">Export ke PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
