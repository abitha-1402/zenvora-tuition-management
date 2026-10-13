import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { AttendanceStatus } from '../types';
import { getTodayDateString } from '../utils/demoData';
import { exportToCSV } from '../utils/exportCsv';
import {
  CalendarCheck,
  QrCode,
  Calendar,
  Filter,
  Download,
  Printer,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  AlertCircle
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    students,
    batches,
    courses,
    attendance,
    recordAttendance,
    bulkUpdateAttendance
  } = useData();

  // Filters
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent' | 'late'>('all');

  // Active Batch & Students
  const activeBatch = batches.find(b => b.id === selectedBatchId) || batches[0];
  const batchStudents = useMemo(() => {
    return students.filter(s => s.batchId === activeBatch?.id && s.status === 'active');
  }, [students, activeBatch]);

  // Attendance Records mapped for selectedBatch and selectedDate
  const batchAttendanceMap = useMemo(() => {
    const map = new Map<string, { id: string; status: AttendanceStatus; time: string; method: string }>();
    attendance
      .filter(a => a.batchId === activeBatch?.id && a.date === selectedDate)
      .forEach(a => {
        map.set(a.studentId.toUpperCase(), {
          id: a.id,
          status: a.status,
          time: a.time,
          method: a.method
        });
      });
    return map;
  }, [attendance, activeBatch, selectedDate]);

  // Calculate statistics for this session
  const totalEnrolled = batchStudents.length;
  const presentCount = batchStudents.filter(s => {
    const record = batchAttendanceMap.get(s.id.toUpperCase());
    return record && (record.status === 'present' || record.status === 'late');
  }).length;
  const absentCount = batchStudents.filter(s => {
    const record = batchAttendanceMap.get(s.id.toUpperCase());
    return record && record.status === 'absent';
  }).length;
  const unrecordedCount = totalEnrolled - presentCount - absentCount;
  const attendanceRate = totalEnrolled > 0 ? Math.round((presentCount / totalEnrolled) * 100) : 0;

  // Toggle single student attendance
  const handleToggleStatus = (studentId: string, newStatus: AttendanceStatus) => {
    const existing = batchAttendanceMap.get(studentId.toUpperCase());
    if (existing) {
      // update existing
      bulkUpdateAttendance([
        {
          studentId,
          batchId: activeBatch.id,
          date: selectedDate,
          status: newStatus
        }
      ]);
    } else {
      // create new record
      recordAttendance({
        studentId,
        batchId: activeBatch.id,
        date: selectedDate,
        status: newStatus,
        method: 'manual',
        recordedBy: currentUser?.name || 'Faculty'
      });
    }
  };

  // Mark all unrecorded as Present
  const handleMarkAllPresent = () => {
    const updates = batchStudents.map(s => ({
      studentId: s.id,
      batchId: activeBatch.id,
      date: selectedDate,
      status: 'present' as AttendanceStatus
    }));
    bulkUpdateAttendance(updates);
  };

  // Export CSV
  const handleExportCSV = () => {
    const rows = batchStudents.map(s => {
      const rec = batchAttendanceMap.get(s.id.toUpperCase());
      return {
        date: selectedDate,
        batch: activeBatch?.name || '',
        studentId: s.id,
        fullName: s.fullName,
        phone: s.phone,
        status: rec?.status.toUpperCase() || 'UNRECORDED',
        time: rec?.time || '-',
        method: rec?.method || '-'
      };
    });

    exportToCSV(`attendance_${activeBatch?.name}_${selectedDate}`, rows);
  };

  // Printable View
  const handlePrint = () => {
    window.print();
  };

  // Filtered student list
  const filteredList = batchStudents.filter(s => {
    const matchesSearch =
      !searchQuery.trim() ||
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());

    const rec = batchAttendanceMap.get(s.id.toUpperCase());
    const currentStatus = rec ? rec.status : 'unrecorded';

    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'present') return matchesSearch && (currentStatus === 'present' || currentStatus === 'late');
    if (statusFilter === 'absent') return matchesSearch && currentStatus === 'absent';
    return matchesSearch && currentStatus === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Attendance Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time batch roll call, QR gate check-ins, and session statistics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/scanner')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] rounded-xl transition-colors cursor-pointer shadow-sm shadow-[#7047D7]/30"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Launch QR Scanner</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#7047D7]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Date & Batch Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 text-slate-800"
            />
          </div>

          {/* Batch Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Batch:</span>
            <select
              value={selectedBatchId}
              onChange={e => setSelectedBatchId(e.target.value)}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 text-slate-800"
            >
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.startTime} - {b.endTime})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Bulk Action */}
        <button
          onClick={handleMarkAllPresent}
          className="text-xs font-semibold text-[#7047D7] hover:text-[#45258D] hover:underline cursor-pointer"
        >
          Mark All Unrecorded as Present
        </button>
      </div>

      {/* Session KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-500 block">Enrolled in Batch</span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
            {totalEnrolled}
          </span>
          <span className="text-[11px] text-slate-400">Total batch roster</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-500 block">Present / On Time</span>
          <span className="text-2xl font-extrabold text-emerald-600 font-mono mt-1 block">
            {presentCount}
          </span>
          <span className="text-[11px] text-emerald-700">Active students today</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-500 block">Absent / Excused</span>
          <span className="text-2xl font-extrabold text-red-600 font-mono mt-1 block">
            {absentCount}
          </span>
          <span className="text-[11px] text-red-500">Recorded absent</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-500 block">Attendance Rate</span>
          <span className="text-2xl font-extrabold text-[#7047D7] font-mono mt-1 block">
            {attendanceRate}%
          </span>
          <span className="text-[11px] text-[#7047D7]">Batch turnout</span>
        </div>
      </div>

      {/* Student List & Attendance Toggles */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Table Search & Status Filter */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between no-print">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search student by name or ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-[#7047D7] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({batchStudents.length})
            </button>
            <button
              onClick={() => setStatusFilter('present')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'present' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Present ({presentCount})
            </button>
            <button
              onClick={() => setStatusFilter('absent')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'absent' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Absent ({absentCount})
            </button>
          </div>
        </div>

        {/* Printable Sheet Header */}
        <div className="p-4 bg-[#FAF9FF] border-b border-slate-100 print-only">
          <h2 className="text-lg font-bold text-slate-900">Zenvora Academy — Official Attendance Roster</h2>
          <p className="text-xs text-slate-600">
            Batch: {activeBatch?.name} | Date: {selectedDate} | Total Enrolled: {totalEnrolled} | Present: {presentCount} ({attendanceRate}%)
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9FF] text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Student ID & Name</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Recorded Time & Method</th>
                <th className="py-3 px-4 text-right no-print">Mark Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    No students match the criteria for this batch.
                  </td>
                </tr>
              ) : (
                filteredList.map(student => {
                  const record = batchAttendanceMap.get(student.id.toUpperCase());

                  return (
                    <tr key={student.id} className="hover:bg-[#FAF9FF]/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#F3EEFF] text-[#7047D7] font-bold text-xs flex items-center justify-center shrink-0">
                            {student.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {student.fullName}
                            </span>
                            <span className="text-[10px] font-mono text-[#7047D7]">
                              {student.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {record ? (
                          record.status === 'present' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Present
                            </span>
                          ) : record.status === 'late' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              Late Arrival
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full">
                              <XCircle className="w-3.5 h-3.5 text-red-600" />
                              Absent
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">
                            Unrecorded
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        {record ? (
                          <div>
                            <span className="font-mono text-xs block">{record.time}</span>
                            <span className="text-[10px] text-slate-400 capitalize">
                              Via {record.method.replace('_', ' ')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right no-print">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleStatus(student.id, 'present')}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                              record?.status === 'present'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700'
                            }`}
                          >
                            Present
                          </button>

                          <button
                            onClick={() => handleToggleStatus(student.id, 'late')}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                              record?.status === 'late'
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700'
                            }`}
                          >
                            Late
                          </button>

                          <button
                            onClick={() => handleToggleStatus(student.id, 'absent')}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                              record?.status === 'absent'
                                ? 'bg-red-600 text-white'
                                : 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
