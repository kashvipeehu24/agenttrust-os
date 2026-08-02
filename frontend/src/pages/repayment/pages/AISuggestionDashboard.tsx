import AISuggestionCard from "../components/AISuggestionCard";
import { useAISuggestion } from "../hooks/useAISuggestion";

export default function AISuggestionDashboard() {
  const walletId = "wallet_001";

  const {
    summary,
    suggestions,
    loading,
    error,
  } = useAISuggestion(walletId);

  if (loading)
    return (
      <div className="p-6">
        Loading AI Suggestions...
      </div>
    );

  if (error)
    return (
      <div className="rounded-lg bg-red-50 p-6 text-red-600">
        {error}
      </div>
    );

  if (!summary)
    return (
      <div className="p-6">
        No suggestions available.
      </div>
    );

  return (
    <AISuggestionCard
      summary={summary}
      suggestions={suggestions}
    />
  );
}