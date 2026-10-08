import React, { useState, useEffect } from 'react';
import { X, Play, RotateCcw, CheckCircle, AlertTriangle, Info, Heart } from 'lucide-react';
import { Pet } from '../types';

interface RespiratoryCounterModalProps {
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
  onSaveRate: (rate: number) => void;
}

export const RespiratoryCounterModal: React.FC<RespiratoryCounterModalProps> = ({
  pet,
  isOpen,
  onClose,
  onSaveRate,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [breathCount, setBreathCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [tapEffect, setTapEffect] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  if (!isOpen) return null;

  const handleTapBreath = () => {
    if (!isRunning && !completed) {
      setIsRunning(true);
    }
    if (secondsLeft > 0) {
      setBreathCount((prev) => prev + 1);
      setTapEffect(true);
      setTimeout(() => setTapEffect(false), 200);
    }
  };

  const calculatedBreathsPerMinute = Math.round((breathCount / (30 - secondsLeft || 1)) * 60);
  const finalCalculatedRate = completed ? breathCount * 2 : calculatedBreathsPerMinute;

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(30);
    setBreathCount(0);
    setCompleted(false);
  };

  const handleSave = () => {
    onSaveRate(finalCalculatedRate);
    onClose();
  };

  const isRateAbnormal = finalCalculatedRate > 30;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#e2e8f0] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#faf8ff] border-b border-[#e2e8f0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#eaedff] text-[#006398] flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#131b2e]">
                Clinical RRR Breath Counter
              </h3>
              <p className="text-xs text-[#6d7a77]">
                Resting Respiratory Rate for {pet.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#6d7a77] hover:text-[#131b2e] hover:bg-[#eaedff] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Instructions banner */}
          <div className="mb-6 p-3 rounded-2xl bg-[#eaedff]/60 border border-[#bcc9c6]/40 flex items-start gap-2.5 text-left text-xs text-[#131b2e]">
            <Info className="w-4 h-4 text-[#006398] shrink-0 mt-0.5" />
            <span>
              Watch {pet.name}&apos;s chest rise while asleep or calmly resting. 
              Tap the large button every time the chest rises (one full inhale).
            </span>
          </div>

          {/* Timer Display */}
          <div className="flex justify-center items-center gap-6 mb-6">
            <div className="p-3 rounded-2xl bg-[#faf8ff] border border-[#e2e8f0] min-w-[100px]">
              <span className="block text-xs font-semibold text-[#6d7a77] uppercase">Timer</span>
              <span className="font-heading font-bold text-3xl text-[#131b2e]">
                {secondsLeft}s
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#faf8ff] border border-[#e2e8f0] min-w-[100px]">
              <span className="block text-xs font-semibold text-[#6d7a77] uppercase">Breaths</span>
              <span className="font-heading font-bold text-3xl text-[#00685f]">
                {breathCount}
              </span>
            </div>
          </div>

          {/* Interactive Tap Circle */}
          <div className="my-6 flex justify-center">
            <button
              onClick={handleTapBreath}
              disabled={completed}
              className={`w-44 h-44 rounded-full flex flex-col items-center justify-center transition-all transform cursor-pointer ${
                completed
                  ? 'bg-emerald-100 text-emerald-800 border-4 border-emerald-500'
                  : tapEffect
                  ? 'scale-95 bg-[#005049] text-white shadow-inner'
                  : 'bg-gradient-to-br from-[#00685f] to-[#008378] text-white shadow-xl hover:shadow-2xl hover:scale-102 active:scale-95 ring-8 ring-[#89f5e7]/30'
              }`}
            >
              {completed ? (
                <>
                  <CheckCircle className="w-10 h-10 mb-2 text-emerald-600" />
                  <span className="font-heading font-bold text-sm">30s Complete</span>
                </>
              ) : (
                <>
                  <span className="font-heading font-extrabold text-lg uppercase tracking-wider">
                    {isRunning ? 'TAP INHALE' : 'TAP TO START'}
                  </span>
                  <span className="text-xs text-teal-100 mt-1">
                    {isRunning ? 'Tap each breath' : '30-second measurement'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Real-time Calculation / Result */}
          {(isRunning || completed) && (
            <div className={`p-4 rounded-2xl border transition-all ${
              isRateAbnormal
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}>
              <div className="flex items-center justify-center gap-2">
                {isRateAbnormal && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                <span className="font-heading font-bold text-lg">
                  {finalCalculatedRate} breaths/min
                </span>
              </div>
              <p className="text-xs mt-1">
                {isRateAbnormal
                  ? `Elevated (>30 bpm). Normal resting rate is 15-30 bpm for ${pet.species.toLowerCase()}s.`
                  : `Within normal reference range (15-30 bpm for resting ${pet.species.toLowerCase()}s).`}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6d7a77] hover:bg-[#eaedff] transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#131b2e] bg-[#f2f3ff] hover:bg-[#eaedff] transition cursor-pointer"
              >
                Cancel
              </button>
              {completed && (
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] shadow-md transition cursor-pointer"
                >
                  Save to {pet.name}&apos;s Record
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
