import api from "../../../services/api";
import type {
  RepaymentSummary,
  RepaymentScheduleItem,
} from "../types/repayment";

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