'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { speedMonitoringService } from '@/features/fleet-monitoring';
import { mockBuses, mockDrivers } from '@/lib/mockData';
import { SpeedMonitoringData, SpeedEvent } from '@/features/fleet-monitoring/types/index';

const navItems = [
  { href:'/admin',           icon:'🏠', label:'Dashboard' },
  { href:'/admin/fleet',     icon:'🚌', label:'Fleet Monitor' },
  { href:'/admin/analytics', icon:'📊', label:'Analytics' },
  { href:'/admin/drivers',   icon:'👨‍✈️', label:'Drivers' },
  { href:'/admin/students',  icon:'🎓', label:'Students' },
  { href:'/admin/alerts',    icon:'🚨', label:'Alerts' },
  { href:'/admin/routes',    icon:'🗺️', label:'Routes' },
  { href:'/admin/speed',     icon:'🚀', label:'Speed Monitor' },
];

export default function SpeedMonitoringPage() {
  const [selectedBus, setSelectedBus] = useState<string>('BUS-01');
  const [selectedDriver, setSelectedDriver] = useState<string>('D1');
  const [timePeriod, setTimePeriod] = useState<'today' | 'week' | 'month'>('today');
  const [speedData, setSpeedData] = useState<SpeedMonitoringData | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTick(p => p + 1);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // Update speed data when selection changes
    const data = speedMonitoringService.getSpeedMonitoringData(selectedBus);
    setSpeedData(data);
  }, [selectedBus, tick]);

  const selectedBusData = mockBuses.find(b => b.id === selectedBus);
  const fleetSummary = speedMonitoringService.getFleetSpeedSummary();
  const overspeedingVehicles = speedMonitoringService.getOverspeedingVehicles();
  const warningVehicles = speedMonitoringService.getWarningVehicles();

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">Speed Monitoring 🚀</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time speed tracking and overspeed detection</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-400 mb-1 block">Vehicle</label>
            <select
              value={selectedBus}
              onChange={(e) => setSelectedBus(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              {mockBuses.map(bus => (
                <option key={bus.id} value={bus.id}>{bus.number} - {bus.route}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-400 mb-1 block">Driver</label>
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              {mockDrivers.map(driver => (
                <option key={driver.id} value={driver.id}>{driver.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs text-gray-400 mb-1 block">Time Period</label>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as any)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Fleet Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-green rounded-2xl p-5 hover-card">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-black neon-text">{fleetSummary.averageSpeed.toFixed(1)} km/h</div>
            <div className="text-xs text-gray-400">Fleet Avg Speed</div>
          </div>
          <div className="glass-green rounded-2xl p-5 hover-card">
            <div className="text-3xl mb-2">🚀</div>
            <div className="text-2xl font-black text-[#FFD700]">{fleetSummary.overspeedCount}</div>
            <div className="text-xs text-gray-400">Overspeeding</div>
          </div>
          <div className="glass-gold rounded-2xl p-5 hover-card">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-2xl font-black gold-text">{fleetSummary.warningCount}</div>
            <div className="text-xs text-gray-400">Warning</div>
          </div>
          <div className="glass-green rounded-2xl p-5 hover-card">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-black neon-text">{fleetSummary.normalCount}</div>
            <div className="text-xs text-gray-400">Normal</div>
          </div>
        </div>

        {/* Current Speed Status */}
        {speedData && selectedBusData && (
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4">Current Speed Status - {selectedBusData.number}</h3>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-4xl font-black mb-2 ${
                  speedData.status === 'overspeed' ? 'text-red-400' : 
                  speedData.status === 'warning' ? 'text-[#FFD700]' : 'neon-text'
                }`}>
                  {speedData.currentSpeed} km/h
                </div>
                <div className="text-xs text-gray-400">Current Speed</div>
                <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                  speedData.status === 'overspeed' ? 'bg-red-500/20 text-red-400' : 
                  speedData.status === 'warning' ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'bg-[#00C853]/20 text-[#00C853]'
                }`}>
                  {speedData.status.toUpperCase()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black neon-text mb-2">{speedData.maxRecordedSpeed} km/h</div>
                <div className="text-xs text-gray-400">Max Recorded Speed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black neon-text mb-2">{speedData.overspeedCount}</div>
                <div className="text-xs text-gray-400">Overspeed Events</div>
              </div>
            </div>

            {/* Speed Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>0 km/h</span>
                <span>Speed Limit: {speedData.speedLimit} km/h</span>
                <span>100 km/h</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    speedData.currentSpeed >= 60 ? 'bg-red-500' :
                    speedData.currentSpeed >= 45 ? 'bg-[#FFD700]' : 'bg-[#00C853]'
                  }`}
                  style={{ width: `${Math.min(speedData.currentSpeed, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Overspeeding Vehicles */}
        {overspeedingVehicles.length > 0 && (
          <div className="glass-red rounded-2xl p-6">
            <h3 className="font-bold mb-4 text-red-400">⚠️ Overspeeding Vehicles</h3>
            <div className="space-y-3">
              {overspeedingVehicles.map(busId => {
                const bus = mockBuses.find(b => b.id === busId);
                return (
                  <div key={busId} className="flex items-center justify-between bg-red-500/10 rounded-lg p-3">
                    <div>
                      <div className="font-semibold">{bus?.number}</div>
                      <div className="text-xs text-gray-400">{bus?.route}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-bold">{bus?.speed} km/h</div>
                      <div className="text-xs text-gray-400">{bus?.driver}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Speed History Table */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Speed History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Driver</th>
                  <th className="pb-3">Current Speed</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Max Speed</th>
                  <th className="pb-3">Avg Speed</th>
                  <th className="pb-3">Overspeed Events</th>
                </tr>
              </thead>
              <tbody>
                {mockBuses.map(bus => {
                  const data = speedMonitoringService.getSpeedMonitoringData(bus.id);
                  return (
                    <tr key={bus.id} className="border-b border-white/5">
                      <td className="py-3">{bus.number}</td>
                      <td className="py-3">{bus.driver}</td>
                      <td className="py-3 font-semibold">{bus.speed} km/h</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          data.status === 'overspeed' ? 'bg-red-500/20 text-red-400' : 
                          data.status === 'warning' ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'bg-[#00C853]/20 text-[#00C853]'
                        }`}>
                          {data.status}
                        </span>
                      </td>
                      <td className="py-3">{data.maxRecordedSpeed} km/h</td>
                      <td className="py-3">{data.averageSpeed.toFixed(1)} km/h</td>
                      <td className="py-3">{data.overspeedCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
