import axios from "axios";
import type {
  CashFlowPoint,
  CashFlowSummary,
} from "../types/cashflow";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

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