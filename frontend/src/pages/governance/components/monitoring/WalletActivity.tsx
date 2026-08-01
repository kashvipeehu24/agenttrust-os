export default function WalletActivity() {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Wallet Activity
        </h2>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          LIVE
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
          <div>
            <p className="font-medium">
              Wallet Connections
            </p>

            <p className="text-sm text-gray-500">
              Connected wallets
            </p>
          </div>

          <span className="text-xl font-bold">
            186
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
          <div>
            <p className="font-medium">
              Transactions Today
            </p>

            <p className="text-sm text-gray-500">
              Verified blockchain activity
            </p>
          </div>

          <span className="text-xl font-bold">
            1,248
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
          <div>
            <p className="font-medium">
              Suspicious Wallets
            </p>

            <p className="text-sm text-gray-500">
              Under investigation
            </p>
          </div>

          <span className="text-xl font-bold text-red-600">
            3
          </span>
        </div>
      </div>
    </div>
  );
}