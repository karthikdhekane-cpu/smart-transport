// Bus API - CRUD operations

import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore, adminAuth } from '@/lib/firebase-admin';
import { BusRepository } from '@/features/backend/repositories/BusRepository';

const repository = new BusRepository();

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

    const buses = await repository.getAll();
    
    return NextResponse.json(
      { buses },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get buses error:', error);
    
    return NextResponse.json(
      { error: 'Failed to get buses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { number, capacity, status, occupancy, routeId } = body;

    if (!number || !capacity) {
      return NextResponse.json(
        { error: 'Number and capacity are required' },
        { status: 400 }
      );
    }

    const bus = await repository.create({
      number,
      capacity,
      status: status || 'idle',
      occupancy: occupancy || 0,
      routeId: routeId || '',
    });

    return NextResponse.json(
      { bus },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create bus error:', error);
    
    return NextResponse.json(
      { error: 'Failed to create bus' },
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
    const { busId } = body;

    if (!busId) {
      return NextResponse.json(
        { error: 'Bus ID is required' },
        { status: 400 }
      );
    }

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
