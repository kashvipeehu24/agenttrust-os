import { useEffect, useState } from "react";
import { getAlerts } from "../services/alertApi";
import type { Alert } from "../types/alert";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        setLoading(true);

        const data = await getAlerts();

        setAlerts(data);
      } catch (err) {
        setError("Failed to load alerts.");

        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
  }, []);

  return {
    alerts,
    loading,
    error,
  };
}