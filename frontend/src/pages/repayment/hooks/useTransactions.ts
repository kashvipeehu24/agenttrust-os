import { useEffect, useState } from "react";
import { walletApi } from "../api/walletApi";
import type { WalletTransaction } from "../types/wallet";

export const useTransactions = (walletId: string) => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response =
        await walletApi.getTransactions(walletId);

      setTransactions(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletId) {
      fetchTransactions();
    }
  }, [walletId]);

  return {
    transactions,
    loading,
    error,
    refreshTransactions: fetchTransactions,
  };
};