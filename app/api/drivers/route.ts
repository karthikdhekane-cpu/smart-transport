// Driver API - CRUD operations

import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore, adminAuth } from '@/lib/firebase-admin';
import { DriverRepository } from '@/features/backend/repositories/DriverRepository';

const repository = new DriverRepository();

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
    
    try {
      await adminAuth?.verifyIdToken(idToken);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const drivers = await repository.getAll();
    
    return NextResponse.json(
      { drivers },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get drivers error:', error);
    
    return NextResponse.json(
      { error: 'Failed to get drivers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { licenseNumber, safetyScore, userId, totalTrips } = body;

    if (!licenseNumber) {
      return NextResponse.json(
        { error: 'License number is required' },
        { status: 400 }
      );
    }

    const driver = await repository.create({
      userId: userId || 'default-user',
      licenseNumber,
      safetyScore: safetyScore || 0,
      totalTrips: totalTrips || 0,
    });

    return NextResponse.json(
      { driver },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create driver error:', error);
    
    return NextResponse.json(
      { error: 'Failed to create driver' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }

    const idToken = authHeader.substring(7);
    
    try {
      await adminAuth?.verifyIdToken(idToken);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { driverId } = body;

    if (!driverId) {
      return NextResponse.json(
        { error: 'Driver ID is required' },
        { status: 400 }
      );
    }

    const success = await repository.delete(driverId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete driver' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Driver deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete driver error:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete driver' },
      { status: 500 }
    );
  }
}
