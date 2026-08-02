import TransactionTable from "../components/TransactionTable";
import { useTransactions } from "../hooks/useTransactions";
import { LoadingSkeleton, ErrorState } from "../../../components/common/FeedbackStates";

export default function TransactionsPage() {
  // Replace with the logged-in wallet ID later
  const walletId = "wallet_demo_1";

  const {
    transactions,
    loading,
    error,
    refreshTransactions,
  } = useTransactions(walletId);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        details="Axios client failed to fetch /wallets/{walletId}/transactions"
        onRetry={refreshTransactions}
      />
    );
  }

  return (
    <div className="space-y-6">
      <TransactionTable transactions={transactions} />
    </div>
  );
}