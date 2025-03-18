
import { Alert } from "@/lib/data";
import AlertBadge from "./AlertBadge";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Loader2 } from "lucide-react";

interface AlertsListProps {
  alerts: Alert[];
  onMarkRead?: (id: string) => void;
  emptyMessage?: string;
  showAIPrioritization?: boolean;
}

const AlertsList = ({ 
  alerts, 
  onMarkRead, 
  emptyMessage = "No alerts at this time",
  showAIPrioritization = false 
}: AlertsListProps) => {
  const [aiProcessing, setAiProcessing] = useState(false);
  const [prioritizedAlerts, setPrioritizedAlerts] = useState<Alert[]>([]);
  const [showOriginalOrder, setShowOriginalOrder] = useState(false);
  
  // Sort alerts by status (critical first) and then by timestamp (newest first)
  const standardSortedAlerts = [...alerts].sort((a, b) => {
    if (a.status === 'critical' && b.status !== 'critical') return -1;
    if (a.status !== 'critical' && b.status === 'critical') return 1;
    if (a.status === 'warning' && b.status === 'normal') return -1;
    if (a.status === 'normal' && b.status === 'warning') return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
  
  // AI prioritization logic (simulated)
  useEffect(() => {
    if (showAIPrioritization && alerts.length > 0) {
      setAiProcessing(true);
      
      // Simulate AI processing time
      const timer = setTimeout(() => {
        // Advanced AI prioritization (this would be replaced with actual AI logic)
        const aiSorted = [...alerts].sort((a, b) => {
          // Priority score calculation (simulated AI logic)
          const getAiPriorityScore = (alert: Alert): number => {
            let score = 0;
            
            // Base score from status
            if (alert.status === 'critical') score += 100;
            else if (alert.status === 'warning') score += 50;
            
            // Add scores based on type of alert (heart and oxygen are higher priority)
            if (alert.type === 'heart') score += 25;
            if (alert.type === 'oxygen') score += 20;
            if (alert.type === 'movement') score += 15;
            if (alert.type === 'sleep') score += 10;
            
            // Prediction alerts get weighted by content
            if (alert.type === 'prediction') {
              if (alert.message.includes('dehydration')) score += 30;
              if (alert.message.includes('fall')) score += 40;
              if (alert.message.includes('infection')) score += 35;
            }
            
            // Unread alerts get priority
            if (!alert.isRead) score += 15;
            
            // Apply time decay factor (newer alerts get higher priority)
            const hoursOld = (new Date().getTime() - new Date(alert.timestamp).getTime()) / (1000 * 60 * 60);
            score -= Math.min(hoursOld * 2, 20); // Max 20 point reduction for old alerts
            
            return score;
          };
          
          return getAiPriorityScore(b) - getAiPriorityScore(a);
        });
        
        setPrioritizedAlerts(aiSorted);
        setAiProcessing(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      setPrioritizedAlerts(standardSortedAlerts);
    }
  }, [alerts, showAIPrioritization]);
  
  // Determine which alert set to use
  const sortedAlerts = showAIPrioritization && !showOriginalOrder 
    ? prioritizedAlerts 
    : standardSortedAlerts;
  
  if (sortedAlerts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <div>
      {showAIPrioritization && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="px-3 py-1 bg-primary/10">
              <Brain className="h-3.5 w-3.5 mr-1 text-primary" />
              AI-Prioritized Alerts
            </Badge>
            {aiProcessing && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" /> 
                Processing alerts...
              </div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowOriginalOrder(!showOriginalOrder)}
            className="text-xs"
          >
            {showOriginalOrder ? "Show AI Prioritization" : "Show Standard Order"}
          </Button>
        </div>
      )}
      <div className="space-y-3">
        {sortedAlerts.map(alert => (
          <AlertBadge 
            key={alert.id} 
            alert={alert} 
            onMarkRead={onMarkRead}
          />
        ))}
      </div>
    </div>
  );
};

export default AlertsList;
