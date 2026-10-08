/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  INITIAL_PETS, 
  INITIAL_TRIAGE_CASES, 
  INITIAL_MEDICATIONS, 
  INITIAL_DIAGNOSTICS, 
  EMERGENCY_CLINICS 
} from './data/mockData';
import { Pet, TriageCase, Medication, DiagnosticRecord } from './types';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { VitalityDashboard } from './components/VitalityDashboard';
import { TriageWizard } from './components/TriageWizard';
import { ClinicalRecordsView } from './components/ClinicalRecordsView';
import { EmergencyHubView } from './components/EmergencyHubView';
import { MedicationsView } from './components/MedicationsView';
import { RespiratoryCounterModal } from './components/RespiratoryCounterModal';
import { EmergencyHotlineModal } from './components/EmergencyHotlineModal';
import { TeleVetModal } from './components/TeleVetModal';
import { AddPetModal } from './components/AddPetModal';
import { ClinicDirectionsModal } from './components/ClinicDirectionsModal';
import { EmergencyClinic } from './types';
import { ShieldCheck, Heart, Stethoscope, AlertTriangle, PhoneCall } from 'lucide-react';

export default function App() {
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [selectedPet, setSelectedPet] = useState<Pet>(INITIAL_PETS[1]); // Barnaby (French Bulldog with active caution state)
  const [triageCases, setTriageCases] = useState<TriageCase[]>(INITIAL_TRIAGE_CASES);
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [diagnostics, setDiagnostics] = useState<DiagnosticRecord[]>(INITIAL_DIAGNOSTICS);

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Modals state
  const [isRespiratoryCounterOpen, setIsRespiratoryCounterOpen] = useState(false);
  const [isEmergencyHotlineOpen, setIsEmergencyHotlineOpen] = useState(false);
  const [isTeleVetOpen, setIsTeleVetOpen] = useState(false);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [isDirectionsModalOpen, setIsDirectionsModalOpen] = useState(false);
  const [selectedDirectionClinic, setSelectedDirectionClinic] = useState<EmergencyClinic>(EMERGENCY_CLINICS[0]);

  // Handlers
  const handleSaveBreathRate = (rate: number) => {
    const updatedPets = pets.map((p) => {
      if (p.id === selectedPet.id) {
        const isElevated = rate > 30;
        return {
          ...p,
          status: isElevated && p.status === 'Routine' ? 'Caution' : p.status,
          vitals: {
            ...p.vitals,
            restingRespiratoryRate: rate,
            timestamp: 'Just now'
          }
        };
      }
      return p;
    });

    setPets(updatedPets);
    const updatedSelected = updatedPets.find((p) => p.id === selectedPet.id);
    if (updatedSelected) {
      setSelectedPet(updatedSelected);
    }
  };

  const handleAdministerMedication = (medId: string) => {
    setMedications((prev) =>
      prev.map((m) => {
        if (m.id === medId) {
          const newStatus = !m.administeredToday;
          return {
            ...m,
            administeredToday: newStatus,
            remainingDoses: newStatus ? Math.max(0, m.remainingDoses - 1) : m.remainingDoses + 1,
            history: newStatus
              ? [{ time: 'Just now', status: 'Taken' as const }, ...m.history]
              : m.history.filter((_, idx) => idx !== 0)
          };
        }
        return m;
      })
    );
  };

  const handleTriageComplete = (newCase: TriageCase) => {
    setTriageCases((prev) => [newCase, ...prev]);

    // Update pet urgency status if case is elevated
    if (newCase.triageLevel !== 'Routine') {
      const updatedPets = pets.map((p) => {
        if (p.id === selectedPet.id) {
          return {
            ...p,
            status: newCase.triageLevel
          };
        }
        return p;
      });
      setPets(updatedPets);
      const updated = updatedPets.find((p) => p.id === selectedPet.id);
      if (updated) setSelectedPet(updated);
    }
  };

  const handleAddPet = (newPet: Pet) => {
    setPets((prev) => [...prev, newPet]);
    setSelectedPet(newPet);
  };

  const handleAddMedication = (newMed: Medication) => {
    setMedications((prev) => [newMed, ...prev]);
  };

  const urgentPetsCount = pets.filter((p) => p.status === 'Urgent').length;

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans">
      {/* Top Clinical Header */}
      <Header
        pets={pets}
        selectedPet={selectedPet}
        medications={medications}
        onSelectPet={(p) => setSelectedPet(p)}
        onOpenNewTriage={() => {
          setActiveTab('triage');
        }}
        onOpenEmergencyHotline={() => setIsEmergencyHotlineOpen(true)}
        onOpenTeleVet={() => setIsTeleVetOpen(true)}
        onOpenAddPet={() => setIsAddPetOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenDirections={(clinic) => {
          setSelectedDirectionClinic(clinic);
          setIsDirectionsModalOpen(true);
        }}
        onSymptomSearch={() => {
          setActiveTab('triage');
        }}
      />

      {/* Main Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        urgentAlertCount={urgentPetsCount}
      />

      {/* Main Screen Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Urgent Alert Banner if selected pet has Urgent status */}
        {selectedPet.status === 'Urgent' && (
          <div className="mb-6 p-4 rounded-3xl bg-red-600 text-white shadow-lg flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-white shrink-0" />
              <div>
                <h4 className="font-heading font-extrabold text-sm">
                  CRITICAL VETERINARY TRIAGE ALERT FOR {selectedPet.name.toUpperCase()}
                </h4>
                <p className="text-xs text-red-100">
                  Vitals indicate severe physiologic compromise. Transport to nearest trauma emergency facility immediately.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEmergencyHotlineOpen(true)}
              className="px-4 py-2 rounded-xl bg-white text-red-700 font-heading font-bold text-xs whitespace-nowrap shadow-sm hover:bg-red-50 transition cursor-pointer"
            >
              Call 24/7 ER Vet
            </button>
          </div>
        )}

        {/* Tab 1: Vitality Dashboard */}
        {activeTab === 'dashboard' && (
          <VitalityDashboard
            pet={selectedPet}
            recentTriageCases={triageCases}
            medications={medications}
            nearbyER={EMERGENCY_CLINICS[0]}
            onOpenRespiratoryCounter={() => setIsRespiratoryCounterOpen(true)}
            onOpenNewTriage={() => setActiveTab('triage')}
            onOpenEmergencyHotline={() => setIsEmergencyHotlineOpen(true)}
            onOpenTeleVet={() => setIsTeleVetOpen(true)}
            onAdministerMedication={handleAdministerMedication}
            onViewAllRecords={() => setActiveTab('records')}
            onViewAllMeds={() => setActiveTab('medications')}
            onOpenDirections={(clinic) => {
              setSelectedDirectionClinic(clinic);
              setIsDirectionsModalOpen(true);
            }}
          />
        )}

        {/* Tab 2: AI Symptom Triage Wizard */}
        {activeTab === 'triage' && (
          <TriageWizard
            pet={selectedPet}
            onTriageComplete={handleTriageComplete}
            onOpenEmergencyHotline={() => setIsEmergencyHotlineOpen(true)}
            onOpenTeleVet={() => setIsTeleVetOpen(true)}
          />
        )}

        {/* Tab 3: Clinical Records & Diagnostics */}
        {activeTab === 'records' && (
          <ClinicalRecordsView
            pet={selectedPet}
            triageCases={triageCases}
            diagnostics={diagnostics}
            onOpenNewTriage={() => setActiveTab('triage')}
          />
        )}

        {/* Tab 4: 24/7 ER Trauma Hub & Tele-Vet */}
        {activeTab === 'emergency' && (
          <EmergencyHubView
            pet={selectedPet}
            onOpenEmergencyHotline={() => setIsEmergencyHotlineOpen(true)}
          />
        )}

        {/* Tab 5: Medications & Regimens */}
        {activeTab === 'medications' && (
          <MedicationsView
            pet={selectedPet}
            medications={medications}
            onAdministerMedication={handleAdministerMedication}
            onAddMedication={handleAddMedication}
          />
        )}
      </main>

      {/* Modals */}
      <RespiratoryCounterModal
        pet={selectedPet}
        isOpen={isRespiratoryCounterOpen}
        onClose={() => setIsRespiratoryCounterOpen(false)}
        onSaveRate={handleSaveBreathRate}
      />

      <EmergencyHotlineModal
        pet={selectedPet}
        isOpen={isEmergencyHotlineOpen}
        onClose={() => setIsEmergencyHotlineOpen(false)}
      />

      <TeleVetModal
        pet={selectedPet}
        isOpen={isTeleVetOpen}
        onClose={() => setIsTeleVetOpen(false)}
      />

      <AddPetModal
        isOpen={isAddPetOpen}
        onClose={() => setIsAddPetOpen(false)}
        onAddPet={handleAddPet}
      />

      <ClinicDirectionsModal
        pet={selectedPet}
        clinic={selectedDirectionClinic}
        isOpen={isDirectionsModalOpen}
        onClose={() => setIsDirectionsModalOpen(false)}
        onCallClinic={(phone) => {
          window.location.href = `tel:${phone}`;
        }}
      />

      {/* Clinical Platform Footer */}
      <footer className="mt-auto border-t border-[#e2e8f0] bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6d7a77]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00685f]" />
            <span>
              Clinical Vitality Pet Telemetry Platform • Veterinary AI Triage Matrix v4.2
            </span>
          </div>
          <p className="text-[11px] text-center sm:text-right max-w-md">
            Clinical Vitality is an assistive veterinary assessment tool. In severe acute emergencies (respiratory arrest, GDV, collapse), transport immediately to an accredited emergency hospital.
          </p>
        </div>
      </footer>
    </div>
  );
}
