type RecommendationCardProps = {
  recommendations: string[];
};

export default function RecommendationCard({
  recommendations,
}: RecommendationCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-5">
        AI Recommendations
      </h2>

      <ul className="space-y-3">
        {recommendations.map((item, index) => (
          <li
            key={index}
            className="rounded-lg bg-blue-50 p-3 border border-blue-100"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}