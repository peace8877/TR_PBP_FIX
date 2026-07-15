import { useMemo, useState } from "react";
import SidebarCashier from "../../components/cashier/SidebarCashier";
import HeaderCashier from "../../components/cashier/HeaderCashier";
import HistoryTable from "../../components/cashier/HistoryTable";
import TransactionDetailModal from "../../components/cashier/TransactionDetailModal";
import { transactions } from "./data/cashierData";

const CashierTransactionsPage = () => {
  const [pagination, setPagination] = useState({ page: 1 });
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("2026-07-01");
  const [dateTo, setDateTo] = useState("2026-07-12");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter((t) => {
      const matchesQuery = !q || t.invoice.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q);
      const matchesDate = (!dateFrom || !dateTo) || (t.date >= dateFrom && t.date <= dateTo);
      return matchesQuery && matchesDate;
    });
  }, [query, dateFrom, dateTo]);

  const openDetail = (row) => {
    setSelectedRow(row);
    setDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-mokkaCream">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex gap-5">
          <SidebarCashier onLogout={() => (window.location.href = "/login")} />

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
      </div>
    </div>
  );
};

export default CashierTransactionsPage;

