type CreditCardProps = {
  creditLimit: number;
  dynamicCreditLimit: number;
};

export default function CreditCard({
  creditLimit,
  dynamicCreditLimit,
}: CreditCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700">
        Credit Limit
      </h2>

      <div className="mt-4">
        <p className="text-sm text-gray-500">
          Base Credit Limit
        </p>

        <p className="text-3xl font-bold text-blue-600">
          ₹{creditLimit.toLocaleString()}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-sm text-gray-500">
          Dynamic Credit Limit
        </p>

        <p className="text-2xl font-semibold text-green-600">
          ₹{dynamicCreditLimit.toLocaleString()}
        </p>
      </div>
    </div>
  );
}