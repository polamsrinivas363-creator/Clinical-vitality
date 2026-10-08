import React, { useState } from 'react';
import { Pet, EmergencyClinic, TeleConsultMessage } from '../types';
import { EMERGENCY_CLINICS } from '../data/mockData';
import { ClinicDirectionsModal } from './ClinicDirectionsModal';
import { VoiceMicButton } from './VoiceMicButton';
import { 
  PhoneCall, 
  MapPin, 
  Navigation as NavigationIcon, 
  AlertOctagon, 
  Video, 
  Send, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Mic, 
  Camera, 
  Award,
  Stethoscope,
  Compass,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface EmergencyHubViewProps {
  pet: Pet;
  onOpenEmergencyHotline: () => void;
}

export const EmergencyHubView: React.FC<EmergencyHubViewProps> = ({
  pet,
  onOpenEmergencyHotline,
}) => {
  const [selectedClinic, setSelectedClinic] = useState<EmergencyClinic>(EMERGENCY_CLINICS[0]);
  const [enRouteAlertSent, setEnRouteAlertSent] = useState(false);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [directionsClinic, setDirectionsClinic] = useState<EmergencyClinic>(EMERGENCY_CLINICS[0]);

  // Tele-vet interactive chat messages
  const [messages, setMessages] = useState<TeleConsultMessage[]>([
    {
      id: 'm1',
      sender: 'vet',
      text: `Hello! I'm Dr. Sarah Chen, DVM on call with Clinical Vitality Tele-Triage. I have ${pet.name}'s medical chart loaded (${pet.breed}, ${pet.weightLbs} lbs). What symptoms are you noticing right now?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleOpenDirections = (clinic: EmergencyClinic) => {
    setDirectionsClinic(clinic);
    setShowDirectionsModal(true);
  };

  const handleSendTeleMessage = () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const newMsg: TeleConsultMessage = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = `Thank you for sharing that. Given ${pet.name}'s breed predispositions and current resting respiratory rate of ${pet.vitals.restingRespiratoryRate} bpm, let's keep ${pet.name} calm. Check the inner gum color right now: are they bright pink or pale?`;
      if (userText.toLowerCase().includes('vomit') || userText.toLowerCase().includes('ate')) {
        replyText = `Understood. Please do not give any human antacids or induce vomiting at home. If ${pet.name} attempts to vomit without producing anything (dry heaving), that is an immediate surgical emergency and you must bring ${pet.name} to the nearest ER.`;
      } else if (userText.toLowerCase().includes('leg') || userText.toLowerCase().includes('limp') || userText.toLowerCase().includes('back')) {
        replyText = `Please enforce strict crate confinement right now. Do not let ${pet.name} walk on hardwood floors or attempt stairs. Check if ${pet.name} can feel a firm pinch on the rear toes.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now() + 1}`,
          sender: 'vet',
          text: replyText,
          timestamp: 'Just now'
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSendEnRouteAlert = () => {
    setEnRouteAlertSent(true);
    setTimeout(() => {
      alert(`[DISPATCH SUCCESS]: Pre-alert sent to ${selectedClinic.name} Emergency Intake! Patient ${pet.name} (${pet.breed}) registered. Trauma bay notified with ETA: ${selectedClinic.driveTimeMin} minutes.`);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Top Emergency Action Header */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-[#ba1a1a] rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30">
              🚨 24/7 Trauma & Emergency Network
            </span>
            <span className="text-xs text-red-100 font-medium">
              Real-Time Hospital Dispatch & Google Maps Routing
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            Emergency Care Hub & Live Directions
          </h2>
          <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-xl">
            Google Maps grounded routing to accredited 24-hour veterinary emergency centers (DACVECC) with live turn-by-turn navigation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleOpenDirections(selectedClinic)}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-heading font-bold text-xs sm:text-sm border border-white/40 shadow-md transition cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Maps Route & Directions</span>
          </button>

          <button
            onClick={onOpenEmergencyHotline}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-red-50 text-red-700 font-heading font-extrabold text-sm shadow-lg transition cursor-pointer"
          >
            <PhoneCall className="w-5 h-5 text-red-600 animate-pulse" />
            <span>Dial 24hr Hotline: (800) 24-PET-ER</span>
          </button>
        </div>
      </div>

      {/* Main Grid: ER Clinic Locator vs Tele-Vet Room */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Emergency Clinics Locator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#00685f]" />
              <h3 className="font-heading font-bold text-lg text-[#131b2e]">
                Accredited 24-Hour Emergency Veterinary Centers
              </h3>
            </div>
            <span className="text-xs text-[#00685f] font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Google Maps Grounded
            </span>
          </div>

          <div className="space-y-3.5">
            {EMERGENCY_CLINICS.map((clinic) => {
              const isSelected = selectedClinic.id === clinic.id;
              return (
                <div
                  key={clinic.id}
                  onClick={() => setSelectedClinic(clinic)}
                  className={`p-5 rounded-3xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#00685f] ring-2 ring-[#00685f]/20 shadow-md'
                      : 'bg-white hover:bg-[#faf8ff] border-[#e2e8f0]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800">
                          {clinic.traumaLevel}
                        </span>
                        {clinic.open24Hours && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                            Open 24/7
                          </span>
                        )}
                        <span className="text-xs text-[#6d7a77]">
                          ★ {clinic.rating} ({clinic.reviewCount} reviews)
                        </span>
                      </div>

                      <h4 className="font-heading font-bold text-base text-[#131b2e]">
                        {clinic.name}
                      </h4>
                      <p className="text-xs text-[#6d7a77] mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#00685f]" />
                        {clinic.address}
                      </p>
                      <p className="text-xs text-[#00685f] font-medium mt-1">
                        Staff: {clinic.availableStaff}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <div className="text-right">
                        <span className="font-heading font-extrabold text-base text-[#131b2e]">
                          {clinic.distanceMiles} mi
                        </span>
                        <span className="text-xs text-emerald-700 block font-bold">
                          ~{clinic.driveTimeMin} min drive
                        </span>
                      </div>

                      <a
                        href={`tel:${clinic.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{clinic.phone}</span>
                      </a>
                    </div>
                  </div>

                  {/* Actions Bar on card */}
                  <div className="mt-4 pt-3 border-t border-[#e2e8f0] flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDirections(clinic);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#eaedff] hover:bg-[#dae2fd] text-[#006398] font-heading font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <NavigationIcon className="w-3.5 h-3.5 text-[#006398]" />
                      <span>Get Google Maps Directions</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClinic(clinic);
                        handleSendEnRouteAlert();
                      }}
                      className={`px-4 py-1.5 rounded-xl font-heading font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                        enRouteAlertSent && isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                      }`}
                    >
                      {enRouteAlertSent && isSelected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> En Route Alert Sent
                        </>
                      ) : (
                        <>
                          <AlertOctagon className="w-3.5 h-3.5" /> Alert ER: We Are En Route
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Embedded Google Maps Live Mini-Radar Preview */}
          <div className="bg-white rounded-3xl p-5 border border-[#e2e8f0] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#00685f]" />
                <h4 className="font-heading font-bold text-sm text-[#131b2e]">
                  Live Google Map Route to {selectedClinic.name}
                </h4>
              </div>
              <button
                onClick={() => handleOpenDirections(selectedClinic)}
                className="text-xs font-bold text-[#00685f] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Turn-by-Turn Screen →</span>
              </button>
            </div>

            <div className="h-52 w-full rounded-2xl overflow-hidden border border-[#e2e8f0] bg-slate-100">
              <iframe
                title="Google Maps Route"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://maps.google.com/maps?saddr=Sunset+District,+San+Francisco,+CA&daddr=${encodeURIComponent(selectedClinic.address)}&output=embed`}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#6d7a77] pt-1">
              <span>Drive Time: <strong>~{selectedClinic.driveTimeMin} mins ({selectedClinic.distanceMiles} miles)</strong></span>
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=Sunset+District,+San+Francisco,+CA&destination=${encodeURIComponent(selectedClinic.address)}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#006398] font-bold hover:underline flex items-center gap-1"
              >
                <span>Launch in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): On-Demand Tele-Vet Consult */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#e2e8f0] shadow-xs flex flex-col h-[640px] overflow-hidden">
          {/* Tele-Vet Header */}
          <div className="p-4 bg-[#faf8ff] border-b border-[#e2e8f0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80"
                  alt="Dr. Sarah Chen, DVM"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00685f]"
                />
                <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-[#131b2e] flex items-center gap-1.5">
                  Dr. Sarah Chen, DVM
                </h4>
                <p className="text-[11px] text-[#6d7a77]">
                  Licensed Tele-Triage Clinician • Online
                </p>
              </div>
            </div>

            <button
              onClick={() => alert(`Starting encrypted HD video consult with Dr. Sarah Chen for patient ${pet.name}...`)}
              className="p-2 rounded-xl bg-[#eaedff] hover:bg-[#dae2fd] text-[#006398] transition cursor-pointer"
              title="Launch HD Video Call"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#faf8ff]/40">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#00685f] text-white rounded-br-xs'
                      : 'bg-white text-[#131b2e] border border-[#e2e8f0] shadow-2xs rounded-bl-xs'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      m.sender === 'user' ? 'text-teal-200' : 'text-[#6d7a77]'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border border-[#e2e8f0] text-xs text-[#6d7a77] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00685f] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#00685f] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#00685f] animate-bounce [animation-delay:0.4s]" />
                  <span>Dr. Chen is evaluating...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick clinical query prompts */}
          <div className="p-2 bg-white border-t border-[#e2e8f0] flex gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            <button
              onClick={() => setInputMessage('Should I bring him to the ER right now?')}
              className="px-2.5 py-1 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#006398] font-medium whitespace-nowrap cursor-pointer"
            >
              Should I bring to ER right now?
            </button>
            <button
              onClick={() => setInputMessage('Gums look slightly pale and he is panting.')}
              className="px-2.5 py-1 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#006398] font-medium whitespace-nowrap cursor-pointer"
            >
              Gums are pale
            </button>
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-[#e2e8f0] flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendTeleMessage()}
              placeholder={`Ask Dr. Chen about ${pet.name}...`}
              className="flex-1 p-2.5 rounded-xl border border-[#e2e8f0] bg-[#faf8ff] text-xs focus:outline-none focus:ring-2 focus:ring-[#00685f]"
            />
            <VoiceMicButton
              size="sm"
              onTranscribed={(text) => {
                setInputMessage((prev) => (prev ? `${prev} ${text}` : text));
              }}
            />
            <button
              onClick={handleSendTeleMessage}
              className="p-2.5 rounded-xl bg-[#00685f] hover:bg-[#005049] text-white transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Google Maps Directions Modal */}
      <ClinicDirectionsModal
        pet={pet}
        clinic={directionsClinic}
        isOpen={showDirectionsModal}
        onClose={() => setShowDirectionsModal(false)}
        onCallClinic={(phone) => {
          window.location.href = `tel:${phone}`;
        }}
      />
    </div>
  );
};

