// Driver Assignment API
// Assign driver to bus atomically

import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebase-admin';
import { AssignmentService } from '@/features/backend/services/AssignmentService';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { driverId, busId } = body;

    // Validate input
    if (!driverId || !busId) {
      return NextResponse.json(
        { error: 'Driver ID and Bus ID are required' },
        { status: 400 }
      );
    }

    // Check if driver exists
    if (adminFirestore) {
      const driverRef = adminFirestore.collection('drivers').doc(driverId);
      const driverSnap = await driverRef.get();
      
      if (!driverSnap.exists) {
        return NextResponse.json(
          { error: 'Driver not found' },
          { status: 404 }
        );
      }
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
    const success = await assignmentService.assignDriverToBus(driverId, busId);

    if (!success) {
      return NextResponse.json(
        { error: 'Assignment failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Driver assigned to bus successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Driver assignment error:', error);
    
    return NextResponse.json(
      { error: 'Assignment failed. Please try again.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { driverId, busId } = body;

    // Validate input
    if (!driverId && !busId) {
      return NextResponse.json(
        { error: 'Driver ID or Bus ID is required' },
        { status: 400 }
      );
    }

    const assignmentService = new AssignmentService();
    let success = true;

    // Clear assignment from driver side
    if (driverId) {
      success = success && await assignmentService.clearDriverAssignment(busId || '');
    }

    // Clear assignment from bus side
    if (busId) {
      success = success && await assignmentService.clearDriverAssignment(busId);
    }

    if (!success) {
      return NextResponse.json(
        { error: 'Clear assignment failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Driver assignment cleared successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Clear driver assignment error:', error);
    
    return NextResponse.json(
      { error: 'Failed to clear assignment. Please try again.' },
      { status: 500 }
    );
  }
}
