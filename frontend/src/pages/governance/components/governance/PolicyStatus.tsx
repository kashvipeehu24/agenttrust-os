interface Props {
  enabled: boolean;
}

export default function PolicyStatus({ enabled }: Props) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        enabled
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {enabled ? "Enabled" : "Disabled"}
    </span>
  );
}