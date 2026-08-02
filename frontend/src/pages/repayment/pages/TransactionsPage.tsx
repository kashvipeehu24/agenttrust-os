import TransactionTable from "../components/TransactionTable";
import { useTransactions } from "../hooks/useTransactions";

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
    return (
      <div className="p-6">
        Loading transactions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-red-600">{error}</p>

        <button
          onClick={refreshTransactions}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <TransactionTable transactions={transactions} />
    </div>
  );
}