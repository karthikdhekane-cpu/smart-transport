'use client';
import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ETACard, TrafficBadge, StatusBadge, ArrivalCountdown, DelayIndicator, formatETA } from '@/features/eta';
import { useETA } from '@/features/eta/hooks/useETA';
import { useNotifications } from '@/features/notifications';
import { notificationService } from '@/features/notifications';

const navItems = [
  { href:'/student',          icon:'🏠', label:'Dashboard' },
  { href:'/student/tracking', icon:'🗺️', label:'Live Tracking' },
  { href:'/student/eta',      icon:'⏱️', label:'ETA & Alarm' },
  { href:'/student/notifications', icon:'🔔', label:'Notifications' },
  { href:'/student/lost-found',    icon:'📦', label:'Lost & Found' },
  { href:'/student/safety',        icon:'🛡️', label:'Safety' },
];

export default function ETAPage() {
  const { busStates, isLoading, isPlaying } = useETA('BUS-01');
  const [busPos, setBusPos] = useState({ lat: 11.0168, lng: 76.9558 });
  const [alarmMin, setAlarmMin] = useState<number|null>(null);
  const [alarmSet, setAlarmSet] = useState(false);
  const [tick, setTick] = useState(0);
  const { markAllAsRead } = useNotifications();
  const previousStateRef = useRef<Record<string, string>>({});
  
  const currentBusState = busStates[0];
  const previousDelayRef = useRef<Record<string, { minutes: number; reason: string }>>({});
  
  // Follow the bus by default for demo purposes
  useEffect(() => {
    if (!isLoading && currentBusState) {
      // Check if arrival state changed
      const etaMinutes = Math.round(currentBusState.currentETA.seconds / 60);
      const previousState = previousStateRef.current[currentBusState.busId];
      
      // Simple state calculation
      let newState = 'FAR';
      if (etaMinutes <= 2) newState = 'ARRIVING';
      else if (etaMinutes <= 5) newState = 'NEAR';
      else if (etaMinutes <= 10) newState = 'APPROACHING';
      
      // Update previous state
      previousStateRef.current[currentBusState.busId] = newState;
      
      // Only generate alert if state changed
      if (newState !== previousState && newState !== 'FAR') {
        // Auto-follow the bus
        if (etaMinutes <= 10) {
          // Call generateArrivalAlert directly through notificationService
          const routeName = currentBusState.routeInfo.name;
          const stopName = currentBusState.nextStop?.name || 'Next Stop';
          notificationService.generateArrivalAlert(
            currentBusState.busId,
            currentBusState.nextStop?.id || 'stop-a1',
            currentBusState.currentETA.seconds,
            currentBusState.routeInfo.id,
            routeName,
            stopName
          );
        }
      }
      
      // Check if delay state changed for delay notifications
      const currentDelay = currentBusState.delay;
      const previousDelay = previousDelayRef.current[currentBusState.busId];
      
      if (!previousDelay || 
          currentDelay.minutes !== previousDelay.minutes || 
          currentDelay.reason !== previousDelay.reason) {
        // Update previous delay state
        previousDelayRef.current[currentBusState.busId] = {
          minutes: currentDelay.minutes,
          reason: currentDelay.reason,
        };
        
        // Generate delay notification if there's a meaningful delay
        if (currentDelay.minutes >= 2) {
          notificationService.generateDelayAlert(
            currentBusState.busId,
            currentDelay.minutes,
            currentDelay.reason,
            currentBusState.routeInfo.id
          );
        }
      }
    }
  }, [isLoading, currentBusState]);

  return (
    <DashboardLayout role="student" navItems={navItems} userName="Priya Sharma">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">AI ETA Engine ⏱️</h1>
          <p className="text-gray-400 text-sm mt-1">Machine learning powered arrival prediction</p>
        </div>

        {/* Live ETA Card */}
        {isLoading ? (
          <div className="glass rounded-3xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading ETA data...</p>
          </div>
        ) : currentBusState ? (
          <ETACard busState={currentBusState} />
        ) : (
          <div className="glass rounded-3xl p-8 text-center">
            <p className="text-gray-400">No bus data available</p>
          </div>
        )}

        {/* Big ETA display */}
        <div className="glass-green rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 shimmer"/>
          <div className="relative z-10">
            <p className="text-gray-400 text-sm mb-2">Estimated Time of Arrival</p>
            {currentBusState ? (
              <>
                <div className="text-8xl font-black neon-text mb-2">
                  {formatETA(currentBusState.currentETA.seconds)}
                </div>
                <p className="text-2xl text-gray-300 font-light">
                  {currentBusState.currentETA.seconds === 1 ? 'second' : 'seconds'}
                </p>
              </>
            ) : (
              <div className="text-8xl font-black neon-text mb-2">8</div>
            )}
            {currentBusState && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse"/>
                <span className="text-sm text-[#00C853]">
                  {currentBusState.status === 'on-time' ? 'On Time' : 'Traffic: ' + currentBusState.traffic.config.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Traffic Status */}
        {currentBusState && (
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4">🚦 Traffic Conditions</h3>
            <div className="flex items-center gap-4">
              <TrafficBadge 
                level={currentBusState.traffic.level} 
                config={currentBusState.traffic.config} 
              />
              <DelayIndicator delay={currentBusState.delay} />
            </div>
          </div>
        )}

        {/* AI Factors */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">🤖 AI Prediction Factors</h3>
          <div className="space-y-3">
            {[
              { label:'Current Traffic', value:currentBusState?.traffic.config.name || 'Moderate', icon:'🚦', impact:'+' + (currentBusState?.traffic.config.delayMinutes || 0) + ' min' },
              { label:'Bus Speed', value:currentBusState?.speed ? Math.round(currentBusState.speed) + ' km/h' : '42 km/h', icon:'🚀', impact:'Normal' },
              { label:'Distance', value:currentBusState?.routeInfo ? Math.round(currentBusState.routeInfo.totalDistance * (1 - currentBusState.routeInfo.progressPercentage/100)/1000) + ' km' : '3.2 km', icon:'📍', impact:'-' },
              { label:'Historical Avg', value:'8.4 min', icon:'📊', impact:'On track' },
              { label:'Weather', value:'Clear', icon:'☀️', impact:'No impact' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-4 p-3 glass rounded-xl">
                <span className="text-xl">{f.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{f.label}</div>
                  <div className="text-xs text-gray-400">{f.value}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${f.impact.includes('+') ? 'bg-red-500/20 text-red-400' : f.impact === 'Normal' || f.impact === 'On track' ? 'bg-[#00C853]/20 text-[#00C853]' : 'bg-white/10 text-gray-400'}`}>
                  {f.impact}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Alarm */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">⏰ Smart Wake-Up Alarm</h3>
          <p className="text-gray-400 text-sm mb-4">Set an alarm to be notified before your bus arrives.</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[5,10,15].map(min => (
              <button
                key={min}
                onClick={() => { setAlarmMin(min); setAlarmSet(true); }}
                className={`py-3 rounded-xl text-sm font-semibold transition-all ${alarmMin===min && alarmSet ? 'bg-[#00C853] text-black' : 'glass text-gray-400 hover:text-white'}`}
              >
                {min} min before
              </button>
            ))}
          </div>
          {alarmSet && alarmMin && (
            <div className="glass-green rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-[#00C853] font-semibold text-sm">Alarm Set!</p>
                <p className="text-gray-400 text-xs">You'll be notified {alarmMin} minutes before bus arrives at Town Hall</p>
              </div>
              <button onClick={() => setAlarmSet(false)} className="ml-auto text-gray-500 hover:text-white">×</button>
            </div>
          )}
        </div>

        {/* Historical */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">📊 Historical ETA Accuracy</h3>
          <div className="flex items-end gap-3 h-24">
            {[92,88,96,94,98,91,95].map((v,i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-[#00C853]">{v}%</span>
                <div className="w-full rounded-t bg-gradient-to-t from-[#00C853] to-[#5efc82]" style={{height:`${v-80}px`}}/>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Last 7 days · Avg accuracy: 93.4%</p>
        </div>

        {/* Route Change Test */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">🔄 Route Change Test</h3>
          <p className="text-gray-400 text-sm mb-4">Test route change notifications (Demo feature)</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => notificationService.trackRouteChange('BUS-01', 'route-b', 'Route B — RS Puram Express', 'Route optimization')}
              className="py-3 rounded-xl text-sm font-semibold transition-all glass text-gray-400 hover:text-white hover:bg-[#9C27B0]/20"
            >
              Change to Route B
            </button>
            <button
              onClick={() => notificationService.trackRouteChange('BUS-01', 'route-c', 'Route C — Peelamedu Circuit', 'Traffic diversion')}
              className="py-3 rounded-xl text-sm font-semibold transition-all glass text-gray-400 hover:text-white hover:bg-[#9C27B0]/20"
            >
              Change to Route C
            </button>
            <button
              onClick={() => notificationService.trackRouteChange('BUS-01', 'route-d', 'Route D — Singanallur Terminal', 'Schedule adjustment')}
              className="py-3 rounded-xl text-sm font-semibold transition-all glass text-gray-400 hover:text-white hover:bg-[#9C27B0]/20"
            >
              Change to Route D
            </button>
            <button
              onClick={() => notificationService.trackRouteChange('BUS-01', 'route-a', 'Route A — Gandhipuram Loop', 'Restored to original')}
              className="py-3 rounded-xl text-sm font-semibold transition-all glass text-gray-400 hover:text-white hover:bg-[#9C27B0]/20"
            >
              Back to Route A
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
