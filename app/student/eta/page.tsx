'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const navItems = [
  { href:'/student',          icon:'🏠', label:'Dashboard' },
  { href:'/student/tracking', icon:'🗺️', label:'Live Tracking' },
  { href:'/student/eta',      icon:'⏱️', label:'ETA & Alarm' },
  { href:'/student/notifications', icon:'🔔', label:'Notifications' },
  { href:'/student/lost-found',    icon:'📦', label:'Lost & Found' },
  { href:'/student/safety',        icon:'🛡️', label:'Safety' },
];

export default function ETAPage() {
  const [eta, setEta] = useState(8);
  const [confidence, setConfidence] = useState(94);
  const [alarmMin, setAlarmMin] = useState<number|null>(null);
  const [alarmSet, setAlarmSet] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTick(p => p+1);
      setEta(prev => Math.max(1, prev - 0.1 + (Math.random()-0.5)*0.3));
      setConfidence(Math.round(90 + Math.random()*8));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const etaDisplay = Math.round(eta);
  const factors = [
    { label:'Current Traffic', value:'Moderate', icon:'🚦', impact:'+2 min' },
    { label:'Bus Speed', value:'42 km/h', icon:'🚀', impact:'Normal' },
    { label:'Distance', value:'3.2 km', icon:'📍', impact:'-' },
    { label:'Historical Avg', value:'8.4 min', icon:'📊', impact:'On track' },
    { label:'Weather', value:'Clear', icon:'☀️', impact:'No impact' },
  ];

  return (
    <DashboardLayout role="student" navItems={navItems} userName="Priya Sharma">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">AI ETA Engine ⏱️</h1>
          <p className="text-gray-400 text-sm mt-1">Machine learning powered arrival prediction</p>
        </div>

        {/* Big ETA display */}
        <div className="glass-green rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 shimmer"/>
          <div className="relative z-10">
            <p className="text-gray-400 text-sm mb-2">Estimated Time of Arrival</p>
            <div className="text-8xl font-black neon-text mb-2">{etaDisplay}</div>
            <p className="text-2xl text-gray-300 font-light">minutes</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse"/>
              <span className="text-sm text-[#00C853]">AI Confidence: {confidence}%</span>
            </div>
            {/* Confidence bar */}
            <div className="mt-4 max-w-xs mx-auto">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#00C853] rounded-full transition-all duration-1000" style={{width:`${confidence}%`}}/>
              </div>
            </div>
          </div>
        </div>

        {/* AI Factors */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">🤖 AI Prediction Factors</h3>
          <div className="space-y-3">
            {factors.map(f => (
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
      </div>
    </DashboardLayout>
  );
}
