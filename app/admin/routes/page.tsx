'use client';
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

const routes = [
  { id:'route-a', name:'Route A — Gandhipuram', bus:'BUS-01', stops:5, students:120, status:'active', color:'#00C853' },
  { id:'route-b', name:'Route B — RS Puram',    bus:'BUS-02', stops:4, students:98,  status:'active', color:'#FFD700' },
  { id:'route-c', name:'Route C — Peelamedu',   bus:'BUS-03', stops:6, students:85,  status:'active', color:'#2196F3' },
  { id:'route-d', name:'Route D — Singanallur', bus:'BUS-04', stops:5, students:110, status:'active', color:'#FF5722' },
];

export default function RoutesPage() {
  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Route Management 🗺️</h1>
            <p className="text-gray-400 text-sm mt-1">{routes.length} active routes</p>
          </div>
          <button className="bg-[#00C853] hover:bg-[#009624] text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
            + Add Route
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {routes.map(r => (
            <div key={r.id} className="glass rounded-2xl p-6 hover-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{background:r.color}}/>
                  <h3 className="font-bold text-white">{r.name}</h3>
                </div>
                <span className="glass-green text-[#00C853] text-xs px-2 py-1 rounded-full">Active</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { l:'Bus', v:r.bus },
                  { l:'Stops', v:r.stops },
                  { l:'Students', v:r.students },
                ].map(s => (
                  <div key={s.l} className="glass rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-white">{s.v}</div>
                    <div className="text-xs text-gray-500">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 glass text-gray-400 hover:text-white py-2 rounded-xl text-xs transition-all">View Map</button>
                <button className="flex-1 glass text-gray-400 hover:text-white py-2 rounded-xl text-xs transition-all">Edit Stops</button>
                <button className="flex-1 glass text-gray-400 hover:text-white py-2 rounded-xl text-xs transition-all">Assign Bus</button>
              </div>
            </div>
          ))}
        </div>

        {/* All routes map */}
        <div className="glass rounded-2xl p-4">
          <h3 className="font-bold mb-4">All Routes Overview</h3>
          <MapMock buses={mockBuses} route={mockRoutes[0]} height={400} showAllBuses/>
        </div>
      </div>
    </DashboardLayout>
  );
}
