import React from "react";

interface SecurityHealthCardProps {
  score: number;
  title?: string;
  description?: string;
}

const SecurityHealthCard: React.FC<SecurityHealthCardProps> = ({
  score,
  title = "Security Health",
  description = "Overall platform security status",
}) => {
  const color =
    score >= 80
      ? "text-green-600"
      : score >= 50
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

      <div className={`mt-6 text-5xl font-bold ${color}`}>
        {score}%
      </div>

      <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-green-500 transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export default SecurityHealthCard;