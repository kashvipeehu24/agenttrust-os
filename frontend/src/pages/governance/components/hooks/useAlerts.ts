import { useEffect, useState } from "react";
import { getAlerts } from "../services/alertApi";
import type { Alert } from "../types/alert";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    getAlerts().then(setAlerts);
  }, []);

  return { alerts };
}