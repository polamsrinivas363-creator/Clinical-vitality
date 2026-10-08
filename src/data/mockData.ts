import { Pet, TriageCase, Medication, DiagnosticRecord, EmergencyClinic } from '../types';

export const INITIAL_PETS: Pet[] = [
  {
    id: 'pet-1',
    name: 'Luna',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: '4 yrs 2 mos',
    sex: 'Female Spayed',
    weightLbs: 64.5,
    avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    microchipId: '985141002938471',
    status: 'Routine',
    primaryVeterinarian: 'Dr. Sarah Chen, DVM, MRCVS',
    clinicName: 'St. Jude Veterinary Specialty Hospital',
    allergies: ['Beef protein (mild dermatitis)', 'Amoxicillin hypersensitivity'],
    chronicConditions: ['Seasonal Canine Atopic Dermatitis'],
    vitals: {
      restingRespiratoryRate: 22, // breaths/min (15-30 normal)
      temperatureF: 101.4, // 100.5 - 102.5 normal
      hydrationScore: 'Normal',
      painIndex: 1, // 0-10
      heartRateBpm: 78,
      activityScore: 92,
      timestamp: '12 mins ago'
    },
    weightHistory: [
      { date: 'May', weightLbs: 63.8 },
      { date: 'Jun', weightLbs: 64.0 },
      { date: 'Jul', weightLbs: 64.2 },
      { date: 'Aug', weightLbs: 64.8 },
      { date: 'Sep', weightLbs: 64.6 },
      { date: 'Oct', weightLbs: 64.5 }
    ]
  },
  {
    id: 'pet-2',
    name: 'Barnaby',
    species: 'Dog',
    breed: 'French Bulldog',
    age: '3 yrs 8 mos',
    sex: 'Male Neutered',
    weightLbs: 27.2,
    avatarUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    microchipId: '985141004819203',
    status: 'Caution',
    primaryVeterinarian: 'Dr. Marcus Vance, DACVECC',
    clinicName: 'Metropolitan Veterinary Trauma & ER',
    allergies: ['Chicken meal', 'Flea saliva hypersensitivity'],
    chronicConditions: ['Brachycephalic Airway Syndrome (Mild)', 'Intervertebral Disc Disease (Stage I - Lumbar)'],
    vitals: {
      restingRespiratoryRate: 34, // Elevated (mild stertor)
      temperatureF: 102.1,
      hydrationScore: 'Normal',
      painIndex: 3, // Lumbar sensitivity
      heartRateBpm: 110,
      activityScore: 68,
      timestamp: '28 mins ago'
    },
    weightHistory: [
      { date: 'May', weightLbs: 28.5 },
      { date: 'Jun', weightLbs: 28.0 },
      { date: 'Jul', weightLbs: 27.8 },
      { date: 'Aug', weightLbs: 27.5 },
      { date: 'Sep', weightLbs: 27.3 },
      { date: 'Oct', weightLbs: 27.2 }
    ]
  },
  {
    id: 'pet-3',
    name: 'Milo',
    species: 'Cat',
    breed: 'Domestic Shorthair Tabby',
    age: '5 yrs 1 mo',
    sex: 'Male Neutered',
    weightLbs: 11.4,
    avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    microchipId: '985141007361842',
    status: 'Routine',
    primaryVeterinarian: 'Dr. Elena Rostova, DVM, DABVP (Feline)',
    clinicName: 'Bay Area Feline Medicine Center',
    allergies: ['None known'],
    chronicConditions: ['Feline Lower Urinary Tract Disease (FLUTD - In Remission)'],
    vitals: {
      restingRespiratoryRate: 24, // breaths/min
      temperatureF: 101.2,
      hydrationScore: 'Normal',
      painIndex: 0,
      heartRateBpm: 165,
      activityScore: 84,
      timestamp: '45 mins ago'
    },
    weightHistory: [
      { date: 'May', weightLbs: 11.8 },
      { date: 'Jun', weightLbs: 11.6 },
      { date: 'Jul', weightLbs: 11.5 },
      { date: 'Aug', weightLbs: 11.4 },
      { date: 'Sep', weightLbs: 11.5 },
      { date: 'Oct', weightLbs: 11.4 }
    ]
  },
  {
    id: 'pet-4',
    name: 'Cleo',
    species: 'Cat',
    breed: 'Siamese Cross',
    age: '2 yrs 4 mos',
    sex: 'Female Spayed',
    weightLbs: 8.9,
    avatarUrl: 'https://images.unsplash.com/photo-1513360309081-36f20ca480d0?auto=format&fit=crop&w=600&q=80',
    microchipId: '985141008891024',
    status: 'Routine',
    primaryVeterinarian: 'Dr. Elena Rostova, DVM',
    clinicName: 'Bay Area Feline Medicine Center',
    allergies: ['Corn fillers'],
    chronicConditions: [],
    vitals: {
      restingRespiratoryRate: 22,
      temperatureF: 100.9,
      hydrationScore: 'Normal',
      painIndex: 0,
      heartRateBpm: 155,
      activityScore: 95,
      timestamp: '1 hour ago'
    },
    weightHistory: [
      { date: 'May', weightLbs: 8.5 },
      { date: 'Jun', weightLbs: 8.6 },
      { date: 'Jul', weightLbs: 8.7 },
      { date: 'Aug', weightLbs: 8.8 },
      { date: 'Sep', weightLbs: 8.8 },
      { date: 'Oct', weightLbs: 8.9 }
    ]
  }
];

export const INITIAL_TRIAGE_CASES: TriageCase[] = [
  {
    id: 'case-892',
    petId: 'pet-2',
    petName: 'Barnaby',
    timestamp: 'Today, 08:42 AM',
    urgencyScore: 6,
    triageLevel: 'Caution',
    primaryComplaint: 'Reluctance to jump onto couch, guarded posture, mild tachypnea after morning walk',
    symptomsReported: ['Guarded lumbar spine', 'Panting at rest', 'Stiff gait in hindquarters', 'Reluctant to sit'],
    duration: '6 hours',
    vitalsAtTriage: {
      restingRespiratoryRate: 34,
      temperatureF: 102.1,
      painIndex: 3,
      heartRateBpm: 110
    },
    differentials: [
      {
        condition: 'IVDD Acute Flare (Hansen Type I Lumbar)',
        confidence: 82,
        severity: 'Caution',
        description: 'Common in chondrodystrophic breeds. Pain localized to thoracolumbar junction with intact proprioception.',
        clinicalSignsMatched: ['Arched back / guarded posture', 'Panting', 'Hindlimb stiffness']
      },
      {
        condition: 'Musculoskeletal Strain (Iliopsoas / Paraspinal)',
        confidence: 45,
        severity: 'Routine',
        description: 'Soft tissue tension secondary to eccentric movement or jumping.',
        clinicalSignsMatched: ['Stiff hindquarters', 'Reluctant to jump']
      }
    ],
    immediateActionPlan: [
      'Strict crate or confined space rest immediately (zero running or jumping).',
      'Avoid high-temperature environments to prevent brachycephalic respiratory escalation.',
      'Check rear paw conscious proprioception (knuckle test); if paws do not flip back within 1 second, transport to emergency hospital immediately.',
      'Administer prescribed anti-inflammatory (Carprofen) only with food as previously directed.'
    ],
    redFlagWarnings: [
      'Loss of deep pain sensation in toes',
      'Sudden knuckling or dragging of rear paws',
      'Urinary incontinence or inability to void',
      'Severe respiratory stridor or cyanotic (blue/purple) tongue'
    ],
    recommendedDisposition: 'Schedule Vet Visit within 24-48h',
    vetNotes: 'Assessed by Dr. Vance. Conscious proprioception intact on video exam. Client instructed on crate rest protocol.',
    reviewedBy: 'Dr. Marcus Vance, DACVECC',
    status: 'Active Review'
  },
  {
    id: 'case-884',
    petId: 'pet-1',
    petName: 'Luna',
    timestamp: 'Yesterday, 03:15 PM',
    urgencyScore: 3,
    triageLevel: 'Routine',
    primaryComplaint: 'Persistent head shaking and scratching at right ear canal after lake swimming',
    symptomsReported: ['Head shaking (frequent)', 'Scratching right ear', 'Mild yellowish cerumen odor', 'Head tilt during shaking'],
    duration: '24 hours',
    vitalsAtTriage: {
      restingRespiratoryRate: 22,
      temperatureF: 101.4,
      painIndex: 1,
      heartRateBpm: 78
    },
    differentials: [
      {
        condition: 'Acute Otitis Externa (Bacterial / Malassezia)',
        confidence: 88,
        severity: 'Routine',
        description: 'Secondary to moisture retention in floppy ear canal post-swimming.',
        clinicalSignsMatched: ['Unilateral head shake', 'Odoriferous discharge', 'Pinna scratching']
      },
      {
        condition: 'Foreign Body Ingress (Foxtail / Grass Awn)',
        confidence: 34,
        severity: 'Caution',
        description: 'Possible botanical foreign body migrating down auditory canal.',
        clinicalSignsMatched: ['Sudden onset after outdoor exposure', 'Vigorous shaking']
      }
    ],
    immediateActionPlan: [
      'Do not insert Q-tips or cotton swabs into deep canal to avoid tympanic membrane trauma.',
      'Wipe outer pinna gently with clean gauze saturated with sterile saline.',
      'Keep ears completely dry; avoid water exposure until otoscopic examination is completed.'
    ],
    redFlagWarnings: [
      'Nystagmus (rapid flickering eye movements)',
      'Sudden loss of balance or severe persistent head tilt (Vestibular syndrome indicator)',
      'Blood or thick purulent discharge from deep ear canal'
    ],
    recommendedDisposition: 'Schedule Vet Visit within 24-48h',
    vetNotes: 'Otoscopic exam completed. Mild yeast overgrowth confirmed. Prescribed Osurnia otic gel application.',
    reviewedBy: 'Dr. Sarah Chen, DVM',
    status: 'Resolved'
  }
];

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'med-1',
    petId: 'pet-2',
    name: 'Carprofen (Rimadyl)',
    dosage: '25 mg Chewable Tablet',
    frequency: 'Once daily (q24h) with food',
    indication: 'Non-steroidal anti-inflammatory for acute lumbar spinal discomfort',
    prescribingVet: 'Dr. Marcus Vance, DACVECC',
    nextDoseTime: 'Today, 06:00 PM',
    remainingDoses: 12,
    totalDoses: 14,
    instructions: 'Give immediately after dinner. Discontinue if vomiting or black tarry stools occur.',
    contraindications: 'Do not administer concurrently with corticosteroids (Prednisone) or other NSAIDs.',
    administeredToday: false,
    history: [
      { time: 'Yesterday 6:05 PM', status: 'Taken' },
      { time: '2 days ago 6:00 PM', status: 'Taken' }
    ]
  },
  {
    id: 'med-2',
    petId: 'pet-2',
    name: 'Gabapentin Oral Suspension',
    dosage: '50 mg (1.0 mL)',
    frequency: 'Every 8-12 hours as needed for neuropathic pain',
    indication: 'Neuropathic pain modulator & neuro-calmative',
    prescribingVet: 'Dr. Marcus Vance, DACVECC',
    nextDoseTime: 'Today, 02:00 PM',
    remainingDoses: 18,
    totalDoses: 20,
    instructions: 'May cause transient mild ataxia or sedation. Administer with oral syringe into corner of pouch.',
    contraindications: 'Human liquid gabapentin containing Xylitol is strictly contraindicated (Veterinary compound only).',
    administeredToday: true,
    history: [
      { time: 'Today 7:45 AM', status: 'Taken' },
      { time: 'Yesterday 8:00 PM', status: 'Taken' }
    ]
  },
  {
    id: 'med-3',
    petId: 'pet-1',
    name: 'Apoquel (Oclacitinib Maleate)',
    dosage: '16 mg Tablet',
    frequency: 'Once daily (q24h) maintenance',
    indication: 'Control of pruritus associated with allergic dermatitis',
    prescribingVet: 'Dr. Sarah Chen, DVM',
    nextDoseTime: 'Tomorrow, 08:00 AM',
    remainingDoses: 26,
    totalDoses: 30,
    instructions: 'Give with or without food. Maintain continuous dosing during high-pollen seasons.',
    contraindications: 'Do not use in dogs under 12 months or with serious systemic infections.',
    administeredToday: true,
    history: [
      { time: 'Today 8:05 AM', status: 'Taken' },
      { time: 'Yesterday 8:10 AM', status: 'Taken' }
    ]
  },
  {
    id: 'med-4',
    petId: 'pet-1',
    name: 'NexGard Plus (Afoxolaner/Moxidectin)',
    dosage: '60.1-120 lbs Beef Chew',
    frequency: 'Monthly preventative (Day 1 of each month)',
    indication: 'Heartworm prevention, flea/tick eradication, intestinal nematode control',
    prescribingVet: 'Dr. Sarah Chen, DVM',
    nextDoseTime: 'Nov 1, 2026',
    remainingDoses: 4,
    totalDoses: 6,
    instructions: 'Administer 1 chew monthly with meal.',
    contraindications: 'Use with caution in dogs with history of seizures.',
    administeredToday: true,
    history: [
      { time: 'Oct 1 9:00 AM', status: 'Taken' },
      { time: 'Sep 1 9:15 AM', status: 'Taken' }
    ]
  }
];

export const INITIAL_DIAGNOSTICS: DiagnosticRecord[] = [
  {
    id: 'diag-101',
    petId: 'pet-2',
    title: 'Thoracolumbar Digital Radiographs & Orthopedic Survey',
    category: 'Radiology',
    date: 'Oct 04, 2026',
    vetPractitioner: 'Dr. Marcus Vance, DACVECC',
    summary: 'Two-view orthogonal spine radiograph reveals mild narrowing of the L2-L3 intervertebral disk space without obvious mineralized disc extrusion into the canal.',
    abnormalFlagsCount: 1,
    results: [
      { parameter: 'L2-L3 Intervertebral Disc Space', value: 'Mild Disc Space Collapse', unit: 'grade', referenceRange: 'Normal Spacing', status: 'critical' },
      { parameter: 'Spondylosis Deformans', value: 'Absent', unit: 'qual', referenceRange: 'Absent', status: 'normal' },
      { parameter: 'Coxofemoral Hip Congruency', value: 'Symmetric & Smooth (Norberg > 105°)', unit: 'angle', referenceRange: '> 105°', status: 'normal' },
      { parameter: 'Tracheal Diameter Index (TD:TI)', value: '0.19 (Mild brachycephalic hypoplasia)', unit: 'ratio', referenceRange: '> 0.20', status: 'low' }
    ]
  },
  {
    id: 'diag-102',
    petId: 'pet-1',
    title: 'Comprehensive Chemistry 17 & Complete Blood Count (CBC)',
    category: 'Hematology & Chem',
    date: 'Sep 18, 2026',
    vetPractitioner: 'Dr. Sarah Chen, DVM',
    summary: 'Organ panels within optimal clinical reference boundaries. Mild eosinophilia consistent with seasonal atopic flare.',
    abnormalFlagsCount: 1,
    results: [
      { parameter: 'Blood Urea Nitrogen (BUN)', value: 18, unit: 'mg/dL', referenceRange: '7 - 27', status: 'normal' },
      { parameter: 'Creatinine', value: 1.1, unit: 'mg/dL', referenceRange: '0.5 - 1.4', status: 'normal' },
      { parameter: 'Alanine Aminotransferase (ALT)', value: 42, unit: 'U/L', referenceRange: '10 - 125', status: 'normal' },
      { parameter: 'Alkaline Phosphatase (ALP)', value: 65, unit: 'U/L', referenceRange: '23 - 212', status: 'normal' },
      { parameter: 'Eosinophils (WBC Differential)', value: 1.35, unit: 'x10^3/uL', referenceRange: '0.10 - 1.20', status: 'high' },
      { parameter: 'Hematocrit (HCT)', value: 48.2, unit: '%', referenceRange: '37.3 - 61.7', status: 'normal' },
      { parameter: 'Platelets Count', value: 295, unit: 'x10^3/uL', referenceRange: '170 - 400', status: 'normal' }
    ]
  }
];

export const EMERGENCY_CLINICS: EmergencyClinic[] = [
  {
    id: 'er-1',
    name: 'Metropolitan Veterinary Trauma & Intensive Care',
    address: '840 Pacific Medical Ave, San Francisco, CA',
    distanceMiles: 2.1,
    driveTimeMin: 7,
    phone: '(415) 555-0199',
    open24Hours: true,
    traumaLevel: 'Level 1 Critical Care',
    rating: 4.9,
    reviewCount: 428,
    erEquipped: true,
    availableStaff: 'Board-Certified Criticalist (DACVECC) & Surgeon on duty'
  },
  {
    id: 'er-2',
    name: 'St. Jude 24/7 Specialty Animal Hospital',
    address: '1420 Lincoln Blvd, San Francisco, CA',
    distanceMiles: 4.3,
    driveTimeMin: 12,
    phone: '(415) 555-0143',
    open24Hours: true,
    traumaLevel: 'Level 1 Critical Care',
    rating: 4.8,
    reviewCount: 312,
    erEquipped: true,
    availableStaff: '2 Emergency DVMs, Full Anesthesia & Oxygen Kennels'
  },
  {
    id: 'er-3',
    name: 'Bay Area Veterinary Urgent Care Center',
    address: '610 Sunset Way, San Francisco, CA',
    distanceMiles: 6.8,
    driveTimeMin: 18,
    phone: '(415) 555-0177',
    open24Hours: false,
    traumaLevel: 'Urgent Care Center',
    rating: 4.7,
    reviewCount: 195,
    erEquipped: false,
    availableStaff: 'Open until 2:00 AM • Non-surgical emergencies & diagnostics'
  }
];

export const COMMON_SYMPTOMS_LIST = [
  { id: 'lethargy', label: 'Severe Lethargy / Collapse', severity: 'Urgent', icon: 'BatteryLow' },
  { id: 'vomiting_repetitive', label: 'Repetitive Vomiting (>3x)', severity: 'Urgent', icon: 'Flame' },
  { id: 'breathing_effort', label: 'Labored Breathing / Open-Mouth Gasps', severity: 'Urgent', icon: 'Wind' },
  { id: 'pale_gums', label: 'Pale or White/Blue Gums', severity: 'Urgent', icon: 'AlertTriangle' },
  { id: 'bloated_distended', label: 'Distended / Painful Abdomen (Bloat)', severity: 'Urgent', icon: 'ShieldAlert' },
  { id: 'inability_to_urinate', label: 'Straining with Zero Urine Produced', severity: 'Urgent', icon: 'Ban' },
  { id: 'toxic_ingestion', label: 'Known Toxic Ingestion (Chocolate, Xylitol, Lilies)', severity: 'Urgent', icon: 'Skull' },
  { id: 'sudden_paralysis', label: 'Dragging Rear Paws / Unable to Walk', severity: 'Urgent', icon: 'Activity' },
  { id: 'limping', label: 'Limping or Guarding Paw/Leg', severity: 'Caution', icon: 'Footprints' },
  { id: 'ear_scratching', label: 'Persistent Head Shaking / Ear Scratching', severity: 'Routine', icon: 'Ear' },
  { id: 'coughing', label: 'Dry Hacking Cough / Gagging', severity: 'Caution', icon: 'Volume2' },
  { id: 'soft_stool', label: 'Mild Diarrhea (Still energetic, drinking water)', severity: 'Caution', icon: 'AlertCircle' },
  { id: 'eye_discharge', label: 'Squinting Eye with Watery Discharge', severity: 'Caution', icon: 'Eye' },
  { id: 'itchy_skin', label: 'Allergic Chewing Paws / Red Belly', severity: 'Routine', icon: 'Sparkles' }
];
