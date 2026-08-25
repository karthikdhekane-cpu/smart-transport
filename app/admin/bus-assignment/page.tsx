'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockBuses, mockRoutes } from '@/lib/mockData';

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
  { href:'/admin/chat', icon:'💬', label:'Chat' },
  { href:'/admin/bus-assignment', icon:'🛻', label:'Bus Assignment' },
];

export default function BusAssignmentPage() {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [assignedRoutes, setAssignedRoutes] = useState<Record<string, string>>({
    'BUS-01': 'route-a',
    'BUS-02': 'route-b',
  });

  const handleAssignBus = (busId: string, routeId: string) => {
    setAssignedRoutes(prev => ({ ...prev, [busId]: routeId }));
  };

  const getRouteName = (routeId: string) => 
    mockRoutes.find(r => r.id === routeId)?.name || routeId;

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Bus Assignment 🛻</h1>
            <p className="text-gray-400 text-sm mt-1">Assign buses to routes</p>
          </div>
          <button className="bg-[#00C853] hover:bg-[#009624] text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
            + Assign New Bus
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bus List */}
          <div className="space-y-3">
            <h3 className="font-bold text-white">Available Buses</h3>
            {mockBuses.map(bus => {
              const assignedRoute = assignedRoutes[bus.id];
              return (
                <div 
                  key={bus.id} 
                  className={`glass rounded-2xl p-4 hover-card cursor-pointer ${selectedBus === bus.id ? 'border-2 border-[#00C853]' : ''}`}
                  onClick={() => setSelectedBus(bus.id === selectedBus ? null : bus.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#00C853]/20 flex items-center justify-center text-xl">
                        {bus.status === 'moving' ? '🚌' : '🛑'}
                      </div>
                      <div>
                        <div className="font-bold text-white">{bus.number}</div>
                        <div className="text-xs text-gray-400">{bus.id}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${bus.status === 'moving' ? 'bg-[#00C853]/20 text-[#00C853]' : 'bg-gray-500/20 text-gray-400'}`}>
                      {bus.status}
                    </span>
                  </div>
                  {assignedRoute && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-400">Assigned to:</span>
                      <span className="text-[#00C853] font-medium">{getRouteName(assignedRoute)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Assignment Panel */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Assignment Panel</h3>
            {selectedBus ? (
              <div>
                <div className="text-sm text-gray-400 mb-4">
                  Assign bus <span className="text-white font-bold">{selectedBus}</span> to a route
                </div>
                
                <div className="space-y-3">
                  {mockRoutes.map(route => (
                    <button
                      key={route.id}
                      onClick={() => handleAssignBus(selectedBus, route.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        assignedRoutes[selectedBus] === route.id 
                          ? 'bg-[#00C853]/20 border-2 border-[#00C853]' 
                          : 'glass hover:bg-white/5'
                      }`}
                    >
                      <div className="font-semibold text-white mb-1">{route.name}</div>
                      <div className="text-xs text-gray-400">
                        {route.stops.length} stops · {route.color.toUpperCase()} line
                      </div>
                    </button>
                  ))}
                </div>

                {assignedRoutes[selectedBus] && (
                  <div className="mt-6 p-4 glass-green rounded-xl">
                    <div className="text-sm font-semibold text-[#00C853] mb-1">✓ Assignment Updated</div>
                    <div className="text-xs text-white">
                      Bus {selectedBus} is now assigned to {getRouteName(assignedRoutes[selectedBus])}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
                Select a bus to view assignment options
              </div>
            )}
          </div>
        </div>

        {/* Assignment Summary */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4">Assignment Summary</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockBuses.map(bus => {
              const assignedRoute = assignedRoutes[bus.id];
              return (
                <div key={bus.id} className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${bus.status === 'moving' ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <span className="font-bold text-white">{bus.number}</span>
                  </div>
                  {assignedRoute ? (
                    <div className="text-sm text-[#00C853]">{getRouteName(assignedRoute)}</div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">Not assigned</div>
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
