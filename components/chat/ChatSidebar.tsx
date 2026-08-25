'use client';
import { useState, useEffect } from 'react';
import { chatService } from '@/features/chat';

interface ChatSidebarProps {
  selectedThreadId: string | null;
  onSelectThread: (threadId: string) => void;
}

export default function ChatSidebar({ selectedThreadId, onSelectThread }: ChatSidebarProps) {
  const [threads, setThreads] = useState(chatService.getThreads('admin'));

  useEffect(() => {
    const interval = setInterval(() => {
      setThreads(chatService.getThreads('admin'));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-bold text-white">Messages</h2>
        <div className="text-xs text-gray-500">{threads.length} conversations</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {threads.map(thread => (
          <button
            key={thread.id}
            onClick={() => onSelectThread(thread.id)}
            className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-all ${
              selectedThreadId === thread.id ? 'bg-[#00C853]/10 border-l-2 border-[#00C853]' : 'border-l-2 border-transparent'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">
              {thread.participantRole === 'driver' ? '👨‍✈️' :
               thread.participantRole === 'student' ? '🎓' :
               thread.participantRole === 'parent' ? '👨‍👩‍👧' : '👤'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`font-semibold text-sm ${selectedThreadId === thread.id ? 'text-[#00C853]' : 'text-white'}`}>
                  {thread.participantName}
                </span>
                <span className="text-[10px] text-gray-500">{formatDate(thread.lastMessageTime)}</span>
              </div>
              <div className="text-xs text-gray-400 truncate">
                {thread.lastMessage}
              </div>
            </div>
            {thread.unreadCount > 0 && (
              <div className="w-5 h-5 rounded-full bg-[#00C853] text-black text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                {thread.unreadCount}
              </div>
            )}
          </button>
        ))}
        {threads.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">
            No messages yet
          </div>
        )}
      </div>
    </div>
  );
}
