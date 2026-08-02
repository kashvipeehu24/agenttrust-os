import axios from "axios";
import type {
  RepaymentSummary,
  RepaymentScheduleItem,
} from "../types/repayment";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const repaymentApi = {
  getRepaymentSummary: (walletId: string) =>
    api.get<RepaymentSummary>(
      `/repayments/${walletId}/summary`
    ),

  getRepaymentSchedule: (walletId: string) =>
    api.get<RepaymentScheduleItem[]>(
      `/repayments/${walletId}/schedule`
    ),

  processRepayment: (
    walletId: string,
    amount: number
  ) =>
    api.post(
      `/repayments/${walletId}/pay`,
      {
        amount,
      }
    ),

  forecast: (walletId: string) =>
    api.get(
      `/repayments/${walletId}/forecast`
    ),

  suggestions: (walletId: string) =>
    api.get(
      `/repayments/${walletId}/suggestions`
    ),
};

export default repaymentApi;