
import { Alert as AlertType } from "@/lib/data";
import { AlertTriangle, AlertCircle, HeartPulse, Droplet, Activity, Moon, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AlertBadgeProps {
  alert: AlertType;
  onMarkRead?: (id: string) => void;
}

const AlertBadge = ({ alert, onMarkRead }: AlertBadgeProps) => {
  const getIcon = () => {
    switch (alert.type) {
      case 'heart':
        return <HeartPulse className="h-4 w-4" />;
      case 'oxygen':
        return <Droplet className="h-4 w-4" />;
      case 'movement':
        return <Activity className="h-4 w-4" />;
      case 'sleep':
        return <Moon className="h-4 w-4" />;
      case 'prediction':
        return <Brain className="h-4 w-4" />;
    }
  };
  
  const getStatusIcon = () => {
    switch (alert.status) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-status-warning" />;
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-status-critical animate-pulse" />;
      default:
        return null;
    }
  };
  
  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className={`flex items-start justify-between p-3 rounded-md border ${
      alert.status === 'critical' ? 'bg-status-critical/10 border-status-critical' : 
      alert.status === 'warning' ? 'bg-status-warning/10 border-status-warning' : 
      'bg-card border-border'
    } ${alert.isRead ? 'opacity-70' : ''}`}>
      <div className="flex space-x-2 items-start">
        <div className="mt-1">
          {getStatusIcon()}
        </div>
        <div>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-semibold">
              {getIcon()} {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(alert.timestamp)}
            </span>
          </div>
          <p className="text-sm">{alert.message}</p>
          <span className="text-xs text-muted-foreground">
            Patient: {alert.patientId}
          </span>
        </div>
      </div>
      
      {!alert.isRead && onMarkRead && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs"
          onClick={() => onMarkRead(alert.id)}
        >
          Mark as read
        </Button>
      )}
    </div>
  );
};

export default AlertBadge;
