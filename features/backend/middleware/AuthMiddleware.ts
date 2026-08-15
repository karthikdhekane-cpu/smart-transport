// Auth Middleware - Provides role-based access control

import { UserRole } from '../types';

// Extension for NextRequest
declare global {
  interface NextRequest {
    user?: {
      id: string;
      email: string;
      role: UserRole;
      name: string;
    };
  }
}

export function authMiddleware(request: Request): Response | null {
  const userStr = request.headers.get('x-campbus-user');
  if (!userStr) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const user = JSON.parse(userStr);
  return null;
}

export function requireRole(requiredRole: UserRole) {
  return function (request: Request): Response | null {
    const userStr = request.headers.get('x-campbus-user');
    if (!userStr) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const user = JSON.parse(userStr);
    if (user.role !== requiredRole) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return null;
  };
}

export function requireAnyRole(allowedRoles: UserRole[]) {
  return function (request: Request): Response | null {
    const userStr = request.headers.get('x-campbus-user');
    if (!userStr) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const user = JSON.parse(userStr);
    if (!allowedRoles.includes(user.role)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return null;
  };
}
