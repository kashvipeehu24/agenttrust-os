import walletApi from "../api/walletApi";
import repaymentApi from "../api/repaymentApi";
import revenueApi from "../api/revenueApi";
import transactionApi from "../api/transactionApi";
import forecastApi from "../api/forecastApi";
import cashFlowApi from "../api/cashFlowApi";
import aiSuggestionApi from "../api/aiSuggestionApi";

const repaymentService = {
  // Wallet
  wallet: walletApi,

  // Repayment
  repayment: repaymentApi,

  // Revenue
  revenue: revenueApi,

  // Transactions
  transaction: transactionApi,

  // Forecast
  forecast: forecastApi,

  // Cash Flow
  cashFlow: cashFlowApi,

  // AI Suggestions
  aiSuggestion: aiSuggestionApi,
};

export default repaymentService;