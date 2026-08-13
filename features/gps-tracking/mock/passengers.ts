// Mock Student and Passenger Data

// Mock students assigned to buses
export interface Student {
  id: string;
  name: string;
  rollNo: string;
  busId: string;
  stopId: string;
  stopName: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  boardingTime: string;
}

export const mockStudents: Student[] = [
  { id: 'S001', name: 'Priya Sharma', rollNo: '21CS001', busId: 'BUS-01', stopId: 'stop-a2', stopName: 'Town Hall', phone: '+91 99887 76655', parentName: 'Rajesh Sharma', parentPhone: '+91 99887 76650', boardingTime: '7:05 AM' },
  { id: 'S002', name: 'Arjun Nair', rollNo: '21CS002', busId: 'BUS-01', stopId: 'stop-a1', stopName: 'Gandhipuram Bus Stand', phone: '+91 99887 76656', parentName: 'Sunil Nair', parentPhone: '+91 99887 76651', boardingTime: '7:00 AM' },
  { id: 'S003', name: 'Kavya Reddy', rollNo: '21CS003', busId: 'BUS-02', stopId: 'stop-b1', stopName: 'RS Puram', phone: '+91 99887 76657', parentName: 'Vishal Reddy', parentPhone: '+91 99887 76652', boardingTime: '6:45 AM' },
  { id: 'S004', name: 'Rahul Mehta', rollNo: '21CS004', busId: 'BUS-02', stopId: 'stop-b2', stopName: 'Race Course', phone: '+91 99887 76658', parentName: 'Sameer Mehta', parentPhone: '+91 99887 76653', boardingTime: '6:55 AM' },
  { id: 'S005', name: 'Sneha Iyer', rollNo: '21CS005', busId: 'BUS-03', stopId: 'stop-c3', stopName: 'Tiruchi Road', phone: '+91 99887 76659', parentName: 'Anand Iyer', parentPhone: '+91 99887 76654', boardingTime: '7:30 AM' },
  { id: 'S006', name: 'Vikas Gupta', rollNo: '21CS006', busId: 'BUS-04', stopId: 'stop-d2', stopName: 'Singanallur Police Station', phone: '+91 99887 76660', parentName: 'Deepak Gupta', parentPhone: '+91 99887 76655', boardingTime: '7:10 AM' },
  { id: 'S007', name: 'Ananya Patel', rollNo: '21CS007', busId: 'BUS-04', stopId: 'stop-d3', stopName: 'Six Feet Road', phone: '+91 99887 76661', parentName: 'Ravi Patel', parentPhone: '+91 99887 76656', boardingTime: '7:15 AM' },
  { id: 'S008', name: 'Rohan Kumar', rollNo: '21CS008', busId: 'BUS-01', stopId: 'stop-a3', stopName: 'Peelamedu Junction', phone: '+91 99887 76662', parentName: 'Arun Kumar', parentPhone: '+91 99887 76657', boardingTime: '7:15 AM' },
  { id: 'S009', name: 'Priyanka Menon', rollNo: '21CS009', busId: 'BUS-02', stopId: 'stop-b3', stopName: 'Coimbatore Junction', phone: '+91 99887 76663', parentName: 'Suresh Menon', parentPhone: '+91 99887 76658', boardingTime: '7:05 AM' },
  { id: 'S010', name: 'Aditya Singh', rollNo: '21CS010', busId: 'BUS-03', stopId: 'stop-c2', stopName: 'Coimbatore Medical College', phone: '+91 99887 76664', parentName: 'Rajendra Singh', parentPhone: '+91 99887 76659', boardingTime: '7:20 AM' },
  { id: 'S011', name: 'Pooja Ramaswamy', rollNo: '21CS011', busId: 'BUS-04', stopId: 'stop-d4', stopName: 'Chinnavedampatti', phone: '+91 99887 76665', parentName: 'Suresh Ramaswamy', parentPhone: '+91 99887 76660', boardingTime: '7:20 AM' },
  { id: 'S012', name: 'Manoj Verma', rollNo: '21CS012', busId: 'BUS-01', stopId: 'stop-a4', stopName: 'Avinashi Road', phone: '+91 99887 76666', parentName: 'Vijay Verma', parentPhone: '+91 99887 76661', boardingTime: '7:22 AM' },
  { id: 'S013', name: 'Divya Krishnan', rollNo: '21CS013', busId: 'BUS-02', stopId: 'stop-b4', stopName: 'Gandhipuram', phone: '+91 99887 76667', parentName: 'Ramesh Krishnan', parentPhone: '+91 99887 76662', boardingTime: '7:18 AM' },
  { id: 'S014', name: 'Siddharth Iyer', rollNo: '21CS014', busId: 'BUS-03', stopId: 'stop-c4', stopName: 'Hosur Road', phone: '+91 99887 76668', parentName: 'Prakash Iyer', parentPhone: '+91 99887 76663', boardingTime: '7:40 AM' },
  { id: 'S015', name: 'Neha Sharma', rollNo: '21CS015', busId: 'BUS-04', stopId: 'stop-d5', stopName: 'College Main Gate', phone: '+91 99887 76669', parentName: 'Amit Sharma', parentPhone: '+91 99887 76664', boardingTime: '7:28 AM' },
];

// Get students by bus ID
export const getStudentsByBus = (busId: string): Student[] => 
  mockStudents.filter(s => s.busId === busId);

// Get students by stop ID
export const getStudentsByStop = (stopId: string): Student[] => 
  mockStudents.filter(s => s.stopId === stopId);

// Student count by bus
export const getStudentCountByBus = (): Record<string, number> => {
  const counts: Record<string, number> = {};
  mockStudents.forEach(s => {
    counts[s.busId] = (counts[s.busId] || 0) + 1;
  });
  return counts;
};

// Student count by stop
export const getStudentCountByStop = (): Record<string, number> => {
  const counts: Record<string, number> = {};
  mockStudents.forEach(s => {
    counts[s.stopId] = (counts[s.stopId] || 0) + 1;
  });
  return counts;
};

// Get boarding students at a stop
export interface BoardingStudent {
  student: Student;
  boardingTime: string;
  status: 'boarding' | 'waiting' | 'boarded';
}

export const getBoardingStudents = (stopId: string): BoardingStudent[] => {
  const students = mockStudents.filter(s => s.stopId === stopId);
  return students.map(s => ({
    student: s,
    boardingTime: s.boardingTime,
    status: 'waiting',
  }));
};
