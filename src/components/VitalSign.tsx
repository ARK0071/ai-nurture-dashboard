
import { HeartPulse, Droplet, Activity, Moon } from "lucide-react";
import { VitalSign as VitalSignType } from "@/lib/data";

interface VitalSignProps {
  type: 'heart' | 'oxygen' | 'movement' | 'sleep';
  vital: VitalSignType;
  size?: 'sm' | 'md' | 'lg';
}

const VitalSign = ({ type, vital, size = 'md' }: VitalSignProps) => {
  const getIcon = () => {
    switch (type) {
      case 'heart':
        return <HeartPulse className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />;
      case 'oxygen':
        return <Droplet className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />;
      case 'movement':
        return <Activity className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />;
      case 'sleep':
        return <Moon className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />;
    }
  };
  
  const getLabel = () => {
    switch (type) {
      case 'heart':
        return 'Heart Rate';
      case 'oxygen':
        return 'Oxygen';
      case 'movement':
        return 'Movement';
      case 'sleep':
        return 'Sleep';
    }
  };
  
  return (
    <div className={`vital-badge ${vital.status} ${size === 'lg' ? 'text-base px-3 py-2' : ''}`}>
      {getIcon()}
      {size === 'sm' ? (
        <span>{vital.value}{vital.unit}</span>
      ) : (
        <div className="flex flex-col items-start">
          <span className="text-xs font-normal">{getLabel()}</span>
          <span className={size === 'lg' ? 'text-lg font-bold' : ''}>{vital.value} {vital.unit}</span>
        </div>
      )}
    </div>
  );
};

export default VitalSign;
