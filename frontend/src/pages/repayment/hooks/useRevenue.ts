import axios from "axios";
import { useCallback, useEffect, useState } from "react";
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

  const fetchRevenue = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);

      const summaryResponse =
        await revenueApi.getRevenueSummary(walletId, { signal });

      const entriesResponse =
        await revenueApi.getRevenueEntries(walletId, { signal });

      setSummary(summaryResponse.data ?? null);
      setEntries(Array.isArray(entriesResponse.data) ? entriesResponse.data : []);
      setError("");
    } catch (err) {
      if (!axios.isCancel(err) && !signal?.aborted) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load revenue data.");
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
    fetchRevenue(controller.signal);
    return () => controller.abort();
  }, [walletId, fetchRevenue]);

  return {
    summary,
    entries,
    loading,
    error,
    refreshRevenue: () => fetchRevenue(),
  };
}
