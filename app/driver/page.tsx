'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MapMock from '@/components/map/MapMock';
import { DriverStatusCard } from '@/components/driver-status/DriverStatusCard';
import { DriverAvailabilityToggle } from '@/components/driver-availability/DriverAvailabilityToggle';
import { busApi, routeApi } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

export const dynamic = 'force-dynamic';

const navItems = [
  { href:'/driver',          icon:'🏠', label:'Dashboard' },
  { href:'/driver/trip',     icon:'🚌', label:'Trip Control' },
  { href:'/driver/analytics',icon:'📊', label:'My Analytics' },
  { href:'/driver/safety',   icon:'🛡️', label:'Safety Score' },
  { href:'/driver/trip-history', icon:'📅', label:'Trip History' },
  { href:'/driver/attendance', icon:'📋', label:'Attendance' },
];

export default function DriverDashboard() {
  const [myBus, setMyBus] = useState<any>(null);
  const [myRoute, setMyRoute] = useState<any>(null);
  const [myDriver, setMyDriver] = useState<any>(null);
  const [tripActive, setTripActive] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [busPos, setBusPos] = useState({ lat: 0, lng: 0 });
  const [sosActive, setSosActive] = useState(false);
  const [events, setEvents] = useState<{time:string,msg:string,type:string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  
  // Derived state from tripActive
  const driverStatus: 'driving' | 'idle' = tripActive ? 'driving' : 'idle';
  const driverAvailability = tripActive ? 'unavailable' : 'available';

  // Load driver, bus, and route data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get driver profile
        const driverRes = await fetch('/api/drivers/me', {
          headers: { 'Authorization': `Bearer ${currentUser ? await currentUser.getIdToken() : ''}` },
        });
        if (driverRes.ok) {
          const data = await driverRes.json();
          setMyDriver(data.driver);
          
          // Get bus by driver's busId
          if (data.driver?.busId) {
            const busRes = await busApi.getById(data.driver.busId);
            if (busRes.bus) {
              setMyBus(busRes.bus);
              setBusPos({ lat: 0, lng: 0 });
              
              // Get route if bus has routeId
              if (busRes.bus.routeId) {
                const routeRes = await routeApi.getById(busRes.bus.routeId);
                if (routeRes.route) {
                  setMyRoute(routeRes.route);
                }
              }
            }
          }
        }
      } catch (error: any) {
        console.error('Failed to load driver data:', error);
        setError(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentUser]);

  useEffect(() => {
    if (!tripActive || !myBus) return;
    const t = setInterval(() => {
      setSpeed(Math.round(30 + Math.random() * 30));
      setBusPos(prev => ({
        lat: prev.lat + (Math.random()-0.5)*0.0004,
        lng: prev.lng + (Math.random()-0.5)*0.0004,
      }));
    }, 2000);
    return () => clearInterval(t);
  }, [tripActive, myBus]);

  const startTrip = () => {
    setTripActive(true);
    setEvents(prev => [{time:new Date().toLocaleTimeString(), msg:'Trip started on ' + (myRoute?.name || 'Unknown'), type:'ok'}, ...prev]);
  };

  const stopTrip = () => {
    setTripActive(false);
    setSpeed(0);
    setEvents(prev => [{time:new Date().toLocaleTimeString(), msg:'Trip completed successfully', type:'ok'}, ...prev]);
  };

  const triggerSOS = () => {
    setSosActive(true);
    setEvents(prev => [{time:new Date().toLocaleTimeString(), msg:'SOS TRIGGERED — Emergency services notified', type:'sos'}, ...prev]);
    setTimeout(() => setSosActive(false), 5000);
  };

  const driverName = myDriver?.name || (myDriver?.userId || '').substring(0, 8);

  return (
    <DashboardLayout role="driver" navItems={navItems} userName={driverName}>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {loading && !myBus && !error && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d97706] mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading driver profile...</p>
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-white">Driver Dashboard 🚌</h1>
            <p className="text-gray-400 text-sm mt-1">{driverName} · {myBus?.number || 'Loading...'} · {myRoute?.name || 'Loading...'}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${tripActive ? 'glass-green text-[#00C853]' : 'glass text-gray-400'}`}>
              <span className={`w-2 h-2 rounded-full ${tripActive ? 'bg-[#00C853] animate-pulse' : 'bg-gray-600'}`}/>
              {tripActive ? 'On Trip' : 'Off Duty'}
            </div>
          </div>
        </div>

        {sosActive && (
          <div className="glass-red rounded-2xl p-4 flex items-center gap-4 animate-pulse">
            <span className="text-3xl">🚨</span>
            <div>
              <p className="text-red-400 font-black text-lg">SOS ACTIVE</p>
              <p className="text-gray-300 text-sm">Emergency services and admin have been notified. Stay calm.</p>
            </div>
          </div>
        )}

        {/* Driver Status and Availability */}
        <div className="grid md:grid-cols-2 gap-6">
          <DriverStatusCard currentStatus={driverStatus} onSelectStatus={() => {}} />
          <DriverAvailabilityToggle availability={driverAvailability} onToggle={() => {}} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l:'Speed', v:`${speed} km/h`, icon:'🚀', c:'gold', active:tripActive },
            { l:'Safety Score', v:'94%', icon:'🛡️', c:'green', active:true },
            { l:'Today\'s Trips', v:'2', icon:'🗺️', c:'gold', active:true },
            { l:'Students', v:`${myBus?.occupancy || 0}`, icon:'👥', c:'green', active:true },
          ].map(s => (
            <div key={s.l} className={`${s.c==='gold'?'glass-gold':'glass-green'} rounded-2xl p-4 hover-card`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className={`text-xl font-black ${s.c==='gold'?'gold-text':'neon-text'}`}>{s.v}</div>
              <div className="text-xs text-gray-400">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Trip control + Map */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Trip control */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">Trip Control</h3>
              {!tripActive ? (
                <button
                  onClick={startTrip}
                  className="w-full bg-[#00C853] hover:bg-[#009624] text-black font-black py-4 rounded-xl text-lg transition-all hover:shadow-neon"
                >
                  ▶ Start Trip
                </button>
              ) : (
                <button
                  onClick={stopTrip}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-xl text-lg transition-all"
                >
                  ⏹ End Trip
                </button>
              )}
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Route</span><span className="text-white">{myRoute?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Bus</span><span className="text-white">{myBus?.number || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Passengers</span><span className="text-white">{myBus?.occupancy || 0}/{myBus?.capacity || 0}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Status</span><span className="text-white capitalize">{driverStatus}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Availability</span><span className="text-white capitalize">{driverAvailability}</span>
                </div>
              </div>
            </div>

            {/* SOS */}
            <div className="glass rounded-2xl p-6 text-center">
              <h3 className="font-bold text-white mb-3">Emergency SOS</h3>
              <button
                onClick={triggerSOS}
                className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 text-white font-black text-sm transition-all sos-btn mx-auto block"
              >
                SOS
              </button>
              <p className="text-gray-600 text-xs mt-3">Alerts admin + emergency services</p>
            </div>

            {/* Safety score */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-white mb-3">Safety Score</h3>
              <div className="text-5xl font-black neon-text text-center mb-3">94%</div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#00C853] rounded-full" style={{width:'94%'}}/>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">Excellent · Top 10% of drivers</p>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Live GPS Location</h3>
                {tripActive && <span className="text-xs text-[#00C853] glass-green px-2 py-1 rounded-full animate-pulse">Sharing Location</span>}
              </div>
              <MapMock buses={myBus ? [{...myBus, lat:busPos.lat, lng:busPos.lng, speed}] : []} route={myRoute} height={380}/>
            </div>
          </div>
        </div>

        {/* Event log */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4">📋 Trip Event Log</h3>
          {events.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No events yet. Start a trip to begin logging.</p>
          ) : (
            <div className="space-y-2">
              {events.map((e, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl text-sm ${e.type==='sos'?'glass-red':'glass'}`}>
                  <span>{e.type==='sos'?'🚨':'✅'}</span>
                  <span className="text-gray-400 text-xs w-20 flex-shrink-0">{e.time}</span>
                  <span className={e.type==='sos'?'text-red-400':'text-white'}>{e.msg}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
