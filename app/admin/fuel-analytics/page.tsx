'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { fuelConsumptionService } from '@/features/fleet-monitoring';
import { mockBuses } from '@/lib/mockData';
import { FuelAnalytics, FuelComparison } from '@/features/fleet-monitoring/types/index';

const navItems = [
  { href:'/admin',           icon:'🏠', label:'Dashboard' },
  { href:'/admin/fleet',     icon:'🚌', label:'Fleet Monitor' },
  { href:'/admin/analytics', icon:'📊', label:'Analytics' },
  { href:'/admin/drivers',   icon:'👨‍✈️', label:'Drivers' },
  { href:'/admin/students',  icon:'🎓', label:'Students' },
  { href:'/admin/alerts',    icon:'🚨', label:'Alerts' },
  { href:'/admin/routes',    icon:'🗺️', label:'Routes' },
  { href:'/admin/fuel-analytics', icon:'⛽', label:'Fuel Analytics' },
];

export default function FuelAnalyticsPage() {
  const [selectedBus, setSelectedBus] = useState<string>('BUS-01');
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [fuelAnalytics, setFuelAnalytics] = useState<FuelAnalytics | null>(null);
  const [fleetSummary, setFleetSummary] = useState<any>(null);
  const [fuelComparison, setFuelComparison] = useState<FuelComparison[]>([]);
  const [highestConsumption, setHighestConsumption] = useState<FuelComparison[]>([]);
  const [lowestEfficiency, setLowestEfficiency] = useState<FuelComparison[]>([]);

  useEffect(() => {
    // Load initial data
    const analytics = fuelConsumptionService.getFuelAnalytics(selectedBus);
    setFuelAnalytics(analytics);
    
    const summary = fuelConsumptionService.getFleetFuelSummary();
    setFleetSummary(summary);
    
    const comparison = fuelConsumptionService.getFuelComparison();
    setFuelComparison(comparison);
    
    const highest = fuelConsumptionService.getHighestConsumptionVehicles(5);
    setHighestConsumption(highest);
    
    const lowest = fuelConsumptionService.getLowestEfficiencyVehicles(5);
    setLowestEfficiency(lowest);
  }, [selectedBus, selectedPeriod]);

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 9) return 'text-[#00C853]';
    if (efficiency >= 8) return 'text-[#FFD700]';
    if (efficiency >= 7) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">Fuel Consumption Analytics ⛽</h1>
          <p className="text-gray-400 text-sm mt-1">Fuel efficiency tracking and cost analysis</p>
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
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs text-gray-400 mb-1 block">Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Fleet Summary */}
        {fleetSummary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-green rounded-2xl p-5 hover-card">
              <div className="text-3xl mb-2">📏</div>
              <div className="text-2xl font-black neon-text">{fleetSummary.totalDistance.toFixed(0)} km</div>
              <div className="text-xs text-gray-400">Total Distance</div>
            </div>
            <div className="glass-gold rounded-2xl p-5 hover-card">
              <div className="text-3xl mb-2">⛽</div>
              <div className="text-2xl font-black gold-text">{fleetSummary.totalFuelConsumed.toFixed(1)} L</div>
              <div className="text-xs text-gray-400">Total Fuel</div>
            </div>
            <div className="glass-green rounded-2xl p-5 hover-card">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-black neon-text">{fleetSummary.averageEfficiency.toFixed(2)} km/L</div>
              <div className="text-xs text-gray-400">Avg Efficiency</div>
            </div>
            <div className="glass-gold rounded-2xl p-5 hover-card">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-black gold-text">₹{fleetSummary.estimatedTotalCost.toFixed(0)}</div>
              <div className="text-xs text-gray-400">Est. Cost</div>
            </div>
          </div>
        )}

        {/* Vehicle Fuel Analytics */}
        {fuelAnalytics && (
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4">Fuel Analytics - {mockBuses.find(b => b.id === selectedBus)?.number}</h3>
            <div className="grid lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-black neon-text">{fuelAnalytics.totalDistance.toFixed(0)} km</div>
                <div className="text-xs text-gray-400">Total Distance</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black gold-text">{fuelAnalytics.totalFuelConsumed.toFixed(1)} L</div>
                <div className="text-xs text-gray-400">Fuel Consumed</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-black ${getEfficiencyColor(fuelAnalytics.averageEfficiency)}`}>
                  {fuelAnalytics.averageEfficiency.toFixed(2)} km/L
                </div>
                <div className="text-xs text-gray-400">Avg Efficiency</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black gold-text">₹{fuelAnalytics.estimatedTotalCost.toFixed(0)}</div>
                <div className="text-xs text-gray-400">Est. Cost</div>
              </div>
            </div>

            {/* Consumption Chart */}
            <div className="mt-6">
              <h4 className="font-bold text-sm mb-3">Consumption Trend</h4>
              <div className="space-y-2">
                {fuelAnalytics.dailyConsumption.slice(-7).map((consumption, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-20">
                      {new Date(consumption.timestamp).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <div className="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#00C853] to-[#FFD700]"
                        style={{ width: `${(consumption.fuelConsumed / 20) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold w-16 text-right">{consumption.fuelConsumed.toFixed(1)} L</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Abnormal Consumption */}
            {fuelAnalytics.abnormalConsumption.length > 0 && (
              <div className="mt-6 bg-orange-500/10 rounded-xl p-4">
                <h4 className="font-bold text-sm text-orange-400 mb-2">⚠️ Abnormal Consumption Detected</h4>
                <div className="space-y-2">
                  {fuelAnalytics.abnormalConsumption.map((consumption, index) => (
                    <div key={index} className="text-xs text-orange-300">
                      {new Date(consumption.timestamp).toLocaleDateString()}: {consumption.fuelConsumed.toFixed(1)} L ({consumption.fuelEfficiency.toFixed(2)} km/L)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fuel Comparison */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Fleet Fuel Efficiency Ranking</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="pb-3">Rank</th>
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Distance</th>
                  <th className="pb-3">Fuel Used</th>
                  <th className="pb-3">Efficiency</th>
                  <th className="pb-3">Est. Cost</th>
                </tr>
              </thead>
              <tbody>
                {fuelComparison.map((comp) => (
                  <tr key={comp.busId} className="border-b border-white/5">
                    <td className="py-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        comp.rank === 1 ? 'bg-[#FFD700] text-black' :
                        comp.rank === 2 ? 'bg-gray-400 text-black' :
                        comp.rank === 3 ? 'bg-orange-600 text-black' :
                        'bg-gray-700 text-white'
                      }`}>
                        {comp.rank}
                      </span>
                    </td>
                    <td className="py-3 font-semibold">{comp.busNumber}</td>
                    <td className="py-3">{comp.distance.toFixed(0)} km</td>
                    <td className="py-3">{comp.fuelConsumed.toFixed(1)} L</td>
                    <td className="py-3">
                      <span className={`font-bold ${getEfficiencyColor(comp.efficiency)}`}>
                        {comp.efficiency.toFixed(2)} km/L
                      </span>
                    </td>
                    <td className="py-3">₹{(comp.fuelConsumed * 95).toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Highest Consumption */}
        <div className="glass-gold rounded-2xl p-6">
          <h3 className="font-bold mb-4">📈 Highest Fuel Consumption</h3>
          <div className="space-y-3">
            {highestConsumption.map((comp) => (
              <div key={comp.busId} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                <div>
                  <div className="font-semibold">{comp.busNumber}</div>
                  <div className="text-xs text-gray-400">{comp.distance.toFixed(0)} km traveled</div>
                </div>
                <div className="text-right">
                  <div className="text-[#FFD700] font-bold">{comp.fuelConsumed.toFixed(1)} L</div>
                  <div className="text-xs text-gray-400">{comp.efficiency.toFixed(2)} km/L</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lowest Efficiency */}
        <div className="glass-red rounded-2xl p-6">
          <h3 className="font-bold mb-4 text-red-400">📉 Lowest Fuel Efficiency</h3>
          <div className="space-y-3">
            {lowestEfficiency.map((comp) => (
              <div key={comp.busId} className="flex items-center justify-between bg-red-500/10 rounded-lg p-3">
                <div>
                  <div className="font-semibold">{comp.busNumber}</div>
                  <div className="text-xs text-gray-400">{comp.distance.toFixed(0)} km traveled</div>
                </div>
                <div className="text-right">
                  <div className="text-red-400 font-bold">{comp.efficiency.toFixed(2)} km/L</div>
                  <div className="text-xs text-gray-400">{comp.fuelConsumed.toFixed(1)} L used</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
