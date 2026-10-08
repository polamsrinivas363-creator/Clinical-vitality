export type UrgencyLevel = 'Routine' | 'Caution' | 'Urgent';

export interface VitalsSnapshot {
  restingRespiratoryRate: number; // breaths per min (Normal dog: 15-30, cat: 20-30)
  temperatureF: number; // Normal: 100.5 - 102.5 F
  hydrationScore: 'Normal' | 'Mild Dehydration' | 'Severe Dehydration';
  painIndex: number; // 0 to 10 scale (Glasgow pain scale adaptation)
  heartRateBpm: number; // Normal dog: 60-140, cat: 140-220
  activityScore: number; // 0 to 100%
  timestamp: string;
}

export interface WeightRecord {
  date: string;
  weightLbs: number;
}

export interface Pet {
  id: string;
  name: string;
  species: 'Dog' | 'Cat';
  breed: string;
  age: string;
  sex: 'Male Neutered' | 'Female Spayed' | 'Male Intact' | 'Female Intact';
  weightLbs: number;
  avatarUrl: string;
  microchipId: string;
  status: UrgencyLevel;
  primaryVeterinarian: string;
  clinicName: string;
  allergies: string[];
  chronicConditions: string[];
  vitals: VitalsSnapshot;
  weightHistory: WeightRecord[];
}

export interface TriageDifferential {
  condition: string;
  confidence: number; // 0 - 100%
  severity: UrgencyLevel;
  description: string;
  clinicalSignsMatched: string[];
}

export interface TriageCase {
  id: string;
  petId: string;
  petName: string;
  timestamp: string;
  urgencyScore: number; // 1 to 10 (10 = critical emergency)
  triageLevel: UrgencyLevel;
  primaryComplaint: string;
  symptomsReported: string[];
  duration: string;
  vitalsAtTriage: Partial<VitalsSnapshot>;
  differentials: TriageDifferential[];
  immediateActionPlan: string[];
  redFlagWarnings: string[];
  recommendedDisposition: 'Home Care Monitoring' | 'Schedule Vet Visit within 24-48h' | 'Immediate ER Vet Hospital Visit';
  vetNotes?: string;
  reviewedBy?: string;
  status: 'Active Review' | 'Resolved' | 'Dispatched to ER';
}

export interface Medication {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  frequency: string;
  indication: string;
  prescribingVet: string;
  nextDoseTime: string;
  remainingDoses: number;
  totalDoses: number;
  instructions: string;
  contraindications: string;
  administeredToday: boolean;
  history: {
    time: string;
    status: 'Taken' | 'Missed' | 'Skipped';
  }[];
}

export interface DiagnosticLabResult {
  parameter: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'low' | 'high' | 'critical';
}

export interface DiagnosticRecord {
  id: string;
  petId: string;
  title: string;
  category: 'Hematology & Chem' | 'Radiology' | 'Urinalysis' | 'Cytology';
  date: string;
  vetPractitioner: string;
  summary: string;
  abnormalFlagsCount: number;
  results: DiagnosticLabResult[];
}

export interface EmergencyClinic {
  id: string;
  name: string;
  address: string;
  distanceMiles: number;
  driveTimeMin: number;
  phone: string;
  open24Hours: boolean;
  traumaLevel: 'Level 1 Critical Care' | 'Level 2 Emergency' | 'Urgent Care Center';
  rating: number;
  reviewCount: number;
  erEquipped: boolean;
  availableStaff: string;
}

export interface TeleConsultMessage {
  id: string;
  sender: 'user' | 'vet' | 'system';
  text: string;
  timestamp: string;
  mediaUrl?: string;
}
