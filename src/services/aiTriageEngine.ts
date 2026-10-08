import { GoogleGenAI } from '@google/genai';
import { Pet, TriageCase, UrgencyLevel, TriageDifferential } from '../types';

export interface TriageInput {
  pet: Pet;
  selectedSymptoms: string[];
  customComplaint: string;
  duration: string;
  painRating: number;
  breathingRate?: number;
  temperature?: number;
  gumColor?: 'Pink' | 'Pale White' | 'Brick Red' | 'Blue Cyanotic' | 'Yellow Jaundiced';
}

export async function runClinicalAITriage(input: TriageInput): Promise<TriageCase> {
  const { pet, selectedSymptoms, customComplaint, duration, painRating, breathingRate, temperature, gumColor } = input;

  // Check for critical emergency red flags
  const urgentKeywords = [
    'collapse', 'bloat', 'distended', 'toxic', 'chocolate', 'xylitol', 'lily', 'lilies',
    'pale', 'cyanotic', 'blue', 'paralysis', 'dragging', 'seizure', 'straining with zero urine',
    'labored breathing', 'open-mouth gasps', 'poison', 'rat poison', 'antifreeze'
  ];

  const fullComplaintText = (customComplaint + ' ' + selectedSymptoms.join(' ')).toLowerCase();
  const hasEmergencySymptom = selectedSymptoms.some(s => 
    ['lethargy', 'bloated_distended', 'inability_to_urinate', 'toxic_ingestion', 'breathing_effort', 'pale_gums', 'sudden_paralysis'].includes(s)
  );
  const matchesUrgentKeyword = urgentKeywords.some(kw => fullComplaintText.includes(kw));

  let urgencyScore = 2;
  let triageLevel: UrgencyLevel = 'Routine';
  let recommendedDisposition: 'Home Care Monitoring' | 'Schedule Vet Visit within 24-48h' | 'Immediate ER Vet Hospital Visit' = 'Home Care Monitoring';

  if (hasEmergencySymptom || matchesUrgentKeyword || painRating >= 7 || gumColor === 'Pale White' || gumColor === 'Blue Cyanotic' || (breathingRate && breathingRate > 45)) {
    urgencyScore = Math.max(8, Math.min(10, 7 + Math.floor(painRating / 3)));
    triageLevel = 'Urgent';
    recommendedDisposition = 'Immediate ER Vet Hospital Visit';
  } else if (painRating >= 4 || selectedSymptoms.length >= 2 || (breathingRate && breathingRate > 32) || duration.includes('days')) {
    urgencyScore = Math.max(5, Math.min(7, 4 + Math.floor(painRating / 3)));
    triageLevel = 'Caution';
    recommendedDisposition = 'Schedule Vet Visit within 24-48h';
  } else {
    urgencyScore = Math.min(4, Math.max(1, 1 + painRating));
    triageLevel = 'Routine';
    recommendedDisposition = 'Home Care Monitoring';
  }

  // Generate differentials based on species and symptoms
  const differentials: TriageDifferential[] = [];
  const actionPlan: string[] = [];
  const redFlags: string[] = [];

  // Feline specific urinary emergency
  if (pet.species === 'Cat' && (fullComplaintText.includes('urinate') || fullComplaintText.includes('straining') || selectedSymptoms.includes('inability_to_urinate'))) {
    urgencyScore = 10;
    triageLevel = 'Urgent';
    recommendedDisposition = 'Immediate ER Vet Hospital Visit';
    differentials.push({
      condition: 'Acute Urethral Obstruction ("Blocked Cat" FLUTD / Urolithiasis)',
      confidence: 94,
      severity: 'Urgent',
      description: 'Medical emergency in male cats. Post-renal azotemia and fatal hyperkalemic cardiac arrest can occur within 24-48 hours.',
      clinicalSignsMatched: ['Straining in litterbox', 'Vocalizing', 'Distended turgid urinary bladder']
    });
    actionPlan.push('Do NOT wait to see if urination resumes. Transport immediately to an open 24/7 emergency veterinary hospital.');
    actionPlan.push('Keep cat in a dark, quiet, well-ventilated carrier during transit.');
    redFlags.push('Vomiting, profound hypothermia, bradycardia, complete urinary obstruction.');
  }

  // GDV / Bloat
  else if (fullComplaintText.includes('bloat') || selectedSymptoms.includes('bloated_distended')) {
    urgencyScore = 10;
    triageLevel = 'Urgent';
    recommendedDisposition = 'Immediate ER Vet Hospital Visit';
    differentials.push({
      condition: 'Gastric Dilatation-Volvulus (GDV / Bloat)',
      confidence: 91,
      severity: 'Urgent',
      description: 'Acute rotational twisting of stomach resulting in vascular compromise and hypovolemic shock.',
      clinicalSignsMatched: ['Distended tympanic abdomen', 'Non-productive retching', 'Restlessness']
    });
    actionPlan.push('Zero oral intake (no water or food).');
    actionPlan.push('Proceed immediately to nearest surgical emergency facility; call ahead so surgical suite is pre-alerted.');
    redFlags.push('Weak femoral pulse, pale capillary refill time > 3 seconds, non-productive retching.');
  }

  // Toxin ingestion
  else if (fullComplaintText.includes('chocolate') || fullComplaintText.includes('toxic') || selectedSymptoms.includes('toxic_ingestion') || fullComplaintText.includes('lily')) {
    urgencyScore = 9;
    triageLevel = 'Urgent';
    recommendedDisposition = 'Immediate ER Vet Hospital Visit';
    differentials.push({
      condition: 'Acute Toxicosis (Theobromine / Lily / Rodenticide)',
      confidence: 90,
      severity: 'Urgent',
      description: 'Exogenous chemical or botanic toxin absorption leading to renal, cardiac, or hepatic decompensation.',
      clinicalSignsMatched: ['Known toxin access', 'Acute onset']
    });
    actionPlan.push('Bring the exact packaging or photo of the ingested substance to the ER.');
    actionPlan.push('Do NOT induce vomiting with hydrogen peroxide at home without explicit toxicology veterinarian clearance.');
    redFlags.push('Tremors, tachycardia, acute seizures, hematemesis.');
  }

  // Spinal / IVDD or orthopedic
  else if (pet.breed.toLowerCase().includes('bulldog') || pet.breed.toLowerCase().includes('dachshund') || selectedSymptoms.includes('sudden_paralysis') || fullComplaintText.includes('limp') || fullComplaintText.includes('spine') || fullComplaintText.includes('back')) {
    const isSpinalEmergency = selectedSymptoms.includes('sudden_paralysis') || painRating >= 7;
    differentials.push({
      condition: isSpinalEmergency ? 'Acute Hansen Type I IVDD with Neurologic Deficit' : 'Thoracolumbar Disc Sensitization / Paraspinal Spasm',
      confidence: 85,
      severity: isSpinalEmergency ? 'Urgent' : 'Caution',
      description: 'Intervertebral disk extrusion compressing the spinal cord, highly prevalent in chondrodystrophic breeds.',
      clinicalSignsMatched: ['Arched back / guarded spine', 'Reluctance to climb stairs', 'Hindquarter ataxia']
    });
    actionPlan.push('Enforce 100% strict confinement: crate or small penned room. Do not allow stair climbing or jumping.');
    actionPlan.push('Support abdomen and pelvis when carrying outdoors for brief bathroom breaks.');
    redFlags.push('Loss of toe pinch sensation (loss of deep pain is surgical emergency requiring <24h decompression).', 'Dragging back toes on ground.');
  }

  // Ear infection / Allergy / Pruritus
  else if (selectedSymptoms.includes('ear_scratching') || fullComplaintText.includes('ear') || fullComplaintText.includes('itch')) {
    differentials.push({
      condition: 'Otitis Externa (Bacterial / Malassezia Yeast Otitis)',
      confidence: 89,
      severity: 'Routine',
      description: 'Erythema and exudative cerumen accumulation in external auditory canal secondary to moisture or allergies.',
      clinicalSignsMatched: ['Head shaking', 'Pruritus of pinna', 'Ceruminous odor']
    });
    actionPlan.push('Do NOT use cotton swabs/Q-tips inside the canal.');
    actionPlan.push('Prevent scratching with an e-collar if skin breakdown or aural hematoma risk is high.');
    actionPlan.push('Schedule routine exam for cytology and targeted topical otic preparation.');
    redFlags.push('Head tilt, involuntary eye flickers (nystagmus), loss of equilibrium (signs of otitis interna).');
  }

  // Default fallback differentials
  else {
    differentials.push({
      condition: 'Acute Mild Gastroenteritis / Dietary Indiscretion',
      confidence: 76,
      severity: triageLevel,
      description: 'Transient irritation of gastric mucosal lining common after dietary indiscretion or mild stress.',
      clinicalSignsMatched: selectedSymptoms.map(s => s.replace('_', ' '))
    });
    differentials.push({
      condition: 'Non-Specific Stress or Environmental Reactive Syndrome',
      confidence: 42,
      severity: 'Routine',
      description: 'Mild behavioral or physiological response to recent routine disruptions.',
      clinicalSignsMatched: ['Transient lethargy']
    });
    actionPlan.push('Offer small amounts of fresh water to verify hydration retention.');
    actionPlan.push('Monitor resting respiratory rate during sleep (should stay under 30 breaths/min).');
    actionPlan.push('Keep a written log of food intake and stool consistency.');
    redFlags.push('Repetitive intractable vomiting > 3 episodes in 6 hours', 'Bloody or black tarry stools', 'Profound weakness or inability to stand');
  }

  return {
    id: `case-${Date.now().toString().slice(-4)}`,
    petId: pet.id,
    petName: pet.name,
    timestamp: 'Just now',
    urgencyScore,
    triageLevel,
    primaryComplaint: customComplaint || selectedSymptoms.map(s => s.replace('_', ' ')).join(', '),
    symptomsReported: selectedSymptoms.length > 0 ? selectedSymptoms.map(s => s.replace('_', ' ')) : [customComplaint],
    duration: duration || 'Under 12 hours',
    vitalsAtTriage: {
      restingRespiratoryRate: breathingRate || pet.vitals.restingRespiratoryRate,
      temperatureF: temperature || pet.vitals.temperatureF,
      painIndex: painRating,
      heartRateBpm: pet.vitals.heartRateBpm,
      hydrationScore: (gumColor === 'Pale White' ? 'Mild Dehydration' : 'Normal')
    },
    differentials,
    immediateActionPlan: actionPlan,
    redFlagWarnings: redFlags,
    recommendedDisposition,
    reviewedBy: 'Clinical Vitality AI Triage Matrix v4.2',
    status: urgencyScore >= 8 ? 'Dispatched to ER' : 'Active Review'
  };
}
