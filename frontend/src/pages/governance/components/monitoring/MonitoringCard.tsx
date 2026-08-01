interface Props {
  title: string;
  value: string | number;
}

export default function MonitoringCard({ title, value }: Props) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow">
      <h3 className="text-sm text-gray-500">{title}</h3>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}