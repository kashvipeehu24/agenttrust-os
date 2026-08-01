import React from "react";

interface FraudRateChartProps {
  data: number[];
  labels: string[];
}

const FraudRateChart: React.FC<FraudRateChartProps> = ({
  data,
  labels,
}) => {
  const maxValue = Math.max(...data, 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold text-slate-900">
        Fraud Rate Trend
      </h3>

      <div className="space-y-4">
        {data.map((value, index) => (
          <div key={index}>
            <div className="mb-1 flex justify-between text-sm text-gray-600">
              <span>{labels[index]}</span>
              <span>{value}</span>
            </div>

            <div className="h-3 w-full rounded-full bg-gray-200">
              <div
                className="h-3 rounded-full bg-red-500 transition-all duration-500"
                style={{
                  width: `${(value / maxValue) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FraudRateChart;