import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { exportToCSV } from '../utils/exportCsv';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Users,
  CreditCard,
  PieChart as PieIcon,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const ReportsPage: React.FC = () => {
  const {
    students,
    courses,
    batches,
    attendance,
    fees,
    getStudentPendingBalance,
    getStudentAttendanceStats
  } = useData();

  // Active Report Tab: 'enrolment' | 'attendance' | 'fees' | 'defaulters'
  const [activeReport, setActiveReport] = useState<'enrolment' | 'attendance' | 'fees' | 'defaulters'>('enrolment');

  // Course-wise distribution
  const courseDistributionData = useMemo(() => {
    return courses.map(course => {
      const count = students.filter(s => s.courseId === course.id && s.status === 'active').length;
      return {
        name: course.name.slice(0, 18) + (course.name.length > 18 ? '...' : ''),
        fullName: course.name,
        value: count,
      };
    });
  }, [courses, students]);

  // Batch-wise attendance rates
  const batchAttendanceData = useMemo(() => {
    return batches.map(batch => {
      const batchRecords = attendance.filter(a => a.batchId === batch.id);
      const total = batchRecords.length;
      const present = batchRecords.filter(a => a.status === 'present' || a.status === 'late').length;
      const rate = total > 0 ? Math.round((present / total) * 100) : 90; // fallback if new
      return {
        name: batch.name.slice(0, 15),
        fullName: batch.name,
        attendanceRate: rate,
        totalSessions: total
      };
    });
  }, [batches, attendance]);

  // Fee Defaulters List
  const defaultersList = useMemo(() => {
    return students
      .filter(s => s.status === 'active')
      .map(s => {
        const { totalPayable, totalPaid, pending } = getStudentPendingBalance(s.id);
        const course = courses.find(c => c.id === s.courseId);
        const batch = batches.find(b => b.id === s.batchId);
        return {
          id: s.id,
          name: s.fullName,
          phone: s.phone,
          guardianPhone: s.guardianPhone,
          courseName: course?.name || 'Class 10 CBSE',
          batchName: batch?.name || 'Batch Alpha',
          monthlyFee: s.monthlyFee,
          totalPaid,
          pending
        };
      })
      .filter(item => item.pending > 0)
      .sort((a, b) => b.pending - a.pending);
  }, [students, courses, batches, getStudentPendingBalance]);

  const COLORS = ['#7047D7', '#45258D', '#9A75F0', '#C5B2F8', '#38BDF8'];

  // Export handlers
  const handleExportCurrentReport = () => {
    if (activeReport === 'enrolment') {
      const rows = students.map(s => {
        const course = courses.find(c => c.id === s.courseId);
        const batch = batches.find(b => b.id === s.batchId);
        return {
          studentId: s.id,
          name: s.fullName,
          course: course?.name || '',
          batch: batch?.name || '',
          joiningDate: s.joiningDate,
          status: s.status
        };
      });
      exportToCSV('zenvora_student_enrolment_report', rows);
    } else if (activeReport === 'attendance') {
      const rows = batchAttendanceData.map(b => ({
        batchName: b.fullName,
        attendanceRate: `${b.attendanceRate}%`,
        totalRecordedSessions: b.totalSessions
      }));
      exportToCSV('zenvora_batch_attendance_report', rows);
    } else if (activeReport === 'defaulters') {
      exportToCSV('zenvora_pending_fees_defaulters_report', defaultersList);
    } else {
      const rows = fees.map(f => {
        const s = students.find(stud => stud.id === f.studentId);
        return {
          receiptNumber: f.receiptNumber,
          date: f.paymentDate,
          studentName: s?.fullName || '',
          amount: f.amount,
          method: f.method,
          notes: f.notes || ''
        };
      });
      exportToCSV('zenvora_fee_collection_report', rows);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Analytics & Academic Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Exportable business metrics, revenue forecasts, and student performance summaries
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCurrentReport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#7047D7]" />
            <span>Export Report (CSV)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print View</span>
          </button>
        </div>
      </div>

      {/* Report Category Navigation Bar */}
      <div className="flex items-center gap-1 p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto no-print">
        <button
          onClick={() => setActiveReport('enrolment')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeReport === 'enrolment'
              ? 'bg-[#7047D7] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Course Enrolment Distribution</span>
        </button>

        <button
          onClick={() => setActiveReport('attendance')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeReport === 'attendance'
              ? 'bg-[#7047D7] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Batch Attendance Rates</span>
        </button>

        <button
          onClick={() => setActiveReport('defaulters')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeReport === 'defaulters'
              ? 'bg-[#7047D7] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Pending Fee Defaulters ({defaultersList.length})</span>
        </button>
      </div>

      {/* REPORT CONTENT: ENROLMENT */}
      {activeReport === 'enrolment' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Curriculum Distribution Breakdown
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Number of actively enrolled students per academic program
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseDistributionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {courseDistributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Course Capacity Summary Table
            </h3>
            <div className="space-y-3">
              {courses.map(course => {
                const count = students.filter(s => s.courseId === course.id && s.status === 'active').length;
                return (
                  <div
                    key={course.id}
                    className="p-3 rounded-xl bg-[#FAF9FF] border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{course.name}</span>
                      <span className="text-[11px] text-slate-500">
                        Monthly Fee: ₹{course.feeAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#7047D7] text-sm block">
                        {count} Enrolled
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Revenue: ₹{(count * course.feeAmount).toLocaleString('en-IN')}/mo
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: ATTENDANCE */}
      {activeReport === 'attendance' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Comparative Attendance Turnout by Cohort
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated percentage of present check-ins across scheduled sessions
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={batchAttendanceData} margin={{ top: 20, right: 30, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Attendance Rate']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Bar dataKey="attendanceRate" fill="#7047D7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: DEFAULTERS */}
      {activeReport === 'defaulters' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Pending Tuition Fee Defaulter Ledger
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Students with unpaid tuition balances requiring parent follow-up
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
              Total Deficit: ₹{defaultersList.reduce((acc, d) => acc + d.pending, 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9FF] text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Student ID & Name</th>
                  <th className="py-3 px-4">Course & Batch</th>
                  <th className="py-3 px-4">Guardian Contact</th>
                  <th className="py-3 px-4 text-right">Total Paid</th>
                  <th className="py-3 px-4 text-right">Balance Due (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {defaultersList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Great news! All active students have cleared their fee installments.
                    </td>
                  </tr>
                ) : (
                  defaultersList.map(defaulter => (
                    <tr key={defaulter.id} className="hover:bg-[#FAF9FF]/60 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{defaulter.name}</span>
                        <span className="text-[10px] font-mono text-[#7047D7]">{defaulter.id}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <span className="block truncate max-w-xs">{defaulter.courseName}</span>
                        <span className="text-[11px] text-slate-400">{defaulter.batchName}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono">
                        {defaulter.guardianPhone}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700">
                        ₹{defaulter.totalPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">
                        ₹{defaulter.pending.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
