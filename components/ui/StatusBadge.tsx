import type { ReactNode } from 'react';

type StatusType = 
  | 'healthy' 
  | 'warning' 
  | 'critical' 
  | 'active' 
  | 'inactive' 
  | 'delayed' 
  | 'overspeed' 
  | 'available' 
  | 'unavailable' 
  | 'emergency';

interface StatusBadgeProps {
  status: StatusType;
  children: ReactNode;
  size?: 'sm' | 'md';
}

const statusConfig = {
  healthy: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: '✓',
  },
  warning: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: '⚠️',
  },
  critical: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: '🚨',
  },
  active: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: '●',
  },
  inactive: {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    icon: '○',
  },
  delayed: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: '⏱️',
  },
  overspeed: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: '🚀',
  },
  available: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: '✓',
  },
  unavailable: {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    icon: '○',
  },
  emergency: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: '🚨',
  },
};

export default function StatusBadge({ status, children, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}>
      <span className="text-xs">{config.icon}</span>
      {children}
    </span>
  );
}
