// API Client with Firebase ID token authentication

import { auth } from './firebase';
import { getAuth, getIdToken } from 'firebase/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const authInstance = getAuth();
  let token: string | null = null;

  try {
    const user = authInstance.currentUser;
    if (user) {
      token = await getIdToken(user);
    }
  } catch (error) {
    console.error('Failed to get ID token:', error);
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API error: ${response.status}`);
  }

  return data;
}

// Student APIs
export const studentApi = {
  getAll: () => apiRequest<{ students: any[] }>('/api/students', { method: 'GET' }),
  create: (data: any) => apiRequest<{ student: any }>('/api/students', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest<{ student: any }>(`/api/students/${id}`, { method: 'PUT', body: data }),
  delete: (studentId: string) => apiRequest<{ message: string }>(`/api/students`, { method: 'DELETE', body: { studentId } }),
};

// Driver APIs
export const driverApi = {
  getAll: () => apiRequest<{ drivers: any[] }>('/api/drivers', { method: 'GET' }),
  getMe: () => apiRequest<{ driver: any }>('/api/drivers/me', { method: 'GET' }),
  create: (data: any) => apiRequest<{ driver: any }>('/api/drivers', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest<{ driver: any }>(`/api/drivers/${id}`, { method: 'PUT', body: data }),
  delete: (driverId: string) => apiRequest<{ message: string }>(`/api/drivers`, { method: 'DELETE', body: { driverId } }),
};

// Bus APIs
export const busApi = {
  getAll: () => apiRequest<{ buses: any[] }>('/api/buses', { method: 'GET' }),
  getById: (busId: string) => apiRequest<{ bus: any }>(`/api/buses/${busId}`, { method: 'GET' }),
  create: (data: any) => apiRequest<{ bus: any }>('/api/buses', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest<{ bus: any }>(`/api/buses/${id}`, { method: 'PUT', body: data }),
  delete: (busId: string) => apiRequest<{ message: string }>(`/api/buses`, { method: 'DELETE', body: { busId } }),
};

// Route APIs
export const routeApi = {
  getAll: () => apiRequest<{ routes: any[] }>('/api/routes', { method: 'GET' }),
  getById: (routeId: string) => apiRequest<{ route: any }>(`/api/routes/${routeId}`, { method: 'GET' }),
  create: (data: any) => apiRequest<{ route: any }>('/api/routes', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest<{ route: any }>(`/api/routes/${id}`, { method: 'PUT', body: data }),
  delete: (routeId: string) => apiRequest<{ message: string }>(`/api/routes`, { method: 'DELETE', body: { routeId } }),
};

// Assignment APIs
export const assignmentApi = {
  assignBus: (data: { busId: string; driverId?: string; routeId?: string }) => 
    apiRequest<{ message: string }>('/api/assignments/bus', { method: 'POST', body: data }),
  clearBusAssignments: (data: { busId: string; driverId?: string; routeId?: string }) => 
    apiRequest<{ message: string }>('/api/assignments/bus', { method: 'DELETE', body: data }),
  assignDriver: (data: { driverId: string; busId: string }) => 
    apiRequest<{ message: string }>('/api/assignments/driver', { method: 'POST', body: data }),
  clearDriverAssignment: (data: { driverId?: string; busId: string }) => 
    apiRequest<{ message: string }>('/api/assignments/driver', { method: 'DELETE', body: data }),
};

// Trip APIs
export const tripApi = {
  getAll: (busId?: string, driverId?: string) => 
    apiRequest<{ trips: any[] }>(busId || driverId ? `/api/trips?busId=${busId || ''}&driverId=${driverId || ''}` : '/api/trips', { method: 'GET' }),
  getById: (tripId: string) => apiRequest<{ trip: any }>(`/api/trips/${tripId}`, { method: 'GET' }),
  create: (data: any) => apiRequest<{ trip: any }>('/api/trips', { method: 'POST', body: data }),
  update: (tripId: string, data: any) => apiRequest<{ trip: any }>(`/api/trips/${tripId}`, { method: 'PUT', body: data }),
  delete: (tripId: string) => apiRequest<{ message: string }>(`/api/trips/${tripId}`, { method: 'DELETE' }),
};
