import { useEffect, useState } from "react";
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

  const fetchCashFlow = async () => {
    try {
      setLoading(true);

      const summaryResponse =
        await cashFlowApi.getSummary(walletId);

      const historyResponse =
        await cashFlowApi.getHistory(walletId);

      setSummary(summaryResponse.data);
      setHistory(historyResponse.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load cash flow.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletId) {
      fetchCashFlow();
    }
  }, [walletId]);

  return {
    summary,
    history,
    loading,
    error,
    refreshCashFlow: fetchCashFlow,
  };
}