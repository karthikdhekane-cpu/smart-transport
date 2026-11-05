'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MapMock from '@/components/map/MapMock';
import { JourneyTimeline } from '@/components/journey-timeline/JourneyTimeline';
import { busApi, driverApi, routeApi, tripApi } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

export const dynamic = 'force-dynamic';

const navItems = [
  { href:'/driver',          icon:'🏠', label:'Dashboard' },
  { href:'/driver/trip',     icon:'🚌', label:'Trip Control' },
  { href:'/driver/analytics',icon:'📊', label:'My Analytics' },
  { href:'/driver/safety',   icon:'🛡️', label:'Safety Score' },
];

export default function TripPage() {
  const [myBus, setMyBus] = useState<any>(null);
  const [myRoute, setMyRoute] = useState<any>(null);
  const [myDriver, setMyDriver] = useState<any>(null);
  const [tripActive, setTripActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [busPos, setBusPos] = useState({ lat: 0, lng: 0 });
  const [currentStop, setCurrentStop] = useState(0);
  const [currentTrip, setCurrentTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const formatTime = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  // Load driver profile, bus, route, and active trip on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get driver profile by UID
        const driverRes = await driverApi.getMe();
        setMyDriver(driverRes.driver);
        
        // Get bus by driver's busId
        if (driverRes.driver?.busId) {
          const busRes = await busApi.getById(driverRes.driver.busId);
          if (busRes.bus) {
            setMyBus(busRes.bus);
            setBusPos({ lat: 0, lng: 0 }); // GPS not implemented yet
          }
        }
        
        // Load trips for this driver
        if (currentUser?.uid) {
          const tripsRes = await tripApi.getAll(undefined, currentUser.uid);
          const activeTrip = tripsRes.trips.find((t: any) => t.status === 'active');
          
          if (activeTrip) {
            setCurrentTrip(activeTrip);
            setTripActive(true);
            
            // Route should come from the trip's routeId, not from myBus
            if (activeTrip.routeId) {
              const routeRes = await routeApi.getById(activeTrip.routeId);
              if (routeRes.route) {
                setMyRoute(routeRes.route);
              }
            }
          } else if (myBus?.routeId) {
            // If no active trip, try to get route from bus
            const routeRes = await routeApi.getById(myBus.routeId);
            if (routeRes.route) {
              setMyRoute(routeRes.route);
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
  }, [currentUser?.uid]);

  const handleStartTrip = async () => {
    if (!myBus?.id || !currentUser?.uid) {
      alert('Cannot start trip: Missing bus or driver information');
      return;
    }
    
    // Check if bus already has an active trip
    const activeTrip = currentTrip;
    if (activeTrip && activeTrip.status === 'active') {
      alert('This bus already has an active trip');
      return;
    }
    
    setLoading(true);
    try {
      const tripData = {
        busId: myBus.id,
        driverId: currentUser.uid,
        routeId: myBus.routeId || '',
        status: 'active',
        startTime: Date.now(),
      };
      const data = await tripApi.create(tripData);
      setCurrentTrip(data.trip);
      setTripActive(true);
    } catch (error: any) {
      console.error('Failed to start trip:', error);
      alert(error.message || 'Failed to start trip');
    } finally {
      setLoading(false);
    }
  };

  const handleEndTrip = async () => {
    if (!currentTrip?.id) return;
    setLoading(true);
    try {
      await tripApi.update(currentTrip.id, { 
        status: 'completed',
        endTime: Date.now(),
      });
      setCurrentTrip(null);
      setTripActive(false);
    } catch (error: any) {
      console.error('Failed to complete trip:', error);
      alert(error.message || 'Failed to complete trip');
    } finally {
      setLoading(false);
    }
  };

  // Get driver name
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
                onClick={handleStartTrip}
                disabled={loading}
                className="bg-[#00C853] hover:bg-[#009624] text-black font-black px-10 py-4 rounded-2xl text-lg transition-all hover:shadow-neon disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ▶ Start Trip
              </button>
            ) : (
              <>
                <button
                  onClick={handleEndTrip}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600 text-white font-black px-10 py-4 rounded-2xl text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
        {tripActive && myRoute?.stops && myBus && (
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
        
        {/* Route unavailable state */}
        {tripActive && !myRoute?.stops && myBus && (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-gray-400 mb-2">Route data unavailable for trip</p>
            <p className="text-xs text-gray-600">Cannot display journey timeline without route stops</p>
          </div>
        )}

        {/* Stop progress (when not active) */}
        {!tripActive && myRoute?.stops && (
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4">Stop Progress (Trip Not Active)</h3>
            <div className="space-y-3 opacity-50">
              {myRoute.stops.map((stop: any, i: number) => (
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
                    <div className="text-xs text-gray-600">{stop.time || ''}</div>
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
