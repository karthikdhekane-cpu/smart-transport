'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MapMock from '@/components/map/MapMock';
import OccupancyBar from '@/components/ui/OccupancyBar';
import AlertBanner from '@/components/ui/AlertBanner';
import SOSButton from '@/components/sos/SOSButton';
import { mockBuses, mockRoutes, simulateGPSMovement } from '@/lib/mockData';
import PageHeader from '@/components/ui/PageHeader';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';

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
      <div className="space-y-8">
        {/* Header */}
        <PageHeader 
          eyebrow="Today's journey" 
          title="Good morning, Priya" 
          description={`Your bus is on the way on Route A — Gandhipuram. ETA: ${etaMinutes} minutes to Town Hall.`} 
          action={<StatusBadge status="active">BUS-01 Live</StatusBadge>} 
        />

        {/* Alert */}
        <AlertBanner type="info" message={`BUS-01 is ${etaMinutes} minutes away from your stop — Town Hall`} />

        {/* Primary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="ETA" value={`${etaMinutes} min`} detail="To Town Hall" icon="⏱️" tone="green" />
          <MetricCard label="Bus Speed" value={`${myBus.speed} km/h`} detail="Moving" icon="🚀" tone="amber" />
          <MetricCard label="Occupancy" value={`${myBus.occupancy}/${myBus.capacity}`} detail={`${occupancyPct}% full`} icon="👥" tone="green" />
          <MetricCard label="Safety Score" value={`${myBus.safetyScore}%`} detail="Excellent" icon="🛡️" tone="amber" />
        </div>

        {/* Primary Operational Visualization - Map */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Live Bus Location</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
              <span className="text-xs text-slate-500">Auto-updating</span>
            </div>
          </div>
          <div className="p-4">
            <MapMock buses={[{...myBus, lat:busPos.lat, lng:busPos.lng}]} route={myRoute} height={360}/>
          </div>
        </div>

        {/* Secondary Analytics - Route Progress & Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Route Progress */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Route Progress</h3>
            <div className="space-y-4">
              {myRoute.stops.map((stop, i) => (
                <div key={stop.name} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                    i < 2 ? 'bg-emerald-100 text-emerald-700' : 
                    i === 2 ? 'bg-amber-100 text-amber-700' : 
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {i < 2 ? '✓' : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${i < 2 ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{stop.name}</div>
                    <div className="text-xs text-slate-500">{stop.time}</div>
                  </div>
                  {i === 2 && <StatusBadge status="warning" size="sm">NEXT</StatusBadge>}
                  {stop.name === 'Town Hall' && <StatusBadge status="healthy" size="sm">YOU</StatusBadge>}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            {/* Bus Occupancy */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Bus Occupancy</h3>
              <OccupancyBar current={myBus.occupancy} total={myBus.capacity}/>
            </div>

            {/* Driver Info */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Driver Info</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg">👨‍✈️</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">{myBus.driver}</div>
                  <div className="text-xs text-slate-500">{myBus.driverPhone}</div>
                  <div className="text-xs text-emerald-600 mt-0.5">Safety: {myBus.safetyScore}%</div>
                </div>
                <StatusBadge status="healthy" size="sm">Active</StatusBadge>
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Alerts */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Smart Alarm */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">⏰ Smart Alarm</h3>
            <p className="text-sm text-slate-500 mb-4">Get notified when your bus is nearby.</p>
            <div className="space-y-2">
              {[5,10,15].map((min) => (
                <button
                  key={min}
                  onClick={() => setAlarmSet(true)}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
                    alarmSet 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {alarmSet ? '✓' : '🔔'} Alert {min} min before
                </button>
              ))}
            </div>
            {alarmSet && <p className="text-emerald-600 text-xs mt-3 text-center">Alarm set! You'll be notified.</p>}
          </div>

          {/* Notifications */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">🔔 Notifications</h3>
              <span className="text-xs text-slate-500">{notifications.filter(n => !n.read).length} unread</span>
            </div>
            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className={`flex items-start gap-3 p-3 rounded-lg text-sm ${n.read ? 'bg-slate-50' : 'bg-emerald-50'}`}>
                  <span className="text-base">{n.type==='arrival'?'🚌':n.type==='delay'?'⚠️':'ℹ️'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 text-xs leading-relaxed">{n.msg}</p>
                    <p className="text-slate-500 text-[10px] mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SOS */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">🚨 Emergency SOS</h3>
            <p className="text-xs text-slate-500 mb-4">Hold for 3 seconds to trigger emergency alert</p>
            <SOSButton
              userName="Priya Sharma"
              busId="BUS-01"
              location="Town Hall Stop, Coimbatore"
              size="md"
            />
            <p className="text-xs text-slate-400 mt-4">Alerts: Driver · Admin · Emergency contacts</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
