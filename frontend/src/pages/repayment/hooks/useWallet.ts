import { useEffect, useState } from "react";
import { walletApi } from "../api/walletApi";
import type { WalletSummary } from "../types/wallet";

export const useWallet = (walletId: string) => {
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWallet = async () => {
    try {
      setLoading(true);

      const response = await walletApi.getWalletSummary(walletId);

      setWallet(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load wallet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletId) {
      fetchWallet();
    }
  }, [walletId]);

  return {
    wallet,
    loading,
    error,
    refreshWallet: fetchWallet,
  };
};