import api from "../../../services/api";
import type { AxiosRequestConfig } from "axios";
import type {
  WalletTransaction,
  PaymentStatus,
  TransactionType,
} from "../types/wallet";

const transactionApi = {
  getTransactions: (walletId: string, config?: AxiosRequestConfig) =>
    api.get<WalletTransaction[]>(`/wallets/${walletId}/transactions`, config),

  getTransactionsByStatus: (
    walletId: string,
    status: PaymentStatus,
    config?: AxiosRequestConfig,
  ) =>
    api.get<WalletTransaction[]>(`/wallets/${walletId}/transactions`, {
      ...config,
      params: { ...config?.params, status },
    }),

  getTransactionsByType: (
    walletId: string,
    type: TransactionType,
    config?: AxiosRequestConfig,
  ) =>
    api.get<WalletTransaction[]>(`/wallets/${walletId}/transactions`, {
      ...config,
      params: { ...config?.params, type },
    }),
};

export default transactionApi;
