import api from "../../../services/api";
import type { AxiosRequestConfig } from "axios";
import type {
  RepaymentSummary,
  RepaymentScheduleItem,
} from "../types/repayment";

export const repaymentApi = {
  getRepaymentSummary: (walletId: string, config?: AxiosRequestConfig) =>
    api.get<RepaymentSummary>(
      `/repayments/${walletId}/summary`, config,
    ),

  getRepaymentSchedule: (walletId: string, config?: AxiosRequestConfig) =>
    api.get<RepaymentScheduleItem[]>(
      `/repayments/${walletId}/schedule`, config,
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
