'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { OccupancyBarChart } from '@/components/occupancy';
import { mockBuses, mockStudents } from '@/lib/mockData';

const navItems = [
  { href:'/admin',           icon:'🏠', label:'Dashboard' },
  { href:'/admin/fleet',     icon:'🚌', label:'Fleet Monitor' },
  { href:'/admin/analytics', icon:'📊', label:'Analytics' },
  { href:'/admin/drivers',   icon:'👨‍✈️', label:'Drivers' },
  { href:'/admin/students',  icon:'🎓', label:'Students' },
  { href:'/admin/alerts',    icon:'🚨', label:'Alerts' },
  { href:'/admin/routes',    icon:'🗺️', label:'Routes' },
  { href:'/admin/maintenance', icon:'🔧', label:'Maintenance' },
  { href:'/admin/activity-logs', icon:'📋', label:'Activity Logs' },
  { href:'/admin/broadcast', icon:'📢', label:'Broadcast' },
  { href:'/admin/occupancy', icon:'👥', label:'Occupancy' },
];

const getColorForOccupancy = (pct: number) => {
  if (pct >= 90) return 'text-red-500 bg-red-500';
  if (pct >= 70) return 'text-amber-500 bg-amber-500';
  return 'text-green-500 bg-green-500';
};

const getLabelForOccupancy = (pct: number) => {
  if (pct >= 90) return 'Full - Critical';
  if (pct >= 70) return 'Crowded';
  return 'Good';
};

export default function OccupancyPage() {
  const [buses, setBuses] = useState(mockBuses);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(p => p + 1);
      setBuses(prev => prev.map(b => ({
        ...b,
        occupancy: Math.min(b.capacity, Math.max(0, b.occupancy + (Math.random() * 4 - 2))),
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalOccupancy = buses.reduce((acc, b) => acc + b.occupancy, 0);
  const totalCapacity = buses.reduce((acc, b) => acc + b.capacity, 0);
  const overallPct = Math.round((totalOccupancy / totalCapacity) * 100);

  const getRouteOccupancy = (routeId: string) => {
    const routeBuses = buses.filter(b => b.route.includes(routeId));
    const routeOccupancy = routeBuses.reduce((acc, b) => acc + b.occupancy, 0);
    const routeCapacity = routeBuses.reduce((acc, b) => acc + b.capacity, 0);
    return {
      occupancy: routeOccupancy,
      capacity: routeCapacity,
      pct: routeCapacity > 0 ? Math.round((routeOccupancy / routeCapacity) * 100) : 0,
    };
  };

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Bus Occupancy Monitoring 👥</h1>
            <p className="text-gray-400 text-sm mt-1">Real-time seat availability tracking</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-4 py-2 rounded-full text-sm font-bold ${getColorForOccupancy(overallPct)} bg-opacity-20`}>
              Overall: {overallPct}% Occupied
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-green rounded-2xl p-5">
            <div className="text-2xl text-[#00C853] mb-2">🚌</div>
            <div className="text-sm text-gray-400">Active Buses</div>
            <div className="text-2xl font-black neon-text">{buses.filter(b => b.status === 'moving').length}</div>
          </div>
          <div className="glass-gold rounded-2xl p-5">
            <div className="text-2xl text-[#FFD700] mb-2">👥</div>
            <div className="text-sm text-gray-400">Total Students</div>
            <div className="text-2xl font-black gold-text">{mockStudents.length}</div>
          </div>
          <div className="glass-blue rounded-2xl p-5">
            <div className="text-2xl text-blue-400 mb-2"> Seats</div>
            <div className="text-sm text-gray-400">Total Capacity</div>
            <div className="text-2xl font-black neon-text">{totalCapacity}</div>
          </div>
          <div className="glass-red rounded-2xl p-5">
            <div className="text-2xl text-red-400 mb-2"> Occupied</div>
            <div className="text-sm text-gray-400">Current Occupancy</div>
            <div className="text-2xl font-black neon-text">{totalOccupancy}</div>
          </div>
        </div>

        {/* Route Occupancy */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4">Route Occupancy Overview</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Gandhipuram', 'RS Puram', 'Peelamedu', 'Singanallur'].map((route, i) => {
              const { occupancy, capacity, pct } = getRouteOccupancy(route);
              return (
                <div key={route} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">{route} Route</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${pct >= 70 ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                      {pct}% Full
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">
                    {occupancy} / {capacity} seats occupied
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct >= 70 ? 'bg-amber-500' : 'bg-green-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Occupancy Trends */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <OccupancyBarChart title="Occupancy Trends (Last Hour)" />
          </div>
        </div>

        {/* Bus Details */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4">Real-time Bus Occupancy</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {buses.map(bus => {
              const occupancyPct = Math.round((bus.occupancy / bus.capacity) * 100);
              const colorClass = getColorForOccupancy(occupancyPct).split(' ')[1];
              return (
                <div key={bus.id} className="glass rounded-xl p-4 hover-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-xl ${colorClass}/20 flex items-center justify-center text-xl`}>
                        {bus.status === 'moving' ? '🚌' : '🛑'}
                      </div>
                      <div>
                        <div className="font-bold text-white">{bus.number}</div>
                        <div className="text-xs text-gray-400">{bus.route}</div>
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${occupancyPct >= 70 ? 'text-amber-500' : 'text-green-500'}`}>
                      {occupancyPct}%
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Occupancy</span>
                        <span className="text-white">{bus.occupancy} / {bus.capacity}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${colorClass}`}
                          style={{ width: `${occupancyPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="glass rounded-lg p-2 text-center">
                        <div className="text-gray-500">Status</div>
                        <div className="text-white font-medium">{bus.status}</div>
                      </div>
                      <div className="glass rounded-lg p-2 text-center">
                        <div className="text-gray-500">Speed</div>
                        <div className="text-white font-medium">{bus.speed} km/h</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student Distribution */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4">Student Distribution per Bus</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {mockStudents.map((student, i) => {
              const bus = buses.find(b => b.id === student.busId);
              return (
                <div key={student.id} className="flex items-center gap-3 p-3 glass rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#00C853]/20 flex items-center justify-center text-sm font-bold text-[#00C853]">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{student.name}</div>
                    <div className="text-xs text-gray-400">{student.rollNo} • {student.stop}</div>
                  </div>
                  {bus && (
                    <div className="text-xs font-medium text-[#00C853]">
                      {bus.number}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
