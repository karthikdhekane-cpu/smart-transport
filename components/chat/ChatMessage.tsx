'use client';
import { useState, useEffect, useRef } from 'react';
import { chatService } from '@/features/chat';

interface ChatMessageProps {
  message: import('@/features/chat').ChatMessage;
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isMe = message.senderRole === 'admin';
  
  return (
    <div className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isMe ? 'bg-[#00C853]/20 text-white rounded-br-none' : 'bg-white/10 text-white rounded-bl-none'
        }`}
      >
        <div className="text-xs text-gray-400 mb-1 flex justify-between">
          <span>{message.senderName}</span>
          <span>{formatTime(message.timestamp)}</span>
        </div>
        <div className="text-sm">{message.content}</div>
      </div>
    </div>
  );
}
