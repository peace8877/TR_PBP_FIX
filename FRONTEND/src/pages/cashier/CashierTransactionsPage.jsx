import { useMemo, useState } from "react";
import SidebarCashier from "../../components/cashier/SidebarCashier";
import HeaderCashier from "../../components/cashier/HeaderCashier";
import HistoryTable from "../../components/cashier/HistoryTable";
import TransactionDetailModal from "../../components/cashier/TransactionDetailModal";

// 1. Import Provider dan Hook dari file yang sama
import { CashierTransactionsProvider, useCashierTransactions } from "./CashierTransactionsContext";

// 2. Komponen konten utama (di sinilah hook boleh dipanggil)
const CashierTransactionsContent = () => {
  const { transactions } = useCashierTransactions(); // Sekarang aman karena dibungkus Provider di bawah
  
  const [pagination, setPagination] = useState({ page: 1 });
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("2026-07-01");
  const [dateTo, setDateTo] = useState("2026-07-12");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!Array.isArray(transactions)) return [];

    return transactions.filter((t) => {
      // Menggunakan data hasil mapping
      const invoice = t.invoice.toLowerCase(); 
      const staf = (t.customer || "").toLowerCase();
      
      const matchesQuery = !q || invoice.includes(q) || customer.includes(q);
      
      // Menggunakan t.date (YYYY-MM-DD) yang sudah diproses di Provider
      const matchesDate = (!dateFrom || !dateTo) || (t.date >= dateFrom && t.date <= dateTo);
      
      return matchesQuery && matchesDate;
    });
  }, [transactions, query, dateFrom, dateTo]);

  const openDetail = (row) => {
    // Kirim data mentah (_raw) yang berisi details, subtotal, tax_amount, user, dll
    setSelectedRow(row._raw || row);
    setDetailOpen(true);
  };

  return (
    <div className="flex gap-5">
      <SidebarCashier onLogout={async () => {
          await fetch("http://127.0.0.1:8000/api/logout", {
            method: "POST",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
          });
          localStorage.clear();
          window.location.href = "/login";
        }} />

      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <HeaderCashier />
        <HistoryTable
          rows={filteredRows}
          onOpenDetail={openDetail}
          query={query}
          onQueryChange={(v) => {
            setQuery(v);
            setPagination({ page: 1 });
          }}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          pagination={pagination}
          onPageChange={(page) => setPagination({ page })}
        />

        <TransactionDetailModal
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          transaction={selectedRow}
        />
      </div>
    </div>
  );
};

// 3. Komponen Utama yang membungkus konten dengan Provider
export default function CashierTransactionsPage() {
  return (
    <div className="min-h-screen bg-mokkaCream">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <CashierTransactionsProvider>
          <CashierTransactionsContent />
        </CashierTransactionsProvider>
      </div>
    </div>
  );
}