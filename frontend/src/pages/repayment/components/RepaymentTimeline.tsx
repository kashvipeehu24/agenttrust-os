import PaymentStatusBadge from "./PaymentStatusBadge";
import type {
  RepaymentSummary,
  RepaymentScheduleItem,
} from "../types/repayment";

interface RepaymentTimelineProps {
  summary: RepaymentSummary;
  schedule?: RepaymentScheduleItem[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function RepaymentTimeline({
  summary,
  schedule,
}: RepaymentTimelineProps) {
  const scheduleItems = Array.isArray(schedule) ? schedule : [];

  return (
    <div className="space-y-6">

      {/* Summary Card */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold">
          Loan Repayment
        </h2>

        <div className="grid gap-4 md:grid-cols-3">

          <div>
            <p className="text-sm text-gray-500">Total Loan</p>
            <h3 className="text-xl font-bold">
              {formatCurrency(summary.totalLoan)}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Amount Paid</p>
            <h3 className="text-xl font-bold text-green-600">
              {formatCurrency(summary.amountPaid)}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Remaining</p>
            <h3 className="text-xl font-bold text-red-600">
              {formatCurrency(summary.remainingAmount)}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Interest</p>
            <h3>{formatCurrency(summary.interest)}</h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Due Date</p>
            <h3>{summary.dueDate}</h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Next Payment</p>
            <h3>
              {formatCurrency(summary.nextPayment)}
            </h3>
            <p className="text-xs text-gray-500">
              {summary.nextPaymentDate}
            </p>
          </div>

        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm">
            <span>Repayment Progress</span>
            <span>{summary.repaymentRate}%</span>
          </div>

          <div className="h-3 rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-green-500"
              style={{
                width: `${summary.repaymentRate}%`,
              }}
            />
          </div>
        </div>

      </div>

      {/* Timeline */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h2 className="mb-4 text-xl font-semibold">
          Repayment Timeline
        </h2>

        <div className="space-y-4">

          {scheduleItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border p-4"
            >

              <div>
                <h4 className="font-semibold">
                  {item.label}
                </h4>

                <p className="text-sm text-gray-500">
                  Due: {item.dueDate}
                </p>
              </div>

              <div className="text-right">

                <p className="font-semibold">
                  {formatCurrency(item.amount)}
                </p>

                <div className="mt-2">
                  <PaymentStatusBadge
                    status={item.status}
                  />
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}