import axios from "axios";
import { useCallback, useEffect, useState } from "react";
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

  const fetchRepayment = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);

      const summaryResponse =
        await repaymentApi.getRepaymentSummary(walletId, { signal });

      const scheduleResponse =
        await repaymentApi.getRepaymentSchedule(walletId, { signal });

      setSummary(summaryResponse.data);
      setSchedule(scheduleResponse.data);
      setError("");
    } catch (err) {
      if (!axios.isCancel(err) && !signal?.aborted) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load repayment data.");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [walletId]);

  useEffect(() => {
    if (!walletId) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    fetchRepayment(controller.signal);
    return () => controller.abort();
  }, [walletId, fetchRepayment]);

  return {
    summary,
    schedule,
    loading,
    error,
    refreshRepayment: () => fetchRepayment(),
  };
}
