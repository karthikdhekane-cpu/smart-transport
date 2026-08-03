'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockWeeklyData, mockOccupancyData, mockStats } from '@/lib/mockData';

const navItems = [
  { href:'/admin',           icon:'🏠', label:'Dashboard' },
  { href:'/admin/fleet',     icon:'🚌', label:'Fleet Monitor' },
  { href:'/admin/analytics', icon:'📊', label:'Analytics' },
  { href:'/admin/drivers',   icon:'👨‍✈️', label:'Drivers' },
  { href:'/admin/students',  icon:'🎓', label:'Students' },
  { href:'/admin/alerts',    icon:'🚨', label:'Alerts' },
  { href:'/admin/routes',    icon:'🗺️', label:'Routes' },
];

// Heatmap data (delay intensity per hour per day)
const heatmapData = [
  [0,0,0,1,2,3,4,3,2,1,0,0,1,2,3,2,1,0,0,0,0,0,0,0],
  [0,0,0,0,1,2,3,4,3,2,1,0,0,1,2,3,2,1,0,0,0,0,0,0],
  [0,0,0,1,3,4,5,4,3,2,1,0,0,2,3,4,3,1,0,0,0,0,0,0],
  [0,0,0,0,1,2,2,3,2,1,0,0,0,1,2,2,1,0,0,0,0,0,0,0],
  [0,0,0,1,2,3,4,3,2,1,0,0,1,2,3,2,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,2,2,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];
const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const hours = Array.from({length:24},(_,i)=>`${i}h`);

function heatColor(v: number) {
  if (v === 0) return 'rgba(0,200,83,0.05)';
  if (v === 1) return 'rgba(255,215,0,0.2)';
  if (v === 2) return 'rgba(255,165,0,0.4)';
  if (v === 3) return 'rgba(255,100,0,0.5)';
  if (v >= 4)  return 'rgba(239,68,68,0.7)';
  return 'transparent';
}

export default function AnalyticsPage() {
  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">Analytics Dashboard 📊</h1>
          <p className="text-gray-400 text-sm mt-1">Fleet intelligence and performance insights</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l:'Avg ETA Accuracy', v:`${mockStats.avgETA} min`, icon:'🎯', c:'green' },
            { l:'On-Time Rate', v:`${mockStats.onTimeRate}%`, icon:'⏱️', c:'gold' },
            { l:'Trips Today', v:mockStats.totalTripsToday, icon:'🗺️', c:'green' },
            { l:'Alerts Today', v:mockStats.alertsToday, icon:'🚨', c:'gold' },
          ].map(s => (
            <div key={s.l} className={`${s.c==='gold'?'glass-gold':'glass-green'} rounded-2xl p-5 hover-card`}>
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className={`text-2xl font-black ${s.c==='gold'?'gold-text':'neon-text'}`}>{s.v}</div>
              <div className="text-xs text-gray-400">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* On-time bar chart */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4">Weekly On-Time vs Delayed</h3>
            <div className="space-y-3">
              {mockWeeklyData.map(d => (
                <div key={d.day} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-8">{d.day}</span>
                  <div className="flex-1 flex gap-1 h-6">
                    <div className="rounded-l bg-[#00C853]/70 flex items-center justify-end pr-1" style={{width:`${d.onTime}%`}}>
                      <span className="text-[10px] text-black font-bold">{d.onTime}%</span>
                    </div>
                    <div className="rounded-r bg-red-500/50 flex items-center pl-1" style={{width:`${d.delayed}%`}}>
                      {d.delayed > 0 && <span className="text-[10px] text-white">{d.delayed}%</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#00C853]/70"/><span className="text-gray-400">On-Time</span></div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/50"/><span className="text-gray-400">Delayed</span></div>
            </div>
          </div>

          {/* Occupancy line chart */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4">Occupancy Trend (Today)</h3>
            <div className="relative h-32">
              <svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="none">
                {/* Grid lines */}
                {[0,30,60,90,120].map(y => (
                  <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                ))}
                {/* BUS01 line */}
                <polyline
                  points={mockOccupancyData.map((d,i) => `${i*75},${120-(d.BUS01/52)*110}`).join(' ')}
                  stroke="#00C853" strokeWidth="2" fill="none"
                />
                {/* BUS02 line */}
                <polyline
                  points={mockOccupancyData.map((d,i) => `${i*75},${120-(d.BUS02/52)*110}`).join(' ')}
                  stroke="#FFD700" strokeWidth="2" fill="none"
                />
              </svg>
            </div>
            <div className="flex gap-4 mt-2 text-xs">
              {['BUS-01','BUS-02','BUS-03','BUS-04'].map((b,i) => (
                <div key={b} className="flex items-center gap-1">
                  <span className="w-3 h-1 rounded" style={{background:['#00C853','#FFD700','#2196F3','#FF5722'][i]}}/>
                  <span className="text-gray-400">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delay Heatmap */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-2">Delay Heatmap — Peak Hours</h3>
          <p className="text-gray-500 text-xs mb-4">Delay intensity by day and hour (darker = more delays)</p>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Hour labels */}
              <div className="flex gap-0.5 mb-1 ml-10">
                {hours.filter((_,i)=>i%3===0).map(h => (
                  <div key={h} className="flex-1 text-[9px] text-gray-600 text-center">{h}</div>
                ))}
              </div>
              {heatmapData.map((row, di) => (
                <div key={di} className="flex items-center gap-0.5 mb-0.5">
                  <span className="text-[10px] text-gray-500 w-8 flex-shrink-0">{days[di]}</span>
                  {row.map((v, hi) => (
                    <div
                      key={hi}
                      className="flex-1 h-5 rounded-sm transition-all hover:scale-110"
                      style={{background:heatColor(v)}}
                      title={`${days[di]} ${hi}:00 — Delay level: ${v}`}
                    />
                  ))}
                </div>
              ))}
              {/* Legend */}
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                <span>Low</span>
                {[0,1,2,3,4].map(v => (
                  <div key={v} className="w-4 h-4 rounded-sm" style={{background:heatColor(v)}}/>
                ))}
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Route efficiency */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Route Efficiency Scores</h3>
          <div className="space-y-4">
            {[
              { route:'Route A — Gandhipuram', score:96, trips:48, delays:2 },
              { route:'Route B — RS Puram', score:88, trips:48, delays:6 },
              { route:'Route C — Peelamedu', score:94, trips:48, delays:3 },
              { route:'Route D — Singanallur', score:91, trips:44, delays:4 },
            ].map(r => (
              <div key={r.route} className="flex items-center gap-4 p-3 glass rounded-xl">
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{r.route}</div>
                  <div className="text-xs text-gray-500">{r.trips} trips · {r.delays} delays</div>
                </div>
                <div className="w-32">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Efficiency</span>
                    <span className="neon-text font-bold">{r.score}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00C853] rounded-full" style={{width:`${r.score}%`}}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
