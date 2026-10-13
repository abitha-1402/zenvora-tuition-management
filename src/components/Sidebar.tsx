import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';
import {
  LayoutDashboard,
  Users,
  QrCode,
  CalendarCheck,
  CreditCard,
  BookOpen,
  GraduationCap,
  CalendarDays,
  Bell,
  BarChart3,
  Settings,
  X,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, isTeacher } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'QR Camera Scanner', path: '/scanner', icon: QrCode, highlight: true },
    { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
    { name: 'Fee Management', path: '/fees', icon: CreditCard, adminOnly: true },
    { name: 'Courses & Batches', path: '/courses', icon: BookOpen },
    { name: 'Teachers', path: '/teachers', icon: GraduationCap, adminOnly: true },
    { name: 'Timetable', path: '/timetable', icon: CalendarDays },
    { name: 'Announcements', path: '/announcements', icon: Bell },
    { name: 'Reports & Analytics', path: '/reports', icon: BarChart3, adminOnly: true },
    { name: 'Settings & Demo Info', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden no-print"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-100 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 no-print ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Brand Area */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <Logo size="md" showTagline={true} />
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Role Badge */}
        <div className="mx-4 mt-4 px-3 py-2 rounded-xl bg-[#FAF9FF] border border-[#7047D7]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-slate-800 capitalize">
              {role} Workspace
            </span>
          </div>
          {role === 'admin' ? (
            <span className="text-[10px] font-bold text-[#7047D7] bg-[#F3EEFF] px-1.5 py-0.5 rounded-md">
              Full Access
            </span>
          ) : (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
              Teacher Mode
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navigationItems.map(item => {
            const Icon = item.icon;
            const isRestricted = isTeacher && item.adminOnly;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all
                  ${
                    isActive
                      ? 'bg-[#7047D7] text-white shadow-sm shadow-[#7047D7]/30 font-semibold'
                      : item.highlight
                      ? 'text-[#7047D7] bg-[#F3EEFF]/60 hover:bg-[#F3EEFF] font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }
                  ${isRestricted ? 'opacity-70' : ''}
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-white'
                            : item.highlight
                            ? 'text-[#7047D7]'
                            : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span className="whitespace-nowrap">{item.name}</span>
                    </div>

                    {item.highlight && !isActive && (
                      <span className="flex items-center gap-1 text-[10px] bg-[#7047D7] text-white px-1.5 py-0.5 rounded-full font-bold shadow-2xs">
                        <Sparkles className="w-2.5 h-2.5" />
                        Live
                      </span>
                    )}

                    {isRestricted && !isActive && (
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                        Admin
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Tuition Info Card */}
        <div className="p-4 border-t border-slate-100 bg-[#FAF9FF]">
          <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-[#7047D7]" />
              <p className="text-xs font-bold text-slate-900">Zenvora Academy</p>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Smarter Classes. Simpler Management.
            </p>
            <p className="text-[10px] text-slate-400 mt-2 font-mono">
              Academic Year 2026–2027
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
