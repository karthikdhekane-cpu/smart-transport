'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MapMock from '@/components/map/MapMock';
import OccupancyBar from '@/components/ui/OccupancyBar';
import AlertBanner from '@/components/ui/AlertBanner';
import SOSButton from '@/components/sos/SOSButton';
import { mockBuses, mockRoutes, simulateGPSMovement } from '@/lib/mockData';

const navItems = [
  { href:'/student',          icon:'🏠', label:'Dashboard' },
  { href:'/student/tracking', icon:'🗺️', label:'Live Tracking' },
  { href:'/student/eta',      icon:'⏱️', label:'ETA & Alarm' },
  { href:'/student/notifications', icon:'🔔', label:'Notifications' },
  { href:'/student/lost-found',    icon:'📦', label:'Lost & Found' },
  { href:'/student/safety',        icon:'🛡️', label:'Safety' },
];

export default function StudentDashboard() {
  const myBus = mockBuses[0];
  const myRoute = mockRoutes[0];
  const [tick, setTick] = useState(0);
  const [busPos, setBusPos] = useState({ lat: myBus.lat, lng: myBus.lng });
  const [alarmSet, setAlarmSet] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [notifications, setNotifications] = useState([
    { id:1, type:'arrival', msg:'Your bus is 8 minutes away', time:'now', read:false },
    { id:2, type:'delay',   msg:'BUS-01 delayed by 3 min due to traffic', time:'5m ago', read:false },
    { id:3, type:'info',    msg:'Route A is operating normally today', time:'1h ago', read:true },
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      setTick(p => p + 1);
      setBusPos(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.0003,
        lng: prev.lng + (Math.random() - 0.5) * 0.0003,
      }));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const etaMinutes = Math.max(1, 8 - Math.floor(tick / 5));
  const occupancyPct = Math.round((myBus.occupancy / myBus.capacity) * 100);

  return (
    <DashboardLayout role="student" navItems={navItems} userName="Priya Sharma">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Good Morning, Priya 👋</h1>
            <p className="text-gray-400 text-sm mt-1">Your bus is on the way · Route A — Gandhipuram</p>
          </div>
          <div className="flex items-center gap-2 glass-green rounded-full px-4 py-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse"/>
            <span className="text-[#00C853] font-semibold">BUS-01 Live</span>
          </div>
        </div>

        {/* Alert */}
        <AlertBanner type="info" message="BUS-01 is 8 minutes away from your stop — Town Hall" />

        {/* Top cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label:'ETA', value:`${etaMinutes} min`, icon:'⏱️', color:'green', sub:'To Town Hall' },
            { label:'Bus Speed', value:`${myBus.speed} km/h`, icon:'🚀', color:'gold', sub:'Moving' },
            { label:'Occupancy', value:`${myBus.occupancy}/${myBus.capacity}`, icon:'👥', color:'green', sub:`${occupancyPct}% full` },
            { label:'Safety Score', value:`${myBus.safetyScore}%`, icon:'🛡️', color:'gold', sub:'Excellent' },
          ].map((c) => (
            <div key={c.label} className={`${c.color==='gold'?'glass-gold':'glass-green'} rounded-2xl p-4 hover-card`}>
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className={`text-xl font-black ${c.color==='gold'?'gold-text':'neon-text'}`}>{c.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{c.label}</div>
              <div className="text-xs text-gray-600">{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Map + Info */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white">Live Bus Location</h2>
                <span className="text-xs text-[#00C853] glass-green px-2 py-1 rounded-full">Auto-updating</span>
              </div>
              <MapMock buses={[{...myBus, lat:busPos.lat, lng:busPos.lng}]} route={myRoute} height={320}/>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {/* Route stops */}
            <div className="glass rounded-2xl p-4">
              <h3 className="font-bold text-white mb-4 text-sm">Route Progress</h3>
              <div className="space-y-3">
                {myRoute.stops.map((stop, i) => (
                  <div key={stop.name} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${i < 2 ? 'bg-[#00C853]' : i === 2 ? 'bg-[#FFD700] animate-pulse' : 'bg-white/20'}`}/>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-medium truncate ${i < 2 ? 'text-gray-400 line-through' : i === 2 ? 'text-white' : 'text-gray-600'}`}>{stop.name}</div>
                      <div className="text-[10px] text-gray-600">{stop.time}</div>
                    </div>
                    {i === 2 && <span className="text-[10px] text-[#FFD700] font-bold">NEXT</span>}
                    {stop.name === 'Town Hall' && <span className="text-[10px] text-[#00C853] font-bold">YOU</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Occupancy */}
            <div className="glass rounded-2xl p-4">
              <h3 className="font-bold text-white mb-3 text-sm">Bus Occupancy</h3>
              <OccupancyBar current={myBus.occupancy} total={myBus.capacity}/>
            </div>

            {/* Driver info */}
            <div className="glass rounded-2xl p-4">
              <h3 className="font-bold text-white mb-3 text-sm">Driver Info</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00C853]/20 flex items-center justify-center text-lg">👨‍✈️</div>
                <div>
                  <div className="text-sm font-semibold text-white">{myBus.driver}</div>
                  <div className="text-xs text-gray-400">{myBus.driverPhone}</div>
                  <div className="text-xs text-[#00C853] mt-0.5">Safety: {myBus.safetyScore}% ⭐</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Smart Alarm */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">⏰ Smart Alarm</h3>
            <p className="text-gray-400 text-sm mb-4">Get notified when your bus is nearby.</p>
            <div className="space-y-3">
              {[5,10,15].map((min) => (
                <button
                  key={min}
                  onClick={() => setAlarmSet(true)}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${alarmSet ? 'glass-green text-[#00C853]' : 'glass text-gray-400 hover:text-white'}`}
                >
                  {alarmSet ? '✓' : '🔔'} Alert {min} min before
                </button>
              ))}
            </div>
            {alarmSet && <p className="text-[#00C853] text-xs mt-3 text-center">Alarm set! You'll be notified.</p>}
          </div>

          {/* Notifications */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">🔔 Notifications</h3>
            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl text-sm ${n.read ? 'opacity-50' : 'glass-green'}`}>
                  <span>{n.type==='arrival'?'🚌':n.type==='delay'?'⚠️':'ℹ️'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs leading-relaxed">{n.msg}</p>
                    <p className="text-gray-500 text-[10px] mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SOS */}
          <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <h3 className="font-bold text-[#0f172a] mb-2">🚨 Emergency SOS</h3>
            <p className="text-[#64748b] text-xs mb-5">Hold for 3 seconds to trigger emergency alert</p>
            <SOSButton
              userName="Priya Sharma"
              busId="BUS-01"
              location="Town Hall Stop, Coimbatore"
              size="md"
            />
            <p className="text-[#94a3b8] text-xs mt-4">Also alerts: Driver · Admin · Emergency contacts</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
