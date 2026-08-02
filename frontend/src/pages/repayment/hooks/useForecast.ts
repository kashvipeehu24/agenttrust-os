import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);

        const summaryRes = await forecastApi.getSummary(walletId);
        const historyRes = await forecastApi.getHistory(walletId);

        setSummary(summaryRes.data);
        setHistory(historyRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load forecast.");
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [walletId]);

  return {
    summary,
    history,
    loading,
    error,
  };
}