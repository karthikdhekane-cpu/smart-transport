'use client';
import { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 glass rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none text-sm"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="bg-[#00C853] hover:bg-[#009624] disabled:opacity-50 disabled:cursor-not-allowed text-black px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
        >
          Send
        </button>
      </div>
    </form>
  );
}
