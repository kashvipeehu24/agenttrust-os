export default function EmergencyModeCard() {
  return (
    <div className="rounded-xl border border-red-300 bg-red-50 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-red-700">
          Emergency Mode
        </h2>

        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
          ACTIVE
        </span>
      </div>

      <p className="mt-4 text-sm text-gray-700">
        Emergency mode immediately freezes wallets, blocks transactions,
        pauses smart contract interactions, and prevents autonomous agent
        spending until manual review.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-white p-3 shadow-sm">
          <p className="text-xs text-gray-500">
            Wallets
          </p>

          <p className="font-semibold text-red-600">
            Frozen
          </p>
        </div>

        <div className="rounded-lg bg-white p-3 shadow-sm">
          <p className="text-xs text-gray-500">
            Transactions
          </p>

          <p className="font-semibold text-red-600">
            Blocked
          </p>
        </div>

        <div className="rounded-lg bg-white p-3 shadow-sm">
          <p className="text-xs text-gray-500">
            Smart Contracts
          </p>

          <p className="font-semibold text-red-600">
            Paused
          </p>
        </div>

        <div className="rounded-lg bg-white p-3 shadow-sm">
          <p className="text-xs text-gray-500">
            Agent Status
          </p>

          <p className="font-semibold text-red-600">
            Disabled
          </p>
        </div>
      </div>
    </div>
  );
}