interface Props {
  labels: string[];
  data: number[];
}

export default function FraudRateChart({
  labels,
  data,
}: Props) {
  const max = Math.max(...data, 1);

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Fraud Trend
        </h2>

        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          Last 7 Days
        </span>
      </div>

      <div className="mt-8 flex h-56 items-end justify-between gap-3">
        {data.map((value, index) => (
          <div
            key={labels[index]}
            className="flex flex-1 flex-col items-center"
          >
            <div
              className="w-full rounded-t-lg bg-red-500 transition-all duration-300 hover:bg-red-600"
              style={{
                height: `${(value / max) * 180}px`,
              }}
            />

            <p className="mt-3 text-xs text-gray-500">
              {labels[index]}
            </p>

            <p className="text-sm font-semibold">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}