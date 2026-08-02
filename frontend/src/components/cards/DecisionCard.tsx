type DecisionCardProps = {
  decision: string;
  riskLevel: string;
};

export default function DecisionCard({
  decision,
  riskLevel,
}: DecisionCardProps) {
  const approved = decision.toLowerCase() === "approved";

  return (
    <div
      className={`rounded-xl shadow-lg p-6 text-white ${
        approved ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <h2 className="text-xl font-bold">
        Credit Decision
      </h2>

      <p className="text-3xl font-bold mt-3">
        {decision}
      </p>

      <p className="mt-2">
        Risk Level: <strong>{riskLevel}</strong>
      </p>
    </div>
  );
}