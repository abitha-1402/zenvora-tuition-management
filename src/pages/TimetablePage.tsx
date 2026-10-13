import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { TimetableSchedule } from '../types';
import { Modal } from '../components/Modal';
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  AlertTriangle,
  GraduationCap,
  Layers,
  Edit2,
  Trash2,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const TimetablePage: React.FC = () => {
  const {
    timetable,
    courses,
    batches,
    teachers,
    addTimetableSchedule,
    updateTimetableSchedule,
    deleteTimetableSchedule
  } = useData();

  const daysList: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const currentDayIndex = new Date().getDay();
  // 0 is Sunday, 1 is Monday ... map to daysList
  const currentDayName = currentDayIndex === 0 ? 'Sunday' : daysList[currentDayIndex - 1];

  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('all');
  const [selectedTeacherFilter, setSelectedTeacherFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<TimetableSchedule | null>(null);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<TimetableSchedule, 'id'>>({
    courseId: courses[0]?.id || '',
    batchId: batches[0]?.id || '',
    teacherId: teachers[0]?.id || '',
    dayOfWeek: 'Monday',
    startTime: '16:00',
    endTime: '17:30',
    room: 'Room 201'
  });

  // Check for scheduling conflicts (same teacher or room at the same time on the same day)
  const checkForConflict = (schedule: Omit<TimetableSchedule, 'id'>, excludeId?: string): string | null => {
    const overlapping = timetable.find(item => {
      if (excludeId && item.id === excludeId) return false;
      if (item.dayOfWeek !== schedule.dayOfWeek) return false;

      // Check time overlap: startA < endB && endA > startB
      const hasTimeOverlap =
        schedule.startTime < item.endTime && schedule.endTime > item.startTime;

      if (hasTimeOverlap) {
        if (item.teacherId === schedule.teacherId) {
          const t = teachers.find(teach => teach.id === item.teacherId);
          return true;
        }
        if (item.room.toLowerCase() === schedule.room.toLowerCase()) {
          return true;
        }
      }
      return false;
    });

    if (overlapping) {
      if (overlapping.teacherId === schedule.teacherId) {
        const t = teachers.find(teach => teach.id === overlapping.teacherId);
        return `Conflict Warning: ${t?.name || 'This teacher'} is already scheduled for another batch (${overlapping.startTime}–${overlapping.endTime}) on ${schedule.dayOfWeek}.`;
      }
      return `Conflict Warning: Classroom "${schedule.room}" is already reserved for another class (${overlapping.startTime}–${overlapping.endTime}) on ${schedule.dayOfWeek}.`;
    }

    return null;
  };

  const handleOpenAdd = () => {
    setEditingSchedule(null);
    setConflictWarning(null);
    setFormData({
      courseId: courses[0]?.id || '',
      batchId: batches[0]?.id || '',
      teacherId: teachers[0]?.id || '',
      dayOfWeek: currentDayName,
      startTime: '16:00',
      endTime: '17:30',
      room: 'Room 201'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sched: TimetableSchedule) => {
    setEditingSchedule(sched);
    setConflictWarning(null);
    setFormData({
      courseId: sched.courseId,
      batchId: sched.batchId,
      teacherId: sched.teacherId,
      dayOfWeek: sched.dayOfWeek,
      startTime: sched.startTime,
      endTime: sched.endTime,
      room: sched.room
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const conflict = checkForConflict(formData, editingSchedule?.id);
    if (conflict) {
      setConflictWarning(conflict);
      return;
    }

    if (editingSchedule) {
      updateTimetableSchedule(editingSchedule.id, formData);
    } else {
      addTimetableSchedule(formData);
    }
    setIsModalOpen(false);
  };

  // Filtered Timetable
  const filteredSchedules = useMemo(() => {
    return timetable.filter(sched => {
      const matchDay = selectedDay === 'all' || sched.dayOfWeek === selectedDay;
      const matchBatch = selectedBatchFilter === 'all' || sched.batchId === selectedBatchFilter;
      const matchTeacher = selectedTeacherFilter === 'all' || sched.teacherId === selectedTeacherFilter;
      return matchDay && matchBatch && matchTeacher;
    });
  }, [timetable, selectedDay, selectedBatchFilter, selectedTeacherFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Weekly Class Timetable
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Class schedules, hall allocation, conflict checking, and live daily highlights
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] rounded-xl transition-colors cursor-pointer shadow-sm shadow-[#7047D7]/30 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Class Slot</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Day Filter */}
          <select
            value={selectedDay}
            onChange={e => setSelectedDay(e.target.value)}
            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 text-slate-700"
          >
            <option value="all">All Days of Week</option>
            {daysList.map(d => (
              <option key={d} value={d}>
                {d} {d === currentDayName ? '(Today)' : ''}
              </option>
            ))}
          </select>

          {/* Batch Filter */}
          <select
            value={selectedBatchFilter}
            onChange={e => setSelectedBatchFilter(e.target.value)}
            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 text-slate-700"
          >
            <option value="all">All Batches</option>
            {batches.map(b => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Teacher Filter */}
          <select
            value={selectedTeacherFilter}
            onChange={e => setSelectedTeacherFilter(e.target.value)}
            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 text-slate-700"
          >
            <option value="all">All Faculty</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#7047D7] bg-[#F3EEFF] px-3 py-1 rounded-xl">
          <Calendar className="w-3.5 h-3.5" />
          <span>Today is {currentDayName}</span>
        </div>
      </div>

      {/* Week Day Schedule Columns / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {daysList.map(day => {
          const dayClasses = filteredSchedules.filter(s => s.dayOfWeek === day);
          const isToday = day === currentDayName;

          if (selectedDay !== 'all' && selectedDay !== day) return null;

          return (
            <div
              key={day}
              className={`rounded-2xl border transition-all ${
                isToday
                  ? 'bg-white border-[#7047D7] ring-2 ring-[#7047D7]/15 shadow-sm'
                  : 'bg-white border-slate-100 shadow-xs'
              }`}
            >
              {/* Day Header */}
              <div
                className={`p-4 border-b flex items-center justify-between rounded-t-2xl ${
                  isToday
                    ? 'bg-[#F3EEFF] border-[#7047D7]/20 text-[#45258D]'
                    : 'bg-[#FAF9FF] border-slate-100 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold">{day}</h3>
                  {isToday && (
                    <span className="text-[10px] font-bold bg-[#7047D7] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Today
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono font-semibold text-slate-400">
                  {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
                </span>
              </div>

              {/* Class Cards for this Day */}
              <div className="p-4 space-y-3">
                {dayClasses.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6 italic">
                    No classes scheduled for {day}
                  </p>
                ) : (
                  dayClasses.map(sched => {
                    const batch = batches.find(b => b.id === sched.batchId);
                    const teacher = teachers.find(t => t.id === sched.teacherId);
                    const course = courses.find(c => c.id === sched.courseId);

                    return (
                      <div
                        key={sched.id}
                        className="p-3 rounded-xl bg-[#FAF9FF] border border-slate-100 hover:border-[#7047D7]/30 transition-all text-xs"
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="font-bold text-slate-900 leading-tight">
                            {batch?.name || 'Batch'}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleOpenEdit(sched)}
                              className="p-1 text-slate-400 hover:text-slate-600 rounded"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => deleteTimetableSchedule(sched.id)}
                              className="p-1 text-slate-400 hover:text-red-500 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 truncate mb-2">
                          {course?.name}
                        </p>

                        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/60">
                          <span className="font-mono font-bold text-[#7047D7] bg-white px-2 py-0.5 rounded border border-slate-100">
                            {sched.startTime} – {sched.endTime}
                          </span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {sched.room}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-2">
                          <GraduationCap className="w-3.5 h-3.5 text-[#7047D7]" />
                          <span>{teacher?.name}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSchedule ? 'Edit Class Schedule' : 'Schedule New Class'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {conflictWarning && (
            <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-xl flex items-start gap-2 border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Conflict Detected!</p>
                <p className="mt-0.5">{conflictWarning}</p>
                <button
                  type="button"
                  onClick={() => setConflictWarning(null)}
                  className="mt-2 text-[11px] text-[#7047D7] font-semibold underline"
                >
                  Override and proceed anyway
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Batch *
            </label>
            <select
              value={formData.batchId}
              onChange={e => {
                const b = batches.find(bat => bat.id === e.target.value);
                setFormData({
                  ...formData,
                  batchId: e.target.value,
                  courseId: b ? b.courseId : formData.courseId,
                  teacherId: b ? b.teacherId : formData.teacherId
                });
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 text-slate-800"
            >
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Faculty Member *
              </label>
              <select
                value={formData.teacherId}
                onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 text-slate-800"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Day of Week *
              </label>
              <select
                value={formData.dayOfWeek}
                onChange={e => setFormData({ ...formData, dayOfWeek: e.target.value as any })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 text-slate-800"
              >
                {daysList.map(d => (
                  <option key={d} value={d}>
                    {d}
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
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
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
                value={formData.endTime}
                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hall / Classroom Location *
            </label>
            <input
              type="text"
              required
              value={formData.room}
              onChange={e => setFormData({ ...formData, room: e.target.value })}
              placeholder="e.g. Room 201 or Physics Lab"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] rounded-xl shadow-sm"
            >
              Save Class Slot
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
