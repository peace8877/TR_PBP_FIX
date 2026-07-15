import { useContext } from "react";
import { CashierTransactionsContext } from "./CashierTransactionsContext";

export const useCashierTransactions = () => {
  const ctx = useContext(CashierTransactionsContext);
  if (!ctx) throw new Error("useCashierTransactions must be used within provider");
  return ctx;
};

