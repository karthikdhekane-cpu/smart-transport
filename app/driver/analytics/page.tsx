'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ETACard, TrafficBadge, StatusBadge } from '@/features/eta';
import { useETA } from '@/features/eta/hooks/useETA';

const navItems = [
  { href:'/driver',          icon:'🏠', label:'Dashboard' },
  { href:'/driver/trip',     icon:'🚌', label:'Trip Control' },
  { href:'/driver/analytics',icon:'📊', label:'My Analytics' },
  { href:'/driver/safety',   icon:'🛡️', label:'Safety Score' },
];

const weeklyData = [
  { day:'Mon', score:96, trips:2, speed:42 },
  { day:'Tue', score:88, trips:2, speed:48 },
  { day:'Wed', score:94, trips:2, speed:40 },
  { day:'Thu', score:91, trips:2, speed:45 },
  { day:'Fri', score:97, trips:2, speed:38 },
  { day:'Sat', score:95, trips:1, speed:41 },
];

const events = [
  { type:'harsh_brake', count:2, label:'Harsh Braking', icon:'🛑', color:'text-red-400' },
  { type:'overspeed',   count:1, label:'Over-Speeding', icon:'🚀', color:'text-[#FFD700]' },
  { type:'idle',        count:3, label:'Long Idle',     icon:'⏸️', color:'text-blue-400' },
  { type:'rash_turn',   count:0, label:'Rash Turns',    icon:'↩️', color:'text-[#00C853]' },
];

export default function DriverAnalyticsPage() {
  const { busStates, isLoading, isPlaying } = useETA('BUS-01');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTick(p => p + 1);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const currentBusState = busStates[0];

  return (
    <DashboardLayout role="driver" navItems={navItems} userName="Rajesh Kumar">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">My Analytics 📊</h1>
          <p className="text-gray-400 text-sm mt-1">Performance insights and safety metrics</p>
        </div>

        {/* Live ETA Info */}
        {isLoading ? (
          <div className="glass-green rounded-2xl p-6 text-center">
            <p className="text-[#00C853]">Loading live ETA data...</p>
          </div>
        ) : currentBusState ? (
          <div className="glass-green rounded-2xl p-4">
            <h3 className="font-bold mb-3">Live Trip Status</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl font-black neon-text">{Math.round(currentBusState.currentETA.seconds / 60)}m</div>
                <div className="text-xs text-gray-400">ETA</div>
              </div>
            {currentBusState?.speed ? (
              <div className="text-center">
                <div className="text-2xl font-black neon-text">{Math.round(currentBusState.speed)} km/h</div>
                <div className="text-xs text-gray-400">Speed</div>
              </div>
            ) : null}
              <div className="text-center">
                <div className="text-2xl font-black neon-text">{Math.round(currentBusState.routeInfo.progressPercentage)}%</div>
                <div className="text-xs text-gray-400">Progress</div>
              </div>
            </div>
            <div className="mt-3 flex justify-center gap-2">
              <TrafficBadge level={currentBusState.traffic.level} config={currentBusState.traffic.config} />
              <StatusBadge status={currentBusState.status} />
            </div>
          </div>
        ) : null}

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l:'Safety Score', v:'94%', icon:'🛡️', c:'green' },
            { l:'Total Trips', v:'1,240', icon:'🗺️', c:'gold' },
            { l:'On-Time Rate', v:'96%', icon:'⏱️', c:'green' },
            { l:'Avg Speed', v:'42 km/h', icon:'🚀', c:'gold' },
          ].map(s => (
            <div key={s.l} className={`${s.c==='gold'?'glass-gold':'glass-green'} rounded-2xl p-4 hover-card`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className={`text-xl font-black ${s.c==='gold'?'gold-text':'neon-text'}`}>{s.v}</div>
              <div className="text-xs text-gray-400">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Weekly safety chart */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Weekly Safety Score</h3>
          <div className="flex items-end gap-4 h-32">
            {weeklyData.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-[#00C853] font-bold">{d.score}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-[#00C853] to-[#5efc82]"
                  style={{height:`${(d.score-80)*6}px`}}
                />
                <span className="text-xs text-gray-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Behavior events */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Driver Behavior Events (This Week)</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {events.map(e => (
              <div key={e.type} className="glass rounded-xl p-4 text-center hover-card">
                <div className="text-3xl mb-2">{e.icon}</div>
                <div className={`text-2xl font-black ${e.color}`}>{e.count}</div>
                <div className="text-xs text-gray-400 mt-1">{e.label}</div>
                <div className={`text-xs mt-1 ${e.count===0?'text-[#00C853]':e.count<=2?'text-[#FFD700]':'text-red-400'}`}>
                  {e.count===0?'Perfect':'Detected'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trip history */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Recent Trips</h3>
          <div className="space-y-3">
            {[
              { date:'Today 8:05 AM', route:'Route A', duration:'35 min', score:94, status:'completed' },
              { date:'Today 4:30 PM', route:'Route A', duration:'38 min', score:91, status:'completed' },
              { date:'Yesterday 8:02 AM', route:'Route A', duration:'33 min', score:97, status:'completed' },
              { date:'Yesterday 4:28 PM', route:'Route A', duration:'40 min', score:88, status:'completed' },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-4 p-4 glass rounded-xl hover-card">
                <div className="w-10 h-10 rounded-xl bg-[#00C853]/20 flex items-center justify-center text-lg">🚌</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">{t.route}</div>
                  <div className="text-xs text-gray-400">{t.date} · {t.duration}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold neon-text">{t.score}%</div>
                  <div className="text-xs text-gray-500">Safety</div>
                </div>
                <span className="text-xs glass-green text-[#00C853] px-2 py-1 rounded-full">✓ Done</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
