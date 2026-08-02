import ForecastCard from "../components/ForecastCard";
import { useForecast } from "../hooks/useForecast";

export default function ForecastDashboard() {
  // Replace later with authenticated user's wallet ID
  const walletId = "wallet_001";

  const {
    summary,
    history,
    loading,
    error,
  } = useForecast(walletId);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6">
        Loading forecast...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
        {error}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-xl border bg-white p-6">
        No forecast data available.
      </div>
    );
  }

  return (
    <ForecastCard
      summary={summary}
      history={history}
    />
  );
}