'use client';
import { useState, useEffect } from 'react';
import { mockRoutes } from '@/lib/mockData';
import { mockAttendanceRecords } from '@/features/attendance/mock/data';

interface JourneyTimelineProps {
  busId: string;
  tripActive: boolean;
  tripDuration: number; // seconds
  currentStopIndex: number;
  totalStops: number;
}

export function JourneyTimeline({ busId, tripActive, tripDuration, currentStopIndex, totalStops }: JourneyTimelineProps) {
  const route = mockRoutes.find(r => r.busId === busId) || mockRoutes[0];
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    if (!tripActive) {
      setCurrentProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentProgress(p => {
        const newProgress = p + (100 / (tripDuration * 60)) * 1;
        return Math.min(newProgress, 100);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tripActive, tripDuration]);

  const getStatus = (index: number) => {
    if (index < currentStopIndex) return 'completed';
    if (index === currentStopIndex) return 'current';
    return 'upcoming';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[#00C853] border-[#00C853]';
      case 'current': return 'bg-[#FFD700] border-[#FFD700]';
      case 'upcoming': return 'bg-white/10 border-white/20';
      default: return 'bg-white/10 border-white/20';
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-bold text-white mb-4">Journey Timeline 🕒</h3>
      
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>0%</span>
          <span>{Math.round(currentProgress)}%</span>
          <span>100%</span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#00C853] to-[#FFD700] transition-all duration-1000"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
        <div className="text-center mt-2 text-sm">
          {tripActive 
            ? `Journey in progress • ${Math.round((currentProgress / 100) * tripDuration)}s / ${tripDuration}s`
            : 'Trip not active'
          }
        </div>
      </div>

      {/* Timeline stops */}
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-white/10" />
        
        <div className="space-y-6">
          {route.stops.map((stop, index) => {
            const status = getStatus(index);
            return (
              <div key={stop.name} className="flex items-start gap-4 relative">
                {/* Status indicator */}
                <div className={`absolute left-4 w-4 h-4 rounded-full -ml-2 border-4 z-10 ${getStatusColor(status)}`} />
                
                {/* Content */}
                <div className="flex-1 pl-8 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-semibold ${status === 'completed' ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {stop.name}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      status === 'completed' ? 'bg-[#00C853]/20 text-[#00C853]' :
                      status === 'current' ? 'bg-[#FFD700]/20 text-[#FFD700] animate-pulse' :
                      'bg-white/10 text-gray-500'
                    }`}>
                      {status === 'completed' ? 'Completed' :
                       status === 'current' ? 'Current' : 'Upcoming'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Scheduled: {stop.time} {index === currentStopIndex && tripActive && '• Arriving now'}
                  </div>
                  
                  {/* Attendance for this stop */}
                  {index <= currentStopIndex && tripActive && (
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <div className="text-xs text-gray-500 mb-1">Attendance recorded:</div>
                      <div className="space-y-1">
                        {mockAttendanceRecords
                          .filter(r => r.busId === busId && r.stopId === stop.name.replace(/\s+/g, '-').toLowerCase())
                          .slice(0, 3)
                          .map(record => (
                            <div key={record.id} className="text-xs flex items-center gap-2">
                              <span>{record.scannedBy === 'qr' ? '📱' : '📡'}</span>
                              <span className="text-gray-300">{record.studentName}</span>
                              <span className="text-gray-500 text-[10px]">
                                {record.status === 'picked_up' ? 'Picked up' : 'Dropped off'}
                              </span>
                            </div>
                          ))}
                        {mockAttendanceRecords.filter(r => r.busId === busId && r.stopId === stop.name.replace(/\s+/g, '-').toLowerCase()).length === 0 && (
                          <div className="text-xs text-gray-600 italic">No attendance records yet</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline events */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="font-semibold text-sm text-gray-400 mb-3">Trip Events</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-3 text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C853]"></span>
            <span>Trip started at {route.stops[0].time}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <span className={`w-1.5 h-1.5 rounded-full ${currentStopIndex >= 1 ? 'bg-[#00C853]' : 'bg-white/20'}`}></span>
            <span className={currentStopIndex >= 1 ? 'text-white' : 'text-gray-500'}>
              Arrived at {route.stops[1]?.name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <span className={`w-1.5 h-1.5 rounded-full ${currentStopIndex >= currentStopIndex ? 'bg-[#FFD700] animate-pulse' : 'bg-white/20'}`}></span>
            <span className={currentStopIndex >= currentStopIndex ? 'text-white' : 'text-gray-500'}>
              Currently at {route.stops[currentStopIndex]?.name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
            <span className="text-gray-500">Arrive at {route.stops[route.stops.length - 1]?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
