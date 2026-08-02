import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);

        const summaryRes =
          await aiSuggestionApi.getSummary(walletId);

        const suggestionsRes =
          await aiSuggestionApi.getSuggestions(walletId);

        setSummary(summaryRes.data);
        setSuggestions(suggestionsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load AI suggestions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [walletId]);

  return {
    summary,
    suggestions,
    loading,
    error,
  };
}