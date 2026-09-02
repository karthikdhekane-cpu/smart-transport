// Authentication API - Logout
// Firebase Auth signOut + clear session

import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase-admin';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }
    
    const idToken = authHeader.substring(7);
    
    // Verify token before logout
    try {
      await verifyIdToken(idToken);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Note: Firebase Auth doesn't have a server-side signOut
    // The client-side token will simply expire or be cleared
    
    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { error: 'Logout failed. Please try again.' },
      { status: 500 }
    );
  }
}
