import api from "../../../services/api";
import type { AxiosRequestConfig } from "axios";
import type {
  RevenueEntry,
  RevenueSummary,
} from "../types/revenue";

const revenueApi = {
  getRevenueSummary: (walletId: string, config?: AxiosRequestConfig) =>
    api.get<RevenueSummary>(`/revenue/${walletId}/summary`, config),

  getRevenueEntries: (walletId: string, config?: AxiosRequestConfig) =>
    api.get<RevenueEntry[]>(`/revenue/${walletId}/entries`, config),
};

export default revenueApi;
