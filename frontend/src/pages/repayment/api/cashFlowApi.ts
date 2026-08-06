import api from "../../../services/api";
import type { AxiosRequestConfig } from "axios";
import type {
  CashFlowPoint,
  CashFlowSummary,
} from "../types/cashflow";

const cashFlowApi = {
  getSummary: (walletId: string, config?: AxiosRequestConfig) =>
    api.get<CashFlowSummary>(
      `/cashflow/${walletId}/summary`, config,
    ),

  getHistory: (walletId: string, config?: AxiosRequestConfig) =>
    api.get<CashFlowPoint[]>(
      `/cashflow/${walletId}/history`, config,
    ),
};

export default cashFlowApi;
