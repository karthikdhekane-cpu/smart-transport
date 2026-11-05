// Attendance API Client - Direct calls to /api/attendance

export async function getAttendanceRecords(): Promise<any[]> {
  try {
    const idToken = await getIdToken();
    const response = await fetch('/api/attendance', {
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.attendance || [];
    }
    
    // If no active trip, return empty array
    if (response.status === 200) {
      const data = await response.json();
      if (data.hasActiveTrip === false) {
        return [];
      }
    }
    
    console.error('Failed to get attendance records:', response.statusText);
    return [];
  } catch (error: any) {
    console.error('Error fetching attendance records:', error);
    return [];
  }
}

export async function createAttendanceRecord(data: {
  studentId: string;
  status: 'picked_up' | 'dropped_off';
  method: 'qr' | 'rfid' | 'manual';
  scanId: string;
  stopId?: string;
  stopName?: string;
}): Promise<any> {
  try {
    const idToken = await getIdToken();
    const response = await fetch('/api/attendance', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (response.ok) {
      const result = await response.json();
      return { success: true, attendance: result.attendance };
    }
    
    const errorData = await response.json().catch(() => ({}));
    return { success: false, error: errorData.error || 'Failed to create attendance record' };
  } catch (error: any) {
    console.error('Error creating attendance record:', error);
    return { success: false, error: error.message || 'Failed to create attendance record' };
  }
}

// Helper to get ID token from localStorage (set during login)
async function getIdToken(): Promise<string> {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('idToken') || '';
}
