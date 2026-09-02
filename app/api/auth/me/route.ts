// Authentication API - Get current user
// Verify token and return user data

import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore, verifyIdToken } from '@/lib/firebase-admin';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }
    
    const idToken = authHeader.substring(7);
    
    // Verify Firebase ID token
    const decodedToken = await verifyIdToken(idToken);
    
    // Get user data from Firestore
    if (!adminFirestore) {
      return NextResponse.json(
        { error: 'Firebase Admin SDK not initialized' },
        { status: 500 }
      );
    }
    
    const usersRef = adminFirestore.collection('users').doc(decodedToken.uid);
    const userDoc = await usersRef.get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const userData = userDoc.data() || {};
    
    return NextResponse.json(
      {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: userData.name || '',
        phone: userData.phone || '',
        role: userData.role || 'user',
        permissions: userData.permissions || [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get current user error:', error);
    
    if (error.message === 'Invalid Firebase ID token') {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to get user data' },
      { status: 500 }
    );
  }
}
