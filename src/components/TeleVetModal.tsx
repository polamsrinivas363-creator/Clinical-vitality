import React, { useState } from 'react';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, ShieldCheck, Stethoscope, Heart } from 'lucide-react';
import { Pet } from '../types';

interface TeleVetModalProps {
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
}

export const TeleVetModal: React.FC<TeleVetModalProps> = ({
  pet,
  isOpen,
  onClose,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(true);
  const [connectedTime, setConnectedTime] = useState('01:24');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#131b2e] rounded-3xl max-w-4xl w-full h-[90vh] max-h-[700px] shadow-2xl border border-slate-700 overflow-hidden flex flex-col">
        {/* Top Video Header */}
        <div className="p-4 bg-[#1e273d] border-b border-slate-700/80 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00685f] flex items-center justify-center text-white font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm text-white">
                  Tele-Triage: Dr. Sarah Chen, DVM, MRCVS
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-300">
                Patient: {pet.name} ({pet.breed}, {pet.weightLbs} lbs) • Duration: {connectedTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              HIPAA & VCPR Compliant Encrypted Line
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Stage Area */}
        <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* Main Vet Video Feed */}
          <div className="w-full h-full relative">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80"
              alt="Dr. Sarah Chen, DVM"
              className="w-full h-full object-cover"
            />
            {/* Live Telemetry Overlay in Corner */}
            <div className="absolute top-4 left-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-white max-w-xs text-xs space-y-1">
              <span className="font-heading font-bold text-[11px] uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-teal-400" /> Live Pet Vitals Overlay
              </span>
              <div className="flex justify-between gap-4 text-[11px]">
                <span className="text-slate-300">Resting Resp:</span>
                <span className="font-bold text-white">{pet.vitals.restingRespiratoryRate} bpm</span>
              </div>
              <div className="flex justify-between gap-4 text-[11px]">
                <span className="text-slate-300">Temp:</span>
                <span className="font-bold text-white">{pet.vitals.temperatureF}°F</span>
              </div>
              <div className="flex justify-between gap-4 text-[11px]">
                <span className="text-slate-300">Pain Index:</span>
                <span className="font-bold text-white">{pet.vitals.painIndex} / 10</span>
              </div>
            </div>

            {/* Doctor Subtitle Banner */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 text-white text-xs max-w-lg text-center shadow-lg">
              <span className="text-teal-300 font-bold">Dr. Chen: </span>
              &ldquo;I can see {pet.name}&apos;s breathing rhythm clearly. Keep {pet.name} sitting upright so the thoracic cavity can expand without compression.&rdquo;
            </div>

            {/* Owner / Pet Self-View PIP */}
            <div className="absolute bottom-4 right-4 w-32 sm:w-44 h-24 sm:h-32 rounded-2xl bg-slate-800 border-2 border-white/30 overflow-hidden shadow-2xl">
              {isVideoActive ? (
                <img
                  src={pet.avatarUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                  Camera Off
                </div>
              )}
              <span className="absolute bottom-1 left-2 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white font-medium">
                You ({pet.name})
              </span>
            </div>
          </div>
        </div>

        {/* Video Controls Bar */}
        <div className="p-4 bg-[#1e273d] border-t border-slate-700/80 flex items-center justify-center gap-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-2xl transition cursor-pointer ${
              isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsVideoActive(!isVideoActive)}
            className={`p-3.5 rounded-2xl transition cursor-pointer ${
              !isVideoActive ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
            title={isVideoActive ? 'Turn Camera Off' : 'Turn Camera On'}
          >
            {isVideoActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-heading font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition cursor-pointer"
          >
            <PhoneOff className="w-5 h-5" />
            <span>End Consultation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
