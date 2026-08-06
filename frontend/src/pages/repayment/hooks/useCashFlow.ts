import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import cashFlowApi from "../api/cashFlowApi";

import type {
  CashFlowPoint,
  CashFlowSummary,
} from "../types/cashflow";

export function useCashFlow(walletId: string) {
  const [summary, setSummary] =
    useState<CashFlowSummary | null>(null);

  const [history, setHistory] =
    useState<CashFlowPoint[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchCashFlow = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);

      const summaryResponse =
        await cashFlowApi.getSummary(walletId, { signal });

      const historyResponse =
        await cashFlowApi.getHistory(walletId, { signal });

      setSummary(summaryResponse.data ?? null);
      setHistory(Array.isArray(historyResponse.data) ? historyResponse.data : []);
      setError("");
    } catch (err) {
      if (!axios.isCancel(err) && !signal?.aborted) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load cash flow.");
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
    fetchCashFlow(controller.signal);
    return () => controller.abort();
  }, [walletId, fetchCashFlow]);

  return {
    summary,
    history,
    loading,
    error,
    refreshCashFlow: () => fetchCashFlow(),
  };
}
