import type {
  RevenueEntry,
  RevenueSummary,
} from "../types/revenue";

interface RevenueCardProps {
  summary: RevenueSummary;
  entries: RevenueEntry[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function RevenueCard({
  summary,
  entries,
}: RevenueCardProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Revenue Overview</h2>

        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <p className="text-sm text-gray-500">Revenue Earned</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(summary.revenueEarned)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Pending Revenue</p>
            <p className="text-xl font-bold text-yellow-600">
              {formatCurrency(summary.pendingRevenue)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Total Earnings</p>
            <p className="text-xl font-bold">
              {formatCurrency(summary.totalEarnings)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Primary Source</p>
            <p className="font-semibold">{summary.revenueSource}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Revenue History</h2>

        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-semibold">{entry.label}</p>
                <p className="text-sm text-gray-500">{entry.date}</p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {formatCurrency(entry.amount)}
                </p>
                <p
                  className={
                    entry.status === "earned"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {entry.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}