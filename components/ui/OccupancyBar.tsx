interface OccupancyBarProps {
  current: number;
  total: number;
}

export default function OccupancyBar({ current, total }: OccupancyBarProps) {
  const pct = Math.round((current / total) * 100);
  const color = pct >= 90 ? '#ef4444' : pct >= 70 ? '#d97706' : '#059669';
  const label = pct >= 90 ? 'Full' : pct >= 70 ? 'Crowded' : 'Available';

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-[#475569] font-medium">{current} / {total} seats</span>
        <span className="font-bold" style={{color}}>{label}</span>
      </div>
      <div className="h-3 bg-[#e2e8f0] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full progress-bar transition-all"
          style={{width:`${pct}%`, background:`linear-gradient(90deg,${color}cc,${color})`}}
        />
      </div>
      <div className="flex gap-1">
        {Array.from({length:10}).map((_,i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full"
            style={{background: i < Math.round(pct/10) ? color : '#e2e8f0'}}
          />
        ))}
      </div>
      <p className="text-xs text-[#64748b] font-medium">{pct}% occupied</p>
    </div>
  );
}
