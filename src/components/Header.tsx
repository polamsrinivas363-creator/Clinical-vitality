import React from 'react';
import { Pet, UrgencyLevel, Medication, EmergencyClinic } from '../types';
import { TabType } from './Navigation';
import { GlobalSearchBar } from './GlobalSearchBar';
import { 
  HeartPulse, 
  AlertOctagon, 
  PhoneCall, 
  Plus, 
  ChevronDown, 
  ShieldCheck, 
  Video,
  Stethoscope
} from 'lucide-react';

interface HeaderProps {
  pets: Pet[];
  selectedPet: Pet;
  medications: Medication[];
  onSelectPet: (pet: Pet) => void;
  onOpenNewTriage: () => void;
  onOpenEmergencyHotline: () => void;
  onOpenTeleVet: () => void;
  onOpenAddPet: () => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenDirections: (clinic: EmergencyClinic) => void;
  onSymptomSearch?: (symptom: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  pets,
  selectedPet,
  medications,
  onSelectPet,
  onOpenNewTriage,
  onOpenEmergencyHotline,
  onOpenTeleVet,
  onOpenAddPet,
  onNavigateTab,
  onOpenDirections,
  onSymptomSearch,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const getUrgencyBadge = (level: UrgencyLevel) => {
    switch (level) {
      case 'Urgent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            Urgent Triage Status
          </span>
        );
      case 'Caution':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Under Clinical Monitoring
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Vitals Stable & Routine
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00685f] to-[#008378] flex items-center justify-center text-white shadow-md shadow-[#00685f]/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl tracking-tight text-[#131b2e]">
                  Clinical <span className="text-[#00685f]">Vitality</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#eaedff] text-[#006398]">
                  Vet-AI v4.2
                </span>
              </div>
              <p className="hidden md:block text-xs text-[#6d7a77] font-normal">
                Clinical Pet Telemetry & Emergency Triage Platform
              </p>
            </div>
          </div>

          {/* Global Search Bar with Voice Mic (Desktop) */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <GlobalSearchBar
              pets={pets}
              medications={medications}
              onSelectPet={onSelectPet}
              onNavigateTab={onNavigateTab}
              onOpenDirections={onOpenDirections}
              onSymptomSearch={onSymptomSearch}
            />
          </div>

          {/* Active Pet Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#faf8ff] hover:bg-[#f2f3ff] border border-[#e2e8f0] transition cursor-pointer"
              aria-label="Select Patient Pet"
            >
              <img
                src={selectedPet.avatarUrl}
                alt={selectedPet.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#00685f]/30"
              />
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-[#131b2e]">
                    {selectedPet.name}
                  </span>
                  <span className="text-[11px] text-[#6d7a77] font-medium">
                    ({selectedPet.breed})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-[#6d7a77]">
                    {selectedPet.weightLbs} lbs • {selectedPet.age}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-[#6d7a77] ml-1" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#e2e8f0] shadow-xl p-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 text-[11px] font-bold text-[#6d7a77] uppercase tracking-wider border-b border-[#e2e8f0]">
                    Select Patient Pet
                  </div>
                  <div className="py-1 space-y-1">
                    {pets.map((pet) => (
                      <button
                        key={pet.id}
                        onClick={() => {
                          onSelectPet(pet);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition cursor-pointer text-left ${
                          selectedPet.id === pet.id
                            ? 'bg-[#eaedff] text-[#00685f]'
                            : 'hover:bg-[#faf8ff] text-[#131b2e]'
                        }`}
                      >
                        <img
                          src={pet.avatarUrl}
                          alt={pet.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-[#e2e8f0]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-semibold text-sm truncate">
                              {pet.name}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                              pet.status === 'Urgent'
                                ? 'bg-red-100 text-red-700'
                                : pet.status === 'Caution'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {pet.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#6d7a77] truncate">
                            {pet.breed} • {pet.weightLbs} lbs
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-[#e2e8f0]">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenAddPet();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-[#00685f] hover:bg-[#eaedff] transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add New Pet Profile
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Clinical Status & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:block">
              {getUrgencyBadge(selectedPet.status)}
            </div>

            {/* Quick Tele-Vet Video button */}
            <button
              onClick={onOpenTeleVet}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#006398] bg-[#eaedff] hover:bg-[#dae2fd] transition cursor-pointer"
              title="Connect with Licensed Vet Triage Nurse"
            >
              <Video className="w-4 h-4 text-[#006398]" />
              <span className="hidden sm:inline">24/7 Tele-Vet</span>
            </button>

            {/* AI Triage Quick Intake CTA */}
            <button
              onClick={onOpenNewTriage}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#00685f] to-[#008378] hover:shadow-md hover:shadow-[#00685f]/25 transition cursor-pointer"
            >
              <HeartPulse className="w-4 h-4" />
              <span>Symptom Triage</span>
            </button>

            {/* Emergency Hotline Button */}
            <button
              onClick={onOpenEmergencyHotline}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition cursor-pointer"
              title="24/7 Emergency Pet Hospital Hotline"
            >
              <AlertOctagon className="w-4 h-4 text-red-600" />
              <span className="hidden xl:inline">Emergency ER</span>
            </button>
          </div>
        </div>

        {/* Global Search Bar (Mobile / Small Screens) */}
        <div className="pb-3 md:hidden">
          <GlobalSearchBar
            pets={pets}
            medications={medications}
            onSelectPet={onSelectPet}
            onNavigateTab={onNavigateTab}
            onOpenDirections={onOpenDirections}
            onSymptomSearch={onSymptomSearch}
          />
        </div>
      </div>
    </header>
  );
};
