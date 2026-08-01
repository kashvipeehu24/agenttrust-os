import { useEffect, useState } from "react";
import { getMonitoringEvents } from "../services/monitoringApi";
import type { MonitoringEvent } from "../types/monitoring";

export function useMonitoring() {
  const [events, setEvents] = useState<MonitoringEvent[]>([]);

  useEffect(() => {
    getMonitoringEvents().then(setEvents);
  }, []);

  return { events };
}