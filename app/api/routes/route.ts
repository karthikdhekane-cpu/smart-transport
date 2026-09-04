// Route API - CRUD operations

import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore, adminAuth } from '@/lib/firebase-admin';
import { RouteRepository } from '@/features/backend/repositories/RouteRepository';

const repository = new RouteRepository();

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

    const routes = await repository.getAll();
    
    return NextResponse.json(
      { routes },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get routes error:', error);
    
    return NextResponse.json(
      { error: 'Failed to get routes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { name, color, busId } = body;

    if (!name || !color) {
      return NextResponse.json(
        { error: 'Name and color are required' },
        { status: 400 }
      );
    }

    // Default empty stops array - UI will populate
    const route = await repository.create({
      name,
      color,
      stops: [],
      busId: busId || '',
    });

    return NextResponse.json(
      { route },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create route error:', error);
    
    return NextResponse.json(
      { error: 'Failed to create route' },
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
    const { routeId } = body;

    if (!routeId) {
      return NextResponse.json(
        { error: 'Route ID is required' },
        { status: 400 }
      );
    }

    const success = await repository.delete(routeId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete route' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Route deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete route error:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete route' },
      { status: 500 }
    );
  }
}
