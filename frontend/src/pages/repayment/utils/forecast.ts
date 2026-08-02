export function calculateGrowth(
  current: number,
  previous: number
): number {
  if (previous === 0) return 0;

  return Number(
    (((current - previous) / previous) * 100).toFixed(2)
  );
}

export function getTrendDirection(
  growth: number
): "up" | "down" | "stable" {
  if (growth > 0) return "up";

  if (growth < 0) return "down";

  return "stable";
}