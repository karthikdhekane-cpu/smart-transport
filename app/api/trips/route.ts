// Trips API - CRUD operations for trip management

import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore, adminAuth } from '@/lib/firebase-admin';
import { TripRepository } from '@/features/backend/repositories/TripRepository';

const repository = new TripRepository();

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
      const decoded = await adminAuth?.verifyIdToken(idToken);
      if (!decoded) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
    } catch (error: any) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get query params
    const url = new URL(request.url);
    const busId = url.searchParams.get('busId');
    const driverId = url.searchParams.get('driverId');

    let trips = await repository.getAll();

    // Filter by busId if provided
    if (busId) {
      trips = trips.filter(t => t.busId === busId);
    }

    // Filter by driverId if provided
    if (driverId) {
      trips = trips.filter(t => t.driverId === driverId);
    }

    // Sort by created at descending
    trips.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json(
      { trips },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get trips error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    );
  }
}

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
    
    try {
      const decoded = await adminAuth?.verifyIdToken(idToken);
      if (!decoded) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
    } catch (error: any) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { busId, driverId, routeId, status, studentCount } = body;

    // Validate required fields
    if (!busId) {
      return NextResponse.json(
        { error: 'Bus ID is required' },
        { status: 400 }
      );
    }

    if (!driverId) {
      return NextResponse.json(
        { error: 'Driver ID is required' },
        { status: 400 }
      );
    }

    if (!routeId) {
      return NextResponse.json(
        { error: 'Route ID is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['scheduled', 'active', 'completed', 'cancelled'];
    const tripStatus = status || 'scheduled';
    if (!validStatuses.includes(tripStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const trip = await repository.startTrip({
      busId,
      driverId,
      routeId,
      status: tripStatus as any,
      studentCount: studentCount || 0,
      startTime: Date.now(),
    });

    return NextResponse.json(
      { trip },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create trip error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to create trip' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
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
      const decoded = await adminAuth?.verifyIdToken(idToken);
      if (!decoded) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
    } catch (error: any) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tripId, ...updateData } = body;

    if (!tripId) {
      return NextResponse.json(
        { error: 'Trip ID is required' },
        { status: 400 }
      );
    }

    const trip = await repository.update(tripId, updateData);

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { trip },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update trip error:', error);
    
    return NextResponse.json(
      { error: 'Failed to update trip' },
      { status: 500 }
    );
  }
}
