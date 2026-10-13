import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Student, StudentStatus } from '../types';
import { StudentIdCardModal } from '../components/StudentIdCardModal';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { exportToCSV } from '../utils/exportCsv';
import {
  UserPlus,
  Search,
  Filter,
  Download,
  QrCode,
  Edit2,
  Trash2,
  Eye,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const {
    students,
    courses,
    batches,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentPendingBalance,
    getStudentAttendanceStats
  } = useData();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [qrModalStudent, setQrModalStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // Form State
  const initialFormState: Omit<Student, 'id'> = {
    fullName: '',
    phone: '',
    guardianName: '',
    guardianPhone: '',
    email: '',
    courseId: courses[0]?.id || '',
    batchId: batches[0]?.id || '',
    joiningDate: new Date().toISOString().slice(0, 10),
    monthlyFee: 3500,
    status: 'active',
    notes: ''
  };
  const [formData, setFormData] = useState<Omit<Student, 'id'>>(initialFormState);
  const [formError, setFormError] = useState<string | null>(null);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        student.fullName.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query) ||
        student.phone.includes(query) ||
        student.guardianPhone.includes(query);

      const matchesCourse = selectedCourse === 'all' || student.courseId === selectedCourse;
      const matchesBatch = selectedBatch === 'all' || student.batchId === selectedBatch;
      const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;

      return matchesSearch && matchesCourse && matchesBatch && matchesStatus;
    });
  }, [students, searchQuery, selectedCourse, selectedBatch, selectedStatus]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData({
      ...initialFormState,
      courseId: courses[0]?.id || '',
      batchId: batches[0]?.id || ''
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      fullName: student.fullName,
      phone: student.phone,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      email: student.email || '',
      courseId: student.courseId,
      batchId: student.batchId,
      joiningDate: student.joiningDate,
      monthlyFee: student.monthlyFee,
      status: student.status,
      notes: student.notes || ''
    });
    setFormError(null);
  };

  // Handle Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setFormError('Student full name is required.');
      return;
    }
    if (!formData.phone.trim()) {
      setFormError('Student phone number is required.');
      return;
    }
    if (!formData.guardianName.trim() || !formData.guardianPhone.trim()) {
      setFormError('Guardian details are required for tuition safety.');
      return;
    }
    if (formData.monthlyFee <= 0) {
      setFormError('Monthly tuition fee must be greater than 0.');
      return;
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
      setEditingStudent(null);
    } else {
      const created = addStudent(formData);
      // Auto-offer to view QR card for newly enrolled student
      setQrModalStudent(created);
      setIsAddModalOpen(false);
    }
  };

  // Handle Export CSV
  const handleExportCSV = () => {
    exportToCSV('zenvora_students', filteredStudents, [
      { key: 'id', label: 'Student ID' },
      { key: 'fullName', label: 'Full Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'guardianName', label: 'Guardian Name' },
      { key: 'guardianPhone', label: 'Guardian Phone' },
      { key: 'courseId', label: 'Course Code' },
      { key: 'batchId', label: 'Batch Code' },
      { key: 'joiningDate', label: 'Joining Date' },
      { key: 'monthlyFee', label: 'Monthly Fee (INR)' },
      { key: 'status', label: 'Status' }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Student Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Directory of enrolled students, personalized QR code passes, and tuition profiles
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#7047D7]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] rounded-xl transition-colors cursor-pointer shadow-sm shadow-[#7047D7]/30"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enrol New Student</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by student name, ID (e.g. ZNV-2026-001), or phone..."
            className="w-full pl-9 pr-3 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 focus:border-[#7047D7]"
          />
        </div>

        {/* Course Filter */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 text-slate-700"
          >
            <option value="all">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Batch Filter */}
          <select
            value={selectedBatch}
            onChange={e => setSelectedBatch(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 text-slate-700"
          >
            <option value="all">All Batches</option>
            {batches.map(b => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Enrolment</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Students Data Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9FF] border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Student ID & Name</th>
                <th className="py-3 px-4">Course & Batch</th>
                <th className="py-3 px-4">Contact & Guardian</th>
                <th className="py-3 px-4 text-right">Monthly Fee</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">No students found matching your filters</p>
                    <p className="text-xs mt-1">Try clearing your search query or reset filter settings</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const course = courses.find(c => c.id === student.courseId);
                  const batch = batches.find(b => b.id === student.batchId);
                  const { pending } = getStudentPendingBalance(student.id);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-[#FAF9FF]/60 transition-colors"
                    >
                      {/* ID & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#F3EEFF] text-[#7047D7] font-bold text-xs flex items-center justify-center shrink-0">
                            {student.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {student.fullName}
                            </span>
                            <span className="text-[10px] font-mono font-semibold text-[#7047D7]">
                              {student.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Course & Batch */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 block truncate max-w-[200px]">
                          {course?.name || 'Class 10 CBSE'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {batch?.name || 'Batch Alpha'}
                        </span>
                      </td>

                      {/* Contact & Guardian */}
                      <td className="py-3 px-4">
                        <div className="text-slate-700">
                          <span className="block">{student.phone}</span>
                          <span className="text-[11px] text-slate-400">
                            Guardian: {student.guardianName} ({student.guardianPhone})
                          </span>
                        </div>
                      </td>

                      {/* Monthly Fee & Pending */}
                      <td className="py-3 px-4 text-right">
                        <span className="font-mono font-bold text-slate-900 block">
                          ₹{student.monthlyFee.toLocaleString('en-IN')}
                        </span>
                        {pending > 0 ? (
                          <span className="text-[10px] font-semibold text-amber-700">
                            Due: ₹{pending.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-600">
                            Fully Paid
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        {student.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* QR Code Card */}
                          <button
                            onClick={() => setQrModalStudent(student)}
                            className="p-1.5 text-[#7047D7] hover:bg-[#F3EEFF] rounded-lg transition-colors cursor-pointer"
                            title="Generate & Print Student QR ID Card"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          {/* Profile Details */}
                          <button
                            onClick={() => setViewingStudent(student)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Student Information"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeletingStudent(student)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove Student Record"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isAddModalOpen || editingStudent !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingStudent(null);
        }}
        title={editingStudent ? `Edit Student — ${editingStudent.id}` : 'Enrol New Student'}
        subtitle="Automatic unique QR student identifier will be assigned on enrolment"
        maxWidth="xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Priya Sharma"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 98201 11223"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Parent / Guardian Name *
              </label>
              <input
                type="text"
                required
                value={formData.guardianName}
                onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                placeholder="e.g. Ramesh Sharma"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Parent / Guardian Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.guardianPhone}
                onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
                placeholder="e.g. +91 98201 99887"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Enrolment *
              </label>
              <select
                value={formData.courseId}
                onChange={e => {
                  const selCourse = courses.find(c => c.id === e.target.value);
                  setFormData({
                    ...formData,
                    courseId: e.target.value,
                    monthlyFee: selCourse ? selCourse.feeAmount : formData.monthlyFee
                  });
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} (₹{c.feeAmount}/mo)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Batch Allocation *
              </label>
              <select
                value={formData.batchId}
                onChange={e => setFormData({ ...formData, batchId: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              >
                {batches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.days.join(', ')} {b.startTime}-{b.endTime})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monthly Fee (₹ INR) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.monthlyFee}
                onChange={e => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Joining Date *
              </label>
              <input
                type="date"
                required
                value={formData.joiningDate}
                onChange={e => setFormData({ ...formData, joiningDate: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@gmail.com"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enrolment Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as StudentStatus })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              >
                <option value="active">Active Enrolment</option>
                <option value="inactive">Inactive / On Leave</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Internal Teacher / Academic Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Academic goals, target board score, or special attention needs..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingStudent(null);
              }}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] rounded-xl shadow-sm shadow-[#7047D7]/30"
            >
              {editingStudent ? 'Save Changes' : 'Complete Enrolment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Student Detailed Profile Drawer/Modal */}
      {viewingStudent && (
        <Modal
          isOpen={true}
          onClose={() => setViewingStudent(null)}
          title={`Student Profile — ${viewingStudent.fullName}`}
          subtitle={`ID: ${viewingStudent.id}`}
          maxWidth="2xl"
        >
          {(() => {
            const course = courses.find(c => c.id === viewingStudent.courseId);
            const batch = batches.find(b => b.id === viewingStudent.batchId);
            const attendanceStats = getStudentAttendanceStats(viewingStudent.id);
            const feeBalance = getStudentPendingBalance(viewingStudent.id);

            return (
              <div className="space-y-6">
                {/* Profile Header Card */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-[#FAF9FF] border border-slate-100">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7047D7] to-[#45258D] text-white font-bold text-xl flex items-center justify-center shadow-md">
                    {viewingStudent.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {viewingStudent.fullName}
                      </h3>
                      <span className="font-mono text-xs font-semibold text-[#7047D7] bg-[#F3EEFF] px-2 py-0.5 rounded-md self-center sm:self-auto">
                        {viewingStudent.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {course?.name} · {batch?.name}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Enrolled on {viewingStudent.joiningDate}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setQrModalStudent(viewingStudent);
                      setViewingStudent(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] rounded-xl shadow-xs"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View QR Pass</span>
                  </button>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">ATTENDANCE</span>
                    <span className="text-lg font-bold text-slate-900 font-mono">
                      {attendanceStats.rate}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {attendanceStats.present} of {attendanceStats.total} sessions
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">MONTHLY FEE</span>
                    <span className="text-lg font-bold text-slate-900 font-mono">
                      ₹{viewingStudent.monthlyFee.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Per month</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">TOTAL PAID</span>
                    <span className="text-lg font-bold text-emerald-600 font-mono">
                      ₹{feeBalance.totalPaid.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500 block">All time</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">PENDING DUES</span>
                    <span className="text-lg font-bold text-amber-700 font-mono">
                      ₹{feeBalance.pending.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Outstanding</span>
                  </div>
                </div>

                {/* Contact & Parent Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                    <span className="font-bold text-slate-800 uppercase text-[10px] block">
                      Student Contact
                    </span>
                    <p className="flex items-center gap-2 text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-[#7047D7]" />
                      <span>{viewingStudent.phone}</span>
                    </p>
                    {viewingStudent.email && (
                      <p className="flex items-center gap-2 text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-[#7047D7]" />
                        <span>{viewingStudent.email}</span>
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                    <span className="font-bold text-slate-800 uppercase text-[10px] block">
                      Guardian / Emergency Contact
                    </span>
                    <p className="text-slate-800 font-medium">
                      {viewingStudent.guardianName}
                    </p>
                    <p className="flex items-center gap-2 text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{viewingStudent.guardianPhone}</span>
                    </p>
                  </div>
                </div>

                {viewingStudent.notes && (
                  <div className="p-3 bg-[#FAF9FF] rounded-xl border border-slate-100 text-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Academic Notes
                    </span>
                    <p className="text-slate-700">{viewingStudent.notes}</p>
                  </div>
                )}
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Student QR Card Modal */}
      <StudentIdCardModal
        student={qrModalStudent}
        isOpen={qrModalStudent !== null}
        onClose={() => setQrModalStudent(null)}
      />

      {/* Delete Confirmation Dialog */}
      {deletingStudent && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Student Record?"
          message={`Are you sure you want to delete ${deletingStudent.fullName} (${deletingStudent.id})? This will remove all personal records and their QR code pass.`}
          confirmText="Yes, Delete Student"
          isDestructive={true}
          onConfirm={() => {
            deleteStudent(deletingStudent.id);
            setDeletingStudent(null);
          }}
          onCancel={() => setDeletingStudent(null)}
        />
      )}
    </div>
  );
};
