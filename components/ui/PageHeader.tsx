import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <header className="app-page-header">
      <div className="min-w-0">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#059669] mb-2">{eyebrow}</p>}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a]">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-[#64748b] max-w-2xl">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
