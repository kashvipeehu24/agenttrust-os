import RevenueCard from "../components/RevenueCard";
import { useRevenue } from "../hooks/useRevenue";
import { LoadingSkeleton, ErrorState, EmptyState } from "../../../components/common/FeedbackStates";

export default function RevenueDashboard() {
  // Replace with actual wallet ID after backend authentication
  const walletId = "wallet_001";

  const {
    summary,
    entries,
    loading,
    error,
    refreshRevenue,
  } = useRevenue(walletId);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        details="Axios client failed to fetch /revenue/{walletId}/summary and /revenue/{walletId}/entries"
        onRetry={refreshRevenue}
      />
    );
  }

  if (!summary) {
    return <EmptyState title="No Revenue Records" description="No logged revenue summary or historic bot profit logs were found." />;
  }

  return (
    <RevenueCard
      summary={summary}
      entries={entries}
    />
  );
}