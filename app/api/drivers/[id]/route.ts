// Driver API - Single driver operations

import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore, adminAuth } from '@/lib/firebase-admin';
import { DriverRepository } from '@/features/backend/repositories/DriverRepository';

const repository = new DriverRepository();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
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

    const driverId = params.id;
    const driver = await repository.getById(driverId);
    
    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { driver },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get driver error:', error);
    
    return NextResponse.json(
      { error: 'Failed to get driver' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
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

    const driverId = params.id;
    const body = await request.json();
    const { licenseNumber, safetyScore, busId } = body;

    const existingDriver = await repository.getById(driverId);
    
    if (!existingDriver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    const driver = await repository.update(driverId, {
      licenseNumber: licenseNumber || existingDriver.licenseNumber,
      safetyScore: safetyScore !== undefined ? safetyScore : existingDriver.safetyScore,
      busId: busId !== undefined ? busId : existingDriver.busId,
    });

    if (!driver) {
      return NextResponse.json(
        { error: 'Failed to update driver' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { driver },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update driver error:', error);
    
    return NextResponse.json(
      { error: 'Failed to update driver' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
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

    const driverId = params.id;
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
