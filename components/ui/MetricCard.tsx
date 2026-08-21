import type { ReactNode } from 'react';

interface MetricCardProps { label: string; value: ReactNode; detail: string; icon: ReactNode; tone?: 'green' | 'amber' | 'blue' | 'red' }

const tones = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  blue: 'bg-blue-50 text-blue-700 ring-blue-100',
  red: 'bg-red-50 text-red-700 ring-red-100',
};

export default function MetricCard({ label, value, detail, icon, tone = 'green' }: MetricCardProps) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md">
    <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div><span className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${tones[tone]}`}>{icon}</span></div>
  </section>;
}
