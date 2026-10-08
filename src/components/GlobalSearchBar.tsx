import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  Heart, 
  Pill, 
  FileText, 
  MapPin, 
  AlertTriangle, 
  Compass, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Pet, Medication, EmergencyClinic } from '../types';
import { COMMON_SYMPTOMS_LIST, EMERGENCY_CLINICS } from '../data/mockData';
import { VoiceMicButton } from './VoiceMicButton';

interface GlobalSearchBarProps {
  pets: Pet[];
  medications: Medication[];
  onSelectPet: (pet: Pet) => void;
  onNavigateTab: (tab: 'dashboard' | 'triage' | 'records' | 'emergency' | 'medications') => void;
  onOpenDirections: (clinic: EmergencyClinic) => void;
  onSymptomSearch?: (symptomLabel: string) => void;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  pets,
  medications,
  onSelectPet,
  onNavigateTab,
  onOpenDirections,
  onSymptomSearch,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanQuery = query.toLowerCase().trim();

  // Filter items
  const matchedPets = cleanQuery
    ? pets.filter((p) => p.name.toLowerCase().includes(cleanQuery) || p.breed.toLowerCase().includes(cleanQuery))
    : [];

  const matchedSymptoms = cleanQuery
    ? COMMON_SYMPTOMS_LIST.filter((s) => s.label.toLowerCase().includes(cleanQuery) || s.id.toLowerCase().includes(cleanQuery))
    : [];

  const matchedMeds = cleanQuery
    ? medications.filter((m) => m.name.toLowerCase().includes(cleanQuery) || m.indication.toLowerCase().includes(cleanQuery))
    : [];

  const matchedClinics = cleanQuery
    ? EMERGENCY_CLINICS.filter((c) => c.name.toLowerCase().includes(cleanQuery) || c.address.toLowerCase().includes(cleanQuery))
    : [];

  const hasResults = matchedPets.length > 0 || matchedSymptoms.length > 0 || matchedMeds.length > 0 || matchedClinics.length > 0;

  const handleVoiceTranscribed = (transcript: string) => {
    setQuery(transcript);
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      {/* Search Input Container */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-[#6d7a77] pointer-events-none">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search symptoms, medications, clinics, or tap mic..."
          className="w-full pl-10 pr-28 py-2.5 rounded-2xl bg-[#faf8ff] hover:bg-[#f2f3ff] focus:bg-white border border-[#e2e8f0] focus:border-[#00685f] focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 text-xs sm:text-sm text-[#131b2e] placeholder-[#6d7a77] transition shadow-2xs"
        />

        {/* Right side: Clear button & Voice Mic */}
        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="p-1 rounded-full text-[#6d7a77] hover:bg-[#eaedff] transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Embedded Voice Mic */}
          <VoiceMicButton
            size="sm"
            onTranscribed={handleVoiceTranscribed}
            className="!rounded-xl"
          />
        </div>
      </div>

      {/* Instant Dropdown Results */}
      {isOpen && cleanQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#e2e8f0] shadow-xl p-2 z-50 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-1 text-xs">
          {!hasResults ? (
            <div className="p-4 text-center text-[#6d7a77]">
              <p>No direct records found for &ldquo;{query}&rdquo;.</p>
              <button
                onClick={() => {
                  onNavigateTab('triage');
                  setIsOpen(false);
                }}
                className="mt-2 text-xs font-bold text-[#00685f] hover:underline"
              >
                Run AI Symptom Triage for &ldquo;{query}&rdquo; →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Matched Patients */}
              {matchedPets.length > 0 && (
                <div>
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6d7a77] block">
                    Patient Records
                  </span>
                  {matchedPets.map((pet) => (
                    <button
                      key={pet.id}
                      onClick={() => {
                        onSelectPet(pet);
                        onNavigateTab('dashboard');
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#faf8ff] text-left transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={pet.avatarUrl} alt={pet.name} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <span className="font-heading font-bold text-[#131b2e] block">{pet.name}</span>
                          <span className="text-[11px] text-[#6d7a77]">{pet.breed} • {pet.weightLbs} lbs</span>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#eaedff] text-[#006398]">
                        Switch Patient
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Matched Symptoms */}
              {matchedSymptoms.length > 0 && (
                <div>
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6d7a77] block">
                    Clinical Symptoms
                  </span>
                  {matchedSymptoms.map((sym) => (
                    <button
                      key={sym.id}
                      onClick={() => {
                        onNavigateTab('triage');
                        onSymptomSearch?.(sym.label);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#faf8ff] text-left transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5 text-[#00685f]" />
                        <span className="font-medium text-[#131b2e]">{sym.label}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        sym.severity === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        Triage: {sym.severity}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Matched Medications */}
              {matchedMeds.length > 0 && (
                <div>
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6d7a77] block">
                    Prescriptions & Medications
                  </span>
                  {matchedMeds.map((med) => (
                    <button
                      key={med.id}
                      onClick={() => {
                        onNavigateTab('medications');
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#faf8ff] text-left transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Pill className="w-3.5 h-3.5 text-[#00685f]" />
                        <div>
                          <span className="font-bold text-[#131b2e] block">{med.name}</span>
                          <span className="text-[11px] text-[#6d7a77]">{med.dosage}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#00685f] font-bold">
                        View Schedule →
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Matched Clinics */}
              {matchedClinics.length > 0 && (
                <div>
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6d7a77] block">
                    Emergency Clinics & Maps
                  </span>
                  {matchedClinics.map((clinic) => (
                    <button
                      key={clinic.id}
                      onClick={() => {
                        onOpenDirections(clinic);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#faf8ff] text-left transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-red-600" />
                        <div>
                          <span className="font-bold text-[#131b2e] block">{clinic.name}</span>
                          <span className="text-[11px] text-[#6d7a77]">{clinic.address}</span>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#eaedff] text-[#006398] flex items-center gap-1">
                        <Compass className="w-3 h-3" /> Get Directions
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
