'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { fleetPerformanceService } from '@/features/fleet-monitoring';
import { FleetPerformanceSummary, VehiclePerformance, DriverPerformance, RoutePerformance } from '@/features/fleet-monitoring/types/index';
import PageHeader from '@/components/ui/PageHeader';
import MetricCard from '@/components/ui/MetricCard';

const navItems = [
  { href:'/admin',           icon:'🏠', label:'Dashboard' },
  { href:'/admin/fleet',     icon:'🚌', label:'Fleet Monitor' },
  { href:'/admin/analytics', icon:'📊', label:'Analytics' },
  { href:'/admin/drivers',   icon:'👨‍✈️', label:'Drivers' },
  { href:'/admin/students',  icon:'🎓', label:'Students' },
  { href:'/admin/alerts',    icon:'🚨', label:'Alerts' },
  { href:'/admin/routes',    icon:'🗺️', label:'Routes' },
  { href:'/admin/fleet-reports', icon:'📈', label:'Fleet Reports' },
];

export default function FleetReportsPage() {
  const [activeTab, setActiveTab] = useState<'summary' | 'vehicles' | 'drivers' | 'routes'>('summary');
  const [fleetSummary, setFleetSummary] = useState<FleetPerformanceSummary | null>(null);
  const [vehiclePerformance, setVehiclePerformance] = useState<VehiclePerformance[]>([]);
  const [driverPerformance, setDriverPerformance] = useState<DriverPerformance[]>([]);
  const [routePerformance, setRoutePerformance] = useState<RoutePerformance[]>([]);

  useEffect(() => {
    // Load performance data
    setFleetSummary(fleetPerformanceService.getFleetPerformanceSummary());
    setVehiclePerformance(fleetPerformanceService.getVehiclePerformance());
    setDriverPerformance(fleetPerformanceService.getDriverPerformance());
    setRoutePerformance(fleetPerformanceService.getRoutePerformance());
  }, []);

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="space-y-6">
        <PageHeader eyebrow="Fleet analytics" title="Fleet Performance Reports" description="Comprehensive fleet analytics and performance metrics across all operations." />

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-white/10 pb-2">
          {[
            { id: 'summary' as const, label: 'Summary' },
            { id: 'vehicles' as const, label: 'Vehicles' },
            { id: 'drivers' as const, label: 'Drivers' },
            { id: 'routes' as const, label: 'Routes' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === tab.id ? 'bg-[#00C853] text-black' : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Summary Tab */}
        {activeTab === 'summary' && fleetSummary && (
          <div className="space-y-6">
            {/* Fleet Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-green rounded-2xl p-5 hover-card">
                <div className="text-3xl mb-2">🚌</div>
                <div className="text-2xl font-black neon-text">{fleetSummary.totalVehicles}</div>
                <div className="text-xs text-gray-400">Total Vehicles</div>
                <div className="text-xs text-gray-600">{fleetSummary.activeToday} active today</div>
              </div>
              <div className="glass-green rounded-2xl p-5 hover-card">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-black neon-text">{fleetSummary.averageUtilization.toFixed(1)}%</div>
                <div className="text-xs text-gray-400">Avg Utilization</div>
              </div>
              <div className="glass-gold rounded-2xl p-5 hover-card">
                <div className="text-3xl mb-2">🗺️</div>
                <div className="text-2xl font-black gold-text">{fleetSummary.totalTrips}</div>
                <div className="text-xs text-gray-400">Total Trips</div>
                <div className="text-xs text-gray-600">{fleetSummary.completedTrips} completed</div>
              </div>
              <div className="glass-green rounded-2xl p-5 hover-card">
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-2xl font-black neon-text">{fleetSummary.averageDelay.toFixed(1)} min</div>
                <div className="text-xs text-gray-400">Avg Delay</div>
                <div className="text-xs text-gray-600">{fleetSummary.delayedTrips} delayed</div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass rounded-2xl p-5 hover-card">
                <div className="text-3xl mb-2">🚀</div>
                <div className="text-2xl font-black neon-text">{fleetSummary.averageSpeed.toFixed(1)} km/h</div>
                <div className="text-xs text-gray-400">Avg Speed</div>
              </div>
              <div className="glass-red rounded-2xl p-5 hover-card">
                <div className="text-3xl mb-2">⚠️</div>
                <div className="text-2xl font-black text-red-400">{fleetSummary.overspeedEvents}</div>
                <div className="text-xs text-gray-400">Overspeed Events</div>
              </div>
              <div className="glass-gold rounded-2xl p-5 hover-card">
                <div className="text-3xl mb-2">🔧</div>
                <div className="text-2xl font-black gold-text">{fleetSummary.maintenanceIssues}</div>
                <div className="text-xs text-gray-400">Maintenance Issues</div>
              </div>
              <div className="glass-green rounded-2xl p-5 hover-card">
                <div className="text-3xl mb-2">⛽</div>
                <div className="text-2xl font-black neon-text">{fleetSummary.averageFuelEfficiency.toFixed(2)} km/L</div>
                <div className="text-xs text-gray-400">Avg Fuel Efficiency</div>
              </div>
            </div>

            {/* Distance and Fuel */}
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold mb-4">Distance & Fuel</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Distance</span>
                    <span className="text-xl font-bold neon-text">{fleetSummary.totalDistance.toFixed(0)} km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Fuel Consumed</span>
                    <span className="text-xl font-bold gold-text">{fleetSummary.totalFuelConsumed.toFixed(1)} L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Estimated Cost</span>
                    <span className="text-xl font-bold gold-text">₹{(fleetSummary.totalFuelConsumed * 95).toFixed(0)}</span>
                  </div>
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold mb-4">Trip Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Completion Rate</span>
                    <span className="text-xl font-bold neon-text">{((fleetSummary.completedTrips / fleetSummary.totalTrips) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">On-Time Rate</span>
                    <span className="text-xl font-bold neon-text">{((1 - fleetSummary.delayedTrips / fleetSummary.totalTrips) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Trips per Vehicle</span>
                    <span className="text-xl font-bold neon-text">{(fleetSummary.totalTrips / fleetSummary.totalVehicles).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4">Vehicle Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-white/10">
                    <th className="pb-3">Vehicle</th>
                    <th className="pb-3">Driver</th>
                    <th className="pb-3">Distance</th>
                    <th className="pb-3">Trips</th>
                    <th className="pb-3">Utilization</th>
                    <th className="pb-3">Avg Speed</th>
                    <th className="pb-3">Overspeed</th>
                    <th className="pb-3">Fuel Eff.</th>
                    <th className="pb-3">Health</th>
                  </tr>
                </thead>
                <tbody>
                  {vehiclePerformance.map((vp) => (
                    <tr key={vp.busId} className="border-b border-white/5">
                      <td className="py-3 font-semibold">{vp.busNumber}</td>
                      <td className="py-3">{vp.driverName}</td>
                      <td className="py-3">{vp.distance.toFixed(0)} km</td>
                      <td className="py-3">{vp.trips}</td>
                      <td className="py-3">{vp.utilization.toFixed(1)}%</td>
                      <td className="py-3">{vp.averageSpeed.toFixed(1)} km/h</td>
                      <td className="py-3">{vp.overspeedEvents}</td>
                      <td className="py-3">{vp.fuelEfficiency.toFixed(2)} km/L</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          vp.healthStatus === 'healthy' ? 'bg-[#00C853]/20 text-[#00C853]' :
                          vp.healthStatus === 'attention_required' ? 'bg-[#FFD700]/20 text-[#FFD700]' :
                          vp.healthStatus === 'maintenance_due' ? 'bg-orange-400/20 text-orange-400' :
                          'bg-red-400/20 text-red-400'
                        }`}>
                          {vp.healthStatus.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Drivers Tab */}
        {activeTab === 'drivers' && (
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4">Driver Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-white/10">
                    <th className="pb-3">Driver</th>
                    <th className="pb-3">Bus</th>
                    <th className="pb-3">Trips</th>
                    <th className="pb-3">Behaviour Score</th>
                    <th className="pb-3">Safety Events</th>
                    <th className="pb-3">Route Deviations</th>
                    <th className="pb-3">Attendance</th>
                    <th className="pb-3">Avg Speed</th>
                    <th className="pb-3">Fuel Eff.</th>
                  </tr>
                </thead>
                <tbody>
                  {driverPerformance.map((dp) => (
                    <tr key={dp.driverId} className="border-b border-white/5">
                      <td className="py-3 font-semibold">{dp.driverName}</td>
                      <td className="py-3">{dp.busNumber}</td>
                      <td className="py-3">{dp.trips}</td>
                      <td className="py-3">
                        <span className={`font-bold ${
                          dp.behaviourScore >= 90 ? 'text-[#00C853]' :
                          dp.behaviourScore >= 75 ? 'text-[#FFD700]' :
                          dp.behaviourScore >= 60 ? 'text-orange-400' : 'text-red-400'
                        }`}>
                          {dp.behaviourScore}
                        </span>
                      </td>
                      <td className="py-3">{dp.safetyEvents}</td>
                      <td className="py-3">{dp.routeDeviations}</td>
                      <td className="py-3">{dp.attendanceRate}%</td>
                      <td className="py-3">{dp.averageSpeed.toFixed(1)} km/h</td>
                      <td className="py-3">{dp.fuelEfficiency.toFixed(2)} km/L</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Routes Tab */}
        {activeTab === 'routes' && (
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4">Route Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-white/10">
                    <th className="pb-3">Route</th>
                    <th className="pb-3">Trips</th>
                    <th className="pb-3">ETA Accuracy</th>
                    <th className="pb-3">Delays</th>
                    <th className="pb-3">Avg Delay</th>
                    <th className="pb-3">Deviations</th>
                    <th className="pb-3">Avg Travel Time</th>
                    <th className="pb-3">Avg Speed</th>
                  </tr>
                </thead>
                <tbody>
                  {routePerformance.map((rp) => (
                    <tr key={rp.routeId} className="border-b border-white/5">
                      <td className="py-3 font-semibold">{rp.routeName}</td>
                      <td className="py-3">{rp.trips}</td>
                      <td className="py-3">{rp.averageETAAccuracy}%</td>
                      <td className="py-3">{rp.delays}</td>
                      <td className="py-3">{rp.averageDelay.toFixed(1)} min</td>
                      <td className="py-3">{rp.routeDeviations}</td>
                      <td className="py-3">{rp.averageTravelTime} min</td>
                      <td className="py-3">{rp.averageSpeed.toFixed(1)} km/h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
