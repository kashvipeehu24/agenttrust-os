import { useEffect, useState } from "react";
import repaymentApi from "../api/repaymentApi";

import type {
  RepaymentSummary,
  RepaymentScheduleItem,
} from "../types/repayment";

export function useRepayment(walletId: string) {
  const [summary, setSummary] = useState<RepaymentSummary | null>(null);
  const [schedule, setSchedule] = useState<RepaymentScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRepayment = async () => {
    try {
      setLoading(true);

      const summaryResponse =
        await repaymentApi.getRepaymentSummary(walletId);

      const scheduleResponse =
        await repaymentApi.getRepaymentSchedule(walletId);

      setSummary(summaryResponse.data);
      setSchedule(scheduleResponse.data);
      setError("");
    } catch (err) {
      setError("Failed to load repayment data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletId) {
      fetchRepayment();
    }
  }, [walletId]);

  return {
    summary,
    schedule,
    loading,
    error,
    refreshRepayment: fetchRepayment,
  };
}