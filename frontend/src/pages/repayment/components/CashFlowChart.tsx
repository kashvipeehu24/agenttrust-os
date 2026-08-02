import type {
  CashFlowPoint,
  CashFlowSummary,
} from "../types/cashflow";

interface CashFlowChartProps {
  summary: CashFlowSummary;
  history: CashFlowPoint[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function CashFlowChart({
  summary,
  history,
}: CashFlowChartProps) {
  return (
    <div className="space-y-6">

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          Cash Flow Summary
        </h2>

        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <p className="text-sm text-gray-500">Income</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(summary.totalIncome)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Expense</p>
            <p className="text-lg font-bold text-red-600">
              {formatCurrency(summary.totalExpense)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Net Cash Flow</p>
            <p className="text-lg font-bold">
              {formatCurrency(summary.netCashFlow)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Trend</p>
            <p className="font-semibold">
              {summary.trend}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          Monthly Cash Flow
        </h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Month</th>
              <th>Income</th>
              <th>Expense</th>
              <th>Balance</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item) => (
              <tr key={item.month} className="border-b">
                <td className="py-3">{item.month}</td>
                <td>{formatCurrency(item.income)}</td>
                <td>{formatCurrency(item.expense)}</td>
                <td>{formatCurrency(item.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}