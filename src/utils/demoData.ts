import { Student, Teacher, Course, Batch, AttendanceRecord, FeePayment, TimetableSchedule, Announcement } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'CRS-01',
    name: 'Class 10 CBSE — Math & Science',
    description: 'Comprehensive board exam preparation covering Physics, Chemistry, Biology, and Advanced Mathematics.',
    duration: '10 Months',
    feeAmount: 3500,
    status: 'active'
  },
  {
    id: 'CRS-02',
    name: 'Class 12 JEE — Physics Mastery',
    description: 'Targeted competitive exam coaching focusing on Mechanics, Electrodynamics, Optics, and Modern Physics.',
    duration: '12 Months',
    feeAmount: 4800,
    status: 'active'
  },
  {
    id: 'CRS-03',
    name: 'Class 12 NEET — Chemistry Excellence',
    description: 'Organic, Inorganic, and Physical Chemistry tailored for medical entrance and board excellence.',
    duration: '12 Months',
    feeAmount: 4500,
    status: 'active'
  },
  {
    id: 'CRS-04',
    name: 'Foundations of Computer Science & Python',
    description: 'Practical programming fundamentals, data structures, and computer science project development.',
    duration: '6 Months',
    feeAmount: 4000,
    status: 'active'
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'TCH-01',
    name: 'Prof. Rajesh Verma',
    phone: '+91 98230 45671',
    email: 'rajesh.verma@zenvora.edu',
    subject: 'Physics & Applied Mechanics',
    assignedBatchIds: ['BAT-02', 'BAT-05'],
    joiningDate: '2023-06-15',
    status: 'active',
    bio: 'M.Sc. Physics (IIT Madras alum), 12+ years mentoring JEE aspirants.'
  },
  {
    id: 'TCH-02',
    name: 'Dr. Sunita Deshmukh',
    phone: '+91 94221 88920',
    email: 'sunita.deshmukh@zenvora.edu',
    subject: 'Inorganic & Organic Chemistry',
    assignedBatchIds: ['BAT-03'],
    joiningDate: '2023-08-01',
    status: 'active',
    bio: 'Ph.D. in Chemistry, author of simplified board question banks.'
  },
  {
    id: 'TCH-03',
    name: 'Vikramaditya Roy',
    phone: '+91 97654 32109',
    email: 'vikram.roy@zenvora.edu',
    subject: 'Pure & Applied Mathematics',
    assignedBatchIds: ['BAT-01'],
    joiningDate: '2024-01-10',
    status: 'active',
    bio: 'Former Olympiad coach specialized in calculus and coordinate geometry.'
  },
  {
    id: 'TCH-04',
    name: 'Pooja Kulkarni',
    phone: '+91 99870 12345',
    email: 'pooja.kulkarni@zenvora.edu',
    subject: 'Computer Science & Python',
    assignedBatchIds: ['BAT-04'],
    joiningDate: '2024-03-20',
    status: 'active',
    bio: 'B.Tech CSE, passionate about coding logic and algorithms for high schoolers.'
  }
];

export const INITIAL_BATCHES: Batch[] = [
  {
    id: 'BAT-01',
    name: 'Class 10 CBSE Morning Spark',
    courseId: 'CRS-01',
    teacherId: 'TCH-03',
    days: ['Mon', 'Wed', 'Fri'],
    startTime: '07:30',
    endTime: '09:00',
    capacity: 25,
    status: 'active',
    room: 'Hall A (Ground Floor)'
  },
  {
    id: 'BAT-02',
    name: 'JEE Physics Alpha 2026',
    courseId: 'CRS-02',
    teacherId: 'TCH-01',
    days: ['Tue', 'Thu', 'Sat'],
    startTime: '16:00',
    endTime: '17:30',
    capacity: 20,
    status: 'active',
    room: 'Physics Lab / Room 201'
  },
  {
    id: 'BAT-03',
    name: 'NEET Chemistry Titans',
    courseId: 'CRS-03',
    teacherId: 'TCH-02',
    days: ['Mon', 'Wed', 'Fri'],
    startTime: '16:30',
    endTime: '18:00',
    capacity: 22,
    status: 'active',
    room: 'Room 203'
  },
  {
    id: 'BAT-04',
    name: 'Python Coders Weekend Cohort',
    courseId: 'CRS-04',
    teacherId: 'TCH-04',
    days: ['Sat', 'Sun'],
    startTime: '10:00',
    endTime: '12:30',
    capacity: 18,
    status: 'active',
    room: 'Computer Lab 1'
  },
  {
    id: 'BAT-05',
    name: 'JEE Advanced Evening Accelerators',
    courseId: 'CRS-02',
    teacherId: 'TCH-01',
    days: ['Mon', 'Wed', 'Fri'],
    startTime: '18:15',
    endTime: '19:45',
    capacity: 15,
    status: 'active',
    room: 'Seminar Room B'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'ZNV-2026-001',
    fullName: 'Priya Sharma',
    phone: '+91 98201 11223',
    guardianName: 'Ramesh Sharma',
    guardianPhone: '+91 98201 99887',
    email: 'priya.sharma@gmail.com',
    courseId: 'CRS-02',
    batchId: 'BAT-02',
    joiningDate: '2026-06-01',
    monthlyFee: 4800,
    status: 'active',
    notes: 'Exceptional in kinematics, preparing for JEE Advanced.'
  },
  {
    id: 'ZNV-2026-002',
    fullName: 'Rohan Verma',
    phone: '+91 98334 22334',
    guardianName: 'Sanjay Verma',
    guardianPhone: '+91 98334 88776',
    email: 'rohan.verma@gmail.com',
    courseId: 'CRS-01',
    batchId: 'BAT-01',
    joiningDate: '2026-06-10',
    monthlyFee: 3500,
    status: 'active',
    notes: 'Aiming for 95%+ in CBSE 10th Board.'
  },
  {
    id: 'ZNV-2026-003',
    fullName: 'Aarav Patel',
    phone: '+91 98450 33445',
    guardianName: 'Bhavesh Patel',
    guardianPhone: '+91 98450 77665',
    email: 'aarav.patel@gmail.com',
    courseId: 'CRS-03',
    batchId: 'BAT-03',
    joiningDate: '2026-06-15',
    monthlyFee: 4500,
    status: 'active'
  },
  {
    id: 'ZNV-2026-004',
    fullName: 'Ananya Iyer',
    phone: '+91 98567 44556',
    guardianName: 'Subramanian Iyer',
    guardianPhone: '+91 98567 66554',
    email: 'ananya.iyer@gmail.com',
    courseId: 'CRS-04',
    batchId: 'BAT-04',
    joiningDate: '2026-07-01',
    monthlyFee: 4000,
    status: 'active',
    notes: 'Built a web scraper project in class.'
  },
  {
    id: 'ZNV-2026-005',
    fullName: 'Kabir Mehta',
    phone: '+91 98678 55667',
    guardianName: 'Alok Mehta',
    guardianPhone: '+91 98678 55443',
    email: 'kabir.mehta@gmail.com',
    courseId: 'CRS-02',
    batchId: 'BAT-02',
    joiningDate: '2026-07-05',
    monthlyFee: 4800,
    status: 'active'
  },
  {
    id: 'ZNV-2026-006',
    fullName: 'Diya Sen',
    phone: '+91 98789 66778',
    guardianName: 'Amit Sen',
    guardianPhone: '+91 98789 44332',
    email: 'diya.sen@gmail.com',
    courseId: 'CRS-01',
    batchId: 'BAT-01',
    joiningDate: '2026-07-12',
    monthlyFee: 3500,
    status: 'active'
  },
  {
    id: 'ZNV-2026-007',
    fullName: 'Ishaan Gupta',
    phone: '+91 98890 77889',
    guardianName: 'Naveen Gupta',
    guardianPhone: '+91 98890 33221',
    email: 'ishaan.gupta@gmail.com',
    courseId: 'CRS-03',
    batchId: 'BAT-03',
    joiningDate: '2026-07-20',
    monthlyFee: 4500,
    status: 'active'
  },
  {
    id: 'ZNV-2026-008',
    fullName: 'Meera Nair',
    phone: '+91 98901 88990',
    guardianName: 'Gopal Nair',
    guardianPhone: '+91 98901 22110',
    email: 'meera.nair@gmail.com',
    courseId: 'CRS-02',
    batchId: 'BAT-05',
    joiningDate: '2026-08-01',
    monthlyFee: 4800,
    status: 'active'
  },
  {
    id: 'ZNV-2026-009',
    fullName: 'Aditya Joshi',
    phone: '+91 99012 99001',
    guardianName: 'Manoj Joshi',
    guardianPhone: '+91 99012 11009',
    email: 'aditya.joshi@gmail.com',
    courseId: 'CRS-04',
    batchId: 'BAT-04',
    joiningDate: '2026-08-05',
    monthlyFee: 4000,
    status: 'active'
  },
  {
    id: 'ZNV-2026-010',
    fullName: 'Tanvi Chawla',
    phone: '+91 99123 00112',
    guardianName: 'Harish Chawla',
    guardianPhone: '+91 99123 99881',
    email: 'tanvi.chawla@gmail.com',
    courseId: 'CRS-01',
    batchId: 'BAT-01',
    joiningDate: '2026-08-15',
    monthlyFee: 3500,
    status: 'active'
  },
  {
    id: 'ZNV-2026-011',
    fullName: 'Siddharth Menon',
    phone: '+91 99234 11223',
    guardianName: 'Krishna Menon',
    guardianPhone: '+91 99234 88772',
    email: 'siddharth.menon@gmail.com',
    courseId: 'CRS-02',
    batchId: 'BAT-02',
    joiningDate: '2026-08-20',
    monthlyFee: 4800,
    status: 'active'
  },
  {
    id: 'ZNV-2026-012',
    fullName: 'Rhea Kapoor',
    phone: '+91 99345 22334',
    guardianName: 'Vivek Kapoor',
    guardianPhone: '+91 99345 77663',
    email: 'rhea.kapoor@gmail.com',
    courseId: 'CRS-03',
    batchId: 'BAT-03',
    joiningDate: '2026-09-01',
    monthlyFee: 4500,
    status: 'active'
  },
  {
    id: 'ZNV-2026-013',
    fullName: 'Varun Reddy',
    phone: '+91 99456 33445',
    guardianName: 'Sridhar Reddy',
    guardianPhone: '+91 99456 66554',
    email: 'varun.reddy@gmail.com',
    courseId: 'CRS-02',
    batchId: 'BAT-05',
    joiningDate: '2026-09-10',
    monthlyFee: 4800,
    status: 'active'
  },
  {
    id: 'ZNV-2026-014',
    fullName: 'Neha Bansal',
    phone: '+91 99567 44556',
    guardianName: 'Pawan Bansal',
    guardianPhone: '+91 99567 55443',
    email: 'neha.bansal@gmail.com',
    courseId: 'CRS-01',
    batchId: 'BAT-01',
    joiningDate: '2026-05-10',
    monthlyFee: 3500,
    status: 'inactive', // inactive demonstration
    notes: 'Moved to another city on transfer in Sept 2026.'
  }
];

export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Today's attendance
  {
    id: 'ATT-2026-001',
    studentId: 'ZNV-2026-001',
    batchId: 'BAT-02',
    date: getTodayDateString(),
    time: '15:58:20',
    status: 'present',
    method: 'qr_scan',
    recordedBy: 'Prof. Rajesh Verma',
    remarks: 'Scanned via gate terminal'
  },
  {
    id: 'ATT-2026-002',
    studentId: 'ZNV-2026-005',
    batchId: 'BAT-02',
    date: getTodayDateString(),
    time: '16:02:45',
    status: 'present',
    method: 'qr_scan',
    recordedBy: 'Prof. Rajesh Verma'
  },
  {
    id: 'ATT-2026-003',
    studentId: 'ZNV-2026-011',
    batchId: 'BAT-02',
    date: getTodayDateString(),
    time: '16:12:10',
    status: 'late',
    method: 'qr_scan',
    recordedBy: 'Prof. Rajesh Verma',
    remarks: 'Arrived 12 min late due to rain'
  },
  {
    id: 'ATT-2026-004',
    studentId: 'ZNV-2026-002',
    batchId: 'BAT-01',
    date: getTodayDateString(),
    time: '07:28:15',
    status: 'present',
    method: 'manual',
    recordedBy: 'Vikramaditya Roy'
  },
  {
    id: 'ATT-2026-005',
    studentId: 'ZNV-2026-006',
    batchId: 'BAT-01',
    date: getTodayDateString(),
    time: '07:31:00',
    status: 'present',
    method: 'manual',
    recordedBy: 'Vikramaditya Roy'
  },
  // Yesterday's attendance
  {
    id: 'ATT-2026-006',
    studentId: 'ZNV-2026-001',
    batchId: 'BAT-02',
    date: getYesterdayDateString(),
    time: '15:55:12',
    status: 'present',
    method: 'qr_scan',
    recordedBy: 'Prof. Rajesh Verma'
  },
  {
    id: 'ATT-2026-007',
    studentId: 'ZNV-2026-003',
    batchId: 'BAT-03',
    date: getYesterdayDateString(),
    time: '16:25:40',
    status: 'present',
    method: 'qr_scan',
    recordedBy: 'Dr. Sunita Deshmukh'
  },
  {
    id: 'ATT-2026-008',
    studentId: 'ZNV-2026-007',
    batchId: 'BAT-03',
    date: getYesterdayDateString(),
    time: '16:28:00',
    status: 'present',
    method: 'qr_scan',
    recordedBy: 'Dr. Sunita Deshmukh'
  },
  {
    id: 'ATT-2026-009',
    studentId: 'ZNV-2026-012',
    batchId: 'BAT-03',
    date: getYesterdayDateString(),
    time: '00:00:00',
    status: 'absent',
    method: 'manual',
    recordedBy: 'Dr. Sunita Deshmukh',
    remarks: 'Informed sick leave'
  }
];

export const INITIAL_FEES: FeePayment[] = [
  {
    id: 'PAY-001',
    receiptNumber: 'REC-2026-0801',
    studentId: 'ZNV-2026-001',
    amount: 4800,
    paymentDate: '2026-10-02',
    method: 'UPI',
    status: 'paid',
    monthCovered: 'October 2026',
    notes: 'Paid via GPay (Txn #GP-982182)',
    recordedBy: 'Admin Anita Sharma'
  },
  {
    id: 'PAY-002',
    receiptNumber: 'REC-2026-0802',
    studentId: 'ZNV-2026-002',
    amount: 3500,
    paymentDate: '2026-10-03',
    method: 'Cash',
    status: 'paid',
    monthCovered: 'October 2026',
    notes: 'Received at tuition front desk',
    recordedBy: 'Admin Anita Sharma'
  },
  {
    id: 'PAY-003',
    receiptNumber: 'REC-2026-0803',
    studentId: 'ZNV-2026-003',
    amount: 4500,
    paymentDate: '2026-10-04',
    method: 'Bank Transfer',
    status: 'paid',
    monthCovered: 'October 2026',
    notes: 'NEFT transfer Ref: HDFC928172',
    recordedBy: 'Admin Anita Sharma'
  },
  {
    id: 'PAY-004',
    receiptNumber: 'REC-2026-0804',
    studentId: 'ZNV-2026-004',
    amount: 4000,
    paymentDate: '2026-10-05',
    method: 'UPI',
    status: 'paid',
    monthCovered: 'October 2026',
    notes: 'PhonePe Ref #PP-482910',
    recordedBy: 'Admin Anita Sharma'
  },
  {
    id: 'PAY-005',
    receiptNumber: 'REC-2026-0805',
    studentId: 'ZNV-2026-005',
    amount: 2500,
    paymentDate: '2026-10-06',
    method: 'Cash',
    status: 'partial',
    monthCovered: 'October 2026',
    notes: 'Partial payment made, balance ₹2,300 promised by 20th',
    recordedBy: 'Admin Anita Sharma'
  },
  {
    id: 'PAY-006',
    receiptNumber: 'REC-2026-0806',
    studentId: 'ZNV-2026-006',
    amount: 3500,
    paymentDate: '2026-10-07',
    method: 'UPI',
    status: 'paid',
    monthCovered: 'October 2026',
    notes: 'UPI Ref #UPI-109283',
    recordedBy: 'Admin Anita Sharma'
  },
  {
    id: 'PAY-007',
    receiptNumber: 'REC-2026-0807',
    studentId: 'ZNV-2026-008',
    amount: 4800,
    paymentDate: '2026-10-09',
    method: 'Demo Payment',
    status: 'paid',
    monthCovered: 'October 2026',
    notes: 'Simulated payment test confirmation',
    recordedBy: 'Admin Anita Sharma'
  },
  {
    id: 'PAY-008',
    receiptNumber: 'REC-2026-0701',
    studentId: 'ZNV-2026-001',
    amount: 4800,
    paymentDate: '2026-09-03',
    method: 'UPI',
    status: 'paid',
    monthCovered: 'September 2026',
    notes: 'Cleared September dues',
    recordedBy: 'Admin Anita Sharma'
  },
  {
    id: 'PAY-009',
    receiptNumber: 'REC-2026-0702',
    studentId: 'ZNV-2026-002',
    amount: 3500,
    paymentDate: '2026-09-04',
    method: 'Cash',
    status: 'paid',
    monthCovered: 'September 2026',
    notes: 'September fee collected',
    recordedBy: 'Admin Anita Sharma'
  }
];

export const INITIAL_TIMETABLE: TimetableSchedule[] = [
  {
    id: 'SCH-01',
    courseId: 'CRS-01',
    batchId: 'BAT-01',
    teacherId: 'TCH-03',
    dayOfWeek: 'Monday',
    startTime: '07:30',
    endTime: '09:00',
    room: 'Hall A (Ground Floor)'
  },
  {
    id: 'SCH-02',
    courseId: 'CRS-03',
    batchId: 'BAT-03',
    teacherId: 'TCH-02',
    dayOfWeek: 'Monday',
    startTime: '16:30',
    endTime: '18:00',
    room: 'Room 203'
  },
  {
    id: 'SCH-03',
    courseId: 'CRS-02',
    batchId: 'BAT-05',
    teacherId: 'TCH-01',
    dayOfWeek: 'Monday',
    startTime: '18:15',
    endTime: '19:45',
    room: 'Seminar Room B'
  },
  {
    id: 'SCH-04',
    courseId: 'CRS-02',
    batchId: 'BAT-02',
    teacherId: 'TCH-01',
    dayOfWeek: 'Tuesday',
    startTime: '16:00',
    endTime: '17:30',
    room: 'Physics Lab / Room 201'
  },
  {
    id: 'SCH-05',
    courseId: 'CRS-01',
    batchId: 'BAT-01',
    teacherId: 'TCH-03',
    dayOfWeek: 'Wednesday',
    startTime: '07:30',
    endTime: '09:00',
    room: 'Hall A (Ground Floor)'
  },
  {
    id: 'SCH-06',
    courseId: 'CRS-03',
    batchId: 'BAT-03',
    teacherId: 'TCH-02',
    dayOfWeek: 'Wednesday',
    startTime: '16:30',
    endTime: '18:00',
    room: 'Room 203'
  },
  {
    id: 'SCH-07',
    courseId: 'CRS-02',
    batchId: 'BAT-02',
    teacherId: 'TCH-01',
    dayOfWeek: 'Thursday',
    startTime: '16:00',
    endTime: '17:30',
    room: 'Physics Lab / Room 201'
  },
  {
    id: 'SCH-08',
    courseId: 'CRS-01',
    batchId: 'BAT-01',
    teacherId: 'TCH-03',
    dayOfWeek: 'Friday',
    startTime: '07:30',
    endTime: '09:00',
    room: 'Hall A (Ground Floor)'
  },
  {
    id: 'SCH-09',
    courseId: 'CRS-04',
    batchId: 'BAT-04',
    teacherId: 'TCH-04',
    dayOfWeek: 'Saturday',
    startTime: '10:00',
    endTime: '12:30',
    room: 'Computer Lab 1'
  },
  {
    id: 'SCH-10',
    courseId: 'CRS-02',
    batchId: 'BAT-02',
    teacherId: 'TCH-01',
    dayOfWeek: 'Saturday',
    startTime: '16:00',
    endTime: '17:30',
    room: 'Physics Lab / Room 201'
  },
  {
    id: 'SCH-11',
    courseId: 'CRS-04',
    batchId: 'BAT-04',
    teacherId: 'TCH-04',
    dayOfWeek: 'Sunday',
    startTime: '10:00',
    endTime: '12:30',
    room: 'Computer Lab 1'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ANN-01',
    title: 'Mid-Term Physics Mock Examination Announced',
    message: 'All students enrolled in JEE Physics Alpha 2026 must appear for the full-syllabus Rotational Dynamics and Thermodynamics test this Saturday at 3:30 PM. Bring your student QR badge for entry.',
    targetBatchId: 'BAT-02',
    priority: 'urgent',
    date: '2026-10-10',
    author: 'Prof. Rajesh Verma'
  },
  {
    id: 'ANN-02',
    title: 'Diwali Holiday Schedule & Study Material Dispatch',
    message: 'The tuition center will remain closed from November 1st to November 5th. Comprehensive holiday worksheets and revision question banks are available at the front office.',
    targetBatchId: 'all',
    priority: 'important',
    date: '2026-10-08',
    author: 'Principal Anita Sharma'
  },
  {
    id: 'ANN-03',
    title: 'Doubt Clearing Session: Organic Reaction Mechanisms',
    message: 'Special 2-hour doubt clearing workshop for NEET Chemistry Titans on Sunday from 4:00 PM to 6:00 PM in Room 203.',
    targetBatchId: 'BAT-03',
    priority: 'normal',
    date: '2026-10-06',
    author: 'Dr. Sunita Deshmukh'
  },
  {
    id: 'ANN-04',
    title: 'Student QR Identity Badges Mandatory for Attendance',
    message: 'Parents and students are requested to ensure physical QR ID cards or downloaded phone QR codes are scanned at the kiosk upon arrival. Digital SMS confirmations are triggered on scan.',
    targetBatchId: 'all',
    priority: 'important',
    date: '2026-10-01',
    author: 'Principal Anita Sharma'
  }
];
