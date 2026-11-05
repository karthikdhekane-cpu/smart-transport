// Attendance API - Get attendance records for authenticated driver's active trip

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminFirestore } from '@/lib/firebase-admin';
import { TripRepository } from '@/features/backend/repositories/TripRepository';

const tripRepository = new TripRepository();

export const dynamic = 'force-dynamic';

// Helper function to get attendance records from Firestore
async function getAttendanceByTrip(tripId: string) {
  if (!adminFirestore) {
    return [];
  }
  
  try {
    const snapshot = await adminFirestore.collection('attendance')
      .where('tripId', '==', tripId)
      .get();
    
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  } catch (error) {
    console.error('Error getting attendance by trip:', error);
    return [];
  }
}

// Helper function to get attendance by scanId
async function getAttendanceByScanId(scanId: string) {
  if (!adminFirestore) {
    return null;
  }
  
  try {
    const snapshot = await adminFirestore.collection('attendance')
      .where('scanId', '==', scanId)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return {
      ...doc.data(),
      id: doc.id,
    };
  } catch (error) {
    console.error('Error getting attendance by scanId:', error);
    return null;
  }
}

// Helper function to create attendance record
async function createAttendanceRecord(data: any) {
  if (!adminFirestore) {
    throw new Error('Firebase Admin SDK not initialized');
  }
  
  const id = adminFirestore.collection('attendance').doc().id;
  const now = Date.now();
  
  await adminFirestore.collection('attendance').doc(id).set({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  
  return {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };
}

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
    const driverResponse = await fetch('/api/drivers/me', {
      headers: { 'Authorization': `Bearer ${idToken}` },
    });
    
    if (!driverResponse.ok) {
      return NextResponse.json(
        { error: 'Driver profile not found' },
        { status: 404 }
      );
    }
    
    const driverData = await driverResponse.json();
    const driver = driverData.driver;
    
    // Get active trip for this driver's bus
    if (!driver?.busId) {
      return NextResponse.json(
        { error: 'Driver not assigned to a bus' },
        { status: 400 }
      );
    }
    
    const activeTrip = await tripRepository.getActiveForBus(driver.busId);
    
    if (!activeTrip) {
      return NextResponse.json(
        { 
          error: 'No active trip for this driver',
          hasActiveTrip: false,
          attendance: []
        },
        { status: 200 }
      );
    }

    // Get attendance records for this trip
    const attendanceRecords = await getAttendanceByTrip(activeTrip.id);
    
    return NextResponse.json(
      { 
        hasActiveTrip: true,
        trip: activeTrip,
        attendance: attendanceRecords,
        driver,
        busId: driver.busId
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get attendance error:', error);
    
    return NextResponse.json(
      { error: 'Failed to get attendance records' },
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
    const driverResponse = await fetch('/api/drivers/me', {
      headers: { 'Authorization': `Bearer ${idToken}` },
    });
    
    if (!driverResponse.ok) {
      return NextResponse.json(
        { error: 'Driver profile not found' },
        { status: 404 }
      );
    }
    
    const driverData = await driverResponse.json();
    const driver = driverData.driver;
    
    // Get request body
    const body = await request.json();
    const { studentId, status, method, stopId, stopName, scanId } = body;

    if (!studentId || !status || !method || !scanId) {
      return NextResponse.json(
        { error: 'Missing required fields: studentId, status, method, scanId' },
        { status: 400 }
      );
    }

    // Validate method
    const validMethods = ['qr', 'rfid', 'manual'];
    if (!validMethods.includes(method)) {
      return NextResponse.json(
        { error: 'Invalid method. Must be one of: qr, rfid, manual' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['picked_up', 'dropped_off'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: picked_up, dropped_off' },
        { status: 400 }
      );
    }

    // Get active trip for this driver's bus
    if (!driver?.busId) {
      return NextResponse.json(
        { error: 'Driver not assigned to a bus' },
        { status: 400 }
      );
    }
    
    const activeTrip = await tripRepository.getActiveForBus(driver.busId);
    
    if (!activeTrip) {
      return NextResponse.json(
        { error: 'No active trip for this driver' },
        { status: 400 }
      );
    }

    // Check for duplicate scanId
    const existingRecord = await getAttendanceByScanId(scanId);
    if (existingRecord) {
      return NextResponse.json(
        { error: 'Attendance already recorded for this scan' },
        { status: 409 }
      );
    }

    // Get student data
    const studentResponse = await fetch(`/api/students/${studentId}`, {
      headers: { 'Authorization': `Bearer ${idToken}` },
    });
    
    if (!studentResponse.ok) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    const studentData = await studentResponse.json();
    const student = studentData.student;
    
    // Verify student belongs to this bus
    if (student.busId !== driver.busId) {
      return NextResponse.json(
        { error: 'Student does not belong to this bus' },
        { status: 403 }
      );
    }

    // Create attendance record
    const attendanceRecord = await createAttendanceRecord({
      studentId,
      busId: driver.busId,
      tripId: activeTrip.id,
      driverId: driver.userId || driver.id,
      routeId: activeTrip.routeId,
      status,
      scannedBy: method,
      scanId,
      stopId,
      stopName,
      timestamp: Date.now(),
    });

    return NextResponse.json(
      { 
        success: true,
        attendance: attendanceRecord,
        trip: activeTrip
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create attendance error:', error);
    
    return NextResponse.json(
      { error: 'Failed to create attendance record' },
      { status: 500 }
    );
  }
}
