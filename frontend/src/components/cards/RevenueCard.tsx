type RevenueCardProps = {
  predictedRevenue: number;
  growthMultiplier: number;
};

export default function RevenueCard({
  predictedRevenue,
  growthMultiplier,
}: RevenueCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700">
        Revenue Prediction
      </h2>

      <p className="mt-4 text-3xl font-bold text-emerald-600">
        ₹{predictedRevenue.toLocaleString()}
      </p>

      <div className="mt-4">
        <span className="rounded-full bg-emerald-100 px-4 py-2 text-emerald-700 font-medium">
          Growth × {growthMultiplier}
        </span>
      </div>
    </div>
  );
}