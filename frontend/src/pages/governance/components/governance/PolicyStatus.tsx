interface Props {
  enabled: boolean;
}

export default function PolicyStatus({ enabled }: Props) {
  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`h-3 w-3 rounded-full ${
          enabled ? "bg-green-500" : "bg-red-500"
        }`}
      />

      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          enabled
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {enabled ? "Policy Active" : "Policy Disabled"}
      </span>
    </div>
  );
}