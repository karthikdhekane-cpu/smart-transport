// Route API - Single route operations

import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore, adminAuth } from '@/lib/firebase-admin';
import { RouteRepository } from '@/features/backend/repositories/RouteRepository';

const repository = new RouteRepository();

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

    const routeId = params.id;
    const route = await repository.getById(routeId);
    
    if (!route) {
      return NextResponse.json(
        { error: 'Route not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { route },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get route error:', error);
    
    return NextResponse.json(
      { error: 'Failed to get route' },
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

    const routeId = params.id;
    const body = await request.json();
    const { name, color, busId } = body;

    const existingRoute = await repository.getById(routeId);
    
    if (!existingRoute) {
      return NextResponse.json(
        { error: 'Route not found' },
        { status: 404 }
      );
    }

    const route = await repository.update(routeId, {
      name: name || existingRoute.name,
      color: color || existingRoute.color,
      busId: busId !== undefined ? busId : existingRoute.busId,
    });

    if (!route) {
      return NextResponse.json(
        { error: 'Failed to update route' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { route },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update route error:', error);
    
    return NextResponse.json(
      { error: 'Failed to update route' },
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

    const routeId = params.id;
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
