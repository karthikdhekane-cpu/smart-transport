'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MapMock from '@/components/map/MapMock';
import { mockBuses, mockRoutes, mockStudents } from '@/lib/mockData';
import { useETA } from '@/features/eta';

const navItems = [
  { href:'/parent',          icon:'🏠', label:'Dashboard' },
  { href:'/parent/tracking', icon:'🗺️', label:'Bus Tracking' },
  { href:'/parent/notifications', icon:'🔔', label:'Notifications' },
];

export default function ParentTrackingPage() {
  const child = mockStudents[0];
  const childBus = mockBuses.find(b => b.id === child.busId);
  const childRoute = mockRoutes.find(r => r.id === 'route-a');
  
  const { busStates, isLoading } = useETA(childBus?.id);
  const currentBusState = busStates[0];
  
  const [busPos, setBusPos] = useState({ lat: childBus?.lat || 11.0168, lng: childBus?.lng || 76.9558 });
  const [speed, setSpeed] = useState(childBus?.speed || 42);

  useEffect(() => {
    const t = setInterval(() => {
      setBusPos(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.0004,
        lng: prev.lng + (Math.random() - 0.5) * 0.0004,
      }));
      setSpeed(Math.round(35 + Math.random() * 20));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const etaMinutes = currentBusState 
    ? Math.round(currentBusState.currentETA.seconds / 60)
    : 8;

  return (
    <DashboardLayout role="parent" navItems={navItems} userName="Parent">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">Live Bus Tracking 🗺️</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time location of {child.name}'s assigned bus</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          {[
            { l:'Bus Number', v:childBus?.number || 'TN 38 AB 1234', icon:'🚌' },
            { l:'Current Speed', v:`${speed} km/h`, icon:'🚀' },
            { l:'Next Stop', v:childBus?.nextStop || 'Main Gate', icon:'📍' },
            { l:'Status', v:childBus?.status.toUpperCase() || 'MOVING', icon:'🟢' },
          ].map(c => (
            <div key={c.l} className="glass-green rounded-2xl p-4">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="text-lg font-bold neon-text">{c.v}</div>
              <div className="text-xs text-gray-400">{c.l}</div>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Live Map — {childRoute?.name || 'Route A'}</h2>
            <div className="flex items-center gap-2 text-xs text-[#00C853]">
              <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse"/>
              Updating every 2s
            </div>
          </div>
          <MapMock buses={childBus ? [{...childBus, lat:busPos.lat, lng:busPos.lng, speed}] : []} route={childRoute} height={420}/>
        </div>

        {/* Route stops timeline */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Route Timeline</h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10"/>
            <div className="space-y-4">
              {childRoute?.stops.map((stop, i) => (
                <div key={stop.name} className="flex items-center gap-4 pl-10 relative">
                  <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${i < 2 ? 'bg-[#00C853] border-[#00C853]' : i === 2 ? 'bg-[#FFD700] border-[#FFD700] animate-pulse' : 'bg-transparent border-white/20'}`}/>
                  <div className="flex-1 glass rounded-xl p-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${i < 2 ? 'text-gray-500 line-through' : 'text-white'}`}>{stop.name}</span>
                      <span className="text-xs text-gray-500">{stop.time}</span>
                    </div>
                    {i === 2 && <span className="text-xs text-[#FFD700] font-bold">Bus is here now</span>}
                    {stop.name === child.stop && <span className="text-xs text-[#00C853] font-bold">Your child's stop</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ETA Information */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">⏱️ ETA Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f8fafc] rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Estimated Arrival</div>
              <div className="text-2xl font-black neon-text">{etaMinutes} min</div>
              <div className="text-xs text-gray-600">To {child.stop}</div>
            </div>
            <div className="bg-[#f8fafc] rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Bus Status</div>
              <div className="text-2xl font-black text-[#00C853]">{currentBusState?.status || 'On Time'}</div>
              <div className="text-xs text-gray-600">{currentBusState?.traffic?.config?.name || 'Normal traffic'}</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
