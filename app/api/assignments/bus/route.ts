// Bus Assignment API
// Assign driver and route to bus atomically

import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebase-admin';
import { AssignmentService } from '@/features/backend/services/AssignmentService';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { busId, driverId, routeId } = body;

    // Validate input
    if (!busId) {
      return NextResponse.json(
        { error: 'Bus ID is required' },
        { status: 400 }
      );
    }

    // Check if bus exists
    if (adminFirestore) {
      const busRef = adminFirestore.collection('buses').doc(busId);
      const busSnap = await busRef.get();
      
      if (!busSnap.exists) {
        return NextResponse.json(
          { error: 'Bus not found' },
          { status: 404 }
        );
      }
    }

    const assignmentService = new AssignmentService();
    let success = true;

    // Assign driver if provided
    if (driverId) {
      success = success && await assignmentService.assignDriverToBus(driverId, busId);
    }

    // Assign route if provided
    if (routeId) {
      success = success && await assignmentService.assignBusToRoute(busId, routeId);
    }

    if (!success) {
      return NextResponse.json(
        { error: 'Assignment failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Assignment successful' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Bus assignment error:', error);
    
    return NextResponse.json(
      { error: 'Assignment failed. Please try again.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { busId, driverId, routeId } = body;

    // Validate input
    if (!busId) {
      return NextResponse.json(
        { error: 'Bus ID is required' },
        { status: 400 }
      );
    }

    const assignmentService = new AssignmentService();
    let success = true;

    // Clear driver assignment if requested
    if (driverId) {
      success = success && await assignmentService.clearDriverAssignment(busId);
    }

    // Clear route assignment if requested
    if (routeId) {
      success = success && await assignmentService.clearBusAssignment(busId);
    }

    if (!success) {
      return NextResponse.json(
        { error: 'Clear assignment failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Assignment cleared successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Clear assignment error:', error);
    
    return NextResponse.json(
      { error: 'Failed to clear assignment. Please try again.' },
      { status: 500 }
    );
  }
}
