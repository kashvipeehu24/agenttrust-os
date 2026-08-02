import axios from "axios";
import type {
  RevenueEntry,
  RevenueSummary,
} from "../types/revenue";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

const revenueApi = {
  getRevenueSummary: (walletId: string) =>
    api.get<RevenueSummary>(`/revenue/${walletId}/summary`),

  getRevenueEntries: (walletId: string) =>
    api.get<RevenueEntry[]>(`/revenue/${walletId}/entries`),
};

export default revenueApi;