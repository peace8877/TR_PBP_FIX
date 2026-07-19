import React, { useState, useEffect, useMemo } from "react";
import { AlertCircle, FileText, Loader2, Calendar, Download } from "lucide-react";

// Silahkan ganti komponen ini dengan komponen Chart dan Card asli milik Anda jika berbeda path
import SalesChart from "./components/SalesChart";
import StatCard from "./components/StatCard";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function ReportsPage() {
  // --- States ---
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default filter tanggal: awal bulan ini s.d hari ini
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 2).toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

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
  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    const headers = getAuthHeaders();

    // Proteksi Awal jika User belum Login / Token Hilang
    if (!headers) {
      setError("Sesi Anda telah berakhir atau Anda belum login. Mengalihkan...");
      setLoading(false);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/reports?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: headers,
        }
      );

      // Tangani token kedaluwarsa atau tidak valid (401 Unauthorized)
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        throw new Error("Sesi login Anda telah kedaluwarsa. Silakan login kembali.");
      }

      // Tangani jika user tidak memiliki akses admin (403 Forbidden)
      if (response.status === 403) {
        throw new Error("Akses ditolak. Anda tidak memiliki izin untuk melihat laporan ini.");
      }

      const resJson = await response.json();

      if (!response.ok) {
        throw new Error(resJson.message || "Gagal memuat data laporan dari server.");
      }

      // Simpan data dari response.data (sesuai format return JSON controller Laravel Anda)
      setReportData(resJson.data ?? resJson);
    } catch (err) {
      console.error("Error Fetching Reports:", err);
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

  // Jalankan fetch pertama kali saat komponen di-mount
  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler saat tombol Filter ditekan
  const handleFilter = (e) => {
    e.preventDefault();
    fetchReports();
  };

  // --- Handler Unduh Laporan (Excel/PDF) ---
  const handleExport = (type) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Sesi Anda telah habis. Silakan login kembali.");
      window.location.href = "/login";
      return;
    }
    // Redirect langsung ke route download dengan membawa token via query parameter
    const exportUrl = `${API_BASE_URL}/reports/export?type=${type}&start_date=${startDate}&end_date=${endDate}&token=${token}`;
    window.open(exportUrl, "_blank");
  };

  // --- Memetakan Data Statistik untuk StatCard (Menggunakan useMemo agar optimal) ---
  const stats = useMemo(() => {
    if (!reportData) return [];
    return [
      {
        title: "Total Penjualan",
        value: `Rp ${Number(reportData.total_sales ?? 0).toLocaleString("id-ID")}`,
        growthPercent: reportData.sales_growth ?? "0%",
        growthLabel: "vs periode sebelumnya",
      },
      {
        title: "Total Transaksi",
        value: String(reportData.total_transactions ?? 0),
        growthPercent: reportData.transactions_growth ?? "0%",
        growthLabel: "vs periode sebelumnya",
      },
      {
        title: "Produk Terjual",
        value: String(reportData.products_sold ?? 0),
        growthPercent: reportData.products_growth ?? "0%",
        growthLabel: "vs periode sebelumnya",
      },
      {
        title: "Pelanggan Baru",
        value: String(reportData.new_customers ?? 0),
        growthPercent: reportData.customers_growth ?? "0%",
        growthLabel: "vs periode sebelumnya",
      },
    ];
  }, [reportData]);

  // --- Tampilan Loading ---
  if (loading) {
    return (
      <div className="h-[500px] flex flex-col items-center justify-center gap-4 bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <div className="text-center">
          <p className="text-gray-800 font-bold text-base">Memproses Data Laporan</p>
          <p className="text-gray-500 text-xs mt-1 animate-pulse">Menghubungkan ke server & kalkulasi database...</p>
        </div>
      </div>
    );
  }

  // --- Tampilan Error ---
  if (error) {
    return (
      <div className="h-[500px] flex flex-col items-center justify-center gap-4 bg-white/70 backdrop-blur rounded-3xl border border-red-100 shadow-soft p-6 text-center">
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100">
          <AlertCircle size={36} className="text-rose-500" />
        </div>
        <div className="max-w-md">
          <p className="text-gray-900 font-extrabold text-lg">Gagal Memuat Laporan</p>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">{error}</p>
        </div>
        <div className="flex gap-3 mt-2">
          <button 
            onClick={fetchReports} 
            className="px-6 h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl text-xs font-bold transition active:scale-95"
          >
            Coba Lagi
          </button>
          <button 
            onClick={() => window.location.href = "/login"} 
            className="px-6 h-11 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl text-xs font-bold transition active:scale-95"
          >
            Halaman Login
          </button>
        </div>
      </div>
    );
  }

  // --- Tampilan Utama ---
  return (
    <div className="min-w-0 flex flex-col gap-6 p-1">
      
      {/* 1. Bagian Header & Filter Tanggal */}
      <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6 sm:p-8">
        <form onSubmit={handleFilter} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Laporan Penjualan</h1>
            <p className="text-sm text-gray-500">Pantau performa harian, tren penjualan, dan produk terlaris Anda.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex items-center">
              <Calendar size={16} className="absolute left-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-12 rounded-2xl bg-white/90 border border-gray-200 pl-11 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-gray-700"
              />
            </div>
            
            <span className="font-bold text-gray-400 text-sm">s/d</span>
            
            <div className="relative flex items-center">
              <Calendar size={16} className="absolute left-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-12 rounded-2xl bg-white/90 border border-gray-200 pl-11 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-gray-700"
              />
            </div>
            
            <button
              type="submit"
              className="h-12 px-6 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition text-sm active:scale-95 shadow-md shadow-gray-900/10"
            >
              Terapkan Filter
            </button>
          </div>
        </form>
      </div>

      {/* 2. Kartu Statistik (StatCards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value}
            growthPercent={s.growthPercent}
            growthLabel={s.growthLabel}
          />
        ))}
      </div>

      {/* 3. Area Visualisasi: Grafik Penjualan & Produk Terlaris */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: SalesChart (Grafik Tren Penjualan) */}
        <div className="xl:col-span-8">
          <SalesChart
            data={reportData?.sales_chart_data ?? []}
            title="Tren Grafik Penjualan Harian"
          />
        </div>

        {/* Kolom Kanan: Top Selling (Produk Terlaris) */}
        <div className="xl:col-span-4">
          <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6 h-full flex flex-col">
            <div className="border-b border-gray-100 pb-4 mb-4">
              <h3 className="text-lg font-black text-gray-900">Produk Terlaris</h3>
              <p className="text-xs text-gray-500 mt-1">5 produk dengan kuantitas penjualan tertinggi.</p>
            </div>
            
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px] pr-1 scrollbar-thin">
              {(!reportData?.top_selling || reportData.top_selling.length === 0) ? (
                <div className="h-48 flex flex-col items-center justify-center text-gray-400 gap-2 border border-dashed border-gray-200 rounded-2xl">
                  <FileText size={32} className="stroke-1" />
                  <p className="text-xs font-bold text-gray-400">Belum ada data transaksi</p>
                </div>
              ) : (
                reportData.top_selling.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3 bg-white/40 hover:bg-white/70 transition">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-black">
                      #{index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-gray-900 truncate text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Kuantitas: <span className="font-bold text-gray-700">{item.quantity} pcs</span>
                      </p>
                    </div>
                    <p className="font-extrabold text-sm text-emerald-600 shrink-0">
                      Rp {Number(item.sales ?? 0).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Bagian Unduh / Export Laporan */}
      <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Download size={18} className="text-gray-700" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Ekspor Berkas Laporan</h3>
              <p className="text-xs text-gray-500 mt-0.5">Unduh data laporan ini untuk kebutuhan arsip atau cetak fisik.</p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleExport("excel")}
              className="flex-1 sm:flex-none h-11 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold transition text-xs active:scale-95 shadow-md shadow-emerald-600/10"
            >
              Export Excel
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="flex-1 sm:flex-none h-11 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold transition text-xs active:scale-95 shadow-md shadow-rose-600/10"
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}