'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MapMock from '@/components/map/MapMock';
import { mockBuses, mockRoutes } from '@/lib/mockData';
import { gpsService } from '@/features/gps-tracking/services/GPSService';

const navItems = [
  { href:'/student',          icon:'🏠', label:'Dashboard' },
  { href:'/student/tracking', icon:'🗺️', label:'Live Tracking' },
  { href:'/student/eta',      icon:'⏱️', label:'ETA & Alarm' },
  { href:'/student/notifications', icon:'🔔', label:'Notifications' },
  { href:'/student/lost-found',    icon:'📦', label:'Lost & Found' },
  { href:'/student/safety',        icon:'🛡️', label:'Safety' },
];

export default function TrackingPage() {
  const myBus = mockBuses[0];
  const myRoute = mockRoutes[0];
  const [liveGPSData, setLiveGPSData] = useState<any>(null);
  const [etaData, setEtaData] = useState<any>(null);
  const [nextStopETA, setNextStopETA] = useState<any>(null);
  const [routeProgress, setRouteProgress] = useState<any>(null);
  const [busPos, setBusPos] = useState({ lat: myBus.lat, lng: myBus.lng });
  const [speed, setSpeed] = useState(myBus.speed);

  useEffect(() => {
    // Subscribe to live GPS updates
    const unsubscribe = gpsService.subscribeToUpdates(myBus.id, (position) => {
      setLiveGPSData(position);
      setBusPos({ lat: position.lat, lng: position.lng });
      setSpeed(position.speed || myBus.speed);
    });

    // Get initial ETA and next-stop ETA
    const eta = gpsService.calculateETA(myBus.id);
    setEtaData(eta);
    setNextStopETA(eta?.nextStopETA);

    // Get initial route progress
    const progress = gpsService.getRouteProgress(myBus.id);
    setRouteProgress(progress);

    // Start GPS simulation
    gpsService.startSimulation();

    // Update periodically
    const interval = setInterval(() => {
      const updatedEta = gpsService.calculateETA(myBus.id);
      setEtaData(updatedEta);
      setNextStopETA(updatedEta?.nextStopETA);
      
      const updatedProgress = gpsService.getRouteProgress(myBus.id);
      setRouteProgress(updatedProgress);
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <DashboardLayout role="student" navItems={navItems} userName="Priya Sharma">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">Live Tracking 🗺️</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time location of your assigned bus</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          {[
            { l:'Bus Number', v:myBus.number, icon:'🚌' },
            { l:'Current Speed', v:`${speed} km/h`, icon:'🚀' },
            { l:'Next Stop', v:myBus.nextStop, icon:'📍' },
            { l:'Status', v:myBus.status.toUpperCase(), icon:'🟢' },
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
            <h2 className="font-bold">Live Map — Route A</h2>
            <div className="flex items-center gap-2 text-xs text-[#00C853]">
              <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse"/>
              Updating every 2s
            </div>
          </div>
          <MapMock buses={[{...myBus, lat:busPos.lat, lng:busPos.lng, speed}]} route={myRoute} height={420}/>
        </div>

        {/* Route stops timeline */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Route Timeline</h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10"/>
            <div className="space-y-4">
              {myRoute.stops.map((stop, i) => (
                <div key={stop.name} className="flex items-center gap-4 pl-10 relative">
                  <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${i < 2 ? 'bg-[#00C853] border-[#00C853]' : i === 2 ? 'bg-[#FFD700] border-[#FFD700] animate-pulse' : 'bg-transparent border-white/20'}`}/>
                  <div className="flex-1 glass rounded-xl p-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${i < 2 ? 'text-gray-500 line-through' : 'text-white'}`}>{stop.name}</span>
                      <span className="text-xs text-gray-500">{stop.time}</span>
                    </div>
                    {i === 2 && <span className="text-xs text-[#FFD700] font-bold">Bus is here now</span>}
                    {stop.name === 'Town Hall' && <span className="text-xs text-[#00C853] font-bold">Your stop</span>}
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
