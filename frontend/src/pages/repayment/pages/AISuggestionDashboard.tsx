import AISuggestionCard from "../components/AISuggestionCard";
import { useAISuggestion } from "../hooks/useAISuggestion";
import { LoadingSkeleton, ErrorState, EmptyState } from "../../../components/common/FeedbackStates";

export default function AISuggestionDashboard() {
  const walletId = "wallet_001";

  const {
    summary,
    suggestions,
    loading,
    error,
    refreshSuggestions,
  } = useAISuggestion(walletId);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        details="Axios client failed to fetch /ai-suggestions/{walletId}/summary and /ai-suggestions/{walletId}"
        onRetry={refreshSuggestions}
      />
    );
  }

  if (!summary) {
    return <EmptyState title="No AI Suggestions" description="No automation recommendations or liquidity advice could be fetched." />;
  }

  return (
    <AISuggestionCard
      summary={summary}
      suggestions={suggestions}
    />
  );
}