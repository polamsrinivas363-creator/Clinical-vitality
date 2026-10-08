import React, { useState } from 'react';
import { Pet, TriageCase } from '../types';
import { COMMON_SYMPTOMS_LIST } from '../data/mockData';
import { runClinicalAITriage, TriageInput } from '../services/aiTriageEngine';
import { VoiceMicButton } from './VoiceMicButton';
import { 
  HeartPulse, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldAlert, 
  Stethoscope, 
  Activity, 
  ChevronRight,
  RotateCcw,
  PhoneCall,
  Clock,
  Layers
} from 'lucide-react';

interface TriageWizardProps {
  pet: Pet;
  onTriageComplete: (newCase: TriageCase) => void;
  onOpenEmergencyHotline: () => void;
  onOpenTeleVet: () => void;
}

export const TriageWizard: React.FC<TriageWizardProps> = ({
  pet,
  onTriageComplete,
  onOpenEmergencyHotline,
  onOpenTeleVet
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customComplaint, setCustomComplaint] = useState('');
  const [duration, setDuration] = useState('Under 4 hours');
  const [painRating, setPainRating] = useState(2);
  const [breathingRate, setBreathingRate] = useState(pet.vitals.restingRespiratoryRate);
  const [gumColor, setGumColor] = useState<'Pink' | 'Pale White' | 'Brick Red' | 'Blue Cyanotic' | 'Yellow Jaundiced'>('Pink');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageCase | null>(null);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleRunAssessment = async () => {
    setIsAnalyzing(true);
    setStep(3);

    // Give visual animation of clinical AI matrix scanning
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const input: TriageInput = {
      pet,
      selectedSymptoms,
      customComplaint,
      duration,
      painRating,
      breathingRate,
      gumColor,
    };

    const result = await runClinicalAITriage(input);
    setTriageResult(result);
    setIsAnalyzing(false);
    setStep(4);
    onTriageComplete(result);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedSymptoms([]);
    setCustomComplaint('');
    setPainRating(2);
    setTriageResult(null);
  };

  // Glasgow pain scale labels
  const getPainDescriptor = (val: number) => {
    if (val === 0) return 'No pain observed (Calm, relaxed, normal appetite)';
    if (val <= 2) return 'Mild discomfort (Slightly less active, guarded when touched)';
    if (val <= 4) return 'Moderate discomfort (Stiff gait, panting at rest, reluctant to move)';
    if (val <= 7) return 'Marked pain (Vocalizing, whimpering, guarding affected area, refusing food)';
    return 'Severe agony / acute shock (Trembling, howling, non-weight bearing, rapid shallow panting)';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Header Stepper */}
      <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2e8f0] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#eaedff] text-[#00685f]">
                AI Clinical Intake
              </span>
              <span className="text-xs text-[#6d7a77]">
                Patient: <strong className="text-[#131b2e]">{pet.name}</strong> ({pet.breed}, {pet.weightLbs} lbs)
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-[#131b2e] mt-1">
              Veterinary Symptom Assessment & Triage
            </h2>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center gap-2">
            {[1, 2, 4].map((sIndex, idx) => (
              <div key={sIndex} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-xs transition-colors ${
                    step === sIndex || (step === 3 && sIndex === 2)
                      ? 'bg-[#00685f] text-white ring-4 ring-[#89f5e7]/30'
                      : step > sIndex
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-[#faf8ff] text-[#6d7a77] border border-[#e2e8f0]'
                  }`}
                >
                  {step > sIndex && sIndex !== 4 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  ) : (
                    idx + 1
                  )}
                </div>
                {idx < 2 && (
                  <div
                    className={`w-6 h-0.5 mx-1 ${
                      step > sIndex ? 'bg-emerald-400' : 'bg-[#e2e8f0]'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: Symptom Checklist & Complaint */}
        {step === 1 && (
          <div className="mt-6 space-y-6 animate-in fade-in">
            <div>
              <label className="block font-heading font-bold text-sm text-[#131b2e] mb-1">
                Select Observed Signs & Symptoms
              </label>
              <p className="text-xs text-[#6d7a77] mb-3">
                Check all manifestations that have emerged recently in {pet.name}.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {COMMON_SYMPTOMS_LIST.map((item) => {
                  const isSelected = selectedSymptoms.includes(item.id);
                  const isUrgentTag = item.severity === 'Urgent';
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleSymptom(item.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#eaedff] border-[#00685f] text-[#00685f] shadow-xs'
                          : 'bg-[#faf8ff] hover:bg-[#f2f3ff] border-[#e2e8f0] text-[#131b2e]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                            isSelected
                              ? 'bg-[#00685f] border-[#00685f] text-white'
                              : 'border-[#bcc9c6] bg-white'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className="font-heading font-semibold text-xs sm:text-sm">
                          {item.label}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          isUrgentTag
                            ? 'bg-red-100 text-red-700'
                            : item.severity === 'Caution'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.severity}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-heading font-bold text-sm text-[#131b2e]">
                  Additional Notes or Specific Incident
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-[#6d7a77] hidden sm:inline">
                    Speak symptom details:
                  </span>
                  <VoiceMicButton
                    size="sm"
                    buttonText="Voice Dictate (AI Transcribe)"
                    onTranscribed={(text) => {
                      setCustomComplaint((prev) => (prev ? `${prev} ${text}` : text));
                    }}
                  />
                </div>
              </div>
              <textarea
                value={customComplaint}
                onChange={(e) => setCustomComplaint(e.target.value)}
                rows={3}
                placeholder="e.g., Jumped off deck this morning, now won't bear weight on rear left leg and is panting heavily. Ate a piece of dark chocolate 2 hours ago..."
                className="w-full p-3.5 rounded-2xl border border-[#e2e8f0] bg-[#faf8ff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f] text-sm text-[#131b2e] placeholder-[#6d7a77]"
              />
            </div>

            {/* Quick Presets for Demo */}
            <div className="p-4 rounded-2xl bg-[#eaedff]/40 border border-[#bcc9c6]/30">
              <span className="text-xs font-bold text-[#006398] uppercase tracking-wider block mb-2">
                Simulate Clinical Triage Scenarios:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSymptoms(['bloated_distended', 'vomiting_repetitive', 'breathing_effort']);
                    setCustomComplaint('Distended hard abdomen after dinner, non-productive retching, pacing continuously.');
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-red-100 hover:bg-red-200 text-red-800 transition cursor-pointer"
                >
                  🚨 Acute Bloat / GDV (Emergency)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSymptoms(['sudden_paralysis', 'limping']);
                    setCustomComplaint('Refusing to walk up stairs, arched back, trembling when touched on back.');
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-amber-100 hover:bg-amber-200 text-amber-800 transition cursor-pointer"
                >
                  ⚠️ Lumbar Spine / IVDD (Caution)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSymptoms(['ear_scratching']);
                    setCustomComplaint('Shaking head vigorously and scratching right ear since yesterday afternoon.');
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition cursor-pointer"
                >
                  🟢 Ear Scratching / Otitis (Routine)
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#e2e8f0]">
              <button
                type="button"
                disabled={selectedSymptoms.length === 0 && !customComplaint.trim()}
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-heading font-bold text-sm text-white bg-[#00685f] hover:bg-[#005049] disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <span>Continue to Clinical Vitals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Clinical Vitals & Pain Rating */}
        {step === 2 && (
          <div className="mt-6 space-y-6 animate-in fade-in">
            {/* Glasgow Pain Scale */}
            <div className="p-5 rounded-2xl bg-[#faf8ff] border border-[#e2e8f0]">
              <div className="flex items-center justify-between mb-2">
                <label className="font-heading font-bold text-sm text-[#131b2e] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#00685f]" />
                  Pain & Discomfort Score (Glasgow Composite Scale)
                </label>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  painRating >= 7 ? 'bg-red-100 text-red-700' : painRating >= 4 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Level {painRating} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={painRating}
                onChange={(e) => setPainRating(Number(e.target.value))}
                className="w-full h-2.5 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-[#00685f]"
              />
              <p className="text-xs text-[#006398] mt-2 font-medium">
                {getPainDescriptor(painRating)}
              </p>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Duration */}
              <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#e2e8f0]">
                <label className="block text-xs font-bold text-[#6d7a77] uppercase tracking-wider mb-2">
                  Symptom Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e2e8f0] bg-white text-xs font-semibold text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                >
                  <option value="Under 2 hours">Under 2 hours (Sudden onset)</option>
                  <option value="2 to 6 hours">2 to 6 hours</option>
                  <option value="6 to 24 hours">6 to 24 hours</option>
                  <option value="1 to 3 days">1 to 3 days</option>
                  <option value="Over 3 days">Over 3 days (Chronic/worsening)</option>
                </select>
              </div>

              {/* Resting Respiratory Rate */}
              <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#e2e8f0]">
                <label className="block text-xs font-bold text-[#6d7a77] uppercase tracking-wider mb-2">
                  Breathing Rate (Breaths/Min)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="10"
                    max="90"
                    value={breathingRate}
                    onChange={(e) => setBreathingRate(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#e2e8f0] bg-white text-xs font-semibold text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                  />
                  <span className="text-xs text-[#6d7a77] font-medium whitespace-nowrap">BPM</span>
                </div>
                <span className="text-[11px] text-[#6d7a77] mt-1 block">Normal: 15 - 30</span>
              </div>

              {/* Gum Color Indicator */}
              <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#e2e8f0]">
                <label className="block text-xs font-bold text-[#6d7a77] uppercase tracking-wider mb-2">
                  Mucous Membrane (Gum Color)
                </label>
                <select
                  value={gumColor}
                  onChange={(e) => setGumColor(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#e2e8f0] bg-white text-xs font-semibold text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                >
                  <option value="Pink">Healthy Pink (Normal)</option>
                  <option value="Pale White">Pale White / Grey (Critical Shock)</option>
                  <option value="Brick Red">Brick Red (Hyperdynamic / Sepsis)</option>
                  <option value="Blue Cyanotic">Blue / Purple (Severe Hypoxia)</option>
                  <option value="Yellow Jaundiced">Yellow Jaundiced (Hepatic/Hemolysis)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#e2e8f0]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6d7a77] hover:bg-[#eaedff] transition cursor-pointer"
              >
                ← Back to Symptoms
              </button>

              <button
                type="button"
                onClick={handleRunAssessment}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-heading font-bold text-sm text-white bg-gradient-to-r from-[#00685f] to-[#008378] hover:shadow-lg transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run AI Clinical Triage Analysis</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Animated Scanning */}
        {step === 3 && (
          <div className="py-16 text-center space-y-4 animate-in fade-in">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-[#89f5e7] opacity-25 animate-ping" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#00685f] to-[#008378] flex items-center justify-center text-white shadow-xl animate-pulse">
                <HeartPulse className="w-10 h-10" />
              </div>
            </div>
            <h3 className="font-heading font-bold text-xl text-[#131b2e]">
              Cross-Referencing Veterinary Clinical Diagnostic Engine...
            </h3>
            <p className="text-xs text-[#6d7a77] max-w-md mx-auto">
              Evaluating species-specific predispositions for {pet.breed}, computing Glasgow score, and cross-matching emergency red flags.
            </p>
          </div>
        )}

        {/* STEP 4: Triage Results & Action Report */}
        {step === 4 && triageResult && (
          <div className="mt-6 space-y-6 animate-in fade-in">
            {/* Primary Urgency Banner */}
            <div
              className={`p-6 rounded-3xl border ${
                triageResult.triageLevel === 'Urgent'
                  ? 'bg-red-50 border-red-300 text-red-950 shadow-md shadow-red-200/50'
                  : triageResult.triageLevel === 'Caution'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 ${
                      triageResult.triageLevel === 'Urgent'
                        ? 'bg-red-600'
                        : triageResult.triageLevel === 'Caution'
                        ? 'bg-amber-600'
                        : 'bg-emerald-600'
                    }`}
                  >
                    {triageResult.triageLevel === 'Urgent' ? (
                      <AlertOctagon className="w-7 h-7" />
                    ) : triageResult.triageLevel === 'Caution' ? (
                      <AlertTriangle className="w-7 h-7" />
                    ) : (
                      <CheckCircle2 className="w-7 h-7" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-extrabold text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/80 shadow-xs">
                        Triage Level: {triageResult.triageLevel}
                      </span>
                      <span className="text-xs font-semibold">
                        Urgency Score: {triageResult.urgencyScore} / 10
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-xl sm:text-2xl mt-1">
                      {triageResult.recommendedDisposition}
                    </h3>
                    <p className="text-xs mt-1 opacity-90">
                      Primary Complaint: {triageResult.primaryComplaint}
                    </p>
                  </div>
                </div>

                {/* Quick Disposition CTA */}
                {triageResult.triageLevel === 'Urgent' ? (
                  <button
                    onClick={onOpenEmergencyHotline}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-heading font-bold text-xs sm:text-sm shadow-lg shadow-red-600/30 transition cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 animate-bounce" />
                    <span>Dispatch to 24/7 ER Vet</span>
                  </button>
                ) : (
                  <button
                    onClick={onOpenTeleVet}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#00685f] hover:bg-[#005049] text-white font-heading font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>Connect with Tele-Vet</span>
                  </button>
                )}
              </div>
            </div>

            {/* Red Flag Warnings if any */}
            {triageResult.redFlagWarnings.length > 0 && (
              <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200">
                <div className="flex items-center gap-2 text-red-800 font-heading font-bold text-xs uppercase tracking-wider mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  Critical Red Flags Requiring Immediate Emergency Transfer:
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-red-900">
                  {triageResult.redFlagWarnings.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white/70 p-2 rounded-xl">
                      <span className="text-red-600 font-bold">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Differential Diagnoses & Clinical Insights */}
            <div className="bg-[#faf8ff] rounded-2xl p-5 border border-[#e2e8f0]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-heading font-bold text-sm text-[#131b2e] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#00685f]" />
                  Differential Diagnoses (AI Clinical Confidence)
                </h4>
                <span className="text-[11px] text-[#6d7a77]">
                  Ranked by pathology probability
                </span>
              </div>

              <div className="space-y-3">
                {triageResult.differentials.map((diff, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-xl border border-[#e2e8f0] shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-heading font-bold text-sm text-[#131b2e]">
                        {diff.condition}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#00685f]">
                          {diff.confidence}% Match
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            diff.severity === 'Urgent'
                              ? 'bg-red-100 text-red-700'
                              : diff.severity === 'Caution'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {diff.severity}
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-[#eaedff] h-1.5 rounded-full overflow-hidden mb-2">
                      <div
                        className="bg-[#00685f] h-full rounded-full transition-all"
                        style={{ width: `${diff.confidence}%` }}
                      />
                    </div>
                    <p className="text-xs text-[#6d7a77] mb-2 leading-relaxed">
                      {diff.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {diff.clinicalSignsMatched.map((sign, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] bg-[#f2f3ff] text-[#006398] px-2 py-0.5 rounded-md font-medium"
                        >
                          ✓ {sign}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Immediate Action Plan */}
            <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0]">
              <h4 className="font-heading font-bold text-sm text-[#131b2e] flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Step-by-Step Care & Monitoring Protocol
              </h4>
              <div className="space-y-2">
                {triageResult.immediateActionPlan.map((action, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-[#faf8ff] border border-[#e2e8f0]/60">
                    <span className="w-5 h-5 rounded-full bg-[#eaedff] text-[#00685f] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs text-[#131b2e] leading-relaxed">
                      {action}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#e2e8f0]">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6d7a77] hover:bg-[#eaedff] transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Start New Assessment
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onOpenTeleVet}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold text-[#006398] bg-[#eaedff] hover:bg-[#dae2fd] transition cursor-pointer"
                >
                  Consult Vet on Call
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Report saved to ${pet.name}'s official health history.`)}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] shadow-sm transition cursor-pointer"
                >
                  Save to Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
