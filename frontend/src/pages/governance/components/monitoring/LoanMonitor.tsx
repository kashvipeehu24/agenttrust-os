export default function LoanMonitor() {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Loan Monitor
        </h2>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          LIVE
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">
            Active Loans
          </p>

          <p className="mt-2 text-2xl font-bold">
            248
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">
            Outstanding Value
          </p>

          <p className="mt-2 text-2xl font-bold">
            $1.25M
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">
            Repayment Rate
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            98%
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">
            Default Risk
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            Low
          </p>
        </div>
      </div>
    </div>
  );
}