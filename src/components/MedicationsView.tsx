import React, { useState } from 'react';
import { Pet, Medication } from '../types';
import { 
  Pill, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Plus, 
  ShieldAlert, 
  RefreshCw, 
  Stethoscope, 
  Info
} from 'lucide-react';

interface MedicationsViewProps {
  pet: Pet;
  medications: Medication[];
  onAdministerMedication: (medId: string) => void;
  onAddMedication: (newMed: Medication) => void;
}

export const MedicationsView: React.FC<MedicationsViewProps> = ({
  pet,
  medications,
  onAdministerMedication,
  onAddMedication,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newFrequency, setNewFrequency] = useState('Once daily');
  const [newInstructions, setNewInstructions] = useState('');

  const petMeds = medications.filter((m) => m.petId === pet.id);

  const handleAddNewMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim() || !newDosage.trim()) return;

    const newMed: Medication = {
      id: `med-${Date.now()}`,
      petId: pet.id,
      name: newMedName.trim(),
      dosage: newDosage.trim(),
      frequency: newFrequency,
      indication: 'Doctor prescribed veterinary regimen',
      prescribingVet: pet.primaryVeterinarian,
      nextDoseTime: 'Today, 08:00 PM',
      remainingDoses: 30,
      totalDoses: 30,
      instructions: newInstructions.trim() || 'Administer with meal.',
      contraindications: 'Follow veterinarian safety guidelines.',
      administeredToday: false,
      history: []
    };

    onAddMedication(newMed);
    setNewMedName('');
    setNewDosage('');
    setNewInstructions('');
    setShowAddModal(false);
  };

  const handleRefillRequest = (medName: string) => {
    alert(`Refill authorization request sent to ${pet.clinicName} for ${medName}. You will receive SMS confirmation within 4 business hours.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#eaedff] text-[#00685f]">
              Pharmacy & Prescription Regimen
            </span>
            <span className="text-xs text-[#6d7a77]">
              Patient: <strong>{pet.name}</strong>
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-[#131b2e]">
            Active Medications & Safety Management
          </h2>
          <p className="text-xs text-[#6d7a77]">
            Track administration times, refill status, and veterinary contraindications.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00685f] hover:bg-[#005049] text-white font-heading font-bold text-xs shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Prescription</span>
        </button>
      </div>

      {/* Safety Alert Matrix */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 leading-relaxed">
          <strong className="block font-heading font-bold text-amber-900 mb-0.5">
            Clinical Safety Protocol & Human Drug Warning:
          </strong>
          Never administer human NSAIDs (Ibuprofen, Naproxen, Acetaminophen) to dogs or cats—these cause irreversible acute renal necrosis and gastric perforation. All medications listed below are specifically calibrated for {pet.name}&apos;s current weight ({pet.weightLbs} lbs).
        </div>
      </div>

      {/* Medication Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {petMeds.length === 0 ? (
          <div className="col-span-2 bg-white rounded-3xl p-10 text-center border border-[#e2e8f0]">
            <Pill className="w-8 h-8 text-[#6d7a77] mx-auto mb-2 opacity-50" />
            <p className="text-xs text-[#6d7a77]">No active prescriptions recorded for {pet.name}.</p>
          </div>
        ) : (
          petMeds.map((med) => (
            <div
              key={med.id}
              className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#eaedff] text-[#00685f] flex items-center justify-center shrink-0">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-[#131b2e]">
                        {med.name}
                      </h3>
                      <span className="text-xs font-semibold text-[#00685f]">
                        {med.dosage}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      med.administeredToday
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {med.administeredToday ? '✓ Done Today' : 'Due Today'}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#faf8ff] border border-[#e2e8f0]">
                    <span className="font-bold text-[#6d7a77] block text-[10px] uppercase">
                      Schedule & Instructions:
                    </span>
                    <p className="text-[#131b2e] mt-0.5">{med.frequency} • {med.instructions}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-red-50/50 border border-red-100">
                    <span className="font-bold text-red-700 block text-[10px] uppercase">
                      Contraindications & Warnings:
                    </span>
                    <p className="text-red-900 mt-0.5">{med.contraindications}</p>
                  </div>

                  <div className="flex items-center justify-between text-[#6d7a77] text-[11px] pt-1">
                    <span>Prescribed by: <strong>{med.prescribingVet}</strong></span>
                    <span>Next Dose: <strong>{med.nextDoseTime}</strong></span>
                  </div>
                </div>
              </div>

              {/* Progress & Actions */}
              <div className="mt-5 pt-4 border-t border-[#e2e8f0]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#6d7a77]">
                    Remaining Supply: <strong>{med.remainingDoses} of {med.totalDoses} doses</strong>
                  </span>
                  {med.remainingDoses <= 5 && (
                    <span className="text-amber-700 font-bold text-[11px]">Low Supply Alert</span>
                  )}
                </div>
                <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full ${med.remainingDoses <= 5 ? 'bg-amber-500' : 'bg-[#00685f]'}`}
                    style={{ width: `${(med.remainingDoses / med.totalDoses) * 100}%` }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAdministerMedication(med.id)}
                    className={`flex-1 py-2.5 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      med.administeredToday
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-[#00685f] hover:bg-[#005049] text-white shadow-2xs'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{med.administeredToday ? 'Mark as Taken Today' : 'Give Dose Now'}</span>
                  </button>

                  <button
                    onClick={() => handleRefillRequest(med.name)}
                    className="px-3 py-2.5 rounded-xl bg-[#faf8ff] hover:bg-[#eaedff] border border-[#e2e8f0] text-xs font-semibold text-[#006398] flex items-center gap-1 transition cursor-pointer"
                    title="Request Clinic Refill"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Refill</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e2e8f0]">
            <h3 className="font-heading font-bold text-lg text-[#131b2e] mb-1">
              Add Veterinary Prescription for {pet.name}
            </h3>
            <p className="text-xs text-[#6d7a77] mb-4">
              Enter dosage specifications and schedule provided by your licensed veterinarian.
            </p>

            <form onSubmit={handleAddNewMed} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Medication Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clavamox (Amoxicillin/Clavulanate)"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e2e8f0] focus:ring-2 focus:ring-[#00685f] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Dosage & Formulation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 125 mg Tablet"
                  value={newDosage}
                  onChange={(e) => setNewDosage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e2e8f0] focus:ring-2 focus:ring-[#00685f] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Frequency</label>
                <select
                  value={newFrequency}
                  onChange={(e) => setNewFrequency(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e2e8f0] focus:ring-2 focus:ring-[#00685f] outline-none"
                >
                  <option value="Once daily (q24h)">Once daily (q24h)</option>
                  <option value="Twice daily (q12h)">Twice daily (q12h)</option>
                  <option value="Every 8 hours (q8h)">Every 8 hours (q8h)</option>
                  <option value="As needed for pain (PRN)">As needed for pain (PRN)</option>
                  <option value="Monthly preventative">Monthly preventative</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Instructions & Food Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Give with food. Complete all 14 days."
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e2e8f0] focus:ring-2 focus:ring-[#00685f] outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-[#6d7a77] hover:bg-[#eaedff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00685f] text-white font-bold"
                >
                  Save Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
