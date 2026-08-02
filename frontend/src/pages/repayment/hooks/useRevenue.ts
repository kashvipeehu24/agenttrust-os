import { useEffect, useState } from "react";
import revenueApi from "../api/revenueApi";

import type {
  RevenueEntry,
  RevenueSummary,
} from "../types/revenue";

export function useRevenue(walletId: string) {
  const [summary, setSummary] =
    useState<RevenueSummary | null>(null);

  const [entries, setEntries] =
    useState<RevenueEntry[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchRevenue = async () => {
    try {
      setLoading(true);

      const summaryResponse =
        await revenueApi.getRevenueSummary(walletId);

      const entriesResponse =
        await revenueApi.getRevenueEntries(walletId);

      setSummary(summaryResponse.data);
      setEntries(entriesResponse.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load revenue data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletId) {
      fetchRevenue();
    }
  }, [walletId]);

  return {
    summary,
    entries,
    loading,
    error,
    refreshRevenue: fetchRevenue,
  };
}