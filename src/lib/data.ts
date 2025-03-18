
import { User } from './auth';

export interface VitalSign {
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  timestamp: Date;
}

export interface PatientVitals {
  heartRate: VitalSign;
  oxygenLevel: VitalSign;
  movement: VitalSign;
  sleep: VitalSign;
}

export interface Alert {
  id: string;
  patientId: string;
  type: 'heart' | 'oxygen' | 'movement' | 'sleep' | 'prediction';
  message: string;
  status: 'normal' | 'warning' | 'critical';
  timestamp: Date;
  isRead: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  room: string;
  photo: string;
  vitals: PatientVitals;
  alerts: Alert[];
  familyMembers: string[]; // User IDs of family members
}

// Mock patient data
export const patients: Patient[] = [
  {
    id: '1',
    name: 'Eleanor Johnson',
    age: 82,
    room: '101A',
    photo: 'https://randomuser.me/api/portraits/women/54.jpg',
    vitals: {
      heartRate: { value: 74, unit: 'bpm', status: 'normal', timestamp: new Date() },
      oxygenLevel: { value: 97, unit: '%', status: 'normal', timestamp: new Date() },
      movement: { value: 3, unit: 'activity/hr', status: 'normal', timestamp: new Date() },
      sleep: { value: 7.2, unit: 'hrs', status: 'normal', timestamp: new Date() }
    },
    alerts: [],
    familyMembers: ['2']
  },
  {
    id: '2',
    name: 'Richard Thompson',
    age: 78,
    room: '102B',
    photo: 'https://randomuser.me/api/portraits/men/92.jpg',
    vitals: {
      heartRate: { value: 92, unit: 'bpm', status: 'warning', timestamp: new Date() },
      oxygenLevel: { value: 94, unit: '%', status: 'warning', timestamp: new Date() },
      movement: { value: 1, unit: 'activity/hr', status: 'warning', timestamp: new Date() },
      sleep: { value: 5.6, unit: 'hrs', status: 'normal', timestamp: new Date() }
    },
    alerts: [
      {
        id: 'a1',
        patientId: '2',
        type: 'heart',
        message: 'Elevated heart rate detected',
        status: 'warning',
        timestamp: new Date(),
        isRead: false
      },
      {
        id: 'a2',
        patientId: '2',
        type: 'oxygen',
        message: 'Oxygen levels slightly below normal',
        status: 'warning',
        timestamp: new Date(),
        isRead: false
      }
    ],
    familyMembers: []
  },
  {
    id: '3',
    name: 'Mary Williams',
    age: 85,
    room: '105C',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    vitals: {
      heartRate: { value: 110, unit: 'bpm', status: 'critical', timestamp: new Date() },
      oxygenLevel: { value: 88, unit: '%', status: 'critical', timestamp: new Date() },
      movement: { value: 0.5, unit: 'activity/hr', status: 'warning', timestamp: new Date() },
      sleep: { value: 4.2, unit: 'hrs', status: 'warning', timestamp: new Date() }
    },
    alerts: [
      {
        id: 'a3',
        patientId: '3',
        type: 'heart',
        message: 'Heart rate critically elevated',
        status: 'critical',
        timestamp: new Date(),
        isRead: false
      },
      {
        id: 'a4',
        patientId: '3',
        type: 'oxygen',
        message: 'Critical oxygen levels detected',
        status: 'critical',
        timestamp: new Date(),
        isRead: false
      },
      {
        id: 'a5',
        patientId: '3',
        type: 'prediction',
        message: 'Risk of dehydration detected',
        status: 'warning',
        timestamp: new Date(),
        isRead: false
      }
    ],
    familyMembers: []
  },
  {
    id: '4',
    name: 'James Davis',
    age: 75,
    room: '110A',
    photo: 'https://randomuser.me/api/portraits/men/52.jpg',
    vitals: {
      heartRate: { value: 68, unit: 'bpm', status: 'normal', timestamp: new Date() },
      oxygenLevel: { value: 96, unit: '%', status: 'normal', timestamp: new Date() },
      movement: { value: 2.5, unit: 'activity/hr', status: 'normal', timestamp: new Date() },
      sleep: { value: 6.8, unit: 'hrs', status: 'normal', timestamp: new Date() }
    },
    alerts: [],
    familyMembers: []
  }
];

// Generate historical data for a patient
export const getPatientHistory = (patientId: string, days: number = 7) => {
  const patient = patients.find(p => p.id === patientId);
  if (!patient) return null;
  
  const history = {
    heartRate: [] as { date: string; value: number }[],
    oxygenLevel: [] as { date: string; value: number }[],
    movement: [] as { date: string; value: number }[],
    sleep: [] as { date: string; value: number }[]
  };
  
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate some random variations based on current values
    const heartRateVariation = Math.floor(Math.random() * 10) - 5;
    const oxygenVariation = Math.floor(Math.random() * 4) - 2;
    const movementVariation = (Math.random() * 1.5) - 0.75;
    const sleepVariation = (Math.random() * 1.5) - 0.75;
    
    history.heartRate.push({ 
      date: dateStr, 
      value: Math.max(60, Math.min(120, patient.vitals.heartRate.value + heartRateVariation)) 
    });
    
    history.oxygenLevel.push({ 
      date: dateStr, 
      value: Math.max(85, Math.min(100, patient.vitals.oxygenLevel.value + oxygenVariation)) 
    });
    
    history.movement.push({ 
      date: dateStr, 
      value: Math.max(0, Math.min(5, patient.vitals.movement.value + movementVariation)) 
    });
    
    history.sleep.push({ 
      date: dateStr, 
      value: Math.max(0, Math.min(10, patient.vitals.sleep.value + sleepVariation)) 
    });
  }
  
  return history;
};

// Get all alerts for a user based on role
export const getAlertsForUser = (user: User): Alert[] => {
  if (user.role === 'family') {
    // Family members only see alerts for their relatives
    const familyPatients = patients.filter(p => p.familyMembers.includes(user.id));
    return familyPatients.flatMap(p => p.alerts);
  } else {
    // Caregivers and nurses see all alerts
    return patients.flatMap(p => p.alerts);
  }
};

// Get patients for a user based on role
export const getPatientsForUser = (user: User): Patient[] => {
  if (user.role === 'family') {
    // Family members only see their relatives
    return patients.filter(p => p.familyMembers.includes(user.id));
  } else {
    // Caregivers and nurses see all patients
    return patients;
  }
};
