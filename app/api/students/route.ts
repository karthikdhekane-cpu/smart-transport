// Student API - CRUD operations

import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore, adminAuth } from '@/lib/firebase-admin';
import { StudentRepository } from '@/features/backend/repositories/StudentRepository';

const repository = new StudentRepository();

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

    const students = await repository.getAll();
    
    return NextResponse.json(
      { students },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get students error:', error);
    
    return NextResponse.json(
      { error: 'Failed to get students' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { rollNo, busId, userId, name } = body;

    if (!rollNo) {
      return NextResponse.json(
        { error: 'Roll number is required' },
        { status: 400 }
      );
    }

    const student = await repository.create({
      userId: userId || 'default-user',
      name: name || 'Unknown Student',
      rollNo,
      busId: busId || '',
    });

    return NextResponse.json(
      { student },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create student error:', error);
    
    return NextResponse.json(
      { error: 'Failed to create student' },
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
    const { studentId } = body;

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    const success = await repository.delete(studentId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete student' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Student deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete student error:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}
