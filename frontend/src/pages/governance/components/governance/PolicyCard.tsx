import type { Policy } from "../types/policy";

interface Props {
  policy: Policy;
}

export default function PolicyCard({ policy }: Props) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow">
      <h3 className="font-semibold">{policy.name}</h3>

      <p className="mt-2 text-sm text-gray-600">
        {policy.description}
      </p>
    </div>
  );
}