'use client';

interface Bus {
  id: string;
  lat: number;
  lng: number;
  color: string;
  status: string;
  speed?: number;
}

interface Stop {
  name: string;
  lat: number;
  lng: number;
}

interface Route {
  stops: Stop[];
  color: string;
}

interface MapMockProps {
  buses: Bus[];
  route?: Route;
  height?: number;
  showAllBuses?: boolean;
}

// Convert lat/lng to SVG coordinates (simple linear mapping)
function toSVG(lat: number, lng: number, bounds: {minLat:number,maxLat:number,minLng:number,maxLng:number}, w=400, h=300) {
  const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (w - 40) + 20;
  const y = h - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * (h - 40) - 20;
  return { x, y };
}

export default function MapMock({ buses, route, height = 300, showAllBuses = false }: MapMockProps) {
  const allLats = [...buses.map(b=>b.lat), ...(route?.stops.map(s=>s.lat)||[])];
  const allLngs = [...buses.map(b=>b.lng), ...(route?.stops.map(s=>s.lng)||[])];
  const bounds = {
    minLat: Math.min(...allLats) - 0.005,
    maxLat: Math.max(...allLats) + 0.005,
    minLng: Math.min(...allLngs) - 0.005,
    maxLng: Math.max(...allLngs) + 0.005,
  };

  const W = 400, H = height;

  return (
    <div className="map-mock map-grid rounded-2xl overflow-hidden relative" style={{height}}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="absolute inset-0">
        {/* Route polyline */}
        {route && route.stops.length > 1 && (
          <polyline
            points={route.stops.map(s => {
              const {x,y} = toSVG(s.lat, s.lng, bounds, W, H);
              return `${x},${y}`;
            }).join(' ')}
            stroke={route.color}
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="8 4"
            className="route-line"
            opacity="0.8"
          />
        )}

        {/* Stop markers */}
        {route?.stops.map((stop, i) => {
          const {x,y} = toSVG(stop.lat, stop.lng, bounds, W, H);
          return (
            <g key={stop.name}>
              <circle cx={x} cy={y} r="5" fill={route.color} opacity="0.8"/>
              <circle cx={x} cy={y} r="8" fill="none" stroke={route.color} strokeWidth="1" opacity="0.3"/>
              {i === 0 || i === route.stops.length-1 ? (
                <text x={x+10} y={y+4} fill="#334155" fontSize="9" opacity="0.9">{stop.name.split(' ')[0]}</text>
              ) : null}
            </g>
          );
        })}

        {/* Bus markers */}
        {buses.map((bus) => {
          const {x,y} = toSVG(bus.lat, bus.lng, bounds, W, H);
          return (
            <g key={bus.id}>
              {/* Pulse ring */}
              <circle cx={x} cy={y} r="20" fill="none" stroke={bus.color} strokeWidth="1.5" opacity="0.3" className="pulse-ring"/>
              {/* Bus circle */}
              <circle cx={x} cy={y} r="10" fill={bus.color} className="bus-pulse"/>
              {/* Bus icon text */}
              <text x={x} y={y+4} textAnchor="middle" fontSize="10" fill="black" fontWeight="bold">🚌</text>
              {/* Label */}
              <rect x={x-18} y={y-28} width="36" height="14" rx="4" fill="rgba(255,255,255,0.92)"/>
              <text x={x} y={y-18} textAnchor="middle" fontSize="8" fill={bus.color} fontWeight="bold">{bus.id}</text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex gap-2">
        <div className="glass rounded-lg px-2 py-1 text-[10px] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#059669]"/>
          <span className="text-[#475569] font-medium">Bus</span>
        </div>
        <div className="glass rounded-lg px-2 py-1 text-[10px] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#94a3b8]"/>
          <span className="text-[#475569] font-medium">Stop</span>
        </div>
      </div>

      {/* Live badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 glass rounded-full px-2.5 py-1 text-[10px]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"/>
        <span className="text-[#059669] font-semibold">LIVE</span>
      </div>
    </div>
  );
}
