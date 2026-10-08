import React from 'react';
import { X, PhoneCall, AlertOctagon, ShieldAlert, Heart, Info, ArrowUpRight } from 'lucide-react';
import { Pet } from '../types';

interface EmergencyHotlineModalProps {
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyHotlineModal: React.FC<EmergencyHotlineModalProps> = ({
  pet,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-red-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-[#ba1a1a] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <AlertOctagon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-white">
                24/7 Emergency Pet Response & Poison Control
              </h3>
              <p className="text-xs text-red-100">
                Direct emergency hotlines & immediate first-aid protocols
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hotlines */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-3">
            {/* Metro Trauma */}
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-200 text-red-900 px-2 py-0.5 rounded-md">
                  Local 24/7 Trauma ER
                </span>
                <h4 className="font-heading font-bold text-sm text-[#131b2e] mt-1">
                  Metropolitan Veterinary Trauma Hospital
                </h4>
                <p className="text-xs text-[#6d7a77]">2.1 miles away • Board-Certified Criticalists on Duty</p>
              </div>
              <a
                href="tel:4155550199"
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-heading font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-600/30 transition shrink-0"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>Call Now (415) 555-0199</span>
              </a>
            </div>

            {/* ASPCA Animal Poison Control Center */}
            <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#e2e8f0] flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#eaedff] text-[#006398] px-2 py-0.5 rounded-md">
                  Toxic Ingestion
                </span>
                <h4 className="font-heading font-bold text-sm text-[#131b2e] mt-1">
                  ASPCA Animal Poison Control (APCC)
                </h4>
                <p className="text-xs text-[#6d7a77]">24/7 Board-Certified Veterinary Toxicologists</p>
              </div>
              <a
                href="tel:8884264435"
                className="px-4 py-2 rounded-xl bg-[#00685f] hover:bg-[#005049] text-white font-bold text-xs flex items-center gap-1.5 transition shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>(888) 426-4435</span>
              </a>
            </div>

            {/* Pet Poison Helpline */}
            <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#e2e8f0] flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#eaedff] text-[#006398] px-2 py-0.5 rounded-md">
                  Poison Helpline
                </span>
                <h4 className="font-heading font-bold text-sm text-[#131b2e] mt-1">
                  Pet Poison Helpline 24/7
                </h4>
                <p className="text-xs text-[#6d7a77]">Nationwide Emergency Animal Toxin Center</p>
              </div>
              <a
                href="tel:8557647661"
                className="px-4 py-2 rounded-xl bg-[#006398] hover:bg-[#004b73] text-white font-bold text-xs flex items-center gap-1.5 transition shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>(855) 764-7661</span>
              </a>
            </div>
          </div>

          {/* Rapid Triage First Aid Matrix */}
          <div className="mt-5 pt-4 border-t border-[#e2e8f0]">
            <h4 className="font-heading font-bold text-sm text-[#131b2e] mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              Immediate En Route Stabilization Steps for {pet.name}:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#131b2e]">
              <div className="p-2.5 rounded-xl bg-[#faf8ff] border border-[#e2e8f0]">
                <strong className="text-red-700 block mb-0.5">Heatstroke / Hyperthermia:</strong>
                Apply cool (never ice cold) wet towels to paws and groin. Turn car AC to maximum.
              </div>
              <div className="p-2.5 rounded-xl bg-[#faf8ff] border border-[#e2e8f0]">
                <strong className="text-red-700 block mb-0.5">Bleeding / Laceration:</strong>
                Apply continuous firm direct pressure with clean cloth. Do not remove saturated layers.
              </div>
              <div className="p-2.5 rounded-xl bg-[#faf8ff] border border-[#e2e8f0]">
                <strong className="text-red-700 block mb-0.5">Suspected Spinal Injury:</strong>
                Transport on a flat, rigid board or firm blanket. Keep spine strictly immobile.
              </div>
              <div className="p-2.5 rounded-xl bg-[#faf8ff] border border-[#e2e8f0]">
                <strong className="text-red-700 block mb-0.5">Bloat / GDV (Retching):</strong>
                Do not allow any food or water. Transport immediately with head slightly elevated.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#faf8ff] border-t border-[#e2e8f0] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#131b2e] text-white text-xs font-semibold hover:bg-black transition cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
