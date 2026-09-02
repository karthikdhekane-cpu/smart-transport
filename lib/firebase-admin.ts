// Firebase Admin SDK - Server-side only
// NEVER expose this to the browser

import * as admin from 'firebase-admin';

// Get Firebase Admin SDK service account from environment variable
const serviceAccountString = process.env.FIREBASE_ADMIN_SDK_JSON;

// Initialize Firebase Admin SDK (singleton pattern)
let appInitialized = false;

if (!admin.apps.length) {
  if (!serviceAccountString) {
    console.warn('FIREBASE_ADMIN_SDK_JSON not set. Firebase Admin SDK will not be initialized.');
  } else {
    try {
      const serviceAccount = JSON.parse(serviceAccountString);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      appInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Firebase Admin SDK:', error);
    }
  }
}

// Helper to get Firestore instance
function getAdminFirestore() {
  if (!appInitialized) {
    console.warn('Firebase Admin SDK not initialized');
    return null;
  }
  return admin.firestore();
}

// Helper to get Auth instance
function getAdminAuth() {
  if (!appInitialized) {
    console.warn('Firebase Admin SDK not initialized');
    return null;
  }
  return admin.auth();
}

// Export Firestore instance
export const adminFirestore = getAdminFirestore();

// Export auth instance for user management
export const adminAuth = getAdminAuth();

// Helper function to verify Firebase ID token
export async function verifyIdToken(idToken: string): Promise<any> {
  try {
    const auth = getAdminAuth();
    if (!auth) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    return await auth.verifyIdToken(idToken);
  } catch (error) {
    throw new Error('Invalid Firebase ID token');
  }
}

// Helper function to get user by UID
export async function getUserByUid(uid: string): Promise<any | null> {
  try {
    const auth = getAdminAuth();
    if (!auth) {
      return null;
    }
    return await auth.getUser(uid);
  } catch (error) {
    return null;
  }
}

// Helper function to get user by email
export async function getUserByEmail(email: string): Promise<any | null> {
  try {
    const auth = getAdminAuth();
    if (!auth) {
      return null;
    }
    return await auth.getUserByEmail(email);
  } catch (error) {
    return null;
  }
}

// Helper function to create user with email and password
export async function createUser(email: string, password: string, customClaims?: Record<string, unknown>): Promise<any> {
  try {
    const auth = getAdminAuth();
    if (!auth) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    
    const userRecord = await auth.createUser({
      email,
      password,
    });
    
    if (customClaims) {
      await auth.setCustomUserClaims(userRecord.uid, customClaims);
    }
    
    return userRecord;
  } catch (error) {
    throw new Error('Failed to create user');
  }
}

// Helper function to set custom claims for role-based access
export async function setUserRole(uid: string, role: 'admin' | 'driver' | 'student' | 'parent'): Promise<void> {
  try {
    const auth = getAdminAuth();
    if (!auth) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    await auth.setCustomUserClaims(uid, { role });
  } catch (error) {
    throw new Error('Failed to set user role');
  }
}
