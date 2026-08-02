import WalletCard from "../components/WalletCard";
import { useWallet } from "../hooks/useWallet";
import { LoadingSkeleton, ErrorState, EmptyState } from "../../../components/common/FeedbackStates";

export default function WalletDashboard() {
  // Replace with the actual wallet ID after login/integration
  const walletId = "wallet_demo_1";

  const {
    wallet,
    loading,
    error,
    refreshWallet,
  } = useWallet(walletId);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        details="Axios client failed to fetch /wallets/{walletId}/summary"
        onRetry={refreshWallet}
      />
    );
  }

  if (!wallet) {
    return <EmptyState title="No Wallet Found" description="The requested wallet does not exist or has not been initialized." />;
  }

  return (
    <div className="space-y-6">
      <WalletCard wallet={wallet} />
    </div>
  );
}