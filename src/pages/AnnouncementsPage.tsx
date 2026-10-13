import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Announcement } from '../types';
import { Modal } from '../components/Modal';
import {
  Bell,
  Plus,
  Copy,
  Check,
  MessageCircle,
  Share2,
  Trash2,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { announcements, batches, addAnnouncement, deleteAnnouncement } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Announcement, 'id'>>({
    title: '',
    message: '',
    targetBatchId: 'all',
    priority: 'normal',
    date: new Date().toISOString().slice(0, 10),
    author: currentUser?.name || 'Academic Office'
  });

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      message: '',
      targetBatchId: 'all',
      priority: 'normal',
      date: new Date().toISOString().slice(0, 10),
      author: currentUser?.name || 'Academic Office'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) return;
    addAnnouncement(formData);
    setIsModalOpen(false);
  };

  const handleCopyMessage = (ann: Announcement) => {
    const textToCopy = `*Zenvora Notice: ${ann.title}*\n\n${ann.message}\n\n— ${ann.author} (${ann.date})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(ann.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleWhatsAppShare = (ann: Announcement) => {
    const text = encodeURIComponent(`*Zenvora Tuition Centre Alert: ${ann.title}*\n\n${ann.message}\n\nPublished: ${ann.date}\nZenvora Smart Portal`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const filteredAnnouncements = announcements.filter(ann => {
    return selectedBatchFilter === 'all' || ann.targetBatchId === 'all' || ann.targetBatchId === selectedBatchFilter;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Announcements & Communication
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast test schedules, holiday bulletins, and parent WhatsApp updates
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] rounded-xl transition-colors cursor-pointer shadow-sm shadow-[#7047D7]/30 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Notice</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Filter Target:</span>
          <select
            value={selectedBatchFilter}
            onChange={e => setSelectedBatchFilter(e.target.value)}
            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 text-slate-700"
          >
            <option value="all">All Center Announcements</option>
            {batches.map(b => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          {filteredAnnouncements.length} Notices
        </span>
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold">No announcements found for this filter.</p>
          </div>
        ) : (
          filteredAnnouncements.map(ann => {
            const targetBatch = batches.find(b => b.id === ann.targetBatchId);

            return (
              <div
                key={ann.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 hover:border-[#7047D7]/30 transition-all space-y-3"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {ann.priority === 'urgent' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase">
                        Urgent Notice
                      </span>
                    ) : ann.priority === 'important' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                        Important
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F3EEFF] text-[#45258D] uppercase">
                        Bulletin
                      </span>
                    )}

                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {ann.targetBatchId === 'all' ? 'All Cohorts' : targetBatch?.name || 'Batch'}
                    </span>

                    <span className="text-xs text-slate-400 font-mono">
                      {ann.date}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded cursor-pointer"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                    {ann.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {ann.message}
                  </p>
                </div>

                {/* Footer Controls: WhatsApp & Copy */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-400">
                    Posted by: <strong>{ann.author}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Copy to Clipboard */}
                    <button
                      onClick={() => handleCopyMessage(ann)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer text-xs"
                    >
                      {copiedId === ann.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>

                    {/* WhatsApp Action */}
                    <button
                      onClick={() => handleWhatsAppShare(ann)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors cursor-pointer text-xs shadow-xs"
                      title="Share to Parents on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Share</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish Center Notice"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notice Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Mid-Term Physics Mock Exam Schedule"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Audience *
              </label>
              <select
                value={formData.targetBatchId}
                onChange={e => setFormData({ ...formData, targetBatchId: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 text-slate-800"
              >
                <option value="all">Entire Tuition Center (All)</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority Tag
              </label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 text-slate-800"
              >
                <option value="normal">Standard Bulletin</option>
                <option value="important">Important</option>
                <option value="urgent">Urgent Examination / Holiday</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Announcement Message *
            </label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              placeholder="Provide exact timings, syllabus details, or holiday instructions..."
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
              Publish to Board
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
