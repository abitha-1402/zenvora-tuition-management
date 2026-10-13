export type UserRole = 'admin' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  assignedTeacherId?: string; // If role === 'teacher', links to Teacher record
}

export type StudentStatus = 'active' | 'inactive';

export interface Student {
  id: string; // e.g., "ZNV-2026-001"
  fullName: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  email?: string;
  courseId: string;
  batchId: string;
  joiningDate: string; // YYYY-MM-DD
  monthlyFee: number; // in INR
  status: StudentStatus;
  notes?: string;
}

export interface Teacher {
  id: string; // e.g., "TCH-01"
  name: string;
  phone: string;
  email: string;
  subject: string;
  assignedBatchIds: string[];
  joiningDate: string;
  status: 'active' | 'inactive';
  bio?: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  duration: string; // e.g. "6 Months", "1 Year"
  feeAmount: number; // monthly fee
  status: 'active' | 'inactive';
}

export interface Batch {
  id: string;
  name: string;
  courseId: string;
  teacherId: string;
  days: string[]; // e.g. ["Mon", "Wed", "Fri"]
  startTime: string; // e.g. "16:00"
  endTime: string; // e.g. "17:30"
  capacity: number;
  status: 'active' | 'inactive';
  room?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type AttendanceMethod = 'qr_scan' | 'manual';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  batchId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  status: AttendanceStatus;
  method: AttendanceMethod;
  recordedBy?: string;
  remarks?: string;
}

export type PaymentMethod = 'Cash' | 'UPI' | 'Bank Transfer' | 'Demo Payment';
export type PaymentStatus = 'paid' | 'partial' | 'pending';

export interface FeePayment {
  id: string;
  receiptNumber: string; // e.g. "REC-2026-081"
  studentId: string;
  amount: number;
  paymentDate: string; // YYYY-MM-DD
  method: PaymentMethod;
  status: PaymentStatus;
  notes?: string;
  monthCovered?: string; // e.g. "October 2026"
  recordedBy?: string;
}

export interface TimetableSchedule {
  id: string;
  courseId: string;
  batchId: string;
  teacherId: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // "16:00"
  endTime: string;   // "17:30"
  room: string;
  isCancelled?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  targetBatchId: string; // 'all' or specific batchId
  priority: 'normal' | 'important' | 'urgent';
  date: string; // YYYY-MM-DD
  author: string;
}
