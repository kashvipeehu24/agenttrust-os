import api from "../../../services/api";
import type {
  TransactionRecord,
  PaymentStatus,
  TransactionType,
} from "../types/transaction";

const transactionApi = {
  getTransactions: (walletId: string) =>
    api.get<TransactionRecord[]>(
      `/wallets/${walletId}/transactions`
    ),

  getTransactionsByStatus: (
    walletId: string,
    status: PaymentStatus
  ) =>
    api.get<TransactionRecord[]>(
      `/wallets/${walletId}/transactions?status=${status}`
    ),

  getTransactionsByType: (
    walletId: string,
    type: TransactionType
  ) =>
    api.get<TransactionRecord[]>(
      `/wallets/${walletId}/transactions?type=${type}`
    ),
};

export default transactionApi;