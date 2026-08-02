import RepaymentTimeline from "../components/RepaymentTimeline";
import { useRepayment } from "../hooks/useRepayment";

export default function RepaymentDashboard() {
  // Replace with the actual wallet ID after backend integration
  const walletId = "wallet_001";

  const {
    summary,
    schedule,
    loading,
    error,
  } = useRepayment(walletId);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        Loading repayment data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        No repayment information available.
      </div>
    );
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