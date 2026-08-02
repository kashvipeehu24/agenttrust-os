import api from "../../../services/api";
import type {
  RevenueEntry,
  RevenueSummary,
} from "../types/revenue";

const revenueApi = {
  getRevenueSummary: (walletId: string) =>
    api.get<RevenueSummary>(`/revenue/${walletId}/summary`),

  getRevenueEntries: (walletId: string) =>
    api.get<RevenueEntry[]>(`/revenue/${walletId}/entries`),
};

export default revenueApi;