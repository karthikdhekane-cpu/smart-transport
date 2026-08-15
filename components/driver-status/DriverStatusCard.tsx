'use client';
import { DriverStatus } from '@/features/driver-state/types';

const statusConfig = {
  driving: {
    label: 'Driving',
    icon: '🚗',
    color: 'bg-[#00C853]',
    text: 'text-[#00C853]',
    subtext: 'On active trip',
  },
  idle: {
    label: 'Idle',
    icon: ' parking',
    color: 'bg-[#FFD700]',
    text: 'text-[#FFD700]',
    subtext: 'Awaiting assignment',
  },
  break: {
    label: 'Break',
    icon: '☕',
    color: 'bg-[#FF5722]',
    text: 'text-[#FF5722]',
    subtext: 'On scheduled break',
  },
};

interface DriverStatusCardProps {
  currentStatus: DriverStatus;
  onSelectStatus: (status: DriverStatus) => void;
}

export function DriverStatusCard({ currentStatus, onSelectStatus }: DriverStatusCardProps) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-bold text-white mb-4">Current Status</h3>
      
      {/* Current status display */}
      <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/5">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${statusConfig[currentStatus].color} bg-opacity-20`}>
          {statusConfig[currentStatus].icon}
        </div>
        <div>
          <div className="text-2xl font-black neon-text">{statusConfig[currentStatus].label}</div>
          <div className="text-xs text-gray-500">{statusConfig[currentStatus].subtext}</div>
        </div>
      </div>

      {/* Status selection */}
      <div className="grid grid-cols-3 gap-3">
        {(Object.keys(statusConfig) as DriverStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => onSelectStatus(status)}
            className={`p-3 rounded-xl transition-all ${
              currentStatus === status
                ? 'border-2 border-[#00C853] bg-[#00C853]/10'
                : 'glass hover:bg-white/5'
            }`}
          >
            <div className="text-2xl mb-1">{statusConfig[status].icon}</div>
            <div className={`text-xs font-semibold ${currentStatus === status ? statusConfig[status].text : 'text-gray-400'}`}>
              {statusConfig[status].label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
