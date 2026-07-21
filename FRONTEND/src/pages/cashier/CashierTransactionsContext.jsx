import { createContext, useMemo, useState, useEffect, useContext } from "react";

// 1. Membuat Context
export const CashierTransactionsContext = createContext(null);

// 2. Provider untuk mengelola data transaksi
export function CashierTransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/transactions", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });

      const result = await response.json();
      
      // Log untuk debug di console browser (F12)
      console.log("Respon API:", result);

      // Menentukan data mentah berdasarkan respon JSON (Sesuaikan jika key-nya berbeda)
      const rawData = Array.isArray(result) ? result : (result.data || []);

      // Mapping data agar sesuai dengan UI yang diharapkan (HistoryTable.jsx)
      const formattedData = rawData.map((t) => {
      const dateStr = t.transactions_date || "2026-07-18 00:00:00"; 
      // Mengambil YYYY-MM-DD dari "2026-07-18 11:18:30"
      const datePart = dateStr.split(' ')[0]; 
      
      return {
        id: t.id,
        invoice: t.invoice_number || `INV-${t.id}`,
        staf: t.user?.name || "Staf Umum",
        status: t.status,
        date: datePart, // Gunakan YYYY-MM-DD untuk mempermudah filter
        rawDate: datePart, 
        time: dateStr.split(' ')[1]?.substring(0, 5) || "00:00",
        totals: {
          grandTotal: Number(t.total_amount || 0),
        },
        // Simpan data mentah untuk digunakan modal detail
        _raw: t,
      };
    });

      setTransactions(formattedData);
    } catch (error) {
      console.error("Gagal memuat transaksi:", error);
      setTransactions([]);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = (tx) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  const value = useMemo(() => ({ 
    transactions, 
    addTransaction,
    refreshTransactions: fetchTransactions 
  }), [transactions]);

  return (
    <CashierTransactionsContext.Provider value={value}>
      {children}
    </CashierTransactionsContext.Provider>
  );
}

// 3. Custom Hook untuk memanggil data dengan mudah di komponen lain
export const useCashierTransactions = () => {
  const context = useContext(CashierTransactionsContext);
  if (!context) {
    throw new Error("useCashierTransactions harus digunakan di dalam CashierTransactionsProvider");
  }
  return context;
};