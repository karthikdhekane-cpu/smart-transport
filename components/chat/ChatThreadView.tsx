'use client';
import { useState, useEffect } from 'react';
import { chatService } from '@/features/chat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface ChatThreadViewProps {
  threadId: string;
}

export default function ChatThreadView({ threadId }: ChatThreadViewProps) {
  const [messages, setMessages] = useState<import('@/features/chat').ChatMessage[]>([]);
  const [thread, setThread] = useState<import('@/features/chat').ChatThread | undefined>(undefined);

  useEffect(() => {
    const threadData = chatService.getThread(threadId);
    if (threadData) {
      setThread(threadData);
      chatService.markAsRead(threadId);
    }
    
    const interval = setInterval(() => {
      setMessages(chatService.getMessages(threadId, 50, 0));
    }, 30000);
    
    return () => clearInterval(interval);
  }, [threadId]);

  const handleSendMessage = (content: string) => {
    if (!thread) return;
    
    const newMessage = chatService.sendMessage({
      senderId: 'A001',
      senderName: 'Admin User',
      senderRole: 'admin' as const,
      recipientId: thread.participantId,
      recipientName: thread.participantName,
      recipientRole: thread.participantRole,
      content,
      type: 'text',
    });
    
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white">{thread?.participantName}</h3>
          <div className="text-xs text-gray-400 capitalize">{thread?.participantRole}</div>
        </div>
        <div className="text-xs text-gray-500">
          {thread?.unreadCount && thread.unreadCount > 0 ? `${thread.unreadCount} unread` : 'All read'}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-8">
            Start a conversation
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
