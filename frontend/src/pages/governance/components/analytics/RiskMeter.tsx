interface Props {
  value: number;
  label: string;
}

export default function RiskMeter({ value, label }: Props) {
  const color =
    value < 30
      ? "bg-green-500"
      : value < 60
      ? "bg-yellow-500"
      : value < 80
      ? "bg-orange-500"
      : "bg-red-500";

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {label}
        </h3>

        <span className="text-2xl font-bold">
          {value}%
        </span>
      </div>

      <div className="mt-5 h-3 w-full rounded-full bg-gray-200">
        <div
          className={`h-3 rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>

      <div className="mt-3 flex justify-between text-xs text-gray-500">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
        <span>Critical</span>
      </div>
    </div>
  );
}