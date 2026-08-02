import RevenueCard from "../components/RevenueCard";
import { useRevenue } from "../hooks/useRevenue";

export default function RevenueDashboard() {
  // Replace with actual wallet ID after backend authentication
  const walletId = "wallet_001";

  const {
    summary,
    entries,
    loading,
    error,
  } = useRevenue(walletId);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading revenue data...
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
        Revenue data not available.
      </div>
    );
  }

  return (
    <RevenueCard
      summary={summary}
      entries={entries}
    />
  );
}