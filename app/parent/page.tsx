'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MapMock from '@/components/map/MapMock';
import OccupancyBar from '@/components/ui/OccupancyBar';
import AlertBanner from '@/components/ui/AlertBanner';
import { mockBuses, mockRoutes, mockStudents } from '@/lib/mockData';
import { notificationService } from '@/features/notifications';
import { useETA } from '@/features/eta';
import PageHeader from '@/components/ui/PageHeader';
import MetricCard from '@/components/ui/MetricCard';

const navItems = [
  { href:'/parent',          icon:'🏠', label:'Dashboard' },
  { href:'/parent/tracking', icon:'🗺️', label:'Bus Tracking' },
  { href:'/parent/notifications', icon:'🔔', label:'Notifications' },
];

export default function ParentDashboard() {
  // Mock parent data - using first student as example
  const child = mockStudents[0];
  const childBus = mockBuses.find(b => b.id === child.busId);
  const childRoute = mockRoutes.find(r => r.id === 'route-a');
  
  const { busStates } = useETA(childBus?.id);
  const currentBusState = busStates[0];
  
  const [notifications, setNotifications] = useState(() => notificationService.getAllNotifications());
  const unreadCount = notifications.filter(n => !n.read).length;
  const [studentStatus, setStudentStatus] = useState<'waiting' | 'picked_up' | 'on_bus' | 'dropped_off' | null>(() => 
    notificationService.getStudentStatus(child.id)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(notificationService.getAllNotifications());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Calculate ETA from current bus state or fallback
  const etaMinutes = currentBusState 
    ? Math.round(currentBusState.currentETA.seconds / 60)
    : 8;
  
  const occupancyPct = childBus ? Math.round((childBus.occupancy / childBus.capacity) * 100) : 0;

  return (
    <DashboardLayout role="parent" navItems={navItems} userName="Parent">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader eyebrow="Family transport" title={`${child.name}'s journey`} description={`Tracking ${child.rollNo} from ${child.stop}.`} action={<div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700 ring-1 ring-emerald-100">
            <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse"/>
            <span className="text-[#00C853] font-semibold">{childBus?.id || 'BUS-01'} Live</span>
          </div>} />

        {/* Alert */}
        <AlertBanner type="info" message={`${childBus?.id || 'BUS-01'} is ${etaMinutes} minutes away from ${child.stop}`} />

        {/* Top cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label:'ETA', value:`${etaMinutes} min`, icon:'⏱️', color:'green', sub:`To ${child.stop}` },
            { label:'Bus Speed', value:`${currentBusState?.speed || childBus?.speed || 42} km/h`, icon:'🚀', color:'gold', sub:'Moving' },
            { label:'Occupancy', value:`${childBus?.occupancy || 38}/${childBus?.capacity || 52}`, icon:'👥', color:'green', sub:`${occupancyPct}% full` },
            { label:'Safety Score', value:`${childBus?.safetyScore || 94}%`, icon:'🛡️', color:'gold', sub:'Excellent' },
          ].map((c) => (
            <MetricCard key={c.label} label={c.label} value={c.value} detail={c.sub} icon={c.icon} tone={c.color === 'gold' ? 'amber' : 'green'} />
          ))}
        </div>

        {/* Child Info Card */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4">👤 Student Information</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label:'Name', value:child.name },
              { label:'Roll Number', value:child.rollNo },
              { label:'Assigned Bus', value:childBus?.id || 'BUS-01' },
              { label:'Pickup Stop', value:child.stop },
              { label:'Phone', value:child.phone },
              { label:'Route', value:childRoute?.name || 'Route A' },
            ].map((info) => (
              <div key={info.label} className="bg-[#f8fafc] rounded-xl p-3">
                <div className="text-xs text-gray-500 mb-1">{info.label}</div>
                <div className="text-sm font-semibold text-[#0f172a]">{info.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Status Card */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4">🚶 Student Status</h3>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
              studentStatus === 'picked_up' || studentStatus === 'on_bus' ? 'bg-[#00C853]/20' :
              studentStatus === 'dropped_off' ? 'bg-[#2196F3]/20' :
              'bg-[#FFD700]/20'
            }`}>
              {studentStatus === 'picked_up' || studentStatus === 'on_bus' ? '🚌' :
               studentStatus === 'dropped_off' ? '🏠' :
               studentStatus === 'waiting' ? '⏳' : '❓'}
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-white">
                {studentStatus === 'picked_up' ? 'Picked Up' :
                 studentStatus === 'on_bus' ? 'On Bus' :
                 studentStatus === 'dropped_off' ? 'Dropped Off' :
                 studentStatus === 'waiting' ? 'Waiting for Pickup' : 'Unknown'}
              </div>
              <div className="text-sm text-gray-400">
                {studentStatus === 'picked_up' || studentStatus === 'on_bus' ? 'Child is on the bus' :
                 studentStatus === 'dropped_off' ? 'Child has reached destination' :
                 studentStatus === 'waiting' ? 'Bus is approaching pickup point' : 'Status not available'}
              </div>
            </div>
          </div>
          
          {/* Status Test Buttons */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500 mb-3">Test Status Changes (Demo)</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { status: 'waiting', label: 'Waiting' },
                { status: 'picked_up', label: 'Picked Up' },
                { status: 'on_bus', label: 'On Bus' },
                { status: 'dropped_off', label: 'Dropped Off' },
              ].map((s) => (
                <button
                  key={s.status}
                  onClick={() => {
                    notificationService.trackStudentStatus(child.id, child.name, childBus?.id || 'BUS-01', s.status as 'waiting' | 'picked_up' | 'on_bus' | 'dropped_off', child.stop);
                    setStudentStatus(s.status as 'waiting' | 'picked_up' | 'on_bus' | 'dropped_off' | null);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    studentStatus === s.status ? 'bg-[#00C853] text-black' : 'glass text-gray-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
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
              <MapMock buses={childBus ? [childBus] : []} route={childRoute} height={320}/>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {/* Route stops */}
            <div className="glass rounded-2xl p-4">
              <h3 className="font-bold text-white mb-4 text-sm">Route Progress</h3>
              <div className="space-y-3">
                {childRoute?.stops.map((stop, i) => (
                  <div key={stop.name} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${i < 2 ? 'bg-[#00C853]' : i === 2 ? 'bg-[#FFD700] animate-pulse' : 'bg-white/20'}`}/>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-medium truncate ${i < 2 ? 'text-gray-400 line-through' : i === 2 ? 'text-white' : 'text-gray-600'}`}>{stop.name}</div>
                      <div className="text-[10px] text-gray-600">{stop.time}</div>
                    </div>
                    {i === 2 && <span className="text-[10px] text-[#FFD700] font-bold">NEXT</span>}
                    {stop.name === child.stop && <span className="text-[10px] text-[#00C853] font-bold">CHILD</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Occupancy */}
            <div className="glass rounded-2xl p-4">
              <h3 className="font-bold text-white mb-3 text-sm">Bus Occupancy</h3>
              <OccupancyBar current={childBus?.occupancy || 38} total={childBus?.capacity || 52}/>
            </div>

            {/* Driver info */}
            <div className="glass rounded-2xl p-4">
              <h3 className="font-bold text-white mb-3 text-sm">Driver Info</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00C853]/20 flex items-center justify-center text-lg">👨‍✈️</div>
                <div>
                  <div className="text-sm font-semibold text-white">{childBus?.driver || 'Rajesh Kumar'}</div>
                  <div className="text-xs text-gray-400">{childBus?.driverPhone || '+91 98765 43210'}</div>
                  <div className="text-xs text-[#00C853] mt-0.5">Safety: {childBus?.safetyScore || 94}% ⭐</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">🔔 Recent Notifications</h3>
            <span className="text-xs text-[#00C853] glass-green px-2 py-1 rounded-full">{unreadCount} unread</span>
          </div>
          <div className="space-y-3">
            {notifications.slice(0, 3).map((n) => (
              <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl text-sm ${n.read ? 'opacity-50' : 'glass-green'}`}>
                <span>{notificationService.getNotificationIcon(n.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs leading-relaxed">{n.message}</p>
                  <p className="text-gray-500 text-[10px] mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🔔</div>
                <p className="text-sm">No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
