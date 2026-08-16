'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MapMock from '@/components/map/MapMock';
import { mockBuses, mockAlerts, mockStats, mockWeeklyData, mockDrivers } from '@/lib/mockData';
import AdminSOSAlert from '@/components/sos/AdminSOSAlert';
import { speedMonitoringService, vehicleHealthService, driverBehaviourScoreService } from '@/features/fleet-monitoring';

const navItems = [
  { href:'/admin',           icon:'🏠', label:'Dashboard' },
  { href:'/admin/fleet',     icon:'🚌', label:'Fleet Monitor' },
  { href:'/admin/analytics', icon:'📊', label:'Analytics' },
  { href:'/admin/drivers',   icon:'👨‍✈️', label:'Drivers' },
  { href:'/admin/students',  icon:'🎓', label:'Students' },
  { href:'/admin/alerts',    icon:'🚨', label:'Alerts' },
  { href:'/admin/routes',    icon:'🗺️', label:'Routes' },
  { href:'/admin/speed',     icon:'🚀', label:'Speed Monitor' },
  { href:'/admin/driver-behaviour', icon:'🛡️', label:'Driver Behaviour' },
  { href:'/admin/vehicle-health', icon:'🔧', label:'Vehicle Health' },
  { href:'/admin/fuel-analytics', icon:'⛽', label:'Fuel Analytics' },
  { href:'/admin/fleet-reports', icon:'📈', label:'Fleet Reports' },
];

export default function AdminDashboard() {
  const [buses, setBuses] = useState(mockBuses);
  const [tick, setTick] = useState(0);
  const [fleetSpeedSummary, setFleetSpeedSummary] = useState<any>(null);
  const [fleetHealthSummary, setFleetHealthSummary] = useState<any>(null);
  const [driverRanking, setDriverRanking] = useState<any[]>([]);

  useEffect(() => {
    const t = setInterval(() => {
      setTick(p => p+1);
      setBuses(prev => prev.map(b => ({
        ...b,
        lat: b.lat + (Math.random()-0.5)*0.0003,
        lng: b.lng + (Math.random()-0.5)*0.0003,
        speed: b.status==='moving' ? Math.round(30+Math.random()*30) : 0,
      })));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // Load fleet monitoring data
    setFleetSpeedSummary(speedMonitoringService.getFleetSpeedSummary());
    setFleetHealthSummary(vehicleHealthService.getFleetHealthSummary());
    setDriverRanking(driverBehaviourScoreService.getDriverRanking());
  }, [tick]);

  const criticalAlerts = mockAlerts.filter(a => a.severity === 'critical');
  const overspeedingVehicles = speedMonitoringService.getOverspeedingVehicles();
  const criticalVehicles = vehicleHealthService.getCriticalVehicles();
  const driversRequiringAttention = driverBehaviourScoreService.getDriversRequiringAttention();

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <AdminSOSAlert />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Fleet Command Center ⚙️</h1>
            <p className="text-gray-400 text-sm mt-1">Real-time monitoring · {buses.filter(b=>b.status==='moving').length} buses active</p>
          </div>
          <div className="flex items-center gap-2 glass-green rounded-full px-4 py-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse"/>
            <span className="text-[#00C853] font-semibold">All Systems Live</span>
          </div>
        </div>

        {/* Critical alert */}
        {criticalAlerts.length > 0 && (
          <div className="glass-red rounded-2xl p-4 flex items-center gap-4">
            <span className="text-2xl animate-pulse">🚨</span>
            <div className="flex-1">
              <p className="text-red-400 font-bold text-sm">Critical Alert</p>
              <p className="text-gray-300 text-sm">{criticalAlerts[0].message}</p>
            </div>
            <span className="text-xs text-gray-500">{criticalAlerts[0].time}</span>
          </div>
        )}

        {/* Enhanced KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { l:'Total Buses', v:mockStats.totalBuses, icon:'🚌', c:'green', sub:`${mockStats.activeBuses} active` },
            { l:'Students', v:mockStats.totalStudents, icon:'🎓', c:'gold', sub:'Tracked today' },
            { l:'On-Time Rate', v:`${mockStats.onTimeRate}%`, icon:'⏱️', c:'green', sub:'This week' },
            { l:'Safety Score', v:`${mockStats.safetyScore}%`, icon:'🛡️', c:'gold', sub:'Fleet avg' },
            { l:'Overspeeding', v:fleetSpeedSummary?.overspeedCount || 0, icon:'🚀', c:'red', sub:'Vehicles' },
          ].map(s => (
            <div key={s.l} className={`${s.c==='gold'?'glass-gold':s.c==='red'?'glass-red':'glass-green'} rounded-2xl p-5 hover-card`}>
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className={`text-2xl font-black ${s.c==='gold'?'gold-text':s.c==='red'?'text-red-400':'neon-text'}`}>{s.v}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.l}</div>
              <div className="text-xs text-gray-600">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Map + Alerts */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Live GPS Map */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white">Live GPS Map</h2>
                <span className="text-xs text-[#00C853] glass-green px-2 py-1 rounded-full">{buses.length} buses tracked</span>
              </div>
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-gray-100">
                {/* Mapbox GL JS would render here */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to bottom, #ecfdf5, #d1fae5)',
                  }}
                >
                  <div className="absolute inset-0 opacity-10" 
                    style={{
                      backgroundImage: `
                        linear-gradient(#10b981 1px, transparent 1px),
                        linear-gradient(90deg, #10b981 1px, transparent 1px)
                      `,
                      backgroundSize: '40px 40px'
                    }}
                  />
                  
                  {/* Render bus markers */}
                  {buses.map(bus => (
                    <div
                      key={bus.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                      style={{
                        left: `${((bus.lng - 76.94) / (76.99 - 76.94)) * 100}%`,
                        top: `${(1 - (bus.lat - 11.005) / (11.035 - 11.005)) * 100}%`,
                      }}
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-500 rounded-full opacity-30 animate-ping" style={{width: '40px', height: '40px'}} />
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg text-lg animate-bounce">
                          🚌
                        </div>
                      </div>
                      <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg text-xs font-bold text-green-600 whitespace-nowrap shadow-sm">
                        {bus.number}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Map Legend */}
                <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-xs">
                  <div className="font-bold mb-1">Legend</div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Active Bus</span>
                  </div>
                </div>
                
                {/* Live Badge */}
                <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-600 font-semibold">LIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Alerts panel */}
          <div className="glass rounded-2xl p-4">
            <h2 className="font-bold text-white mb-4">🚨 Live Alerts</h2>
            <div className="space-y-3">
              {/* Overspeeding vehicles */}
              {overspeedingVehicles.length > 0 && (
                <div className="glass-red p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span>🚀</span>
                    <span className="text-xs font-bold text-red-400">OVERSPEEDING</span>
                  </div>
                  {overspeedingVehicles.map(busId => {
                    const bus = mockBuses.find(b => b.id === busId);
                    return (
                      <div key={busId} className="text-xs text-gray-300">
                        {bus?.number}: {bus?.speed} km/h
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Critical vehicles */}
              {criticalVehicles.length > 0 && (
                <div className="glass-red p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span>🔧</span>
                    <span className="text-xs font-bold text-red-400">CRITICAL VEHICLES</span>
                  </div>
                  {criticalVehicles.map(health => {
                    const bus = mockBuses.find(b => b.id === health.busId);
                    return (
                      <div key={health.busId} className="text-xs text-gray-300">
                        {bus?.number}: {health.criticalWarnings[0] || 'Maintenance required'}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Drivers requiring attention */}
              {driversRequiringAttention.length > 0 && (
                <div className="glass-gold p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span>🛡️</span>
                    <span className="text-xs font-bold text-[#FFD700]">DRIVER ATTENTION</span>
                  </div>
                  {driversRequiringAttention.slice(0, 3).map(driver => (
                    <div key={driver.driverId} className="text-xs text-gray-300">
                      {driver.driverName}: {driver.overallScore} pts
                    </div>
                  ))}
                </div>
              )}

              {/* Standard alerts */}
              {mockAlerts.map(a => (
                <div key={a.id} className={`p-3 rounded-xl text-sm ${
                  a.severity==='critical'?'glass-red':a.severity==='warning'?'glass-gold':'glass'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{a.type==='sos'?'🚨':a.type==='delay'?'⚠️':a.type==='deviation'?'📍':'ℹ️'}</span>
                    <span className={`text-xs font-bold ${a.severity==='critical'?'text-red-400':a.severity==='warning'?'text-[#FFD700]':'text-[#00C853]'}`}>
                      {a.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">{a.message}</p>
                  <p className="text-gray-600 text-[10px] mt-1">{a.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bus fleet status */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-bold text-white mb-4">Fleet Status</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {buses.map(bus => (
              <div key={bus.id} className="glass rounded-xl p-4 hover-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-white text-sm">{bus.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${bus.status==='moving'?'bg-[#00C853]/20 text-[#00C853]':'bg-white/10 text-gray-400'}`}>
                    {bus.status}
                  </span>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div className="flex justify-between"><span>Driver</span><span className="text-white">{bus.driver.split(' ')[0]}</span></div>
                  <div className="flex justify-between"><span>Speed</span><span className="text-white">{bus.speed} km/h</span></div>
                  <div className="flex justify-between"><span>Occupancy</span><span className="text-white">{bus.occupancy}/{bus.capacity}</span></div>
                  <div className="flex justify-between"><span>ETA</span><span className="neon-text font-bold">{bus.eta}</span></div>
                </div>
                <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{width:`${(bus.occupancy/bus.capacity)*100}%`, background:bus.color}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly chart */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4">Weekly On-Time Performance</h3>
            <div className="flex items-end gap-3 h-28">
              {mockWeeklyData.map(d => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-[#00C853]">{d.onTime}%</span>
                  <div className="w-full rounded-t bg-gradient-to-t from-[#00C853] to-[#5efc82]" style={{height:`${(d.onTime-80)*5}px`}}/>
                  <span className="text-[10px] text-gray-500">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Driver rankings */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4">Driver Safety Rankings</h3>
            <div className="space-y-3">
              {mockDrivers.sort((a,b)=>b.safetyScore-a.safetyScore).map((d,i) => (
                <div key={d.id} className="flex items-center gap-3 p-2 glass rounded-xl">
                  <span className={`text-lg font-black w-6 text-center ${i===0?'text-[#FFD700]':i===1?'text-gray-300':i===2?'text-amber-600':'text-gray-500'}`}>
                    {i===0?'🥇':i===1?'🥈':i===2?'🥉':`${i+1}`}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{d.name}</div>
                    <div className="text-xs text-gray-500">{d.busId} · {d.experience}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold neon-text">{d.safetyScore}%</div>
                    <div className="text-xs text-gray-500">{d.trips} trips</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
