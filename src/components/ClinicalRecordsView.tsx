import React, { useState } from 'react';
import { Pet, TriageCase, DiagnosticRecord } from '../types';
import { 
  FileText, 
  Layers, 
  Activity, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Calendar, 
  Stethoscope, 
  ChevronDown, 
  ChevronUp, 
  Filter
} from 'lucide-react';

interface ClinicalRecordsViewProps {
  pet: Pet;
  triageCases: TriageCase[];
  diagnostics: DiagnosticRecord[];
  onOpenNewTriage: () => void;
}

export const ClinicalRecordsView: React.FC<ClinicalRecordsViewProps> = ({
  pet,
  triageCases,
  diagnostics,
  onOpenNewTriage,
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'triage' | 'labs'>('all');
  const [expandedLabId, setExpandedLabId] = useState<string | null>(diagnostics[0]?.id || null);

  const filteredCases = triageCases.filter((c) => c.petId === pet.id);
  const filteredLabs = diagnostics.filter((d) => d.petId === pet.id);

  const toggleLabExpand = (id: string) => {
    setExpandedLabId(expandedLabId === id ? null : id);
  };

  const handleExportPDF = () => {
    alert(`Exporting complete verified clinical record for ${pet.name} (Microchip: ${pet.microchipId}) in PDF format...`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#eaedff] text-[#00685f]">
              Official Health Dossier
            </span>
            <span className="text-xs text-[#6d7a77]">
              Patient: <strong>{pet.name}</strong> ({pet.breed})
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-[#131b2e]">
            Clinical Diagnostics & Longitudinal History
          </h2>
          <p className="text-xs text-[#6d7a77]">
            Comprehensive veterinary laboratory panels, radiographic surveys, and AI triage transcripts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleExportPDF}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-[#faf8ff] hover:bg-[#eaedff] text-xs font-semibold text-[#131b2e] transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#00685f]" />
            <span>Export Record PDF</span>
          </button>
          <button
            onClick={onOpenNewTriage}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#00685f] hover:bg-[#005049] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <span>+ New Assessment</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#e2e8f0] pb-2">
        <button
          onClick={() => setActiveSection('all')}
          className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition cursor-pointer ${
            activeSection === 'all'
              ? 'bg-[#00685f] text-white'
              : 'text-[#6d7a77] hover:bg-[#eaedff]'
          }`}
        >
          All Clinical Records ({filteredCases.length + filteredLabs.length})
        </button>
        <button
          onClick={() => setActiveSection('labs')}
          className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition cursor-pointer ${
            activeSection === 'labs'
              ? 'bg-[#00685f] text-white'
              : 'text-[#6d7a77] hover:bg-[#eaedff]'
          }`}
        >
          Diagnostic Labs & Radiology ({filteredLabs.length})
        </button>
        <button
          onClick={() => setActiveSection('triage')}
          className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition cursor-pointer ${
            activeSection === 'triage'
              ? 'bg-[#00685f] text-white'
              : 'text-[#6d7a77] hover:bg-[#eaedff]'
          }`}
        >
          AI Triage Reports ({filteredCases.length})
        </button>
      </div>

      {/* SECTION 1: Laboratory Diagnostics & Blood Panels */}
      {(activeSection === 'all' || activeSection === 'labs') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#00685f]" />
            <h3 className="font-heading font-bold text-lg text-[#131b2e]">
              Laboratory Diagnostic Panels & Imaging
            </h3>
          </div>

          {filteredLabs.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-[#e2e8f0]">
              <p className="text-xs text-[#6d7a77]">No laboratory panels filed yet for {pet.name}.</p>
            </div>
          ) : (
            filteredLabs.map((lab) => {
              const isExpanded = expandedLabId === lab.id;
              return (
                <div
                  key={lab.id}
                  className="bg-white rounded-3xl border border-[#e2e8f0] shadow-xs overflow-hidden"
                >
                  {/* Lab Header Summary */}
                  <div
                    onClick={() => toggleLabExpand(lab.id)}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#faf8ff] transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#eaedff] text-[#006398] flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#eaedff] text-[#006398]">
                            {lab.category}
                          </span>
                          <span className="text-xs text-[#6d7a77] flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {lab.date}
                          </span>
                        </div>
                        <h4 className="font-heading font-bold text-base text-[#131b2e] mt-1">
                          {lab.title}
                        </h4>
                        <p className="text-xs text-[#6d7a77] mt-0.5">
                          Assessing Clinician: {lab.vetPractitioner}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      {lab.abnormalFlagsCount > 0 ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          {lab.abnormalFlagsCount} Parameter Flagged
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          All Within Normal Limits
                        </span>
                      )}

                      <button className="p-1 rounded-full text-[#6d7a77]">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Parameters Table */}
                  {isExpanded && (
                    <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-[#e2e8f0] bg-[#faf8ff]/50 animate-in fade-in">
                      <div className="p-3.5 rounded-2xl bg-white border border-[#e2e8f0] mb-4 text-xs text-[#131b2e] leading-relaxed">
                        <strong className="text-[#00685f]">Clinician Summary Note:</strong> {lab.summary}
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-[#e2e8f0] text-[#6d7a77] uppercase text-[10px] font-bold">
                              <th className="py-2.5 px-3">Analyte / Biomarker</th>
                              <th className="py-2.5 px-3">Measured Value</th>
                              <th className="py-2.5 px-3">Reference Interval</th>
                              <th className="py-2.5 px-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e2e8f0]/70">
                            {lab.results.map((param, pIdx) => {
                              const isAbnormal = param.status !== 'normal';
                              return (
                                <tr
                                  key={pIdx}
                                  className={`hover:bg-white transition ${
                                    isAbnormal ? 'bg-amber-50/50' : ''
                                  }`}
                                >
                                  <td className="py-2.5 px-3 font-semibold text-[#131b2e]">
                                    {param.parameter}
                                  </td>
                                  <td className="py-2.5 px-3 font-bold text-[#131b2e]">
                                    {param.value} {param.unit}
                                  </td>
                                  <td className="py-2.5 px-3 text-[#6d7a77]">
                                    {param.referenceRange} {param.unit}
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <span
                                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                        param.status === 'normal'
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : param.status === 'critical'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-amber-100 text-amber-800'
                                      }`}
                                    >
                                      {param.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* SECTION 2: AI Triage Cases & Clinical Evaluations */}
      {(activeSection === 'all' || activeSection === 'triage') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#00685f]" />
            <h3 className="font-heading font-bold text-lg text-[#131b2e]">
              AI Clinical Triage Transcripts & Dispositions
            </h3>
          </div>

          {filteredCases.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-[#e2e8f0]">
              <p className="text-xs text-[#6d7a77]">No triage cases filed for {pet.name}.</p>
              <button
                onClick={onOpenNewTriage}
                className="mt-3 px-4 py-2 rounded-xl bg-[#00685f] text-white text-xs font-semibold cursor-pointer"
              >
                Run First Triage Assessment
              </button>
            </div>
          ) : (
            filteredCases.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e2e8f0] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-xs uppercase px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#006398]">
                        Case ID: #{c.id}
                      </span>
                      <span className="text-xs text-[#6d7a77]">{c.timestamp}</span>
                    </div>
                    <h4 className="font-heading font-bold text-base text-[#131b2e] mt-1">
                      {c.primaryComplaint}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        c.triageLevel === 'Urgent'
                          ? 'bg-red-100 text-red-700'
                          : c.triageLevel === 'Caution'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Triage: {c.triageLevel} (Urgency {c.urgencyScore}/10)
                    </span>
                    <span className="text-xs text-[#6d7a77] font-medium px-2 py-1 rounded-lg bg-[#faf8ff] border border-[#e2e8f0]">
                      {c.status}
                    </span>
                  </div>
                </div>

                {/* Symptoms reported */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6d7a77] block mb-1">
                    Symptoms Recorded at Intake:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {c.symptomsReported.map((sym, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-lg bg-[#faf8ff] border border-[#e2e8f0] text-xs font-medium text-[#131b2e]"
                      >
                        • {sym}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Differential Diagnoses */}
                <div className="bg-[#faf8ff] rounded-2xl p-4 border border-[#e2e8f0]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6d7a77] block mb-2">
                    Top AI Differential Diagnoses:
                  </span>
                  <div className="space-y-2">
                    {c.differentials.map((diff, dIdx) => (
                      <div key={dIdx} className="bg-white p-3 rounded-xl border border-[#e2e8f0]/80">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-heading font-bold text-xs sm:text-sm text-[#131b2e]">
                            {diff.condition}
                          </span>
                          <span className="text-xs font-bold text-[#00685f]">
                            {diff.confidence}% Match
                          </span>
                        </div>
                        <p className="text-xs text-[#6d7a77] leading-relaxed">
                          {diff.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vet Notes */}
                {c.vetNotes && (
                  <div className="p-3.5 rounded-2xl bg-[#eaedff]/50 border border-[#bcc9c6]/40 text-xs text-[#131b2e]">
                    <div className="flex items-center gap-1.5 font-bold text-[#006398] mb-1">
                      <Stethoscope className="w-3.5 h-3.5" /> Attending Reviewer Note ({c.reviewedBy}):
                    </div>
                    {c.vetNotes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
