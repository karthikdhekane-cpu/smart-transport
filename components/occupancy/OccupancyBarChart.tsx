'use client';
import { useState } from 'react';
import { mockBuses } from '@/lib/mockData';

interface OccupancyData {
  time: string;
  [key: string]: number | string;
}

interface OccupancyBarChartProps {
  title?: string;
  data?: OccupancyData[];
  className?: string;
}

const DEFAULT_DATA: OccupancyData[] = [
  { time: '7:00', 'BUS-01': 10, 'BUS-02': 5, 'BUS-03': 8, 'BUS-04': 15 },
  { time: '7:30', 'BUS-01': 28, 'BUS-02': 22, 'BUS-03': 18, 'BUS-04': 35 },
  { time: '8:00', 'BUS-01': 45, 'BUS-02': 48, 'BUS-03': 30, 'BUS-04': 50 },
  { time: '8:30', 'BUS-01': 38, 'BUS-02': 40, 'BUS-03': 20, 'BUS-04': 45 },
  { time: '9:00', 'BUS-01': 12, 'BUS-02': 15, 'BUS-03': 8, 'BUS-04': 20 },
];

export default function OccupancyBarChart({ title = 'Occupancy Trends', data = DEFAULT_DATA, className = '' }: OccupancyBarChartProps) {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);

  const busColors: Record<string, string> = {
    'BUS-01': '#00C853',
    'BUS-02': '#FFD700',
    'BUS-03': '#2196F3',
    'BUS-04': '#FF5722',
  };

  const maxOccupancy = 52; // Max capacity

  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      <h3 className="font-bold text-white mb-4">{title}</h3>
      
      {/* Bus selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {data[0] && Object.keys(data[0])
          .filter(k => k !== 'time')
          .map(busId => (
            <button
              key={busId}
              onClick={() => setSelectedBus(selectedBus === busId ? null : busId)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedBus === busId
                  ? 'bg-[#00C853] text-black'
                  : 'glass text-gray-400 hover:text-white'
              }`}
              style={{
                borderColor: busColors[busId],
              }}
            >
              {busId}
            </button>
          ))}
        {selectedBus && (
          <button
            onClick={() => setSelectedBus(null)}
            className="px-3 py-1.5 rounded-full text-xs text-gray-400 hover:text-white transition-all"
          >
            Show All
          </button>
        )}
      </div>

      {/* Chart */}
      <div className="relative h-48">
        <svg width="100%" height="100%" viewBox="0 0 300 192" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 48, 96, 144, 192].map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="300"
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}
          
          {/* Bars */}
          {data.map((d, i) => {
            const busIds = selectedBus ? [selectedBus] : ['BUS-01', 'BUS-02', 'BUS-03', 'BUS-04'];
            const xPos = 20 + i * 50;
            
            return (
              <g key={d.time}>
                {busIds.map((busId, bi) => {
                  const occupancy = (d as any)[busId] || 0;
                  const height = (occupancy / maxOccupancy) * 160;
                  const y = 180 - height;
                  const barWidth = 8;
                  const gap = 4;
                  const x = xPos + bi * (barWidth + gap);
                  
                  return (
                    <rect
                      key={busId}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={height}
                      fill={busColors[busId]}
                      fillOpacity={selectedBus ? 1 : 0.5}
                      rx="2"
                      className="hover:fill-opacity-100 transition-all cursor-pointer"
                      style={{
                        stroke: '#fff',
                        strokeWidth: selectedBus ? 1 : 0.5,
                      }}
                    >
                      <title>{`${busId} at ${d.time}: ${occupancy}/${maxOccupancy} (${Math.round((occupancy / maxOccupancy) * 100)}%)`}</title>
                    </rect>
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
          {data.map((d, i) => (
            <span key={d.time} className="text-[10px] text-gray-500">
              {d.time}
            </span>
          ))}
        </div>

        {/* Y-axis */}
        <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-between text-[10px] text-gray-500">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {(() => {
          const occupanciesByBus = data.reduce((acc, d) => {
            const busIds = selectedBus ? [selectedBus] : ['BUS-01', 'BUS-02', 'BUS-03', 'BUS-04'];
            busIds.forEach(busId => {
              if (!acc[busId]) acc[busId] = [];
              acc[busId].push((d as any)[busId] || 0);
            });
            return acc;
          }, {} as Record<string, number[]>);
          
          return Object.entries(occupanciesByBus).map(([busId, occupancies]) => {
            const avg = Math.round(occupancies.reduce((a, b) => a + b, 0) / occupancies.length);
            const max = Math.max(...occupancies);
            const min = Math.min(...occupancies);
            
            return (
              <div key={busId} className="glass rounded-xl p-3 text-center">
                <div className="text-sm font-bold text-white mb-1">{busId}</div>
                <div className="text-xs text-gray-400">Avg: {avg} | Max: {max} | Min: {min}</div>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}
