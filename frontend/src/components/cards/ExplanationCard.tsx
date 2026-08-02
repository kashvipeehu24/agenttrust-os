type ExplanationCardProps = {
  explanation: string;
};

export default function ExplanationCard({
  explanation,
}: ExplanationCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">
        Explainable AI
      </h2>

      <p className="leading-7 text-gray-700">
        {explanation}
      </p>
    </div>
  );
}