import { useEffect, useState } from "react";
import { getMonitoringEvents } from "../services/monitoringApi";
import type { MonitoringEvent } from "../types/monitoring";

export function useMonitoring() {
  const [events, setEvents] = useState<MonitoringEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMonitoringEvents() {
      try {
        setLoading(true);

        const data = await getMonitoringEvents();

        setEvents(data);
      } catch (err) {
        setError("Failed to load monitoring events.");

        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMonitoringEvents();
  }, []);

  return {
    events,
    loading,
    error,
  };
}