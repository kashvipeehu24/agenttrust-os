import CashFlowChart from "../components/CashFlowChart";
import { useCashFlow } from "../hooks/useCashFlow";

export default function CashFlowDashboard() {
  // Replace with authenticated user's wallet ID later
  const walletId = "wallet_001";

  const {
    summary,
    history,
    loading,
    error,
  } = useCashFlow(walletId);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading cash flow...
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
        No cash flow data available.
      </div>
    );
  }

  return (
    <CashFlowChart
      summary={summary}
      history={history}
    />
  );
}