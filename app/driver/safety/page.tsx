'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';

const navItems = [
  { href:'/driver',          icon:'🏠', label:'Dashboard' },
  { href:'/driver/trip',     icon:'🚌', label:'Trip Control' },
  { href:'/driver/analytics',icon:'📊', label:'My Analytics' },
  { href:'/driver/safety',   icon:'🛡️', label:'Safety Score' },
];

export default function DriverSafetyPage() {
  const score = 94;
  const metrics = [
    { label:'Speed Compliance', value:97, icon:'🚀' },
    { label:'Smooth Braking', value:91, icon:'🛑' },
    { label:'Smooth Acceleration', value:95, icon:'⚡' },
    { label:'Turn Safety', value:98, icon:'↩️' },
    { label:'Idle Management', value:88, icon:'⏸️' },
  ];

  return (
    <DashboardLayout role="driver" navItems={navItems} userName="Rajesh Kumar">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">Safety Score 🛡️</h1>
          <p className="text-gray-400 text-sm mt-1">Your driving safety performance</p>
        </div>

        {/* Big score */}
        <div className="glass-green rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 shimmer"/>
          <div className="relative z-10">
            <p className="text-gray-400 mb-2">Overall Safety Score</p>
            <div className="text-9xl font-black neon-text">{score}</div>
            <div className="text-2xl text-gray-300">/ 100</div>
            <div className="mt-4 inline-flex items-center gap-2 glass-green rounded-full px-4 py-2 text-sm">
              <span>🏆</span>
              <span className="text-[#00C853] font-semibold">Excellent Driver · Top 10%</span>
            </div>
          </div>
        </div>

        {/* Metric breakdown */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Score Breakdown</h3>
          <div className="space-y-4">
            {metrics.map(m => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    <span>{m.icon}</span>
                    <span className="text-gray-300">{m.label}</span>
                  </div>
                  <span className="text-sm font-bold neon-text">{m.value}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00C853] to-[#5efc82] transition-all duration-1000"
                    style={{width:`${m.value}%`}}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">🏅 Safety Badges</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon:'🥇', label:'Safe Driver', earned:true },
              { icon:'⚡', label:'Speed Master', earned:true },
              { icon:'🛑', label:'Smooth Braker', earned:true },
              { icon:'🌟', label:'Zero Incidents', earned:false },
              { icon:'🏆', label:'Top Driver', earned:false },
              { icon:'💎', label:'Diamond Class', earned:false },
            ].map(b => (
              <div key={b.label} className={`glass rounded-xl p-4 text-center ${b.earned ? '' : 'opacity-30'}`}>
                <div className="text-3xl mb-2">{b.icon}</div>
                <div className="text-xs text-gray-300">{b.label}</div>
                {b.earned && <div className="text-[10px] text-[#00C853] mt-1">Earned</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
