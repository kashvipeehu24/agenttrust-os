import WalletDashboard from "./pages/WalletDashboard";
import TransactionsPage from "./pages/TransactionsPage";
import RepaymentDashboard from "./pages/RepaymentDashboard";
import RevenueDashboard from "./pages/RevenueDashboard";
import CashFlowDashboard from "./pages/CashFlowDashboard";
import ForecastDashboard from "./pages/ForecastDashboard";

export default function RepaymentModule() {
  return (
  <div className="space-y-8 p-6">
    <WalletDashboard />

    <RepaymentDashboard />

    <RevenueDashboard />

    <CashFlowDashboard />

    <ForecastDashboard />

    <TransactionsPage />
  </div>
  );
}