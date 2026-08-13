'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { GPSDashboard, mockBuses, fleetSummary, mockRoutes } from '@/features/gps-tracking';
import { useGPS } from '@/features/gps-tracking/hooks/useGPS';

export default function TrackingPage() {
  const [activeTab, setActiveTab] = useState<'fleet' | 'route' | 'analytics'>('fleet');
  const [selectedBusId, setSelectedBusId] = useState<string>('BUS-01');
  
  // Get buses from GPS hook
  const { buses, positions, isLoading, isPlaying, simulationSpeed } = useGPS();
  
  // Get current bus info
  const currentBus = buses.find(b => b.id === selectedBusId);
  
  // Fleet status
  const activeBuses = buses.filter(b => b.status === 'moving' || b.status === 'boarding').length;
  
  return (
    <DashboardLayout role="admin" navItems={[
      { href: '/admin', icon: '🏠', label: 'Dashboard' },
      { href: '/admin/fleet', icon: '🚌', label: 'Fleet Monitor' },
      { href: '/admin/analytics', icon: '📊', label: 'Analytics' },
      { href: '/admin/drivers', icon: '👨‍✈️', label: 'Drivers' },
      { href: '/admin/students', icon: '🎓', label: 'Students' },
      { href: '/admin/alerts', icon: '🚨', label: 'Alerts' },
      { href: '/admin/routes', icon: '🗺️', label: 'Routes' },
    ]} userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Fleet Command Center ⚙️</h1>
            <p className="text-gray-500 text-sm mt-1">Real-time monitoring · {activeBuses} buses active</p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
            <span className="text-gray-700 font-semibold">Live Tracking</span>
          </div>
        </div>

        {/* Fleet Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: 'Total Buses', v: fleetSummary.totalBuses, icon: '🚌', c: 'blue', sub: `${fleetSummary.activeBuses} active` },
            { l: 'Students', v: fleetSummary.totalStudentsTracked, icon: '🎓', c: 'gold', sub: 'Tracked today' },
            { l: 'On-Time Rate', v: `${fleetSummary.onTimeRate}%`, icon: '⏱️', c: 'green', sub: 'This week' },
            { l: 'Safety Score', v: `${fleetSummary.safetyScore}%`, icon: '🛡️', c: 'gold', sub: 'Fleet avg' },
          ].map(s => (
            <div key={s.l} className={`${s.c==='gold'?'bg-gold-light':'bg-blue-light'} rounded-2xl p-4 shadow-sm`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`text-xl font-bold ${s.c==='gold'?'text-gold':'text-blue'}`}>{s.v}</div>
              <div className="text-xs text-gray-600">{s.l}</div>
              <div className="text-xs text-gray-500">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Main Map */}
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Live Fleet Map</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('fleet')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'fleet' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Fleet View
              </button>
              <button
                onClick={() => setActiveTab('route')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'route' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Route View
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Analytics
              </button>
            </div>
          </div>
          
          <GPSDashboard />
        </div>

        {/* Bus Status List */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-bold text-gray-900 mb-4">Fleet Status</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buses.map(bus => (
              <div key={bus.id} className="glass rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gray-100">
                      🚌
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{bus.number}</div>
                      <div className="text-xs text-gray-500">{bus.routeName}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    bus.status === 'moving' ? 'bg-green-100 text-green-700' :
                    bus.status === 'boarding' ? 'bg-yellow-100 text-yellow-700' :
                    bus.status === 'delayed' ? 'bg-red-100 text-red-700' :
                    bus.status === 'traffic' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {bus.status}
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Driver</span>
                    <span className="font-medium text-gray-900">{bus.driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed</span>
                    <span className="font-medium text-gray-900">{bus.currentSpeed} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Occupancy</span>
                    <span className="font-medium text-gray-900">{bus.occupancy}/{bus.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ETA</span>
                    <span className="font-medium text-blue-600">3 min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-bold text-gray-900 mb-4">Live Alerts</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
              <span className="text-xl">🚨</span>
              <div className="flex-1">
                <p className="text-red-700 font-medium text-sm">Traffic Delay</p>
                <p className="text-gray-600 text-xs">BUS-02 delayed by 8 minutes near Coimbatore Junction</p>
              </div>
              <span className="text-xs text-gray-500">2 min ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <span className="text-xl">✅</span>
              <div className="flex-1">
                <p className="text-green-700 font-medium text-sm">On Time</p>
                <p className="text-gray-600 text-xs">BUS-01 arriving at Main Gate in 8 minutes</p>
              </div>
              <span className="text-xs text-gray-500">5 min ago</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
