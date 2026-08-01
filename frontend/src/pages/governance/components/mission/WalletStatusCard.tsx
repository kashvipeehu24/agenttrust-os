import React from "react";

const WalletStatusCard: React.FC = () => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Wallet Status</h3>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Verified Wallets</span>
          <span className="font-medium text-green-600">18</span>
        </div>

        <div className="flex justify-between">
          <span>Pending Verification</span>
          <span className="font-medium text-yellow-600">3</span>
        </div>

        <div className="flex justify-between">
          <span>Blocked Wallets</span>
          <span className="font-medium text-red-600">1</span>
        </div>
      </div>
    </div>
  );
};

export default WalletStatusCard;