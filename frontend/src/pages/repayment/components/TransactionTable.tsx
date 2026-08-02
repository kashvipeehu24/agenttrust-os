import type { WalletTransaction } from "../types/wallet";

interface TransactionTableProps {
  transactions: WalletTransaction[];
}

export default function TransactionTable({
  transactions,
}: TransactionTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold">Transaction History</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                ID
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Type
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Amount
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Status
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Description
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.transaction_id}
                className="border-t border-slate-200"
              >
                <td className="px-6 py-4">{tx.transaction_id}</td>

                <td className="px-6 py-4 capitalize">
                  {tx.type.replaceAll("_", " ")}
                </td>

                <td className="px-6 py-4">
                  ${Number(tx.amount).toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm">
                    {tx.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {tx.description}
                </td>

                <td className="px-6 py-4">
                  {new Date(tx.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {transactions.length === 0 && (
          <div className="p-6 text-center text-slate-500">
            No transactions available.
          </div>
        )}
      </div>
    </div>
  );
}