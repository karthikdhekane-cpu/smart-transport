'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { gpsService } from './services/GPSService';
import { useGPS } from './hooks/useGPS';
import { useMapControls } from './hooks/useMapControls';
import { GPSPosition, VehicleStatus } from './types';
import BusMarker from './components/bus/BusMarker';
import BusInfoPopup from './components/bus/BusInfoPopup';
import RouteLine from './components/route/RouteLine';
import StopMarker from './components/stops/StopMarker';
import PlaybackControls from './components/controls/PlaybackControls';
import MapControls from './components/controls/MapControls';
import CurrentStopCard from './components/ui/CurrentStopCard';
import TrackingLegend from './components/ui/TrackingLegend';
import TripProgress from './components/ui/TripProgress';

interface GPSDashboardProps {
  className?: string;
  initialBusId?: string;
  showControls?: boolean;
}

export default function GPSDashboard({
  className,
  initialBusId = 'BUS-01',
  showControls = true,
}: GPSDashboardProps) {
  // State
  const [selectedBusId, setSelectedBusId] = useState<string>(initialBusId);
  const [showPopup, setShowPopup] = useState(false);
  const [busPositions, setBusPositions] = useState<Record<string, GPSPosition>>({});
  const [busHistory, setBusHistory] = useState<Record<string, GPSPosition[]>>({});
  const [activeBuses, setActiveBuses] = useState<string[]>([]);
  
  // Hooks
  const { buses, positions, history, isLoading, isPlaying, simulationSpeed, setSimulationSpeed } = useGPS();
  const { mapState, toggleFollowBus, toggleShowRoute, toggleShowStops, toggleShowHistory, toggleSatelliteMode } = useMapControls();

  // Initialize active buses
  useEffect(() => {
    setActiveBuses(buses.map(b => b.id));
  }, [buses]);

  // Update positions when GPS hook updates
  useEffect(() => {
    setBusPositions(positions);
    setBusHistory(history);
  }, [positions, history]);

  // Get current bus
  const currentBus = useMemo(() => {
    return buses.find(b => b.id === selectedBusId);
  }, [buses, selectedBusId]);

  // Get current position
  const currentPosition = useMemo(() => {
    return busPositions[selectedBusId];
  }, [busPositions, selectedBusId]);

  // Handle bus marker click
  const handleBusClick = (busId: string) => {
    setSelectedBusId(busId);
    setShowPopup(true);
  };

  // Calculate progress for current route
  const routeProgress = useMemo(() => {
    if (!currentBus || !currentPosition) return { progress: 0, currentStopIndex: 0, remainingDistance: 0 };
    
    // Simplified progress calculation
    return { progress: 45, currentStopIndex: 2, remainingDistance: 3500 };
  }, [currentBus, currentPosition]);

  // Handle playback controls
  const handlePlayPause = () => {
    if (isPlaying) {
      gpsService.stopSimulation();
    } else {
      gpsService.startSimulation();
    }
  };

  const handleRestart = () => {
    gpsService.restartSimulation();
  };

  // Map center
  const mapCenter = useMemo(() => {
    if (mapState.followsBus && currentPosition) {
      return { lat: currentPosition.lat, lng: currentPosition.lng };
    }
    return mapState.center;
  }, [mapState.followsBus, currentPosition, mapState.center]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Map Container */}
      <div className="relative w-full h-[600px] rounded-2xl overflow-hidden bg-gray-100">
        {/* Mapbox GL JS would render here */}
        {/* For now, showing a placeholder with Mapbox-style styling */}
        <div
          className="absolute inset-0"
          style={{
            background: mapState.satelliteMode
              ? 'linear-gradient(to bottom, #1a365d, #2c5282)'
              : 'linear-gradient(to bottom, #ecfdf5, #d1fae5)',
          }}
        >
          {/* Mock Map Grid */}
          <div className="absolute inset-0 opacity-10" 
            style={{
              backgroundImage: `
                linear-gradient(#10b981 1px, transparent 1px),
                linear-gradient(90deg, #10b981 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
          
          {/* Map Layers Container */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Breadcrumb trail */}
            {busHistory[selectedBusId] && (
              <g className="breadcrumb-layer">
                <path
                  d={busHistory[selectedBusId].map((pos, i) => 
                    `${i === 0 ? 'M' : 'L'} ${pos.lng} ${pos.lat}`
                  ).join(' ')}
                  stroke="#A855F7"
                  strokeWidth="2"
                  fill="none"
                  strokeOpacity="0.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )}

            {/* Route line */}
            {mapState.showRoute && currentBus && (
              <RouteLine
                route={{
                  id: currentBus.routeId,
                  name: currentBus.routeName,
                  color: currentBus.color,
                  stops: [
                    { id: 'stop1', name: 'Start', lat: currentPosition?.lat || 11.0168, lng: currentPosition?.lng || 76.9558, scheduledTime: '7:00 AM', order: 0 },
                    { id: 'stop2', name: 'Stop 2', lat: 11.0200, lng: 76.9600, scheduledTime: '7:10 AM', order: 1 },
                    { id: 'stop3', name: 'Current', lat: currentPosition?.lat || 11.0230, lng: currentPosition?.lng || 76.9650, scheduledTime: '7:20 AM', order: 2 },
                    { id: 'stop4', name: 'Next', lat: 11.0260, lng: 76.9680, scheduledTime: '7:30 AM', order: 3 },
                    { id: 'stop5', name: 'End', lat: 11.0288, lng: 76.9678, scheduledTime: '7:40 AM', order: 4 },
                  ],
                  totalDistance: 8500,
                  estimatedDuration: 2400,
                }}
                currentProgress={routeProgress.progress}
                showRoute={mapState.showRoute}
                showStops={mapState.showStops}
                routeColor={currentBus.color}
              />
            )}

            {/* Bus markers */}
            {activeBuses.map((busId: string) => {
              const pos = busPositions[busId];
              if (!pos) return null;
              
              const bus = buses.find((b: any) => b.id === busId);
              if (!bus) return null;

              return (
                <g key={busId}>
                  <BusMarker
                    position={pos}
                    busId={busId}
                    busNumber={bus.number}
                    status={(bus.status as 'moving' | 'stopped' | 'boarding' | 'waiting' | 'delayed' | 'traffic' | 'completed') || 'moving'}
                    color={bus.color}
                    isCurrent={busId === selectedBusId}
                    onClick={handleBusClick}
                    showLabel={true}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Popup */}
        {showPopup && currentBus && currentPosition && (
          <div className="absolute top-4 right-4 z-20">
            <BusInfoPopup
              busId={currentBus.id}
              busNumber={currentBus.number}
              driverName={currentBus.driverName}
              driverPhone={currentBus.driverPhone}
              capacity={currentBus.capacity}
              occupancy={currentBus.occupancy}
              status={(currentBus.status as 'moving' | 'stopped' | 'boarding' | 'waiting' | 'delayed' | 'traffic' | 'completed') || 'moving'}
              color={currentBus.color}
              position={currentPosition}
              currentSpeed={currentBus.currentSpeed}
              averageSpeed={currentBus.averageSpeed}
              batteryLevel={currentBus.batteryLevel}
              currentStop={`Stop ${routeProgress.currentStopIndex + 1}`}
              nextStop={`Stop ${routeProgress.currentStopIndex + 2}`}
              remainingDistance={routeProgress.remainingDistance}
              onClose={() => setShowPopup(false)}
            />
          </div>
        )}

        {/* Current Stop Card */}
        {currentPosition && (
          <div className="absolute bottom-4 left-4 z-20 w-full max-w-sm">
            <CurrentStopCard
              stopName={`Stop ${routeProgress.currentStopIndex + 1}`}
              eta="3 min"
              distance="250m"
              studentsWaiting={Math.floor(Math.random() * 10) + 2}
              arrivalStatus={Math.random() > 0.8 ? 'delayed' : 'on-time'}
            />
          </div>
        )}

        {/* Trip Progress */}
        {currentBus && (
          <div className="absolute top-4 left-4 z-20 w-full max-w-sm">
            <TripProgress
              progress={routeProgress.progress}
              completedStops={routeProgress.currentStopIndex}
              remainingStops={5 - routeProgress.currentStopIndex}
              totalStops={5}
              completedDistance={routeProgress.progress * 170}
              remainingDistance={routeProgress.remainingDistance}
              totalDistance={8500}
              status={(currentBus.status as 'moving' | 'stopped' | 'boarding' | 'waiting' | 'delayed' | 'traffic' | 'completed') || 'moving'}
            />
          </div>
        )}

        {/* Tracking Legend */}
        <div className="absolute bottom-4 right-4 z-20">
          <TrackingLegend />
        </div>

        {/* Controls */}
        {showControls && (
          <>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
              <PlaybackControls
                isPlaying={isPlaying}
                speed={simulationSpeed}
                onPlayPause={handlePlayPause}
                onRestart={handleRestart}
                onSpeedChange={setSimulationSpeed}
              />
            </div>

            <div className="absolute top-4 right-4 z-20">
              <MapControls
                followsBus={mapState.followsBus}
                showRoute={mapState.showRoute}
                showStops={mapState.showStops}
                showHistory={mapState.showHistory}
                satelliteMode={mapState.satelliteMode}
                onFollowBus={toggleFollowBus}
                onToggleRoute={toggleShowRoute}
                onToggleStops={toggleShowStops}
                onToggleHistory={toggleShowHistory}
                onToggleSatellite={toggleSatelliteMode}
              />
            </div>
          </>
        )}

        {/* Map Header */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg">
            <h2 className="font-bold text-gray-800">Live GPS Tracking</h2>
            <p className="text-xs text-gray-600">
              {activeBuses.length} buses • {buses.filter((b: any) => b.status === 'moving').length} active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
