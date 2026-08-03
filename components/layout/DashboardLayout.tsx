'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DashboardBg from '@/components/ui/DashboardBg';

interface NavItem { href: string; icon: string; label: string }
interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'student' | 'driver' | 'admin';
  navItems: NavItem[];
  userName?: string;
}

const roleColors = { student: '#059669', driver: '#d97706', admin: '#3b82f6' };
const roleIcons  = { student: '🎓', driver: '🚌', admin: '⚙️' };

export default function DashboardLayout({ children, role, navItems, userName = 'User' }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const color = roleColors[role];

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex relative">
      <DashboardBg />

      {/* Ambient overlay */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse 80% 50% at 20% 20%, rgba(5,150,105,0.04) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(59,130,246,0.03) 0%, transparent 55%)',
      }} />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{background:'rgba(255,255,255,0.96)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderRight:'1px solid #e2e8f0',boxShadow:'1px 0 12px rgba(15,23,42,0.05)'}}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#e2e8f0]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{background:`linear-gradient(135deg,${color},${color}bb)`}}>
              {roleIcons[role]}
            </div>
            <div>
              <div className="font-bold text-[#0f172a] text-sm">CampBus – A Smart App</div>
              <div className="text-xs capitalize font-medium" style={{color}}>{role} Portal</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'sidebar-active text-[#0f172a]'
                    : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{background:color}}/>}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[#e2e8f0]">
          <div className="flex items-center gap-3 bg-[#f8fafc] rounded-xl p-3 border border-[#e2e8f0]">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{background:color}}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#0f172a] truncate">{userName}</div>
              <div className="text-xs text-[#94a3b8] capitalize">{role}</div>
            </div>
            <Link href="/login" className="text-[#94a3b8] hover:text-red-500 transition-colors text-base">⏏</Link>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)}/>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen relative z-10">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 px-6 py-3.5 flex items-center justify-between"
          style={{background:'rgba(248,250,252,0.94)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',borderBottom:'1px solid #e2e8f0',boxShadow:'0 1px 6px rgba(15,23,42,0.04)'}}
        >
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-[#64748b] hover:text-[#0f172a] transition-colors text-xl">
            ☰
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"/>
            <span className="text-xs text-[#64748b] font-medium">Live · {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative bg-white border border-[#e2e8f0] rounded-xl p-2 text-[#64748b] hover:text-[#0f172a] transition-colors shadow-sm">
              🔔
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center text-white font-bold">3</span>
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{background:color}}>
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
