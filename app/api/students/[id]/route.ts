// Student API - Single student operations

import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore, adminAuth } from '@/lib/firebase-admin';
import { StudentRepository } from '@/features/backend/repositories/StudentRepository';

const repository = new StudentRepository();

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

    const studentId = params.id;
    const student = await repository.getById(studentId);
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { student },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get student error:', error);
    
    return NextResponse.json(
      { error: 'Failed to get student' },
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

    const studentId = params.id;
    const body = await request.json();
    const { rollNo, busId } = body;

    const existingStudent = await repository.getById(studentId);
    
    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const student = await repository.update(studentId, {
      rollNo: rollNo || existingStudent.rollNo,
      busId: busId !== undefined ? busId : existingStudent.busId,
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Failed to update student' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { student },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update student error:', error);
    
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    );
  }
}
