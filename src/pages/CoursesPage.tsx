import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Course, Batch } from '../types';
import { Modal } from '../components/Modal';
import {
  BookOpen,
  Plus,
  Users,
  Clock,
  Calendar,
  Edit2,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Layers,
  ArrowRight
} from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const {
    courses,
    batches,
    teachers,
    students,
    addCourse,
    updateCourse,
    addBatch,
    updateBatch,
    getBatchStudentCount
  } = useData();

  // Tab: 'courses' | 'batches'
  const [activeTab, setActiveTab] = useState<'courses' | 'batches'>('batches');

  // Course Modal
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseFormData, setCourseFormData] = useState<Omit<Course, 'id'>>({
    name: '',
    description: '',
    duration: '10 Months',
    feeAmount: 3500,
    status: 'active'
  });

  // Batch Modal
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [batchFormData, setBatchFormData] = useState<Omit<Batch, 'id'>>({
    name: '',
    courseId: courses[0]?.id || '',
    teacherId: teachers[0]?.id || '',
    days: ['Mon', 'Wed', 'Fri'],
    startTime: '16:00',
    endTime: '17:30',
    capacity: 25,
    status: 'active',
    room: 'Room 101'
  });

  // Course Handlers
  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setCourseFormData({
      name: '',
      description: '',
      duration: '10 Months',
      feeAmount: 3500,
      status: 'active'
    });
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseFormData({
      name: course.name,
      description: course.description,
      duration: course.duration,
      feeAmount: course.feeAmount,
      status: course.status
    });
    setIsCourseModalOpen(true);
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      updateCourse(editingCourse.id, courseFormData);
    } else {
      addCourse(courseFormData);
    }
    setIsCourseModalOpen(false);
  };

  // Batch Handlers
  const handleOpenAddBatch = () => {
    setEditingBatch(null);
    setBatchFormData({
      name: '',
      courseId: courses[0]?.id || '',
      teacherId: teachers[0]?.id || '',
      days: ['Mon', 'Wed', 'Fri'],
      startTime: '16:00',
      endTime: '17:30',
      capacity: 25,
      status: 'active',
      room: 'Room 201'
    });
    setIsBatchModalOpen(true);
  };

  const handleOpenEditBatch = (batch: Batch) => {
    setEditingBatch(batch);
    setBatchFormData({
      name: batch.name,
      courseId: batch.courseId,
      teacherId: batch.teacherId,
      days: batch.days,
      startTime: batch.startTime,
      endTime: batch.endTime,
      capacity: batch.capacity,
      status: batch.status,
      room: batch.room || ''
    });
    setIsBatchModalOpen(true);
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBatch) {
      updateBatch(editingBatch.id, batchFormData);
    } else {
      addBatch(batchFormData);
    }
    setIsBatchModalOpen(false);
  };

  const toggleDay = (day: string) => {
    if (batchFormData.days.includes(day)) {
      setBatchFormData({
        ...batchFormData,
        days: batchFormData.days.filter(d => d !== day)
      });
    } else {
      setBatchFormData({
        ...batchFormData,
        days: [...batchFormData.days, day]
      });
    }
  };

  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Academic Courses & Batches
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Curriculum offerings, room allocations, capacity tracking, and assigned faculty
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'batches' ? (
            <button
              onClick={handleOpenAddBatch}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] rounded-xl transition-colors cursor-pointer shadow-sm shadow-[#7047D7]/30"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Batch</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddCourse}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] rounded-xl transition-colors cursor-pointer shadow-sm shadow-[#7047D7]/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Course</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('batches')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'batches'
              ? 'border-[#7047D7] text-[#7047D7]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Active Batches ({batches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'courses'
              ? 'border-[#7047D7] text-[#7047D7]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Course Curriculums ({courses.length})</span>
        </button>
      </div>

      {/* BATCHES VIEW */}
      {activeTab === 'batches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map(batch => {
            const course = courses.find(c => c.id === batch.courseId);
            const teacher = teachers.find(t => t.id === batch.teacherId);
            const enrolled = getBatchStudentCount(batch.id);
            const isFull = enrolled >= batch.capacity;
            const percentage = Math.min(100, Math.round((enrolled / batch.capacity) * 100));

            return (
              <div
                key={batch.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between hover:border-[#7047D7]/30 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-[#7047D7] bg-[#F3EEFF] px-2 py-0.5 rounded-md">
                        {batch.id}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">
                        {batch.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleOpenEditBatch(batch)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                      title="Edit Batch"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 font-medium truncate mb-3">
                    {course?.name || 'Class 10 CBSE'}
                  </p>

                  {/* Schedule Details */}
                  <div className="space-y-1.5 text-xs text-slate-600 bg-[#FAF9FF] p-3 rounded-xl border border-slate-100 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#7047D7]" /> Days:
                      </span>
                      <span className="font-semibold text-slate-800">
                        {batch.days.join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#7047D7]" /> Time:
                      </span>
                      <span className="font-mono font-semibold text-slate-800">
                        {batch.startTime} – {batch.endTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-[#7047D7]" /> Faculty:
                      </span>
                      <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                        {teacher?.name || 'Assigned Tutor'}
                      </span>
                    </div>

                    {batch.room && (
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">Location:</span>
                        <span className="text-slate-600 text-[11px]">{batch.room}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Capacity Occupancy</span>
                    <span className="font-mono font-bold text-slate-800">
                      {enrolled} / {batch.capacity} seats
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isFull ? 'bg-amber-500' : 'bg-[#7047D7]'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* COURSES VIEW */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map(course => {
            const courseBatches = batches.filter(b => b.courseId === course.id);
            const totalStudentsInCourse = students.filter(
              s => s.courseId === course.id && s.status === 'active'
            ).length;

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between hover:border-[#7047D7]/30 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-[#7047D7] bg-[#F3EEFF] px-2 py-0.5 rounded-md">
                        {course.id}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {course.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleOpenEditCourse(course)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                      title="Edit Course"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-[#FAF9FF] p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">MONTHLY FEE</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      ₹{course.feeAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="bg-[#FAF9FF] p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">DURATION</span>
                    <span className="font-semibold text-slate-800 text-sm">
                      {course.duration}
                    </span>
                  </div>

                  <div className="bg-[#FAF9FF] p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">ENROLLED</span>
                    <span className="font-mono font-bold text-[#7047D7] text-sm">
                      {totalStudentsInCourse} Students
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Course Modal */}
      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        title={editingCourse ? `Edit Course — ${editingCourse.name}` : 'Create Academic Course'}
        maxWidth="md"
      >
        <form onSubmit={handleCourseSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Course Title *
            </label>
            <input
              type="text"
              required
              value={courseFormData.name}
              onChange={e => setCourseFormData({ ...courseFormData, name: e.target.value })}
              placeholder="e.g. Class 12 JEE — Physics Mastery"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description *
            </label>
            <textarea
              rows={2}
              required
              value={courseFormData.description}
              onChange={e => setCourseFormData({ ...courseFormData, description: e.target.value })}
              placeholder="Syllabus, topics covered, and targeted entrance exams..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration *
              </label>
              <input
                type="text"
                required
                value={courseFormData.duration}
                onChange={e => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                placeholder="e.g. 10 Months"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monthly Fee (₹) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={courseFormData.feeAmount}
                onChange={e => setCourseFormData({ ...courseFormData, feeAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCourseModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] rounded-xl shadow-sm"
            >
              Save Course
            </button>
          </div>
        </form>
      </Modal>

      {/* Batch Modal */}
      <Modal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        title={editingBatch ? `Edit Batch — ${editingBatch.name}` : 'Create New Batch'}
        maxWidth="lg"
      >
        <form onSubmit={handleBatchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Batch Name *
              </label>
              <input
                type="text"
                required
                value={batchFormData.name}
                onChange={e => setBatchFormData({ ...batchFormData, name: e.target.value })}
                placeholder="e.g. JEE Physics Alpha 2026"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Curriculum / Course *
              </label>
              <select
                value={batchFormData.courseId}
                onChange={e => setBatchFormData({ ...batchFormData, courseId: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 text-slate-800"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Faculty *
              </label>
              <select
                value={batchFormData.teacherId}
                onChange={e => setBatchFormData({ ...batchFormData, teacherId: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 text-slate-800"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.subject})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={batchFormData.startTime}
                onChange={e => setBatchFormData({ ...batchFormData, startTime: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                End Time *
              </label>
              <input
                type="time"
                required
                value={batchFormData.endTime}
                onChange={e => setBatchFormData({ ...batchFormData, endTime: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Classroom / Location
              </label>
              <input
                type="text"
                value={batchFormData.room}
                onChange={e => setBatchFormData({ ...batchFormData, room: e.target.value })}
                placeholder="e.g. Hall A / Physics Lab 201"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Capacity (Max) *
              </label>
              <input
                type="number"
                min="5"
                max="60"
                required
                value={batchFormData.capacity}
                onChange={e => setBatchFormData({ ...batchFormData, capacity: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Class Days *
            </label>
            <div className="flex flex-wrap gap-2">
              {allDays.map(day => {
                const isSelected = batchFormData.days.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#7047D7] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsBatchModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] rounded-xl shadow-sm"
            >
              Save Batch
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
