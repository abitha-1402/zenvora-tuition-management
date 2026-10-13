import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Teacher,
  Course,
  Batch,
  AttendanceRecord,
  FeePayment,
  TimetableSchedule,
  Announcement,
  AttendanceStatus,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_COURSES,
  INITIAL_BATCHES,
  INITIAL_ATTENDANCE,
  INITIAL_FEES,
  INITIAL_TIMETABLE,
  INITIAL_ANNOUNCEMENTS,
  getTodayDateString,
} from '../utils/demoData';
import { loadFromStorage, saveToStorage, STORAGE_KEYS, clearAllZenvoraStorage } from '../utils/storage';

interface AttendanceResult {
  success: boolean;
  message: string;
  isDuplicate?: boolean;
  record?: AttendanceRecord;
}

interface DataContextType {
  // Collections
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  batches: Batch[];
  attendance: AttendanceRecord[];
  fees: FeePayment[];
  timetable: TimetableSchedule[];
  announcements: Announcement[];

  // Student Actions
  addStudent: (student: Omit<Student, 'id'>) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudent: (id: string) => Student | undefined;

  // Teacher Actions
  addTeacher: (teacher: Omit<Teacher, 'id'>) => Teacher;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  // Course & Batch Actions
  addCourse: (course: Omit<Course, 'id'>) => Course;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  addBatch: (batch: Omit<Batch, 'id'>) => Batch;
  updateBatch: (id: string, updates: Partial<Batch>) => void;

  // Attendance Actions
  recordAttendance: (record: Omit<AttendanceRecord, 'id' | 'time'> & { time?: string }) => AttendanceResult;
  bulkUpdateAttendance: (records: { studentId: string; batchId: string; date: string; status: AttendanceStatus }[]) => void;
  
  // Fee Actions
  recordFeePayment: (payment: Omit<FeePayment, 'id' | 'receiptNumber'>) => FeePayment;
  
  // Timetable & Announcements
  addTimetableSchedule: (schedule: Omit<TimetableSchedule, 'id'>) => TimetableSchedule;
  updateTimetableSchedule: (id: string, updates: Partial<TimetableSchedule>) => void;
  deleteTimetableSchedule: (id: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => Announcement;
  deleteAnnouncement: (id: string) => void;

  // Calculators & Helpers
  getStudentPendingBalance: (studentId: string) => { totalPayable: number; totalPaid: number; pending: number };
  getStudentAttendanceStats: (studentId: string) => { total: number; present: number; absent: number; late: number; rate: number };
  getBatchStudentCount: (batchId: string) => number;
  getTodayStats: () => { presentCount: number; totalStudents: number; attendanceRate: number };
  getFinancialSummary: () => { totalCollected: number; thisMonthCollected: number; totalPending: number };
  
  // Reset
  resetDemoData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage with demo fallbacks
  const [students, setStudents] = useState<Student[]>(() =>
    loadFromStorage(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS)
  );
  const [teachers, setTeachers] = useState<Teacher[]>(() =>
    loadFromStorage(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS)
  );
  const [courses, setCourses] = useState<Course[]>(() =>
    loadFromStorage(STORAGE_KEYS.COURSES, INITIAL_COURSES)
  );
  const [batches, setBatches] = useState<Batch[]>(() =>
    loadFromStorage(STORAGE_KEYS.BATCHES, INITIAL_BATCHES)
  );
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() =>
    loadFromStorage(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE)
  );
  const [fees, setFees] = useState<FeePayment[]>(() =>
    loadFromStorage(STORAGE_KEYS.FEES, INITIAL_FEES)
  );
  const [timetable, setTimetable] = useState<TimetableSchedule[]>(() =>
    loadFromStorage(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE)
  );
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    loadFromStorage(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS)
  );

  // Sync back to localStorage
  useEffect(() => { saveToStorage(STORAGE_KEYS.STUDENTS, students); }, [students]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.TEACHERS, teachers); }, [teachers]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.COURSES, courses); }, [courses]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.BATCHES, batches); }, [batches]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.ATTENDANCE, attendance); }, [attendance]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.FEES, fees); }, [fees]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.TIMETABLE, timetable); }, [timetable]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements); }, [announcements]);

  // STUDENT OPERATIONS
  const addStudent = (studentData: Omit<Student, 'id'>): Student => {
    // Generate next student ID: ZNV-2026-XXX
    const nextNum = students.length + 1;
    const padded = String(nextNum).padStart(3, '0');
    const newStudent: Student = {
      ...studentData,
      id: `ZNV-2026-${padded}`
    };
    setStudents(prev => [newStudent, ...prev]);
    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const getStudent = (id: string): Student | undefined => {
    const cleanId = id.trim().toUpperCase();
    return students.find(s => s.id.toUpperCase() === cleanId);
  };

  // TEACHER OPERATIONS
  const addTeacher = (teacherData: Omit<Teacher, 'id'>): Teacher => {
    const nextNum = teachers.length + 1;
    const newTeacher: Teacher = {
      ...teacherData,
      id: `TCH-${String(nextNum).padStart(2, '0')}`
    };
    setTeachers(prev => [...prev, newTeacher]);
    return newTeacher;
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  // COURSES & BATCHES
  const addCourse = (courseData: Omit<Course, 'id'>): Course => {
    const newCourse: Course = {
      ...courseData,
      id: `CRS-${String(courses.length + 1).padStart(2, '0')}`
    };
    setCourses(prev => [...prev, newCourse]);
    return newCourse;
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const addBatch = (batchData: Omit<Batch, 'id'>): Batch => {
    const newBatch: Batch = {
      ...batchData,
      id: `BAT-${String(batches.length + 1).padStart(2, '0')}`
    };
    setBatches(prev => [...prev, newBatch]);
    return newBatch;
  };

  const updateBatch = (id: string, updates: Partial<Batch>) => {
    setBatches(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
  };

  // ATTENDANCE OPERATIONS
  const recordAttendance = (
    recordData: Omit<AttendanceRecord, 'id' | 'time'> & { time?: string }
  ): AttendanceResult => {
    const student = getStudent(recordData.studentId);
    if (!student) {
      return { success: false, message: `Student ID "${recordData.studentId}" not found in system.` };
    }

    const checkDate = recordData.date || getTodayDateString();
    
    // Check duplicate attendance for the same student + batch + date
    const existing = attendance.find(
      a => a.studentId.toUpperCase() === recordData.studentId.toUpperCase() &&
           a.batchId === recordData.batchId &&
           a.date === checkDate
    );

    if (existing) {
      return {
        success: false,
        isDuplicate: true,
        message: `Attendance already recorded for ${student.fullName} on ${checkDate} (${existing.status.toUpperCase()} at ${existing.time}).`,
        record: existing
      };
    }

    const now = new Date();
    const timeStr = recordData.time || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newRecord: AttendanceRecord = {
      id: `ATT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      studentId: student.id,
      batchId: recordData.batchId,
      date: checkDate,
      time: timeStr,
      status: recordData.status,
      method: recordData.method,
      recordedBy: recordData.recordedBy || 'System User',
      remarks: recordData.remarks
    };

    setAttendance(prev => [newRecord, ...prev]);

    return {
      success: true,
      message: `Marked ${student.fullName} as ${recordData.status.toUpperCase()} successfully.`,
      record: newRecord
    };
  };

  const bulkUpdateAttendance = (
    records: { studentId: string; batchId: string; date: string; status: AttendanceStatus }[]
  ) => {
    setAttendance(prev => {
      const updated = [...prev];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

      records.forEach(req => {
        const index = updated.findIndex(
          a => a.studentId === req.studentId && a.batchId === req.batchId && a.date === req.date
        );
        if (index >= 0) {
          updated[index] = {
            ...updated[index],
            status: req.status,
            method: 'manual'
          };
        } else {
          updated.unshift({
            id: `ATT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            studentId: req.studentId,
            batchId: req.batchId,
            date: req.date,
            time: timeStr,
            status: req.status,
            method: 'manual',
            recordedBy: 'Admin Kiosk'
          });
        }
      });
      return updated;
    });
  };

  // FEE OPERATIONS
  const recordFeePayment = (
    paymentData: Omit<FeePayment, 'id' | 'receiptNumber'>
  ): FeePayment => {
    const receiptNum = `REC-2026-${String(fees.length + 801).padStart(4, '0')}`;
    const newPayment: FeePayment = {
      ...paymentData,
      id: `PAY-${Date.now()}`,
      receiptNumber: receiptNum
    };
    setFees(prev => [newPayment, ...prev]);
    return newPayment;
  };

  // TIMETABLE & ANNOUNCEMENTS
  const addTimetableSchedule = (item: Omit<TimetableSchedule, 'id'>): TimetableSchedule => {
    const newSchedule: TimetableSchedule = {
      ...item,
      id: `SCH-${Date.now()}`
    };
    setTimetable(prev => [...prev, newSchedule]);
    return newSchedule;
  };

  const updateTimetableSchedule = (id: string, updates: Partial<TimetableSchedule>) => {
    setTimetable(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteTimetableSchedule = (id: string) => {
    setTimetable(prev => prev.filter(s => s.id !== id));
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id'>): Announcement => {
    const newAnn: Announcement = {
      ...ann,
      id: `ANN-${Date.now()}`
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    return newAnn;
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // CALCULATED HELPERS
  const getStudentPendingBalance = (studentId: string) => {
    const student = getStudent(studentId);
    if (!student) return { totalPayable: 0, totalPaid: 0, pending: 0 };

    // Calculate approximate total fees based on joining date (e.g. months enrolled up to current month)
    const joinDate = new Date(student.joiningDate);
    const currentDate = new Date();
    const monthsElapsed = Math.max(
      1,
      (currentDate.getFullYear() - joinDate.getFullYear()) * 12 +
        (currentDate.getMonth() - joinDate.getMonth()) + 1
    );

    const totalPayable = student.monthlyFee * monthsElapsed;
    const studentPayments = fees.filter(f => f.studentId === student.id);
    const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
    const pending = Math.max(0, totalPayable - totalPaid);

    return { totalPayable, totalPaid, pending };
  };

  const getStudentAttendanceStats = (studentId: string) => {
    const records = attendance.filter(a => a.studentId === studentId);
    const total = records.length;
    const present = records.filter(a => a.status === 'present').length;
    const late = records.filter(a => a.status === 'late').length;
    const absent = records.filter(a => a.status === 'absent').length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 100;
    return { total, present, late, absent, rate };
  };

  const getBatchStudentCount = (batchId: string): number => {
    return students.filter(s => s.batchId === batchId && s.status === 'active').length;
  };

  const getTodayStats = () => {
    const today = getTodayDateString();
    const todayRecords = attendance.filter(a => a.date === today && (a.status === 'present' || a.status === 'late'));
    const activeStudents = students.filter(s => s.status === 'active').length;
    const presentCount = todayRecords.length;
    const attendanceRate = activeStudents > 0 ? Math.round((presentCount / activeStudents) * 100) : 0;
    return { presentCount, totalStudents: activeStudents, attendanceRate };
  };

  const getFinancialSummary = () => {
    const totalCollected = fees.reduce((sum, f) => sum + f.amount, 0);
    
    // This month's collection
    const currentYearMonth = getTodayDateString().slice(0, 7);
    const thisMonthPayments = fees.filter(f => f.paymentDate.startsWith(currentYearMonth));
    const thisMonthCollected = thisMonthPayments.reduce((sum, f) => sum + f.amount, 0);

    // Sum of all active students' pending balances
    let totalPending = 0;
    students.filter(s => s.status === 'active').forEach(s => {
      const { pending } = getStudentPendingBalance(s.id);
      totalPending += pending;
    });

    return { totalCollected, thisMonthCollected, totalPending };
  };

  const resetDemoData = () => {
    clearAllZenvoraStorage();
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setCourses(INITIAL_COURSES);
    setBatches(INITIAL_BATCHES);
    setAttendance(INITIAL_ATTENDANCE);
    setFees(INITIAL_FEES);
    setTimetable(INITIAL_TIMETABLE);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
  };

  return (
    <DataContext.Provider
      value={{
        students,
        teachers,
        courses,
        batches,
        attendance,
        fees,
        timetable,
        announcements,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addCourse,
        updateCourse,
        addBatch,
        updateBatch,
        recordAttendance,
        bulkUpdateAttendance,
        recordFeePayment,
        addTimetableSchedule,
        updateTimetableSchedule,
        deleteTimetableSchedule,
        addAnnouncement,
        deleteAnnouncement,
        getStudentPendingBalance,
        getStudentAttendanceStats,
        getBatchStudentCount,
        getTodayStats,
        getFinancialSummary,
        resetDemoData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
