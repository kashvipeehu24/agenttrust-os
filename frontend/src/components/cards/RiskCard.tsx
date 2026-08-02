type RiskCardProps = {
  riskScore: number;
  riskLevel: string;
};

export default function RiskCard({
  riskScore,
  riskLevel,
}: RiskCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700">
        Risk Analysis
      </h2>

      <p className="text-4xl font-bold text-red-600 mt-4">
        {riskScore}
      </p>

      <span className="inline-block mt-3 rounded-full bg-red-100 px-4 py-2 text-red-700 font-medium">
        {riskLevel}
      </span>
    </div>
  );
}