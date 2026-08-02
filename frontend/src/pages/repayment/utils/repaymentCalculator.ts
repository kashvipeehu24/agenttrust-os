export function calculateRepaymentRate(
  amountPaid: number,
  totalLoan: number
): number {
  if (totalLoan <= 0) return 0;

  return Number(
    ((amountPaid / totalLoan) * 100).toFixed(2)
  );
}

export function calculateRemainingAmount(
  totalLoan: number,
  amountPaid: number
): number {
  return Math.max(totalLoan - amountPaid, 0);
}

export function calculateInterest(
  principal: number,
  interestRate: number
): number {
  return Number(
    ((principal * interestRate) / 100).toFixed(2)
  );
}