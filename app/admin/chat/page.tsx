'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ChatSidebar, ChatThreadView } from '@/components/chat';

const navItems = [
  { href:'/admin',           icon:'🏠', label:'Dashboard' },
  { href:'/admin/fleet',     icon:'🚌', label:'Fleet Monitor' },
  { href:'/admin/analytics', icon:'📊', label:'Analytics' },
  { href:'/admin/drivers',   icon:'👨‍✈️', label:'Drivers' },
  { href:'/admin/students',  icon:'🎓', label:'Students' },
  { href:'/admin/alerts',    icon:'🚨', label:'Alerts' },
  { href:'/admin/routes',    icon:'🗺️', label:'Routes' },
  { href:'/admin/maintenance', icon:'🔧', label:'Maintenance' },
  { href:'/admin/activity-logs', icon:'📋', label:'Activity Logs' },
  { href:'/admin/broadcast', icon:'📢', label:'Broadcast' },
  { href:'/admin/occupancy', icon:'👥', label:'Occupancy' },
  { href:'/admin/chat', icon:'💬', label:'Chat' },
];

export default function ChatPage() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>('thread3');

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="flex h-[calc(100vh-2rem)]">
        <div className="w-80 border-r border-white/10">
          <ChatSidebar
            selectedThreadId={selectedThreadId}
            onSelectThread={setSelectedThreadId}
          />
        </div>
        <div className="flex-1">
          <div className="h-full bg-gray-900">
            {selectedThreadId ? (
              <ChatThreadView threadId={selectedThreadId} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
