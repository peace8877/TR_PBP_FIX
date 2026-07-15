import { useMemo } from "react";
import StatCard from "./components/StatCard";
import SalesChart from "./components/SalesChart";
import TopSelling from "./components/TopSelling";
import CategoryChart from "./components/CategoryChart";
import RecentTransactions from "./components/RecentTransactions";

const DashboardHomePage = () => {
  const stats = useMemo(
    () => [
      {
        title: "Total Penjualan",
        value: "Rp 12.450.000",
        growthPercent: "+12,5%",
        growthLabel: "vs minggu lalu",
        icon: undefined,
      },
      {
        title: "Total Transaksi",
        value: "248",
        growthPercent: "+8,1%",
        growthLabel: "vs minggu lalu",
        icon: undefined,
      },
      {
        title: "Total Produk Terjual",
        value: "532",
        growthPercent: "+4,7%",
        growthLabel: "vs minggu lalu",
        icon: undefined,
      },
      {
        title: "Rata-rata Transaksi",
        value: "Rp 50.201",
        growthPercent: "+9,3%",
        growthLabel: "vs minggu lalu",
        icon: undefined,
      },
    ],
    []
  );

  const salesData = useMemo(
    () => [
      { label: "Mon", value: 1200000 },
      { label: "Tue", value: 1650000 },
      { label: "Wed", value: 980000 },
      { label: "Thu", value: 2100000 },
      { label: "Fri", value: 1870000 },
      { label: "Sat", value: 2250000 },
      { label: "Sun", value: 2540000 },
    ],
    []
  );

  const topSelling = useMemo(
    () => [
      {
        name: "Caffe Latte",
        thumbnail: "/icons.svg",
        quantity: 62,
        sales: "Rp 3.110.000",
      },
      {
        name: "Americano",
        thumbnail: "/icons.svg",
        quantity: 54,
        sales: "Rp 2.420.000",
      },
      {
        name: "Cappuccino",
        thumbnail: "/icons.svg",
        quantity: 48,
        sales: "Rp 2.015.000",
      },
      {
        name: "Es Kopi Susu",
        thumbnail: "/icons.svg",
        quantity: 41,
        sales: "Rp 1.730.000",
      },
      {
        name: "Vanilla Latte",
        thumbnail: "/icons.svg",
        quantity: 36,
        sales: "Rp 1.520.000",
      },
    ],
    []
  );

  const categoryData = useMemo(
    () => [
      { name: "Kopi", value: 52 },
      { name: "Non Kopi", value: 28 },
      { name: "Makanan", value: 14 },
      { name: "Lainnya", value: 6 },
    ],
    []
  );

  const recentTransactions = useMemo(
    () => [
      { id: 1, no: "TRX-0192", customer: "Alya Putri", total: "Rp 120.000", date: "2026-07-11", status: "Selesai" },
      { id: 2, no: "TRX-0191", customer: "Bima Pratama", total: "Rp 76.000", date: "2026-07-11", status: "Selesai" },
      { id: 3, no: "TRX-0189", customer: "Citra Lestari", total: "Rp 148.000", date: "2026-07-10", status: "Selesai" },
      { id: 4, no: "TRX-0188", customer: "Dimas Arya", total: "Rp 92.000", date: "2026-07-10", status: "Selesai" },
      { id: 5, no: "TRX-0187", customer: "Eka Nurhasanah", total: "Rp 134.000", date: "2026-07-09", status: "Selesai" },
      { id: 6, no: "TRX-0184", customer: "Fajar Suryawan", total: "Rp 64.000", date: "2026-07-09", status: "Selesai" },
    ],
    []
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
      <div className="xl:col-span-8 flex flex-col gap-5">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((s) => (
            <StatCard
              key={s.title}
              icon={undefined}
              title={s.title}
              value={s.value}
              growthPercent={s.growthPercent}
              growthLabel={s.growthLabel}
            />
          ))}
        </div>

        {/* Sales Chart */}
        <SalesChart data={salesData} title="Grafik Penjualan" />

        {/* Sales + Category + Table area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-12">
            {/* Recent Transactions (table) */}
            <RecentTransactions rows={recentTransactions} />
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="xl:col-span-4 flex flex-col gap-5">
        <TopSelling items={topSelling} />
        <CategoryChart categories={categoryData} />
      </div>
    </div>
  );
};

export default DashboardHomePage;