import CashFlowChart from "../components/CashFlowChart";
import { useCashFlow } from "../hooks/useCashFlow";
import { LoadingSkeleton, ErrorState, EmptyState } from "../../../components/common/FeedbackStates";

export default function CashFlowDashboard() {
  // Replace with authenticated user's wallet ID later
  const walletId = "wallet_001";

  const {
    summary,
    history,
    loading,
    error,
    refreshCashFlow,
  } = useCashFlow(walletId);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        details="Axios client failed to fetch /cashflow/{walletId}/summary and /cashflow/{walletId}/history"
        onRetry={refreshCashFlow}
      />
    );
  }

  if (!summary) {
    return <EmptyState title="No Cash Flow Records" description="No cash flow summaries or historical data points were found." />;
  }

  return (
    <CashFlowChart
      summary={summary}
      history={history}
    />
  );
}