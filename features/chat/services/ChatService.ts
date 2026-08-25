// Chat Service - Handles messaging between drivers, students, and admins
// Uses in-memory storage with mock data for demo purposes

import type { 
  ChatMessage, 
  ChatService, 
  ChatThread, 
  ChatRole,
  ChatMessageType 
} from '../types';

// Mock initial messages
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg1',
    senderId: 'D001',
    senderName: 'Rajesh Kumar',
    senderRole: 'driver',
    recipientId: 'S001',
    recipientName: 'Priya Sharma',
    recipientRole: 'student',
    content: 'Hi Priya, I will be picking you up at 7:30 AM.',
    type: 'text',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    read: true,
  },
  {
    id: 'msg2',
    senderId: 'S001',
    senderName: 'Priya Sharma',
    senderRole: 'student',
    recipientId: 'D001',
    recipientName: 'Rajesh Kumar',
    recipientRole: 'driver',
    content: 'Thank you sir! I will be ready.',
    type: 'text',
    timestamp: Date.now() - 1 * 60 * 60 * 1000,
    read: true,
  },
  {
    id: 'msg3',
    senderId: 'D001',
    senderName: 'Rajesh Kumar',
    senderRole: 'driver',
    recipientId: 'S002',
    recipientName: 'Arjun Nair',
    recipientRole: 'student',
    content: 'Your bus is running a bit late today due to traffic.',
    type: 'text',
    timestamp: Date.now() - 30 * 60 * 1000,
    read: false,
  },
  {
    id: 'msg4',
    senderId: 'A001',
    senderName: 'Admin User',
    senderRole: 'admin',
    recipientId: 'D001',
    recipientName: 'Rajesh Kumar',
    recipientRole: 'admin',
    content: 'Please check the maintenance schedule for BUS-01.',
    type: 'text',
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
    read: true,
  },
];

// Mock threads (chat conversations)
const INITIAL_THREADS: ChatThread[] = [
  {
    id: 'thread1',
    participantId: 'D001',
    participantName: 'Rajesh Kumar',
    participantRole: 'driver',
    lastMessage: 'Please check the maintenance schedule for BUS-01.',
    lastMessageTime: Date.now() - 4 * 60 * 60 * 1000,
    unreadCount: 0,
  },
  {
    id: 'thread2',
    participantId: 'S001',
    participantName: 'Priya Sharma',
    participantRole: 'student',
    lastMessage: 'Thank you sir! I will be ready.',
    lastMessageTime: Date.now() - 1 * 60 * 60 * 1000,
    unreadCount: 0,
  },
  {
    id: 'thread3',
    participantId: 'S002',
    participantName: 'Arjun Nair',
    participantRole: 'student',
    lastMessage: 'Your bus is running a bit late today due to traffic.',
    lastMessageTime: Date.now() - 30 * 60 * 1000,
    unreadCount: 1,
  },
];

// In-memory storage
let messages: ChatMessage[] = [...INITIAL_MESSAGES];
let threads: ChatThread[] = [...INITIAL_THREADS];

class ChatServiceImpl implements ChatService {
  getThread(threadId: string): ChatThread | undefined {
    return threads.find(t => t.id === threadId);
  }

  getThreads(userId: string): ChatThread[] {
    return [...threads]
      .sort((a, b) => b.lastMessageTime - a.lastMessageTime)
      .map(thread => ({
        ...thread,
        unreadCount: thread.id === 'thread3' ? 1 : 0, // Mock unread count
      }));
  }

  getMessages(threadId: string, limit: number = 50, offset: number = 0): ChatMessage[] {
    // In a real app, this would filter by thread
    return [...messages]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(offset, offset + limit);
  }

  sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>): ChatMessage {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
    };
    messages.push(newMessage);
    
    // Update thread
    const threadIndex = threads.findIndex(t => 
      (t.participantId === message.recipientId && t.participantRole === message.recipientRole) ||
      (t.participantId === message.senderId && t.participantRole === message.senderRole)
    );
    
    if (threadIndex === -1) {
      const newThread: ChatThread = {
        id: `thread${Date.now()}`,
        participantId: message.recipientId,
        participantName: message.recipientName,
        participantRole: message.recipientRole,
        lastMessage: message.content,
        lastMessageTime: Date.now(),
        unreadCount: 1,
      };
      threads.unshift(newThread);
    } else {
      threads[threadIndex] = {
        ...threads[threadIndex],
        lastMessage: message.content,
        lastMessageTime: Date.now(),
      };
    }
    
    return newMessage;
  }

  markAsRead(threadId: string): void {
    const thread = this.getThread(threadId);
    if (!thread) return;
    
    // In a real app, mark messages as read
    // For now, just update the thread
    const index = threads.findIndex(t => t.id === threadId);
    if (index !== -1) {
      threads[index] = {
        ...threads[index],
        unreadCount: 0,
      };
    }
  }

  markThreadAsRead(threadId: string): void {
    this.markAsRead(threadId);
  }

  getUnreadCount(userId: string): number {
    // In a real app, count unread messages for the user
    return threads.reduce((acc, t) => acc + t.unreadCount, 0);
  }
}

// Export singleton instance
let chatServiceInstance: ChatService | null = null;

export const chatService = (() => {
  if (!chatServiceInstance) {
    chatServiceInstance = new ChatServiceImpl();
  }
  return chatServiceInstance;
})();
