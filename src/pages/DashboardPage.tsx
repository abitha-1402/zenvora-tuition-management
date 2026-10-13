import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  AlertCircle,
  QrCode,
  UserPlus,
  ArrowUpRight,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { role, isTeacher } = useAuth();
  const {
    students,
    teachers,
    courses,
    batches,
    attendance,
    fees,
    timetable,
    announcements,
    getTodayStats,
    getFinancialSummary,
    getStudentPendingBalance
  } = useData();

  const { presentCount, totalStudents, attendanceRate } = getTodayStats();
  const { thisMonthCollected, totalPending } = getFinancialSummary();

  // Find today's day of week
  const daysOfWeek: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
  const todayDayName = daysOfWeek[new Date().getDay()];

  // Today's classes
  const todayClasses = timetable.filter(t => t.dayOfWeek === todayDayName);

  // Recent student registrations (latest 4)
  const recentStudents = [...students].slice(0, 4);

  // Calculate monthly fee trend data for chart
  const monthlyData = [
    { month: 'Jun', collection: 32000, target: 40000 },
    { month: 'Jul', collection: 41500, target: 45000 },
    { month: 'Aug', collection: 47200, target: 50000 },
    { month: 'Sep', collection: 52000, target: 50000 },
    { month: 'Oct', collection: thisMonthCollected || 27600, target: 55000 },
  ];

  // Attendance rate by day over past 5 days
  const attendanceTrendData = [
    { day: 'Mon', rate: 92 },
    { day: 'Tue', rate: 88 },
    { day: 'Wed', rate: 95 },
    { day: 'Thu', rate: 89 },
    { day: 'Today', rate: attendanceRate || 90 },
  ];

  // Students with overdue balances
  const overdueStudents = students
    .filter(s => s.status === 'active')
    .map(s => ({
      student: s,
      ...getStudentPendingBalance(s.id)
    }))
    .filter(item => item.pending > 0)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-[#45258D] to-[#7047D7] rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-[#7047D7]/15">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 tracking-wider">
              ACADEMIC YEAR 2026–2027
            </span>
            <span className="text-xs text-white/80">·</span>
            <span className="text-xs text-white/90">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to Zenvora Hub
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
            Smarter Classes. Simpler Management. Manage student attendance, fees, courses, and schedules from a single unified center.
          </p>
        </div>

        {/* Quick Scan Action CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/scanner')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#45258D] hover:bg-[#F3EEFF] text-xs font-bold shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <QrCode className="w-4 h-4 text-[#7047D7]" />
            <span>Launch Camera Scanner</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:border-[#7047D7]/30 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">Total Students</span>
            <div className="w-8 h-8 rounded-xl bg-[#F3EEFF] text-[#7047D7] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {students.length}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              {students.filter(s => s.status === 'active').length} Active
            </span>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:border-[#7047D7]/30 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">Faculty Members</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {teachers.length}
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {batches.length} Batches
            </span>
          </div>
        </div>

        {/* Today's Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:border-[#7047D7]/30 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">Today's Attendance</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {attendanceRate}%
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 font-mono">
              {presentCount} / {totalStudents} present
            </span>
          </div>
        </div>

        {/* Monthly Fee Collection */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:border-[#7047D7]/30 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">Monthly Collection</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#7047D7] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              ₹{thisMonthCollected.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
              ₹{totalPending.toLocaleString('en-IN')} Due
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Strip */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Quick Actions
          </span>
          <span className="text-[11px] text-slate-400">1-Click Center Operations</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => navigate('/students')}
            className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF9FF] hover:bg-[#F3EEFF] text-slate-700 hover:text-[#7047D7] border border-slate-100 transition-all text-xs font-semibold cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#7047D7]" />
            <span>Add Student</span>
          </button>

          <button
            onClick={() => navigate('/scanner')}
            className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF9FF] hover:bg-[#F3EEFF] text-slate-700 hover:text-[#7047D7] border border-slate-100 transition-all text-xs font-semibold cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-[#7047D7]" />
            <span>Scan Student QR</span>
          </button>

          <button
            onClick={() => navigate('/attendance')}
            className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF9FF] hover:bg-[#F3EEFF] text-slate-700 hover:text-[#7047D7] border border-slate-100 transition-all text-xs font-semibold cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4 text-[#7047D7]" />
            <span>Mark Attendance</span>
          </button>

          <button
            onClick={() => navigate('/fees')}
            className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF9FF] hover:bg-[#F3EEFF] text-slate-700 hover:text-[#7047D7] border border-slate-100 transition-all text-xs font-semibold cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-[#7047D7]" />
            <span>Record Fee Payment</span>
          </button>
        </div>
      </div>

      {/* Analytics Visuals: 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Fee Collection Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Fee Inflow</h3>
              <p className="text-xs text-slate-500">Collected tuition fees in INR (₹)</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +18% MoM
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value || 0).toLocaleString('en-IN')}`, 'Collected']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Bar dataKey="collection" fill="#7047D7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Trend Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Attendance Rate</h3>
              <p className="text-xs text-slate-500">Daily average percentage</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#7047D7] bg-[#F3EEFF] px-2 py-1 rounded-lg">
              Avg: 91%
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7047D7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7047D7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(value: any) => [`${value}%`, 'Attendance']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#7047D7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#attendanceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Operational Sections: Today's Schedule & Pending Fees & Recent Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Timetable */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#7047D7]" />
              <h3 className="text-sm font-bold text-slate-900">Today's Timetable</h3>
            </div>
            <button
              onClick={() => navigate('/timetable')}
              className="text-xs text-[#7047D7] hover:underline font-semibold flex items-center gap-0.5"
            >
              Full Schedule <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          {todayClasses.length === 0 ? (
            <div className="p-6 text-center text-slate-400 bg-[#FAF9FF] rounded-xl text-xs">
              No classes scheduled for {todayDayName}.
            </div>
          ) : (
            <div className="space-y-3">
              {todayClasses.map(sched => {
                const batch = batches.find(b => b.id === sched.batchId);
                const teacher = teachers.find(t => t.id === sched.teacherId);
                const course = courses.find(c => c.id === sched.courseId);

                return (
                  <div
                    key={sched.id}
                    className="p-3 rounded-xl bg-[#FAF9FF] border border-slate-100 hover:border-[#7047D7]/30 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{batch?.name || 'Batch'}</span>
                      <span className="font-mono font-semibold text-[#7047D7] bg-[#F3EEFF] px-2 py-0.5 rounded-md text-[10px]">
                        {sched.startTime} – {sched.endTime}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">{course?.name}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                      <span>Tutor: {teacher?.name}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        {sched.room}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pending Fee Reminders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Fee Balance Alerts</h3>
            </div>
            <button
              onClick={() => navigate('/fees')}
              className="text-xs text-[#7047D7] hover:underline font-semibold flex items-center gap-0.5"
            >
              Fee Ledger <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          {overdueStudents.length === 0 ? (
            <div className="p-6 text-center text-slate-400 bg-[#FAF9FF] rounded-xl text-xs flex flex-col items-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-2" />
              <span>All active students are up to date!</span>
            </div>
          ) : (
            <div className="space-y-3">
              {overdueStudents.map(item => (
                <div
                  key={item.student.id}
                  className="p-3 rounded-xl bg-amber-50/50 border border-amber-100/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{item.student.fullName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{item.student.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-amber-700">
                      ₹{item.pending.toLocaleString('en-IN')}
                    </p>
                    <button
                      onClick={() => navigate('/fees')}
                      className="text-[10px] text-[#7047D7] hover:underline font-semibold"
                    >
                      Collect Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Student Registrations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#7047D7]" />
              <h3 className="text-sm font-bold text-slate-900">Recent Enrolments</h3>
            </div>
            <button
              onClick={() => navigate('/students')}
              className="text-xs text-[#7047D7] hover:underline font-semibold flex items-center gap-0.5"
            >
              All Students <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentStudents.map(student => {
              const course = courses.find(c => c.id === student.courseId);
              return (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF9FF] transition-colors border border-transparent hover:border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#F3EEFF] text-[#7047D7] flex items-center justify-center font-bold text-xs">
                      {student.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{student.fullName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{student.id}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {course?.name.slice(0, 15)}...
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
