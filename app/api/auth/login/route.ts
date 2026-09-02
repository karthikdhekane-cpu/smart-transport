// Authentication API - Login
// Browser → Firebase Client SDK signInWithEmailAndPassword()
// → Firebase ID token → Next.js API → Firebase Admin verifyIdToken()
// → RBAC → Response

import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebase-admin';

// Rate limiting state (in-memory, reset on server restart)
const loginAttempts: Map<string, { count: number; lastAttempt: number }> = new Map();
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  
  if (!record) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Reset if window expired
  if (now - record.lastAttempt > RATE_LIMIT_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Check if rate limit exceeded
  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }
  
  record.count += 1;
  return true;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
  
  // Rate limiting
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429 }
    );
  }
  
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // For Phase 1, we'll implement a simple mock login
    // In production, you would verify the ID token from the client
    
    // Simulate user lookup
    const mockUser = {
      uid: `user-${Date.now()}`,
      email,
      displayName: email.split('@')[0],
    };
    
    // Get user data from Firestore
    if (adminFirestore) {
      const usersRef = adminFirestore.collection('users').doc(mockUser.uid);
      const userDoc = await usersRef.get();
      
      if (!userDoc.exists) {
        // Create user record in Firestore if it doesn't exist
        await usersRef.set({
          email: mockUser.email,
          name: mockUser.displayName,
          phone: '',
          role: 'user',
          createdAt: new Date().toISOString(),
        });
      }
    }
    
    // Return mock token for Phase 1 testing
    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          uid: mockUser.uid,
          email: mockUser.email,
          name: mockUser.displayName,
          role: 'user',
        },
        token: 'mock-firebase-id-token',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
