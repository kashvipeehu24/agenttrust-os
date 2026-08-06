import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { walletApi } from "../api/walletApi";
import type { WalletSummary } from "../types/wallet";

export const useWallet = (walletId: string) => {
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWallet = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);

      const response = await walletApi.getWalletSummary(walletId, { signal });

      setWallet(response.data);
      setError("");
    } catch (err) {
      if (!axios.isCancel(err) && !signal?.aborted) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unable to load wallet.");
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
    fetchWallet(controller.signal);
    return () => controller.abort();
  }, [walletId, fetchWallet]);

  return {
    wallet,
    loading,
    error,
    refreshWallet: () => fetchWallet(),
  };
};
