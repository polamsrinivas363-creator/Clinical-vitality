import React, { useState } from 'react';
import { X, Plus, ShieldCheck } from 'lucide-react';
import { Pet } from '../types';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPet: (pet: Pet) => void;
}

const PRESET_AVATARS = [
  { label: 'Golden Retriever', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80', species: 'Dog' },
  { label: 'French Bulldog', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80', species: 'Dog' },
  { label: 'German Shepherd', url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5455?auto=format&fit=crop&w=600&q=80', species: 'Dog' },
  { label: 'Orange Tabby Cat', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80', species: 'Cat' },
  { label: 'Siamese Cat', url: 'https://images.unsplash.com/photo-1513360309081-36f20ca480d0?auto=format&fit=crop&w=600&q=80', species: 'Cat' },
  { label: 'Beagle', url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80', species: 'Dog' },
];

export const AddPetModal: React.FC<AddPetModalProps> = ({
  isOpen,
  onClose,
  onAddPet,
}) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'Dog' | 'Cat'>('Dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('2 yrs');
  const [sex, setSex] = useState<'Male Neutered' | 'Female Spayed' | 'Male Intact' | 'Female Intact'>('Male Neutered');
  const [weightLbs, setWeightLbs] = useState(25);
  const [primaryVet, setPrimaryVet] = useState('Dr. Sarah Chen, DVM');
  const [clinicName, setClinicName] = useState('St. Jude Veterinary Specialty Hospital');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0].url);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !breed.trim()) return;

    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name: name.trim(),
      species,
      breed: breed.trim(),
      age: age.trim(),
      sex,
      weightLbs: Number(weightLbs) || 20,
      avatarUrl: selectedAvatar,
      microchipId: `98514100${Math.floor(1000000 + Math.random() * 9000000)}`,
      status: 'Routine',
      primaryVeterinarian: primaryVet.trim(),
      clinicName: clinicName.trim(),
      allergies: [],
      chronicConditions: [],
      vitals: {
        restingRespiratoryRate: species === 'Dog' ? 22 : 24,
        temperatureF: 101.4,
        hydrationScore: 'Normal',
        painIndex: 0,
        heartRateBpm: species === 'Dog' ? 80 : 160,
        activityScore: 90,
        timestamp: 'Just registered'
      },
      weightHistory: [
        { date: 'Jul', weightLbs: Number(weightLbs) - 0.5 },
        { date: 'Aug', weightLbs: Number(weightLbs) - 0.2 },
        { date: 'Sep', weightLbs: Number(weightLbs) },
        { date: 'Oct', weightLbs: Number(weightLbs) }
      ]
    };

    onAddPet(newPet);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-[#e2e8f0] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#faf8ff] border-b border-[#e2e8f0] flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-[#131b2e]">
              Register New Pet Patient Profile
            </h3>
            <p className="text-xs text-[#6d7a77]">
              Enter clinical details for baseline vitals telemetry
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#6d7a77] hover:bg-[#eaedff] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          {/* Avatar selector */}
          <div>
            <label className="block font-bold text-[#131b2e] mb-1.5">
              Select Patient Avatar
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_AVATARS.map((av, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setSelectedAvatar(av.url);
                    setSpecies(av.species as any);
                    if (!breed) setBreed(av.label);
                  }}
                  className={`p-1 rounded-2xl border-2 transition cursor-pointer ${
                    selectedAvatar === av.url ? 'border-[#00685f] ring-2 ring-[#00685f]/30' : 'border-transparent hover:border-[#bcc9c6]'
                  }`}
                >
                  <img src={av.url} alt={av.label} className="w-12 h-12 rounded-xl object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#131b2e] mb-1">Pet Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Copper"
                className="w-full p-2.5 rounded-xl border border-[#e2e8f0] bg-[#faf8ff] text-xs focus:ring-2 focus:ring-[#00685f] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#131b2e] mb-1">Species *</label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#e2e8f0] bg-[#faf8ff] text-xs focus:ring-2 focus:ring-[#00685f] outline-none"
              >
                <option value="Dog">Dog (Canine)</option>
                <option value="Cat">Cat (Feline)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#131b2e] mb-1">Breed *</label>
              <input
                type="text"
                required
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g. Labrador Retriever"
                className="w-full p-2.5 rounded-xl border border-[#e2e8f0] bg-[#faf8ff] text-xs focus:ring-2 focus:ring-[#00685f] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#131b2e] mb-1">Age *</label>
              <input
                type="text"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 3 yrs 4 mos"
                className="w-full p-2.5 rounded-xl border border-[#e2e8f0] bg-[#faf8ff] text-xs focus:ring-2 focus:ring-[#00685f] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#131b2e] mb-1">Weight (lbs) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={weightLbs}
                onChange={(e) => setWeightLbs(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#e2e8f0] bg-[#faf8ff] text-xs focus:ring-2 focus:ring-[#00685f] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#131b2e] mb-1">Sex & Reproductive Status</label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#e2e8f0] bg-[#faf8ff] text-xs focus:ring-2 focus:ring-[#00685f] outline-none"
              >
                <option value="Male Neutered">Male Neutered</option>
                <option value="Female Spayed">Female Spayed</option>
                <option value="Male Intact">Male Intact</option>
                <option value="Female Intact">Female Intact</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e2e8f0] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[#6d7a77] hover:bg-[#eaedff] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#00685f] hover:bg-[#005049] text-white font-bold transition cursor-pointer"
            >
              Create Patient Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
