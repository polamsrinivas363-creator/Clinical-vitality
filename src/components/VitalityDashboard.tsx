import React, { useState } from 'react';
import { Pet, TriageCase, Medication, EmergencyClinic } from '../types';
import { 
  Heart, 
  Thermometer, 
  Droplets, 
  Activity, 
  Pill, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Scale, 
  PhoneCall, 
  ShieldCheck, 
  ChevronRight, 
  Stethoscope, 
  Timer, 
  ExternalLink,
  Flame,
  Award,
  Compass
} from 'lucide-react';

interface VitalityDashboardProps {
  pet: Pet;
  recentTriageCases: TriageCase[];
  medications: Medication[];
  nearbyER: EmergencyClinic;
  onOpenRespiratoryCounter: () => void;
  onOpenNewTriage: () => void;
  onOpenEmergencyHotline: () => void;
  onOpenTeleVet: () => void;
  onAdministerMedication: (medId: string) => void;
  onViewAllRecords: () => void;
  onViewAllMeds: () => void;
  onOpenDirections?: (clinic: EmergencyClinic) => void;
}

export const VitalityDashboard: React.FC<VitalityDashboardProps> = ({
  pet,
  recentTriageCases,
  medications,
  nearbyER,
  onOpenRespiratoryCounter,
  onOpenNewTriage,
  onOpenEmergencyHotline,
  onOpenTeleVet,
  onAdministerMedication,
  onViewAllRecords,
  onViewAllMeds,
  onOpenDirections,
}) => {
  const [activeTab, setActiveTab] = useState<'vitals' | 'notes'>('vitals');

  const petMeds = medications.filter((m) => m.petId === pet.id);
  const petTriageCase = recentTriageCases.find((c) => c.petId === pet.id);

  // Normal vitals calculations
  const rrrNormal = pet.vitals.restingRespiratoryRate >= 15 && pet.vitals.restingRespiratoryRate <= 30;
  const tempNormal = pet.vitals.temperatureF >= 100.5 && pet.vitals.temperatureF <= 102.5;
  const painNormal = pet.vitals.painIndex <= 1;

  return (
    <div className="space-y-6">
      {/* Patient Health Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e2e8f0] shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Pet Details */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <img
                src={pet.avatarUrl}
                alt={pet.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-[#eaedff] shadow-sm"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white ${
                  pet.status === 'Urgent'
                    ? 'bg-red-500 animate-pulse'
                    : pet.status === 'Caution'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                title={`Status: ${pet.status}`}
              >
                {pet.status === 'Routine' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#131b2e]">
                  {pet.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#eaedff] text-[#006398]">
                  {pet.species} • {pet.breed}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    pet.status === 'Urgent'
                      ? 'bg-red-100 text-red-700'
                      : pet.status === 'Caution'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {pet.status === 'Routine' ? 'Normal Vitality' : `${pet.status} Alert`}
                </span>
              </div>

              <div className="text-xs text-[#6d7a77] flex flex-wrap items-center gap-y-1 gap-x-3 mt-1">
                <span>Age: <strong>{pet.age}</strong></span>
                <span>•</span>
                <span>Weight: <strong>{pet.weightLbs} lbs</strong></span>
                <span>•</span>
                <span>Sex: <strong>{pet.sex}</strong></span>
                <span>•</span>
                <span>Microchip: <code className="bg-[#f2f3ff] px-1 py-0.5 rounded text-[11px]">{pet.microchipId}</code></span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs font-medium text-[#131b2e] flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-[#00685f]" />
                  {pet.primaryVeterinarian}
                </span>
                <span className="text-xs text-[#6d7a77]">({pet.clinicName})</span>
              </div>
            </div>
          </div>

          {/* Quick Telemetry & Intake Trigger Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={onOpenRespiratoryCounter}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#eaedff] hover:bg-[#dae2fd] text-[#006398] font-heading font-semibold text-xs sm:text-sm transition cursor-pointer"
            >
              <Timer className="w-4 h-4 text-[#006398]" />
              <span>RRR Breath Counter</span>
            </button>

            <button
              onClick={onOpenNewTriage}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00685f] to-[#008378] hover:shadow-md text-white font-heading font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              <span>AI Symptom Intake</span>
            </button>
          </div>
        </div>

        {/* Chronic Conditions & Allergies Tags */}
        <div className="mt-5 pt-4 border-t border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[#6d7a77]">Health Flags:</span>
            {pet.chronicConditions.map((cond, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-[#f2f3ff] text-[#006398] font-medium">
                {cond}
              </span>
            ))}
            {pet.allergies.map((all, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-medium">
                ⚠️ Allergy: {all}
              </span>
            ))}
          </div>

          <span className="text-[11px] text-[#6d7a77]">
            Last Telemetry Sync: <strong>{pet.vitals.timestamp}</strong>
          </span>
        </div>
      </div>

      {/* Real-Time Clinical Vitals Telemetry Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#00685f]" />
            <h2 className="font-heading font-bold text-lg text-[#131b2e]">
              Real-Time Clinical Vitals & Biomarkers
            </h2>
          </div>
          <button
            onClick={onOpenRespiratoryCounter}
            className="text-xs font-semibold text-[#00685f] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Measure Resting Breathing Rate →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Resting Respiratory Rate (RRR) */}
          <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-2xs hover:shadow-xs transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6d7a77]">
                Resting Respiratory
              </span>
              <div className={`p-2 rounded-xl ${rrrNormal ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-extrabold text-3xl text-[#131b2e]">
                {pet.vitals.restingRespiratoryRate}
              </span>
              <span className="text-xs text-[#6d7a77] font-semibold">breaths/min</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className={`font-semibold ${rrrNormal ? 'text-emerald-700' : 'text-amber-700'}`}>
                {rrrNormal ? '✓ Optimal resting rate' : '⚠️ Mildly elevated'}
              </span>
              <span className="text-[#6d7a77] text-[11px]">Ref: 15-30 bpm</span>
            </div>
            <button
              onClick={onOpenRespiratoryCounter}
              className="mt-3 w-full py-1.5 px-2 rounded-xl text-center text-xs font-semibold bg-[#faf8ff] hover:bg-[#eaedff] text-[#00685f] transition cursor-pointer"
            >
              Open 30s Tap Counter
            </button>
          </div>

          {/* Card 2: Core Body Temperature */}
          <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-2xs hover:shadow-xs transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6d7a77]">
                Core Temperature
              </span>
              <div className={`p-2 rounded-xl ${tempNormal ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                <Thermometer className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-extrabold text-3xl text-[#131b2e]">
                {pet.vitals.temperatureF.toFixed(1)}°
              </span>
              <span className="text-xs text-[#6d7a77] font-semibold">Fahrenheit</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className={`font-semibold ${tempNormal ? 'text-emerald-700' : 'text-amber-700'}`}>
                {tempNormal ? '✓ Normothermic' : '⚠️ Sub-febrile'}
              </span>
              <span className="text-[#6d7a77] text-[11px]">Ref: 100.5-102.5°F</span>
            </div>
            <div className="mt-3 w-full bg-[#eaedff] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#008378] h-full rounded-full"
                style={{ width: `${Math.min(100, Math.max(10, ((pet.vitals.temperatureF - 98) / 6) * 100))}%` }}
              />
            </div>
          </div>

          {/* Card 3: Glasgow Pain Index */}
          <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-2xs hover:shadow-xs transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6d7a77]">
                Pain Score (Glasgow)
              </span>
              <div className={`p-2 rounded-xl ${painNormal ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-extrabold text-3xl text-[#131b2e]">
                {pet.vitals.painIndex}
              </span>
              <span className="text-xs text-[#6d7a77] font-semibold">/ 10 scale</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className={`font-semibold ${painNormal ? 'text-emerald-700' : 'text-amber-700'}`}>
                {painNormal ? '✓ Comfortable' : '⚠️ Guarded posture'}
              </span>
              <span className="text-[#6d7a77] text-[11px]">0 = No pain</span>
            </div>
            <div className="mt-3 w-full bg-[#eaedff] h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${pet.vitals.painIndex > 3 ? 'bg-amber-500' : 'bg-[#00685f]'}`}
                style={{ width: `${(pet.vitals.painIndex / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Card 4: Hydration & Capillary Refill */}
          <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-2xs hover:shadow-xs transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6d7a77]">
                Hydration Index
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-bold text-2xl text-[#131b2e]">
                {pet.vitals.hydrationScore}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-semibold">
                ✓ CRT &lt; 1.5 seconds
              </span>
              <span className="text-[#6d7a77] text-[11px]">Skin turgor elastic</span>
            </div>
            <div className="mt-3 py-1 px-2 rounded-lg bg-[#eaedff]/60 text-center text-[11px] text-[#006398] font-medium">
              Daily Water Intake: Normal (1.2L)
            </div>
          </div>
        </div>
      </div>

      {/* Middle Two-Column Section: Weight & Diagnostics Timeline vs Medications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Weight Trajectory & Recent AI Triage Finding */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weight Tracking Chart */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#00685f]" />
                <h3 className="font-heading font-bold text-base text-[#131b2e]">
                  Body Weight Trajectory (6 Months)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f2f3ff] text-[#006398]">
                  Target: {pet.weightLbs} lbs (Ideal BCS 5/9)
                </span>
              </div>
            </div>

            {/* SVG Weight Line Curve */}
            <div className="h-44 w-full pt-4">
              <div className="relative h-full flex items-end justify-between px-4 pb-6 border-b border-[#e2e8f0]">
                {pet.weightHistory.map((item, idx) => {
                  const min = 20;
                  const max = 70;
                  const heightPercent = Math.min(100, Math.max(15, ((item.weightLbs - min) / (max - min)) * 100));
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                      <div className="text-[11px] font-bold text-[#131b2e] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition">
                        {item.weightLbs}
                      </div>
                      <div className="w-8 sm:w-10 bg-[#eaedff] group-hover:bg-[#89f5e7] rounded-t-xl transition-all relative" style={{ height: `${heightPercent}px` }}>
                        <div className="w-3 h-3 rounded-full bg-[#00685f] absolute -top-1.5 left-1/2 -translate-x-1/2 ring-2 ring-white" />
                      </div>
                      <span className="text-xs text-[#6d7a77] font-medium mt-1">
                        {item.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-[#6d7a77] px-2">
              <span>Body Condition Score (BCS): <strong>5 / 9 (Ideal Body Symmetry)</strong></span>
              <span className="text-emerald-700 font-semibold">✓ Stable & within ±0.5 lbs</span>
            </div>
          </div>

          {/* Recent AI Triage Finding Snapshot */}
          {petTriageCase && (
            <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${
                    petTriageCase.triageLevel === 'Urgent'
                      ? 'bg-red-600'
                      : petTriageCase.triageLevel === 'Caution'
                      ? 'bg-amber-600'
                      : 'bg-[#00685f]'
                  }`}>
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#131b2e]">
                      Latest AI Clinical Triage Findings
                    </h3>
                    <p className="text-xs text-[#6d7a77]">
                      Assessed on {petTriageCase.timestamp}
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  petTriageCase.triageLevel === 'Urgent'
                    ? 'bg-red-100 text-red-700'
                    : petTriageCase.triageLevel === 'Caution'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {petTriageCase.triageLevel} (Score: {petTriageCase.urgencyScore}/10)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#faf8ff] border border-[#e2e8f0] mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6d7a77] block mb-1">
                  Primary Differential:
                </span>
                <span className="font-heading font-bold text-sm text-[#131b2e] block">
                  {petTriageCase.differentials[0]?.condition || 'Evaluated Condition'}
                </span>
                <p className="text-xs text-[#6d7a77] mt-1 leading-relaxed">
                  {petTriageCase.differentials[0]?.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#00685f] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Reviewed: {petTriageCase.reviewedBy || 'Veterinary Triage Engine'}
                </span>
                <button
                  onClick={onViewAllRecords}
                  className="text-xs font-bold text-[#00685f] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View Full Differential Panel →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 span): Active Prescriptions & Nearest ER Trauma Centre */}
        <div className="space-y-6">
          {/* Active Medications Checklist */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-[#00685f]" />
                <h3 className="font-heading font-bold text-base text-[#131b2e]">
                  Active Prescriptions
                </h3>
              </div>
              <button
                onClick={onViewAllMeds}
                className="text-xs font-bold text-[#00685f] hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>

            {petMeds.length === 0 ? (
              <p className="text-xs text-[#6d7a77] py-4 text-center">
                No active prescriptions for {pet.name}.
              </p>
            ) : (
              <div className="space-y-3">
                {petMeds.map((med) => (
                  <div
                    key={med.id}
                    className="p-3.5 rounded-2xl bg-[#faf8ff] border border-[#e2e8f0] hover:border-[#bcc9c6] transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-[#131b2e]">
                          {med.name}
                        </h4>
                        <span className="text-xs text-[#00685f] font-medium block">
                          {med.dosage}
                        </span>
                      </div>
                      <button
                        onClick={() => onAdministerMedication(med.id)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          med.administeredToday
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-[#00685f] hover:bg-[#005049] text-white shadow-2xs'
                        }`}
                      >
                        {med.administeredToday ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Taken
                          </>
                        ) : (
                          'Give Dose'
                        )}
                      </button>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-[#6d7a77]">
                      <span>Next: <strong>{med.nextDoseTime}</strong></span>
                      <span>{med.remainingDoses} doses left</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 24/7 Nearest Trauma Hospital Card */}
          <div className="bg-gradient-to-br from-[#131b2e] to-[#283044] rounded-3xl p-6 text-white shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30">
                Nearest 24/7 Emergency Center
              </span>
              <span className="text-xs font-bold text-teal-300">
                {nearbyER.distanceMiles} mi • {nearbyER.driveTimeMin} min ETA
              </span>
            </div>

            <h3 className="font-heading font-bold text-base text-white mt-1">
              {nearbyER.name}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {nearbyER.address}
            </p>
            <p className="text-[11px] text-teal-200 mt-2">
              Staffing: {nearbyER.availableStaff}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-2">
              <button
                onClick={() => onOpenDirections?.(nearbyER)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-teal-300" />
                <span>Maps Directions</span>
              </button>
              <button
                onClick={onOpenEmergencyHotline}
                className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call ({nearbyER.phone})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
