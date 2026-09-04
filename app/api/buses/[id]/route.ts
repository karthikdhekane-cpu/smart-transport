// Bus API - Single bus operations

import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore, adminAuth } from '@/lib/firebase-admin';
import { BusRepository } from '@/features/backend/repositories/BusRepository';

const repository = new BusRepository();

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

    const busId = params.id;
    const bus = await repository.getById(busId);
    
    if (!bus) {
      return NextResponse.json(
        { error: 'Bus not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { bus },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get bus error:', error);
    
    return NextResponse.json(
      { error: 'Failed to get bus' },
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

    const busId = params.id;
    const body = await request.json();
    const { number, capacity, status, occupancy, routeId } = body;

    const existingBus = await repository.getById(busId);
    
    if (!existingBus) {
      return NextResponse.json(
        { error: 'Bus not found' },
        { status: 404 }
      );
    }

    const bus = await repository.update(busId, {
      number: number || existingBus.number,
      capacity: capacity !== undefined ? capacity : existingBus.capacity,
      status: status !== undefined ? status : existingBus.status,
      occupancy: occupancy !== undefined ? occupancy : existingBus.occupancy,
      routeId: routeId !== undefined ? routeId : existingBus.routeId,
    });

    if (!bus) {
      return NextResponse.json(
        { error: 'Failed to update bus' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { bus },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update bus error:', error);
    
    return NextResponse.json(
      { error: 'Failed to update bus' },
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

    const busId = params.id;
    const success = await repository.delete(busId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete bus' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Bus deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete bus error:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete bus' },
      { status: 500 }
    );
  }
}
