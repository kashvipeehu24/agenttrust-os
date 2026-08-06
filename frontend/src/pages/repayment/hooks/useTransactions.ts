import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { walletApi } from "../api/walletApi";
import type { WalletTransaction } from "../types/wallet";

export const useTransactions = (walletId: string) => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);

      const response =
        await walletApi.getTransactions(walletId, { signal });

      setTransactions(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch (err) {
      if (!axios.isCancel(err) && !signal?.aborted) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unable to load transactions.");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [walletId]);

  useEffect(() => {
    if (!walletId) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    fetchTransactions(controller.signal);
    return () => controller.abort();
  }, [walletId, fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    refreshTransactions: () => fetchTransactions(),
  };
};
