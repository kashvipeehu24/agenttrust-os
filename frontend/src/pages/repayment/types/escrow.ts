export interface Escrow {
  escrowId: string;
  amount: number;
  milestone: string;
  status: string;
  releasePercentage: number;
}