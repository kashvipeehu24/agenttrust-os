import AlertCard from "./AlertCard";
import { useAlerts } from "../hooks/useAlerts";

export default function AlertList() {
  const { alerts } = useAlerts();

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
        />
      ))}
    </div>
  );
}