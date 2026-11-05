'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockBuses, mockRoutes } from '@/lib/mockData';
import { gpsService } from '@/features/gps-tracking';

const navItems = [
  { href:'/admin',           icon:'🏠', label:'Dashboard' },
  { href:'/admin/fleet',     icon:'🚌', label:'Fleet Monitor' },
  { href:'/admin/trips',     icon:'📅', label:'Trips' },
  { href:'/admin/analytics', icon:'📊', label:'Analytics' },
  { href:'/admin/drivers',   icon:'👨‍✈️', label:'Drivers' },
  { href:'/admin/students',  icon:'🎓', label:'Students' },
  { href:'/admin/alerts',    icon:'🚨', label:'Alerts' },
  { href:'/admin/routes',    icon:'🗺️', label:'Routes' },
  { href:'/admin/maintenance', icon:'🔧', label:'Maintenance' },
  { href:'/admin/activity-logs', icon:'📋', label:'Activity Logs' },
  { href:'/admin/broadcast', icon:'📢', label:'Broadcast' },
  { href:'/admin/occupancy', icon:'👥', label:'Occupancy' },
  { href:'/admin/chat', icon:'💬', label:'Chat' },
  { href:'/admin/bus-assignment', icon:'🛻', label:'Bus Assignment' },
  { href:'/admin/driver-assignment', icon:'👨‍✈️', label:'Driver Assignment' },
  { href:'/admin/route-scheduling', icon:'📅', label:'Route Scheduling' },
];

export default function RouteSchedulingPage() {
  const [schedule, setSchedule] = useState<Record<string, string>>({
    'route-a': 'BUS-01',
    'route-b': 'BUS-02',
  });

  const [schedules, setSchedules] = useState<Record<string, Array<{day: string, startTime: string, endTime: string}>>>({
    'route-a': [
      { day: 'Mon-Fri', startTime: '7:00 AM', endTime: '8:30 AM' },
      { day: 'Sat', startTime: '8:00 AM', endTime: '9:30 AM' },
    ],
    'route-b': [
      { day: 'Mon-Fri', startTime: '7:15 AM', endTime: '8:45 AM' },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSchedules(prev => ({ ...prev }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAssignBus = (routeId: string, busId: string) => {
    setSchedule(prev => ({ ...prev, [routeId]: busId }));
  };

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Route Scheduling 📅</h1>
            <p className="text-gray-400 text-sm mt-1">Manage route timetables and assignments</p>
          </div>
          <button className="bg-[#00C853] hover:bg-[#009624] text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
            + Schedule Route
          </button>
        </div>

        {/* Route Schedule Timeline */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4">Route Schedule Timeline</h3>
          
          <div className="space-y-4">
            {mockRoutes.map(route => {
              const assignedBus = schedule[route.id];
              const bus = mockBuses.find(b => b.id === assignedBus);
              return (
                <div key={route.id} className="glass rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 flex-shrink-0">
                      <div className="text-xs font-bold text-white mb-1">{route.name}</div>
                      <div className="text-[10px] text-gray-400">
                        {route.stops.length} stops
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      {/* Schedule Timeline */}
                      <div className="relative h-16">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full h-0.5 bg-white/10" />
                        </div>
                        {schedules[route.id]?.map((s, i) => (
                          <div key={i} className="absolute flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#00C853]" />
                            <div className="px-2 py-1 bg-[#00C853]/20 rounded text-xs text-[#00C853] font-semibold">
                              {s.day}
                            </div>
                            <div className="text-xs text-gray-400">
                              {s.startTime} - {s.endTime}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="w-32 flex-shrink-0">
                      <div className="text-xs text-gray-400 mb-1">Assigned Bus</div>
                      <select
                        value={assignedBus}
                        onChange={(e) => handleAssignBus(route.id, e.target.value)}
                        className="w-full glass rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
                      >
                        <option value="">No Bus</option>
                        {mockBuses.map(b => (
                          <option key={b.id} value={b.id}>{b.number} ({b.id})</option>
                        ))}
                      </select>
                      {bus && (
                        <div className="mt-2 text-xs text-[#00C853]">
                          {bus.status === 'moving' ? 'Active' : 'Available'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver Assignments per Route */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Driver Assignments</h3>
            <div className="space-y-3">
              {mockRoutes.map(route => {
                const busId = schedule[route.id];
                const bus = mockBuses.find(b => b.id === busId);
                return (
                  <div key={route.id} className="glass rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">{route.name}</span>
                      <span className="text-xs text-gray-400">{route.color.toUpperCase()}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Bus: {bus ? bus.number : 'Not assigned'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Schedule Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-black neon-text mb-1">{mockRoutes.length}</div>
                <div className="text-xs text-gray-400">Active Routes</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-black neon-text mb-1">{mockBuses.length}</div>
                <div className="text-xs text-gray-400">Buses Scheduled</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-black neon-text mb-1">
                  {Object.values(schedule).filter(Boolean).length}
                </div>
                <div className="text-xs text-gray-400">Fully Assigned</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-black neon-text mb-1">
                  {mockRoutes.length - Object.values(schedule).filter(Boolean).length}
                </div>
                <div className="text-xs text-gray-400">Pending</div>
              </div>
            </div>

            <div className="mt-4 p-4 glass rounded-xl">
              <h4 className="text-sm font-bold text-white mb-3">Upcoming Schedule</h4>
              {mockRoutes.map((route, i) => (
                <div key={route.id} className="flex items-center justify-between text-sm mb-2 last:mb-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full`} style={{background: route.color}} />
                    <span className="text-gray-300">{route.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {schedules[route.id]?.[0]?.startTime || 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Route Map View */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4">Route Overview</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {mockRoutes.map(route => (
              <div key={route.id} className="glass rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl" style={{background: route.color}}>
                    <span className="text-white text-center text-xs w-full mt-2">{route.stops.length} stops</span>
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{route.name}</div>
                    <div className="text-[10px] text-gray-400">{route.id}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Start:</span>
                    <span className="text-white">{route.stops[0]?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>End:</span>
                    <span className="text-white">{route.stops[route.stops.length - 1]?.name}</span>
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
