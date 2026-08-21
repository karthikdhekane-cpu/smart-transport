'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MapMock from '@/components/map/MapMock';
import { mockBuses, mockRoutes } from '@/lib/mockData';
import { gpsService } from '@/features/gps-tracking/services/GPSService';
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
      <div className="space-y-8">
        <PageHeader 
          eyebrow="Journey status" 
          title="Live bus tracking" 
          description="Real-time location, current speed, and your next stop." 
          action={<StatusBadge status="active">Live</StatusBadge>} 
        />

        {/* Primary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Bus Number" value={myBus.number} detail="Route A" icon="🚌" />
          <MetricCard label="Current Speed" value={`${speed} km/h`} detail="Moving" icon="🚀" tone="amber" />
          <MetricCard label="Next Stop" value={myBus.nextStop} detail="Approaching" icon="📍" tone="green" />
          <MetricCard label="Status" value={myBus.status.toUpperCase()} detail="On schedule" icon="🟢" tone="green" />
        </div>

        {/* Primary Operational Visualization - Map */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Live Map — {myRoute.name}</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
              <span className="text-xs text-slate-500">Updating every 2s</span>
            </div>
          </div>
          <div className="p-4">
            <MapMock buses={[{...myBus, lat:busPos.lat, lng:busPos.lng, speed}]} route={myRoute} height={420}/>
          </div>
        </div>

        {/* Route Timeline */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Route Timeline</h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"/>
            <div className="space-y-4">
              {myRoute.stops.map((stop, i) => (
                <div key={stop.name} className="flex items-center gap-4 pl-10 relative">
                  <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                    i < 2 ? 'bg-emerald-500 border-emerald-500' : 
                    i === 2 ? 'bg-amber-500 border-amber-500 animate-pulse' : 
                    'bg-white border-slate-300'
                  }`}/>
                  <div className="flex-1 rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${i < 2 ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{stop.name}</span>
                      <span className="text-xs text-slate-500">{stop.time}</span>
                    </div>
                    {i === 2 && <span className="text-xs text-amber-600 font-medium">Bus is here now</span>}
                    {stop.name === 'Town Hall' && <span className="text-xs text-emerald-600 font-medium">Your stop</span>}
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
