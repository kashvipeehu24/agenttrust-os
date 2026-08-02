import api from "../../../services/api";
import type {
  CashFlowPoint,
  CashFlowSummary,
} from "../types/cashflow";

const cashFlowApi = {
  getSummary: (walletId: string) =>
    api.get<CashFlowSummary>(
      `/cashflow/${walletId}/summary`
    ),

  getHistory: (walletId: string) =>
    api.get<CashFlowPoint[]>(
      `/cashflow/${walletId}/history`
    ),
};

export default cashFlowApi;