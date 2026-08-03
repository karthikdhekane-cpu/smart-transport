'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MapMock from '@/components/map/MapMock';
import { mockBuses, mockRoutes } from '@/lib/mockData';

const navItems = [
  { href:'/admin',           icon:'🏠', label:'Dashboard' },
  { href:'/admin/fleet',     icon:'🚌', label:'Fleet Monitor' },
  { href:'/admin/analytics', icon:'📊', label:'Analytics' },
  { href:'/admin/drivers',   icon:'👨‍✈️', label:'Drivers' },
  { href:'/admin/students',  icon:'🎓', label:'Students' },
  { href:'/admin/alerts',    icon:'🚨', label:'Alerts' },
  { href:'/admin/routes',    icon:'🗺️', label:'Routes' },
];

export default function FleetPage() {
  const [buses, setBuses] = useState(mockBuses);
  const [selected, setSelected] = useState<string|null>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setBuses(prev => prev.map(b => ({
        ...b,
        lat: b.lat + (Math.random()-0.5)*0.0003,
        lng: b.lng + (Math.random()-0.5)*0.0003,
        speed: b.status==='moving' ? Math.round(30+Math.random()*30) : 0,
      })));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const selectedBus = buses.find(b => b.id === selected);

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">Fleet Monitor 🚌</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time tracking of all {buses.length} buses</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Bus list */}
          <div className="space-y-3">
            {buses.map(bus => (
              <button
                key={bus.id}
                onClick={() => setSelected(bus.id === selected ? null : bus.id)}
                className={`w-full text-left glass rounded-2xl p-4 hover-card transition-all ${selected===bus.id?'border border-[#00C853]/50':''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">{bus.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${bus.status==='moving'?'bg-[#00C853]/20 text-[#00C853]':'bg-white/10 text-gray-400'}`}>
                    {bus.status}
                  </span>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>{bus.route}</div>
                  <div className="flex justify-between">
                    <span>{bus.driver}</span>
                    <span className="neon-text font-bold">ETA {bus.eta}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{bus.speed} km/h</span>
                    <span>{bus.occupancy}/{bus.capacity} seats</span>
                  </div>
                </div>
                <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{width:`${(bus.occupancy/bus.capacity)*100}%`, background:bus.color}}/>
                </div>
              </button>
            ))}
          </div>

          {/* Map */}
          <div className="lg:col-span-2 glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">
                {selectedBus ? `${selectedBus.id} — ${selectedBus.route}` : 'All Buses'}
              </h3>
              <span className="text-xs text-[#00C853] glass-green px-2 py-1 rounded-full">Live</span>
            </div>
            <MapMock
              buses={selectedBus ? [selectedBus] : buses}
              route={selectedBus ? mockRoutes.find(r=>r.busId===selectedBus.id) : mockRoutes[0]}
              height={460}
              showAllBuses
            />
            {selectedBus && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {[
                  { l:'Speed', v:`${selectedBus.speed} km/h` },
                  { l:'Occupancy', v:`${selectedBus.occupancy}/${selectedBus.capacity}` },
                  { l:'ETA', v:selectedBus.eta },
                  { l:'Safety', v:`${selectedBus.safetyScore}%` },
                ].map(s => (
                  <div key={s.l} className="glass rounded-xl p-3 text-center">
                    <div className="text-sm font-bold neon-text">{s.v}</div>
                    <div className="text-xs text-gray-500">{s.l}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
