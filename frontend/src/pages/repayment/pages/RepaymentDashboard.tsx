import RepaymentTimeline from "../components/RepaymentTimeline";
import { useRepayment } from "../hooks/useRepayment";
import { LoadingSkeleton, ErrorState, EmptyState } from "../../../components/common/FeedbackStates";

export default function RepaymentDashboard() {
  // Replace with the actual wallet ID after backend integration
  const walletId = "wallet_001";

  const {
    summary,
    schedule,
    loading,
    error,
    refreshRepayment,
  } = useRepayment(walletId);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        details="Axios client failed to fetch /repayments/{walletId}/summary and /repayments/{walletId}/schedule"
        onRetry={refreshRepayment}
      />
    );
  }

  if (!summary) {
    return <EmptyState title="No Repayment Data" description="No active repayment records or payment schedules were found for this wallet." />;
  }

  return (
    <div className="space-y-6">
      <RepaymentTimeline
        summary={summary}
        schedule={schedule}
      />
    </div>
  );
}