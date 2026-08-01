export default function EmergencyModeCard() {
  return (
    <div className="rounded-xl border border-red-300 bg-red-50 p-4">
      <h3 className="font-semibold text-red-700">
        Emergency Mode
      </h3>

      <p className="mt-2 text-sm">
        Wallets and agent transactions are temporarily frozen.
      </p>
    </div>
  );
}