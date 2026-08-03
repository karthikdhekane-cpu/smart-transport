'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockDrivers } from '@/lib/mockData';

const navItems = [
  { href:'/admin',           icon:'🏠', label:'Dashboard' },
  { href:'/admin/fleet',     icon:'🚌', label:'Fleet Monitor' },
  { href:'/admin/analytics', icon:'📊', label:'Analytics' },
  { href:'/admin/drivers',   icon:'👨‍✈️', label:'Drivers' },
  { href:'/admin/students',  icon:'🎓', label:'Students' },
  { href:'/admin/alerts',    icon:'🚨', label:'Alerts' },
  { href:'/admin/routes',    icon:'🗺️', label:'Routes' },
];

export default function DriversPage() {
  const [search, setSearch] = useState('');
  const filtered = mockDrivers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.busId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Driver Management 👨‍✈️</h1>
            <p className="text-gray-400 text-sm mt-1">{mockDrivers.length} registered drivers</p>
          </div>
          <button className="bg-[#00C853] hover:bg-[#009624] text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
            + Add Driver
          </button>
        </div>

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search drivers..."
          className="w-full glass rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none text-sm"
        />

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((d, i) => (
            <div key={d.id} className="glass rounded-2xl p-6 hover-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#00C853]/20 flex items-center justify-center text-2xl">👨‍✈️</div>
                  <div>
                    <div className="font-bold text-white">{d.name}</div>
                    <div className="text-xs text-gray-400">{d.busId} · {d.experience}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black neon-text">{d.safetyScore}%</div>
                  <div className="text-xs text-gray-500">Safety</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>License</span><span className="text-white text-xs">{d.license}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Phone</span><span className="text-white">{d.phone}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Total Trips</span><span className="text-white">{d.trips.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Safety Score</span>
                  <span className="neon-text">{d.safetyScore}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00C853] rounded-full" style={{width:`${d.safetyScore}%`}}/>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 glass text-gray-400 hover:text-white py-2 rounded-xl text-xs transition-all">View Details</button>
                <button className="flex-1 glass text-gray-400 hover:text-white py-2 rounded-xl text-xs transition-all">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
