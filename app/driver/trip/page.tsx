'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MapMock from '@/components/map/MapMock';
import { JourneyTimeline } from '@/components/journey-timeline/JourneyTimeline';
import { mockBuses, mockRoutes } from '@/lib/mockData';

const navItems = [
  { href:'/driver',          icon:'🏠', label:'Dashboard' },
  { href:'/driver/trip',     icon:'🚌', label:'Trip Control' },
  { href:'/driver/analytics',icon:'📊', label:'My Analytics' },
  { href:'/driver/safety',   icon:'🛡️', label:'Safety Score' },
];

export default function TripPage() {
  const myBus = mockBuses[0];
  const myRoute = mockRoutes[0];
  const [tripActive, setTripActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [busPos, setBusPos] = useState({ lat: myBus.lat, lng: myBus.lng });
  const [currentStop, setCurrentStop] = useState(0);

  useEffect(() => {
    if (!tripActive) return;
    const t = setInterval(() => {
      setElapsed(p => p+1);
      setBusPos(prev => ({
        lat: prev.lat + (Math.random()-0.5)*0.0003,
        lng: prev.lng + (Math.random()-0.5)*0.0003,
      }));
      if (elapsed > 0 && elapsed % 30 === 0) {
        setCurrentStop(p => Math.min(p+1, myRoute.stops.length-1));
      }
    }, 1000);
    return () => clearInterval(t);
  }, [tripActive, elapsed]);

  const formatTime = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  return (
    <DashboardLayout role="driver" navItems={navItems} userName="Rajesh Kumar">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">Live GPS Tracking 🚌</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time bus location sharing</p>
        </div>

        {/* Trip timer */}
        <div className={`rounded-3xl p-8 text-center ${tripActive ? 'glass-green' : 'glass'}`}>
          <p className="text-gray-400 text-sm mb-2">{tripActive ? 'Trip Duration' : 'Ready to Start'}</p>
          <div className={`text-6xl font-black mb-4 ${tripActive ? 'neon-text' : 'text-gray-600'}`}>
            {formatTime(elapsed)}
          </div>
          <div className="flex gap-4 justify-center">
            {!tripActive ? (
              <button
                onClick={() => { setTripActive(true); setElapsed(0); setCurrentStop(0); }}
                className="bg-[#00C853] hover:bg-[#009624] text-black font-black px-10 py-4 rounded-2xl text-lg transition-all hover:shadow-neon"
              >
                ▶ Start Trip
              </button>
            ) : (
              <>
                <button
                  onClick={() => { setTripActive(false); }}
                  className="bg-red-500 hover:bg-red-600 text-white font-black px-10 py-4 rounded-2xl text-lg transition-all"
                >
                  ⏹ End Trip
                </button>
              </>
            )}
          </div>
          {tripActive && (
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-[#00C853]">
              <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse"/>
              GPS Location Sharing Active
            </div>
          )}
        </div>

        {/* Journey Timeline */}
        {tripActive && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <JourneyTimeline
                busId={myBus.id}
                tripActive={tripActive}
                tripDuration={1800} // 30 minutes
                currentStopIndex={currentStop}
                totalStops={myRoute.stops.length}
              />
            </div>
            
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">Live GPS Location</h3>
                  {tripActive && <span className="text-xs text-[#00C853] glass-green px-2 py-1 rounded-full animate-pulse">Sharing Location</span>}
                </div>
                <MapMock buses={[{...myBus, lat:busPos.lat, lng:busPos.lng}]} route={myRoute} height={380}/>
              </div>
            </div>
          </div>
        )}

        {/* Stop progress (when not active) */}
        {!tripActive && (
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4">Stop Progress (Trip Not Active)</h3>
            <div className="space-y-3 opacity-50">
              {myRoute.stops.map((stop, i) => (
                <div key={stop.name} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    i < currentStop ? 'bg-[#00C853] text-black' :
                    i === currentStop ? 'bg-[#FFD700] text-black' :
                    'bg-white/10 text-gray-500'
                  }`}>
                    {i < currentStop ? '✓' : i+1}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${i <= currentStop ? 'text-white' : 'text-gray-500'}`}>{stop.name}</div>
                    <div className="text-xs text-gray-600">{stop.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
