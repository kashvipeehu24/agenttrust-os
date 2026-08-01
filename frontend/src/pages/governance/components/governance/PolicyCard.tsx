import type { Policy } from "../types/policy";

interface Props {
  policy: Policy;
}

export default function PolicyCard({ policy }: Props) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {policy.name}
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            policy.enabled
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {policy.enabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        {policy.description}
      </p>

      <div className="mt-5 border-t pt-4">
        <p className="text-xs text-gray-500">
          Policy ID
        </p>

        <p className="font-medium">
          {policy.id}
        </p>
      </div>
    </div>
  );
}