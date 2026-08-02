import axios from "axios";
import type {
  Wallet,
  WalletSummary,
  WalletTransaction,
  WalletStatus,
  CreateWalletRequest,
  WalletCreditRequest,
  WalletDebitRequest,
  WalletRepaymentRequest,
} from "../types/wallet";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const walletApi = {
  createWallet: (data: CreateWalletRequest) =>
    api.post<Wallet>("/wallets", data),

  getWallet: (walletId: string) =>
    api.get<Wallet>(`/wallets/${walletId}`),

  getWalletSummary: (walletId: string) =>
    api.get<WalletSummary>(`/wallets/${walletId}/summary`),

  getTransactions: (walletId: string) =>
    api.get<WalletTransaction[]>(
      `/wallets/${walletId}/transactions`
    ),

  getStatus: (walletId: string) =>
    api.get<WalletStatus>(`/wallets/${walletId}/status`),

  creditWallet: (
    walletId: string,
    data: WalletCreditRequest
  ) =>
    api.post(
      `/wallets/${walletId}/credit`,
      data
    ),

  debitWallet: (
    walletId: string,
    data: WalletDebitRequest
  ) =>
    api.post(
      `/wallets/${walletId}/debit`,
      data
    ),

  repayLoan: (
    walletId: string,
    data: WalletRepaymentRequest
  ) =>
    api.post(
      `/wallets/${walletId}/repayment`,
      data
    ),

  lockEscrow: (
    walletId: string,
    data: {
      amount: number;
      escrow_id: string;
      milestone: string;
    }
  ) =>
    api.post(
      `/wallets/${walletId}/escrow-lock`,
      data
    ),

  releaseEscrow: (
    walletId: string,
    data: {
      amount: number;
      escrow_id: string;
      milestone: string;
    }
  ) =>
    api.post(
      `/wallets/${walletId}/escrow-release`,
      data
    ),

  health: () =>
    api.get("/wallets/health"),
};

export default walletApi;