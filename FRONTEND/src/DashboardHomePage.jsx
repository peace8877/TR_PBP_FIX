import React, { useState, useEffect, useMemo } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import StatCard from "./components/StatCard";
import SalesChart from "./components/SalesChart";
import TopSelling from "./components/TopSelling";
import RecentTransactions from "./components/RecentTransactions";

// --- API Base URL ---
const API_BASE_URL = "http://127.0.0.1:8000/api";

// --- KOMPONEN CATEGORYCHART DINAMIS (DITULIS LANGSUNG DI SINI AGAR TIDAK SALAH PATH) ---
const CategoryChart = ({ categories = [] }) => {
  // Hitung total kuantitas dari semua kategori untuk mencari persentase dinamis
  const totalValue = useMemo(() => {
    return categories.reduce((acc, curr) => acc + Number(curr.value ?? 0), 0);
  }, [categories]);

  // Daftar warna estetik untuk diagram/dot kategori
  const colors = ["bg-amber-800", "bg-amber-600", "bg-amber-950", "bg-yellow-500", "bg-stone-500"];

  return (
    <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gray-100 rounded-xl">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-900">Ringkasan Kategori</h3>
          <p className="text-xs text-gray-500">Komposisi penjualan berdasarkan kategori</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 mt-2">
        {/* Sisi Kiri: Visual Donut Chart Sederhana */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Background Lingkaran Abu-abu */}
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="3" />
            
            {/* Segment Lingkaran Dinamis berdasarkan persentase kategori database */}
            {categories.map((cat, idx) => {
              const percentage = totalValue > 0 ? (Number(cat.value) / totalValue) * 100 : 0;
              let accumulatedPercent = 0;
              for (let i = 0; i < idx; i++) {
                accumulatedPercent += totalValue > 0 ? (Number(categories[i].value) / totalValue) * 100 : 0;
              }
              const strokeDashArray = `${percentage} ${100 - percentage}`;
              const strokeDashOffset = 100 - accumulatedPercent + 25; // +25 untuk offset start 12 o'clock

              const strokeColors = ["#78350f", "#d97706", "#451a03", "#eab308", "#78716c"];
              const strokeColor = strokeColors[idx % strokeColors.length];

              return (
                <circle
                  key={cat.name || idx}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="3.2"
                  strokeDasharray={strokeDashArray}
                  strokeDashoffset={strokeDashOffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</p>
            <p className="text-base font-black text-gray-900">{totalValue} pcs</p>
          </div>
        </div>

        {/* Sisi Kanan: Daftar Label Dinamis Terhubung ke Database */}
        <div className="flex-1 w-full space-y-2">
          {categories.length === 0 ? (
            <p className="text-xs text-gray-400 text-center font-bold py-4">Belum ada data transaksi</p>
          ) : (
            categories.map((cat, idx) => {
              const percentage = totalValue > 0 ? Math.round((Number(cat.value) / totalValue) * 100) : 0;
              const colorClass = colors[idx % colors.length];

              return (
                <div key={cat.name || idx} className="flex items-center justify-between border border-gray-100 p-2.5 rounded-2xl bg-white/40">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${colorClass}`} />
                    <span className="text-xs font-bold text-gray-800">{cat.name}</span>
                  </div>
                  <span className="text-xs font-extrabold text-gray-900">{percentage}%</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN UTAMA DASHBOARD ---
const DashboardHomePage = () => {
  // --- States ---
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Helper: Ambil Header Autentikasi ---
  const getAuthHeaders = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      return {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      };
    } catch (err) {
      console.error("Gagal mengambil token dari localStorage", err);
      return null;
    }
  };

  // --- Ambil Data Laporan dari Laravel ---
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    const headers = getAuthHeaders();

    if (!headers) {
      setError("Sesi Anda telah berakhir atau Anda belum login. Mengalihkan...");
      setLoading(false);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    const d = new Date();
    const startDate = new Date(d.getFullYear(), d.getMonth(), 2).toISOString().split("T")[0];
    const endDate = new Date().toISOString().split("T")[0];

    try {
      const response = await fetch(
        `${API_BASE_URL}/reports?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: headers,
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        throw new Error("Sesi login Anda telah kedaluwarsa. Silakan login kembali.");
      }

      if (response.status === 403) {
        throw new Error("Akses ditolak. Anda tidak memiliki izin untuk melihat laporan ini.");
      }

      const resJson = await response.json();

      if (!response.ok) {
        throw new Error(resJson.message || "Gagal memuat data laporan dari server.");
      }

      setReportData(resJson.data ?? resJson);
    } catch (err) {
      console.error("Error Fetching Dashboard Data:", err);
      setError(err.message || "Terjadi kesalahan koneksi ke server.");
      
      if (err.message.includes("Sesi login")) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- Memetakan Data Statistik untuk StatCard ---
  const stats = useMemo(() => {
    if (!reportData) return [];
    return [
      {
        title: "Total Penjualan",
        value: `Rp ${Number(reportData.total_sales ?? 0).toLocaleString("id-ID")}`,
        growthPercent: reportData.sales_growth ?? "0%",
        growthLabel: "vs periode sebelumnya",
        icon: undefined,
      },
      {
        title: "Total Transaksi",
        value: String(reportData.total_transactions ?? 0),
        growthPercent: reportData.transactions_growth ?? "0%",
        growthLabel: "vs periode sebelumnya",
        icon: undefined,
      },
      {
        title: "Total Produk Terjual",
        value: String(reportData.products_sold ?? 0),
        growthPercent: reportData.products_growth ?? "0%",
        growthLabel: "vs periode sebelumnya",
        icon: undefined,
      },
      {
        title: "Pelanggan Baru",
        value: String(reportData.new_customers ?? 0),
        growthPercent: reportData.customers_growth ?? "0%",
        growthLabel: "vs periode sebelumnya",
        icon: undefined,
      },
    ];
  }, [reportData]);

  const salesData = useMemo(() => {
    return reportData?.sales_chart_data ?? [];
  }, [reportData]);

  const topSelling = useMemo(() => {
    return reportData?.top_selling ?? [];
  }, [reportData]);

  // Mengambil data kategori dinamis
  const categoryData = useMemo(() => {
    return reportData?.category_data ?? reportData?.categories ?? [];
  }, [reportData]);

  const recentTransactions = useMemo(() => {
    return reportData?.recent_transactions ?? [];
  }, [reportData]);

  if (loading) {
    return (
      <div className="h-[500px] flex flex-col items-center justify-center gap-4 bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <div className="text-center">
          <p className="text-gray-800 font-bold text-base">Memproses Data Dashboard</p>
          <p className="text-gray-500 text-xs mt-1 animate-pulse font-medium">Menghubungkan ke server & sinkronisasi laporan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[500px] flex flex-col items-center justify-center gap-4 bg-white/70 backdrop-blur rounded-3xl border border-red-100 shadow-soft p-6 text-center">
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100">
          <AlertCircle size={36} className="text-rose-500" />
        </div>
        <div className="max-w-md">
          <p className="text-gray-900 font-extrabold text-lg">Gagal Memuat Dashboard</p>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">{error}</p>
        </div>
        <button 
          onClick={fetchDashboardData} 
          className="px-6 h-11 mt-2 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl text-xs font-bold transition active:scale-95"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
      <div className="xl:col-span-8 flex flex-col gap-5">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((s) => (
            <StatCard
              key={s.title}
              icon={s.icon}
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
            <RecentTransactions rows={recentTransactions} />
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="xl:col-span-4 flex flex-col gap-5">
        <TopSelling items={topSelling} />
        {/* Menggunakan komponen inline CategoryChart yang sudah dinamis */}
        <CategoryChart categories={categoryData} />
      </div>
    </div>
  );
};

export default DashboardHomePage;