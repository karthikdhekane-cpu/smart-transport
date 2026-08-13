'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import DashboardBg from '@/components/ui/DashboardBg';
import { notificationService } from '@/features/notifications';

interface NavItem { href: string; icon: string; label: string }
interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'student' | 'driver' | 'admin' | 'parent';
  navItems: NavItem[];
  userName?: string;
}

const roleColors = { student: '#059669', driver: '#d97706', admin: '#3b82f6', parent: '#9C27B0' };
const roleIcons  = { student: '🎓', driver: '🚌', admin: '⚙️', parent: '👨‍👩‍👧' };

export default function DashboardLayout({ children, role, navItems, userName = 'User' }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const color = roleColors[role];

  // Load unread count from notification service
  useEffect(() => {
    const loadUnreadCount = () => {
      const unread = notificationService.getUnreadNotifications();
      setUnreadCount(unread.length);
    };
    
    loadUnreadCount();
    
    // Note: In a real implementation, we'd subscribe to notification changes
    // For now, we'll use polling or manual updates
    
    return () => {
      // Cleanup
    };
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    
    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationsOpen]);

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
    setUnreadCount(0);
  };

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
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = item.href;
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'sidebar-active text-[#0f172a]'
                    : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{background:color}}/>}
              </a>
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
          <div className="flex items-center gap-3 relative" ref={notificationsRef}>
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative bg-white border border-[#e2e8f0] rounded-xl p-2 text-[#64748b] hover:text-[#0f172a] transition-colors shadow-sm"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[10px] flex items-center justify-center text-white font-bold animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#e2e8f0] overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
                    <span className="font-semibold text-[#0f172a] text-sm">Notifications</span>
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-xs text-[#64748b] hover:text-[#0f172a] transition-colors font-medium"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notificationService.getUnreadNotifications().length === 0 ? (
                      <div className="p-8 text-center text-[#94a3b8]">
                        <div className="text-4xl mb-2">🔔</div>
                        <p className="text-sm">No unread notifications</p>
                      </div>
                    ) : (
                      notificationService.getAllNotifications().slice(0, 5).map((n) => (
                        <div 
                          key={n.id}
                          onClick={() => {
                            notificationService.markAsRead(n.id);
                            setUnreadCount(notificationService.getUnreadNotifications().length);
                            setNotificationsOpen(false);
                          }}
                          className="p-4 border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors cursor-pointer last:border-0"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl mt-0.5">{notificationService.getNotificationIcon(n.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-sm font-semibold ${notificationService.getNotificationColor(n.type)}`}>
                                  {n.title}
                                </span>
                                {!n.read && <span className="w-2 h-2 rounded-full bg-[#00C853]"/>}
                              </div>
                              <p className="text-xs text-[#64748b] mb-2">{n.message}</p>
                              <div className="flex items-center gap-2 text-[10px] text-[#94a3b8]">
                                <span>{formatTimeAgo(n.timestamp)}</span>
                                {n.busNumber && <span>• {n.busNumber}</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
                    <Link 
                      href="/student/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className="block w-full text-center text-xs font-semibold text-[#0f172a] hover:text-[#00C853] transition-colors"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
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

// Helper function to format time ago
function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}
