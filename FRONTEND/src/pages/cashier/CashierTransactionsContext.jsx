import { createContext, useMemo, useState } from "react";

import { transactions as seedTransactions } from "./data/cashierData";

export const CashierTransactionsContext = createContext(null);

export function CashierTransactionsProvider({ children }) {

  const [transactions, setTransactions] = useState(() => seedTransactions);

  const addTransaction = (tx) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  const value = useMemo(() => ({ transactions, addTransaction }), [transactions]);

  return (
    <CashierTransactionsContext.Provider value={value}>
      {children}
    </CashierTransactionsContext.Provider>
  );
}





