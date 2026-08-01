interface Props {
  label: string;
}

export default function RestrictionBadge({ label }: Props) {
  return (
    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
      {label}
    </span>
  );
}