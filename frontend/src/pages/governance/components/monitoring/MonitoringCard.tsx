interface Props {
  title: string;
  value: string | number;
}

export default function MonitoringCard({ title, value }: Props) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium uppercase tracking-wide text-gray-500">
          {title}
        </h3>

        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
          LIVE
        </span>
      </div>

      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}