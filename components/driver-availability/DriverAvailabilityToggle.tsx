'use client';

interface DriverAvailabilityToggleProps {
  availability: 'available' | 'unavailable';
  onToggle: (availability: 'available' | 'unavailable') => void;
}

export function DriverAvailabilityToggle({ availability, onToggle }: DriverAvailabilityToggleProps) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-bold text-white mb-4">Availability</h3>
      
      {/* Current availability display */}
      <div className={`rounded-xl p-4 mb-6 text-center ${availability === 'available' ? 'bg-[#00C853]/10 border border-[#00C853]/30' : 'bg-[#FF5722]/10 border border-[#FF5722]/30'}`}>
        <div className={`text-4xl font-black mb-1 ${availability === 'available' ? 'neon-text' : 'text-[#FF5722]'}`}>
          {availability === 'available' ? '● Available' : '● Unavailable'}
        </div>
        <div className="text-xs text-gray-500">
          {availability === 'available' ? 'You can be assigned trips' : 'You will not receive trip assignments'}
        </div>
      </div>

      {/* Availability toggle */}
      <div className="flex gap-3">
        <button
          onClick={() => onToggle('available')}
          className={`flex-1 py-3 rounded-xl transition-all ${
            availability === 'available'
              ? 'bg-[#00C853] text-black font-bold'
              : 'glass text-gray-400 hover:bg-white/5'
          }`}
        >
          ✓ Available
        </button>
        <button
          onClick={() => onToggle('unavailable')}
          className={`flex-1 py-3 rounded-xl transition-all ${
            availability === 'unavailable'
              ? 'bg-[#FF5722] text-white font-bold'
              : 'glass text-gray-400 hover:bg-white/5'
          }`}
        >
          ✕ Unavailable
        </button>
      </div>
    </div>
  );
}
