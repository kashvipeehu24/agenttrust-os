import type {
  AISuggestion,
  AISuggestionSummary,
} from "../types/aiSuggestion";

interface Props {
  summary: AISuggestionSummary;
  suggestions: AISuggestion[];
}

const priorityStyle = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

export default function AISuggestionCard({
  summary,
  suggestions,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        AI Suggestions
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Personalized recommendations based on wallet activity and repayment trends.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-2xl font-bold">
            {summary.totalSuggestions}
          </p>
        </div>

        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-700">
            High Priority
          </p>

          <p className="text-2xl font-bold text-red-700">
            {summary.highPriority}
          </p>
        </div>

        <div className="rounded-lg bg-yellow-50 p-4">
          <p className="text-sm text-yellow-700">
            Medium
          </p>

          <p className="text-2xl font-bold text-yellow-700">
            {summary.mediumPriority}
          </p>
        </div>

        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm text-green-700">
            Low
          </p>

          <p className="text-2xl font-bold text-green-700">
            {summary.lowPriority}
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {item.title}
              </h3>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${priorityStyle[item.priority]}`}
              >
                {item.priority}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-600">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}