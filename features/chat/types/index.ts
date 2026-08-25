// Chat Types

export type ChatMessageType = 'text' | 'system' | 'image';
export type ChatRole = 'admin' | 'driver' | 'student' | 'parent';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: ChatRole;
  recipientId: string;
  recipientName: string;
  recipientRole: ChatRole;
  content: string;
  type: ChatMessageType;
  timestamp: number;
  read: boolean;
  attachment?: string;
}

export interface ChatThread {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: ChatRole;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
  avatar?: string;
}

export interface ChatService {
  getThread(threadId: string): ChatThread | undefined;
  getThreads(userId: string): ChatThread[];
  getMessages(threadId: string, limit?: number, offset?: number): ChatMessage[];
  sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>): ChatMessage;
  markAsRead(threadId: string): void;
  markThreadAsRead(threadId: string): void;
  getUnreadCount(userId: string): number;
}
