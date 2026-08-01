import type { Alert } from "../types/alert";

interface Props {
  alert: Alert;
}

export default function ExplainableAlert({ alert }: Props) {
  return (
    <div className="rounded-xl border bg-yellow-50 p-4">
      <h3 className="font-semibold">
        {alert.title}
      </h3>

      <p className="mt-2 text-sm">
        {alert.description}
      </p>

      <p className="mt-3 text-xs text-gray-500">
        Suggested Action: Review this event.
      </p>
    </div>
  );
}