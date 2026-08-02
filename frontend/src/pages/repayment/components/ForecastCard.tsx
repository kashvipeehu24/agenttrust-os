import type { ForecastPoint, ForecastSummary } from "../types/forecast";

interface ForecastCardProps {
  summary: ForecastSummary;
  history: ForecastPoint[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function ForecastCard({
  summary,
  history,
}: ForecastCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          AI Forecast
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Predicted repayment and revenue performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Expected Revenue</p>

          <p className="mt-2 text-xl font-bold text-emerald-600">
            {formatCurrency(summary.expectedRevenue)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Expected Repayment</p>

          <p className="mt-2 text-xl font-bold text-blue-600">
            {formatCurrency(summary.expectedRepayment)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Expected Balance</p>

          <p className="mt-2 text-xl font-bold text-violet-600">
            {formatCurrency(summary.expectedBalance)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">AI Confidence</p>

          <p className="mt-2 text-xl font-bold text-amber-600">
            {summary.confidence}%
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-3 text-lg font-semibold">
          Forecast Timeline
        </h3>

        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.month}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
            >
              <span className="font-medium">{item.month}</span>

              <span className="text-emerald-600">
                {formatCurrency(item.projectedRevenue)}
              </span>

              <span className="text-blue-600">
                {formatCurrency(item.projectedRepayment)}
              </span>

              <span className="font-semibold">
                {formatCurrency(item.projectedBalance)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}