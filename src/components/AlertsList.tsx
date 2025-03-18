
import { Alert } from "@/lib/data";
import AlertBadge from "./AlertBadge";

interface AlertsListProps {
  alerts: Alert[];
  onMarkRead?: (id: string) => void;
  emptyMessage?: string;
}

const AlertsList = ({ alerts, onMarkRead, emptyMessage = "No alerts at this time" }: AlertsListProps) => {
  // Sort alerts by status (critical first) and then by timestamp (newest first)
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (a.status === 'critical' && b.status !== 'critical') return -1;
    if (a.status !== 'critical' && b.status === 'critical') return 1;
    if (a.status === 'warning' && b.status === 'normal') return -1;
    if (a.status === 'normal' && b.status === 'warning') return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
  
  if (sortedAlerts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {sortedAlerts.map(alert => (
        <AlertBadge 
          key={alert.id} 
          alert={alert} 
          onMarkRead={onMarkRead}
        />
      ))}
    </div>
  );
};

export default AlertsList;
