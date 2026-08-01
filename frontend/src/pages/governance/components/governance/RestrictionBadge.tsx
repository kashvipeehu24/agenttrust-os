interface Props {
  label: string;
}

export default function RestrictionBadge({ label }: Props) {
  return (
    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
      🔒 {label}
    </span>
  );
}