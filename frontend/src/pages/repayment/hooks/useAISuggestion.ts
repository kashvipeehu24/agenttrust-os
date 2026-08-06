import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import aiSuggestionApi from "../api/aiSuggestionApi";

import type {
  AISuggestion,
  AISuggestionSummary,
} from "../types/aiSuggestion";

export function useAISuggestion(walletId: string) {
  const [summary, setSummary] =
    useState<AISuggestionSummary | null>(null);

  const [suggestions, setSuggestions] =
    useState<AISuggestion[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchSuggestions = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);

      const summaryRes =
        await aiSuggestionApi.getSummary(walletId, { signal });

      const suggestionsRes =
        await aiSuggestionApi.getSuggestions(walletId, { signal });

      setSummary(summaryRes.data ?? null);
      setSuggestions(Array.isArray(suggestionsRes.data) ? suggestionsRes.data : []);
      setError("");
    } catch (err) {
      if (!axios.isCancel(err) && !signal?.aborted) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load AI suggestions.");
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
    fetchSuggestions(controller.signal);
    return () => controller.abort();
  }, [walletId, fetchSuggestions]);

  return {
    summary,
    suggestions,
    loading,
    error,
    refreshSuggestions: () => fetchSuggestions(),
  };
}
