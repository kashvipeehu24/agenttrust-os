import type { Alert } from "../types/alert";

interface Props {
  alert: Alert;
}

export default function ExplainableAlert({ alert }: Props) {
  return (
    <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-yellow-800">
        Explainable Alert
      </h3>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase text-gray-500">
            Alert
          </p>
          <p className="text-sm font-medium text-gray-900">
            {alert.title}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-gray-500">
            Why it happened
          </p>
          <p className="text-sm text-gray-700">
            {alert.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">
              Risk Level
            </p>
            <p className="font-semibold text-red-600">
              {alert.severity}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">
              Status
            </p>
            <p className="font-semibold text-blue-600">
              {alert.status}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-gray-500">
            Suggested Action
          </p>
          <p className="text-sm text-gray-700">
            Review the transaction, verify wallet activity, and enforce
            governance policies if required.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-gray-500">
            Impact
          </p>
          <p className="text-sm text-gray-700">
            This event may affect agent trust, credit utilization, or policy
            compliance until resolved.
          </p>
        </div>
      </div>
    </div>
  );
}