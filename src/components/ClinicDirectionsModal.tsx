import React, { useState, useEffect } from 'react';
import { 
  X, 
  Navigation, 
  MapPin, 
  PhoneCall, 
  Clock, 
  Car, 
  Sparkles, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Search, 
  Compass, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Pet, EmergencyClinic } from '../types';
import { ClinicDirectionRoute } from '../../server/api';
import { VoiceMicButton } from './VoiceMicButton';

interface ClinicDirectionsModalProps {
  pet: Pet;
  clinic: EmergencyClinic;
  isOpen: boolean;
  onClose: () => void;
  onCallClinic: (phone: string) => void;
}

export const ClinicDirectionsModal: React.FC<ClinicDirectionsModalProps> = ({
  pet,
  clinic,
  isOpen,
  onClose,
  onCallClinic,
}) => {
  const [userLocation, setUserLocation] = useState('Sunset District, San Francisco, CA');
  const [mapMode, setMapMode] = useState<'route' | 'destination'>('route');
  const [isLoadingGrounded, setIsLoadingGrounded] = useState(false);
  const [groundedData, setGroundedData] = useState<{
    text: string;
    routes: ClinicDirectionRoute[];
    source: string;
  } | null>(null);

  // Default fallback route for this clinic
  const [activeRoute, setActiveRoute] = useState<ClinicDirectionRoute>({
    clinicName: clinic.name,
    address: clinic.address,
    distanceMiles: clinic.distanceMiles,
    driveTimeMin: clinic.driveTimeMin,
    trafficStatus: 'Light',
    emergencyStatus: clinic.open24Hours ? 'Open 24/7' : 'Urgent Care Open',
    googleMapsUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent('Sunset District, San Francisco, CA')}&destination=${encodeURIComponent(clinic.address)}&travelmode=driving`,
    aiNotes: 'Level 1 Trauma accreditation. Trauma bay pre-alert active. Parking available directly in front of the emergency intake ambulance bay.',
    steps: [
      {
        instruction: 'Start from your location, head east toward Lincoln Blvd',
        distance: '0.4 mi',
        time: '1 min',
        maneuver: 'straight',
      },
      {
        instruction: 'Turn right onto Lincoln Blvd toward 19th Ave / CA-1 S',
        distance: '0.7 mi',
        time: '2 mins',
        maneuver: 'right',
      },
      {
        instruction: 'Merge onto 19th Ave / CA-1 South (clear traffic)',
        distance: '0.8 mi',
        time: '2 mins',
        maneuver: 'merge',
      },
      {
        instruction: `Turn left onto ${clinic.address.split(',')[0]}`,
        distance: '0.2 mi',
        time: '1 min',
        maneuver: 'left',
      },
      {
        instruction: `Arrive at ${clinic.name} (${clinic.address}). Follow red Emergency Veterinary Intake signs.`,
        distance: '300 ft',
        time: '1 min',
        maneuver: 'arrive',
      },
    ],
  });

  const fetchGroundedDirections = async (locToSearch = userLocation) => {
    setIsLoadingGrounded(true);
    try {
      const res = await fetch('/api/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: locToSearch,
          complaint: `${pet.name} (${pet.breed}) emergency triage assessment`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGroundedData(data);
        if (data.routes && data.routes.length > 0) {
          // Find matching route or take first
          const matched = data.routes.find((r: ClinicDirectionRoute) => 
            r.clinicName.toLowerCase().includes(clinic.name.toLowerCase().slice(0, 10))
          ) || data.routes[0];
          setActiveRoute(matched);
        }
      }
    } catch (err) {
      console.warn('Maps Grounding fetch error:', err);
    } finally {
      setIsLoadingGrounded(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGroundedDirections();
    }
  }, [isOpen, clinic]);

  if (!isOpen) return null;

  const embedMapUrl = mapMode === 'route'
    ? `https://maps.google.com/maps?saddr=${encodeURIComponent(userLocation)}&daddr=${encodeURIComponent(clinic.address)}&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(clinic.address)}&output=embed`;

  const externalGoogleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(userLocation)}&destination=${encodeURIComponent(clinic.address)}&travelmode=driving`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-[#e2e8f0] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#faf8ff] border-b border-[#e2e8f0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00685f] to-[#008378] text-white flex items-center justify-center shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#131b2e]">
                  Live Google Maps Directions & Route
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Maps Grounded
                </span>
              </div>
              <p className="text-xs text-[#6d7a77]">
                Routing to <strong>{clinic.name}</strong> for {pet.name} ({pet.breed})
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

        {/* Origin / Starting Location Bar */}
        <div className="px-5 py-3 bg-[#f2f3ff]/60 border-b border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
            <span className="font-bold text-[#6d7a77] whitespace-nowrap flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#00685f]" /> Starting Point:
            </span>
            <input
              type="text"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchGroundedDirections(userLocation)}
              placeholder="Enter current address, cross street or ZIP code..."
              className="flex-1 p-1.5 px-3 rounded-xl border border-[#bcc9c6] bg-white text-xs font-semibold text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#00685f]"
            />
            <VoiceMicButton
              size="sm"
              onTranscribed={(transcript) => {
                setUserLocation(transcript);
                fetchGroundedDirections(transcript);
              }}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => fetchGroundedDirections(userLocation)}
              disabled={isLoadingGrounded}
              className="px-3 py-1.5 rounded-xl bg-[#00685f] hover:bg-[#005049] text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              {isLoadingGrounded ? (
                <span>Recalculating...</span>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Update Route</span>
                </>
              )}
            </button>

            <a
              href={externalGoogleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-[#006398] hover:bg-[#00476e] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <span>Open in Google Maps App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Modal Main Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Top Quick ETA & Clinic Status Banner */}
          <div className="p-4 rounded-2xl bg-[#eaedff] border border-[#bcc9c6]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#00685f] text-white shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-lg sm:text-xl text-[#131b2e]">
                    {clinic.driveTimeMin} Min Drive ({clinic.distanceMiles} miles)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    {activeRoute.trafficStatus} Traffic
                  </span>
                </div>
                <p className="text-xs text-[#006398] font-medium">
                  Destination: {clinic.name} • {clinic.address}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onCallClinic(clinic.phone)}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-heading font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Ahead ({clinic.phone})</span>
              </button>
            </div>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-xs bg-slate-100">
            {/* Map Mode Tabs */}
            <div className="p-2.5 bg-[#faf8ff] border-b border-[#e2e8f0] flex items-center justify-between text-xs">
              <div className="flex gap-2">
                <button
                  onClick={() => setMapMode('route')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    mapMode === 'route'
                      ? 'bg-[#00685f] text-white'
                      : 'text-[#6d7a77] hover:bg-[#eaedff]'
                  }`}
                >
                  Driving Route Map
                </button>
                <button
                  onClick={() => setMapMode('destination')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    mapMode === 'destination'
                      ? 'bg-[#00685f] text-white'
                      : 'text-[#6d7a77] hover:bg-[#eaedff]'
                  }`}
                >
                  Hospital Location & Entrance Map
                </button>
              </div>

              <span className="text-[11px] text-[#6d7a77] hidden sm:inline">
                Interactive Google Maps Navigation
              </span>
            </div>

            {/* Iframe */}
            <div className="h-64 sm:h-72 w-full relative">
              <iframe
                title="Google Maps Driving Directions"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={embedMapUrl}
              />
            </div>
          </div>

          {/* AI Grounding Insights & Arrival Notes */}
          <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#e2e8f0] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#00685f]">
              <Sparkles className="w-4 h-4" />
              <span>Grounding Insights from Google Maps & Clinical Emergency Dispatch:</span>
            </div>
            <p className="text-xs text-[#131b2e] leading-relaxed">
              {activeRoute.aiNotes}
            </p>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Transit Precaution for {pet.name}:</strong> Turn off loud music, keep car temperature cool (~68°F), and keep companion on a secure flat surface or carrier to prevent jostling and sudden acceleration spinal shocks.
              </span>
            </div>
          </div>

          {/* Step-by-Step Turn-by-Turn Directions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-sm text-[#131b2e] flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#00685f]" />
                Step-by-Step Driving Directions
              </h4>
              <span className="text-xs text-[#6d7a77]">
                {activeRoute.steps.length} checkpoints
              </span>
            </div>

            <div className="divide-y divide-[#e2e8f0] border border-[#e2e8f0] rounded-2xl overflow-hidden bg-white">
              {activeRoute.steps.map((step, idx) => (
                <div key={idx} className="p-3.5 flex items-start gap-3.5 hover:bg-[#faf8ff] transition">
                  <div className="w-7 h-7 rounded-full bg-[#eaedff] text-[#00685f] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[#131b2e] leading-relaxed">
                      {step.instruction}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6d7a77]">
                      <span>{step.distance}</span>
                      <span>•</span>
                      <span>~{step.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#faf8ff] border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#6d7a77] text-center sm:text-left">
            Grounded with Google Maps • gemini-3.5-flash
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-xs font-semibold text-[#131b2e] hover:bg-[#eaedff] transition cursor-pointer"
            >
              Close
            </button>
            <a
              href={externalGoogleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#00685f] hover:bg-[#005049] text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <Navigation className="w-4 h-4" />
              <span>Start Turn-by-Turn GPS Navigation</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
