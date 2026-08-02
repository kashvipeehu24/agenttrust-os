import DecisionCard from "../../components/cards/DecisionCard";
import CreditCard from "../../components/cards/CreditCard";
import RiskCard from "../../components/cards/RiskCard";
import RevenueCard from "../../components/cards/RevenueCard";
import RecommendationCard from "../../components/cards/RecommendationCard";
import ExplanationCard from "../../components/cards/ExplanationCard";

export default function UnderwritingDashboard() {

  const data = {
    decision: "APPROVED",
    riskLevel: "LOW",
    riskScore: 22,

    creditLimit: 500000,
    dynamicCreditLimit: 650000,

    predictedRevenue: 1200000,
    growthMultiplier: 1.45,

    recommendations: [
      "Increase trust score through successful missions.",
      "Maintain wallet balance above ₹100,000.",
      "Keep fraud score below 5."
    ],

    explanation:
      "The AI approved the credit request because the agent has high trust, strong financial stability, low fraud probability and excellent historical performance."
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        Credit & Underwriting Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <DecisionCard
          decision={data.decision}
          riskLevel={data.riskLevel}
        />

        <RiskCard
          riskScore={data.riskScore}
          riskLevel={data.riskLevel}
        />

        <CreditCard
          creditLimit={data.creditLimit}
          dynamicCreditLimit={data.dynamicCreditLimit}
        />

        <RevenueCard
          predictedRevenue={data.predictedRevenue}
          growthMultiplier={data.growthMultiplier}
        />

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        <RecommendationCard
          recommendations={data.recommendations}
        />

        <ExplanationCard
          explanation={data.explanation}
        />

      </div>

    </div>
  );
}