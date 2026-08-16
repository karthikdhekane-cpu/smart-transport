'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { vehicleHealthService } from '@/features/fleet-monitoring';
import { mockBuses } from '@/lib/mockData';
import { VehicleHealth, HealthStatus } from '@/features/fleet-monitoring/types/index';

const navItems = [
  { href:'/admin',           icon:'🏠', label:'Dashboard' },
  { href:'/admin/fleet',     icon:'🚌', label:'Fleet Monitor' },
  { href:'/admin/analytics', icon:'📊', label:'Analytics' },
  { href:'/admin/drivers',   icon:'👨‍✈️', label:'Drivers' },
  { href:'/admin/students',  icon:'🎓', label:'Students' },
  { href:'/admin/alerts',    icon:'🚨', label:'Alerts' },
  { href:'/admin/routes',    icon:'🗺️', label:'Routes' },
  { href:'/admin/vehicle-health', icon:'🔧', label:'Vehicle Health' },
];

export default function VehicleHealthPage() {
  const [selectedBus, setSelectedBus] = useState<string>('BUS-01');
  const [vehicleHealth, setVehicleHealth] = useState<VehicleHealth | null>(null);
  const [fleetSummary, setFleetSummary] = useState<any>(null);
  const [upcomingServices, setUpcomingServices] = useState<any[]>([]);

  useEffect(() => {
    // Load initial data
    const health = vehicleHealthService.getVehicleHealth(selectedBus);
    setVehicleHealth(health);
    
    const summary = vehicleHealthService.getFleetHealthSummary();
    setFleetSummary(summary);
    
    const services = vehicleHealthService.getUpcomingServices(30);
    setUpcomingServices(services);
  }, [selectedBus]);

  const getStatusColor = (status: HealthStatus) => {
    switch (status) {
      case 'healthy': return 'text-[#00C853]';
      case 'attention_required': return 'text-[#FFD700]';
      case 'maintenance_due': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: HealthStatus) => {
    switch (status) {
      case 'healthy': return 'bg-[#00C853]/20 text-[#00C853]';
      case 'attention_required': return 'bg-[#FFD700]/20 text-[#FFD700]';
      case 'maintenance_due': return 'bg-orange-400/20 text-orange-400';
      case 'critical': return 'bg-red-400/20 text-red-400';
      default: return 'bg-gray-400/20 text-gray-400';
    }
  };

  const getHealthPercentage = (status: HealthStatus) => {
    switch (status) {
      case 'healthy': return 100;
      case 'attention_required': return 75;
      case 'maintenance_due': return 50;
      case 'critical': return 25;
      default: return 0;
    }
  };

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">Vehicle Health Dashboard 🔧</h1>
          <p className="text-gray-400 text-sm mt-1">Fleet health monitoring and maintenance tracking</p>
        </div>

        {/* Vehicle Selection */}
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs text-gray-400 mb-1 block">Select Vehicle</label>
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

        {/* Fleet Health Summary */}
        {fleetSummary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-green rounded-2xl p-5 hover-card">
              <div className="text-3xl mb-2">🚌</div>
              <div className="text-2xl font-black neon-text">{fleetSummary.totalVehicles}</div>
              <div className="text-xs text-gray-400">Total Vehicles</div>
            </div>
            <div className="glass-green rounded-2xl p-5 hover-card">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-black text-[#00C853]">{fleetSummary.healthy}</div>
              <div className="text-xs text-gray-400">Healthy</div>
            </div>
            <div className="glass-gold rounded-2xl p-5 hover-card">
              <div className="text-3xl mb-2">⚠️</div>
              <div className="text-2xl font-black text-[#FFD700]">{fleetSummary.attentionRequired + fleetSummary.maintenanceDue}</div>
              <div className="text-xs text-gray-400">Needs Attention</div>
            </div>
            <div className="glass-red rounded-2xl p-5 hover-card">
              <div className="text-3xl mb-2">🚨</div>
              <div className="text-2xl font-black text-red-400">{fleetSummary.critical}</div>
              <div className="text-xs text-gray-400">Critical</div>
            </div>
          </div>
        )}

        {/* Vehicle Health Detail */}
        {vehicleHealth && (
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold">Vehicle Health - {mockBuses.find(b => b.id === selectedBus)?.number}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(vehicleHealth.overallStatus)}`}>
                {vehicleHealth.overallStatus.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* Health Overview */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Health Status</span>
                <span>{getHealthPercentage(vehicleHealth.overallStatus)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className={`h-full rounded-full transition-all ${
                    vehicleHealth.overallStatus === 'healthy' ? 'bg-[#00C853]' :
                    vehicleHealth.overallStatus === 'attention_required' ? 'bg-[#FFD700]' :
                    vehicleHealth.overallStatus === 'maintenance_due' ? 'bg-orange-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${getHealthPercentage(vehicleHealth.overallStatus)}%` }}
                />
              </div>
            </div>

            {/* Component Health */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Engine */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">⚙️ Engine</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(vehicleHealth.engine.status)}`}>
                    {vehicleHealth.engine.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Temperature</span>
                    <span>{vehicleHealth.engine.temperature}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Oil Level</span>
                    <span>{vehicleHealth.engine.oilLevel}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Next Service</span>
                    <span>{Math.ceil((vehicleHealth.engine.nextService - Date.now()) / (24 * 60 * 60 * 1000))} days</span>
                  </div>
                </div>
              </div>

              {/* Battery */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">🔋 Battery</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(vehicleHealth.battery.status)}`}>
                    {vehicleHealth.battery.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Level</span>
                    <span>{vehicleHealth.battery.level}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Voltage</span>
                    <span>{vehicleHealth.battery.voltage.toFixed(1)}V</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Replacement</span>
                    <span>{Math.floor((Date.now() - vehicleHealth.battery.lastReplacement) / (30 * 24 * 60 * 60 * 1000))} months ago</span>
                  </div>
                </div>
              </div>

              {/* Tires */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">🛞 Tires</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(vehicleHealth.tires.status)}`}>
                    {vehicleHealth.tires.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pressure</span>
                    <span>{vehicleHealth.tires.pressure} PSI</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tread Depth</span>
                    <span>{vehicleHealth.tires.treadDepth.toFixed(1)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Rotation</span>
                    <span>{Math.floor((Date.now() - vehicleHealth.tires.lastRotation) / (30 * 24 * 60 * 60 * 1000))} months ago</span>
                  </div>
                </div>
              </div>

              {/* Brakes */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">🛑 Brakes</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(vehicleHealth.brakes.status)}`}>
                    {vehicleHealth.brakes.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pad Wear</span>
                    <span>{vehicleHealth.brakes.padWear}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fluid Level</span>
                    <span>{vehicleHealth.brakes.fluidLevel}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Inspection</span>
                    <span>{Math.floor((Date.now() - vehicleHealth.brakes.lastInspection) / (30 * 24 * 60 * 60 * 1000))} months ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Warnings */}
            {vehicleHealth.criticalWarnings.length > 0 && (
              <div className="mt-6 bg-red-500/10 rounded-xl p-4">
                <h4 className="font-bold text-sm text-red-400 mb-2">🚨 Critical Warnings</h4>
                <div className="space-y-1">
                  {vehicleHealth.criticalWarnings.map((warning, index) => (
                    <div key={index} className="text-xs text-red-300">• {warning}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Maintenance Info */}
            <div className="mt-6 grid lg:grid-cols-2 gap-4 text-xs">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-gray-400">Last Inspection</div>
                <div className="font-semibold">{new Date(vehicleHealth.lastInspection).toLocaleDateString()}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-gray-400">Next Inspection</div>
                <div className="font-semibold">{new Date(vehicleHealth.nextInspection).toLocaleDateString()}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-gray-400">Mileage</div>
                <div className="font-semibold">{vehicleHealth.mileage.toLocaleString()} km</div>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Services */}
        {upcomingServices.length > 0 && (
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4">📅 Upcoming Services (Next 30 Days)</h3>
            <div className="space-y-3">
              {upcomingServices.map((service) => (
                <div key={service.busId} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div>
                    <div className="font-semibold">{service.busNumber}</div>
                    <div className="text-xs text-gray-400">Service due in {service.daysUntil} days</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#FFD700] font-bold">{new Date(service.dueDate).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Vehicles Health */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Fleet Health Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Engine</th>
                  <th className="pb-3">Battery</th>
                  <th className="pb-3">Tires</th>
                  <th className="pb-3">Brakes</th>
                  <th className="pb-3">Warnings</th>
                </tr>
              </thead>
              <tbody>
                {fleetSummary?.vehicles.map((health: VehicleHealth) => {
                  const bus = mockBuses.find(b => b.id === health.busId);
                  return (
                    <tr key={health.busId} className="border-b border-white/5">
                      <td className="py-3 font-semibold">{bus?.number}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(health.overallStatus)}`}>
                          {health.overallStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-xs ${getStatusBadge(health.engine.status)}`}>
                          {health.engine.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-xs ${getStatusBadge(health.battery.status)}`}>
                          {health.battery.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-xs ${getStatusBadge(health.tires.status)}`}>
                          {health.tires.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-xs ${getStatusBadge(health.brakes.status)}`}>
                          {health.brakes.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3">
                        {health.criticalWarnings.length > 0 ? (
                          <span className="text-red-400 font-bold">{health.criticalWarnings.length}</span>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
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
