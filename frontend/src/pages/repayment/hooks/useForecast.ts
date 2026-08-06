import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import forecastApi from "../api/forecastApi";
import type {
  ForecastPoint,
  ForecastSummary,
} from "../types/forecast";

export function useForecast(walletId: string) {
  const [summary, setSummary] = useState<ForecastSummary | null>(null);
  const [history, setHistory] = useState<ForecastPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchForecast = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);

      const summaryRes = await forecastApi.getSummary(walletId, { signal });
      const historyRes = await forecastApi.getHistory(walletId, { signal });

      setSummary(summaryRes.data ?? null);
      setHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
      setError("");
    } catch (err) {
      if (!axios.isCancel(err) && !signal?.aborted) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load forecast.");
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
    fetchForecast(controller.signal);
    return () => controller.abort();
  }, [walletId, fetchForecast]);

  return {
    summary,
    history,
    loading,
    error,
    refreshForecast: () => fetchForecast(),
  };
}
