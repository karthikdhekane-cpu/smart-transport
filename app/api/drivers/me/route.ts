// Driver API - Get current driver profile

import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore, adminAuth } from '@/lib/firebase-admin';
import { DriverRepository } from '@/features/backend/repositories/DriverRepository';

const repository = new DriverRepository();

export const dynamic = 'force-dynamic';

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
    
    let uid: string | null = null;
    try {
      const decodedToken = await adminAuth?.verifyIdToken(idToken);
      uid = decodedToken?.uid || null;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    if (!uid) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get driver record by UID
    const driver = await repository.getById(uid);
    
    if (!driver) {
      return NextResponse.json(
        { error: 'Driver profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { driver },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get driver profile error:', error);
    
    return NextResponse.json(
      { error: 'Failed to get driver profile' },
      { status: 500 }
    );
  }
}
