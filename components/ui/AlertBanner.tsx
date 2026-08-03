'use client';
import { useState } from 'react';

interface AlertBannerProps {
  type: 'info' | 'warning' | 'critical' | 'success';
  message: string;
}

const config = {
  info:     { bg:'glass-green', icon:'ℹ️', color:'text-[#059669]' },
  warning:  { bg:'glass-gold',  icon:'⚠️', color:'text-[#b45309]' },
  critical: { bg:'glass-red',   icon:'🚨', color:'text-red-600' },
  success:  { bg:'glass-green', icon:'✅', color:'text-[#059669]' },
};

export default function AlertBanner({ type, message }: AlertBannerProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  const c = config[type];
  return (
    <div className={`${c.bg} rounded-xl px-4 py-3 flex items-center gap-3 notif-slide`}>
      <span className="text-lg">{c.icon}</span>
      <p className={`flex-1 text-sm font-medium ${c.color}`}>{message}</p>
      <button onClick={() => setVisible(false)} className="text-[#64748b] hover:text-[#0f172a] transition-colors text-lg leading-none">×</button>
    </div>
  );
}
