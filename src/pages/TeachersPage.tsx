import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Teacher } from '../types';
import { Modal } from '../components/Modal';
import {
  GraduationCap,
  Plus,
  Search,
  Phone,
  Mail,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const TeachersPage: React.FC = () => {
  const { demoLogin } = useAuth();
  const {
    teachers,
    batches,
    courses,
    addTeacher,
    updateTeacher,
    deleteTeacher
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState<Omit<Teacher, 'id'>>({
    name: '',
    phone: '',
    email: '',
    subject: 'Physics & Applied Mechanics',
    assignedBatchIds: [],
    joiningDate: new Date().toISOString().slice(0, 10),
    status: 'active',
    bio: ''
  });
  const [formError, setFormError] = useState<string | null>(null);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => {
      const q = searchQuery.trim().toLowerCase();
      return (
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.phone.includes(q)
      );
    });
  }, [teachers, searchQuery]);

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      subject: 'Applied Mathematics',
      assignedBatchIds: [],
      joiningDate: new Date().toISOString().slice(0, 10),
      status: 'active',
      bio: ''
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      phone: teacher.phone,
      email: teacher.email,
      subject: teacher.subject,
      assignedBatchIds: teacher.assignedBatchIds,
      joiningDate: teacher.joiningDate,
      status: teacher.status,
      bio: teacher.bio || ''
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Teacher name is required.');
      return;
    }
    if (!formData.phone.trim()) {
      setFormError('Phone number is required.');
      return;
    }

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, formData);
    } else {
      addTeacher(formData);
    }
    setIsModalOpen(false);
  };

  const toggleBatchAssignment = (batchId: string) => {
    if (formData.assignedBatchIds.includes(batchId)) {
      setFormData({
        ...formData,
        assignedBatchIds: formData.assignedBatchIds.filter(id => id !== batchId)
      });
    } else {
      setFormData({
        ...formData,
        assignedBatchIds: [...formData.assignedBatchIds, batchId]
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Teacher & Faculty Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Subject specialists, batch mentorship assignments, and teaching schedules
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] rounded-xl transition-colors cursor-pointer shadow-sm shadow-[#7047D7]/30 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by faculty name, subject, or ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredTeachers.map(teacher => {
          const assignedBatches = batches.filter(b => teacher.assignedBatchIds.includes(b.id) || b.teacherId === teacher.id);

          return (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between hover:border-[#7047D7]/30 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#7047D7] flex items-center justify-center text-base font-bold shadow-2xs">
                      {teacher.name.replace('Dr. ', '').replace('Prof. ', '').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {teacher.name}
                        </h3>
                        <span className="text-[10px] font-mono text-[#7047D7] bg-[#F3EEFF] px-1.5 py-0.5 rounded">
                          {teacher.id}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#7047D7] mt-0.5">
                        {teacher.subject}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(teacher)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                      title="Edit Teacher"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {teacher.bio && (
                  <p className="text-xs text-slate-600 mb-3 bg-[#FAF9FF] p-2.5 rounded-xl border border-slate-100">
                    {teacher.bio}
                  </p>
                )}

                {/* Contact */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#7047D7]" />
                    <span className="truncate">{teacher.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-[#7047D7]" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                </div>

                {/* Assigned Batches */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Assigned Cohorts & Batches:
                  </span>
                  {assignedBatches.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No batches assigned yet</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {assignedBatches.map(b => (
                        <span
                          key={b.id}
                          className="px-2 py-0.5 rounded-md bg-[#FAF9FF] border border-slate-200 text-slate-700 text-[11px] font-medium"
                        >
                          {b.name} ({b.startTime})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Demo switch shortcut */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Joined: {teacher.joiningDate}
                </span>
                <button
                  onClick={() => demoLogin('teacher')}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#7047D7] hover:underline cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Simulate Login as this Teacher</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeacher ? `Edit Faculty — ${editingTeacher.name}` : 'Add Faculty Member'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name & Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Prof. Rajesh Verma"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98230 45671"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject Specialization *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Physics & Applied Mechanics"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="tutor@zenvora.edu"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bio / Credentials
            </label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Degrees, research experience, and previous mentoring..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assign Batches
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
              {batches.map(b => (
                <label key={b.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.assignedBatchIds.includes(b.id)}
                    onChange={() => toggleBatchAssignment(b.id)}
                    className="rounded text-[#7047D7] focus:ring-[#7047D7]"
                  />
                  <span>{b.name} ({b.startTime} - {b.endTime})</span>
                </label>
              ))}
            </div>
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
              Save Teacher Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
