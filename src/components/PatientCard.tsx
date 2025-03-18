
import { useState } from "react";
import { Link } from "react-router-dom";
import { Patient } from "@/lib/data";
import { AlertTriangle, AlertCircle, MoreHorizontal } from "lucide-react";
import VitalSign from "./VitalSign";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PatientCardProps {
  patient: Patient;
  compact?: boolean;
}

const PatientCard = ({ patient, compact = false }: PatientCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  // Determine overall status based on vitals
  const getPatientStatus = () => {
    if (
      patient.vitals.heartRate.status === 'critical' || 
      patient.vitals.oxygenLevel.status === 'critical' ||
      patient.vitals.movement.status === 'critical' ||
      patient.vitals.sleep.status === 'critical'
    ) {
      return 'critical';
    } else if (
      patient.vitals.heartRate.status === 'warning' || 
      patient.vitals.oxygenLevel.status === 'warning' ||
      patient.vitals.movement.status === 'warning' ||
      patient.vitals.sleep.status === 'warning'
    ) {
      return 'warning';
    }
    return 'normal';
  };
  
  const status = getPatientStatus();
  const unreadAlerts = patient.alerts.filter(a => !a.isRead).length;
  
  return (
    <div className={`patient-card status-${status} ${compact ? 'w-full' : 'w-full md:w-96'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={patient.photo} alt={patient.name} />
            <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <h3 className="font-semibold">
              {patient.name}
              {status === 'critical' && (
                <AlertCircle className="inline ml-1 h-4 w-4 text-status-critical" />
              )}
              {status === 'warning' && (
                <AlertTriangle className="inline ml-1 h-4 w-4 text-status-warning" />
              )}
            </h3>
            <div className="flex items-center text-xs text-muted-foreground space-x-2">
              <span>Room {patient.room}</span>
              <span>•</span>
              <span>{patient.age} years</span>
              {unreadAlerts > 0 && (
                <>
                  <span>•</span>
                  <span className="text-status-critical font-medium">{unreadAlerts} alert{unreadAlerts !== 1 ? 's' : ''}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link to={`/patient/${patient.id}`} className="w-full">View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Add Note</DropdownMenuItem>
            <DropdownMenuItem>Contact Family</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {(expanded || !compact) && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <VitalSign type="heart" vital={patient.vitals.heartRate} />
          <VitalSign type="oxygen" vital={patient.vitals.oxygenLevel} />
          <VitalSign type="movement" vital={patient.vitals.movement} />
          <VitalSign type="sleep" vital={patient.vitals.sleep} />
        </div>
      )}
      
      {compact && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-2 text-xs"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'Show Vitals'}
        </Button>
      )}
      
      {!compact && (
        <div className="mt-4">
          <Link to={`/patient/${patient.id}`}>
            <Button size="sm" className="w-full">View Details</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PatientCard;
