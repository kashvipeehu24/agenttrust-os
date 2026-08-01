interface Props {
  score: number;
}

export default function SecurityHealthCard({ score }: Props) {
  const status =
    score >= 90
      ? "Excellent"
      : score >= 75
      ? "Good"
      : score >= 50
      ? "Warning"
      : "Critical";

  const color =
    score >= 90
      ? "text-green-600"
      : score >= 75
      ? "text-blue-600"
      : score >= 50
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Security Health
        </h3>

        <span className={`text-lg font-bold ${color}`}>
          {status}
        </span>
      </div>

      <div className="mt-6">
        <p className="text-5xl font-bold">
          {score}%
        </p>

        <div className="mt-4 h-3 w-full rounded-full bg-gray-200">
          <div
            className="h-3 rounded-full bg-green-500"
            style={{ width: `${score}%` }}
          />
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Overall platform security health based on fraud detection,
          governance compliance, monitoring, and active alerts.
        </p>
      </div>
    </div>
  );
}