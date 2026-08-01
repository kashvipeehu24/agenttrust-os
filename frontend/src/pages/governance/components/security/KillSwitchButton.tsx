export default function KillSwitchButton() {
  return (
    <div className="rounded-xl border border-red-300 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-red-700">
            Emergency Kill Switch
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Instantly disable autonomous agent operations during suspicious
            activity.
          </p>
        </div>

        <button
          className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700"
        >
          Activate
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">
            Wallet
          </p>

          <p className="font-semibold">
            Freeze
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">
            Transactions
          </p>

          <p className="font-semibold">
            Stop
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">
            Agent
          </p>

          <p className="font-semibold">
            Disable
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">
            Contracts
          </p>

          <p className="font-semibold">
            Pause
          </p>
        </div>
      </div>
    </div>
  );
}