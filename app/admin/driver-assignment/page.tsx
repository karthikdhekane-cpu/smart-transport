'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockBuses, mockDrivers } from '@/lib/mockData';

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
  { href:'/admin/driver-assignment', icon:'👨‍✈️', label:'Driver Assignment' },
];

export default function DriverAssignmentPage() {
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [assignedDrivers, setAssignedDrivers] = useState<Record<string, string>>({
    'BUS-01': 'D001',
    'BUS-02': 'D002',
    'BUS-03': 'D003',
    'BUS-04': 'D004',
  });

  const getDriverName = (driverId: string) => 
    mockDrivers.find(d => d.id === driverId)?.name || driverId;

  const getDriverPhone = (driverId: string) => 
    mockDrivers.find(d => d.id === driverId)?.phone || '';

  const handleAssignDriver = (busId: string, driverId: string) => {
    setAssignedDrivers(prev => ({ ...prev, [busId]: driverId }));
  };

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Driver Assignment 👨‍✈️</h1>
            <p className="text-gray-400 text-sm mt-1">Assign drivers to buses</p>
          </div>
          <button className="bg-[#00C853] hover:bg-[#009624] text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
            + Assign New Driver
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bus List */}
          <div className="space-y-3">
            <h3 className="font-bold text-white">Buses</h3>
            {mockBuses.map(bus => {
              const assignedDriver = assignedDrivers[bus.id];
              const driver = assignedDriver ? mockDrivers.find(d => d.id === assignedDriver) : null;
              return (
                <div 
                  key={bus.id} 
                  className={`glass rounded-2xl p-4 hover-card cursor-pointer ${selectedDriver === bus.id ? 'border-2 border-[#00C853]' : ''}`}
                  onClick={() => setSelectedDriver(selectedDriver === bus.id ? null : bus.id)}
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
                  {driver ? (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-400">Driver:</span>
                      <span className="text-[#00C853] font-medium">{driver.name}</span>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 italic">No driver assigned</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Driver Assignment Panel */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Driver Assignment</h3>
            {selectedDriver ? (
              <div>
                <div className="text-sm text-gray-400 mb-4">
                  Assign a driver to <span className="text-white font-bold">{selectedDriver}</span>
                </div>
                
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {mockDrivers.map(driver => {
                    const isAssigned = assignedDrivers[selectedDriver] === driver.id;
                    return (
                      <button
                        key={driver.id}
                        onClick={() => handleAssignDriver(selectedDriver, driver.id)}
                        className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between ${
                          isAssigned 
                            ? 'bg-[#00C853]/20 border border-[#00C853]' 
                            : 'glass hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-white">{driver.name}</div>
                          <div className="text-xs text-gray-400">
                            {driver.experience} · {driver.busId || 'Unassigned'}
                          </div>
                        </div>
                        {isAssigned && (
                          <div className="text-[#00C853] font-bold">✓</div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {assignedDrivers[selectedDriver] && (
                  <div className="mt-6 p-4 glass-green rounded-xl">
                    <div className="text-sm font-semibold text-[#00C853] mb-1">✓ Driver Assigned</div>
                    <div className="text-xs text-white">
                      Driver {getDriverName(assignedDrivers[selectedDriver])} is now assigned to {selectedDriver}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
                Select a bus to view driver assignment options
              </div>
            )}
          </div>
        </div>

        {/* Assignment Summary */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4">Driver Assignment Summary</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockBuses.map(bus => {
              const driverId = assignedDrivers[bus.id];
              const driver = driverId ? mockDrivers.find(d => d.id === driverId) : null;
              return (
                <div key={bus.id} className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${bus.status === 'moving' ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <span className="font-bold text-white">{bus.number}</span>
                  </div>
                  {driver ? (
                    <>
                      <div className="text-sm text-white">{driver.name}</div>
                      <div className="text-xs text-gray-500">{driver.phone}</div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500 italic">No driver assigned</div>
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
