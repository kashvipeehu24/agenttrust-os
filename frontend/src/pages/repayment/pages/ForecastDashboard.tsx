import ForecastCard from "../components/ForecastCard";
import { useForecast } from "../hooks/useForecast";
import { LoadingSkeleton, ErrorState, EmptyState } from "../../../components/common/FeedbackStates";

export default function ForecastDashboard() {
  // Replace later with authenticated user's wallet ID
  const walletId = "wallet_001";

  const {
    summary,
    history,
    loading,
    error,
    refreshForecast,
  } = useForecast(walletId);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        details="Axios client failed to fetch /forecast/{walletId}/summary and /forecast/{walletId}"
        onRetry={refreshForecast}
      />
    );
  }

  if (!summary) {
    return <EmptyState title="No Forecast Metrics" description="No future balance or projected revenue timeline points were found." />;
  }

  return (
    <ForecastCard
      summary={summary}
      history={history}
    />
  );
}