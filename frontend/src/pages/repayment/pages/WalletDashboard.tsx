import WalletCard from "../components/WalletCard";
import { useWallet } from "../hooks/useWallet";

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
    return (
      <div className="p-6 text-gray-600">
        Loading wallet...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-red-600">{error}</p>

        <button
          onClick={refreshWallet}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="p-6">
        Wallet not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <WalletCard wallet={wallet} />
    </div>
  );
}