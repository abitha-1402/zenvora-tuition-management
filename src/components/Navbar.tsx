import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PWAInstallButton } from './PWAInstallButton';
import { Menu, LogOut, ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';
import { Logo } from './Logo';
import { useData } from '../context/DataContext';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { currentUser, role, demoLogin, logout } = useAuth();
  const { resetDemoData } = useData();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const toggleRole = () => {
    if (role === 'admin') {
      demoLogin('teacher');
    } else {
      demoLogin('admin');
    }
    setShowProfileMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-6 py-3 bg-white/90 backdrop-blur-md border-b border-slate-100 no-print">
      {/* Zone 1: Mobile toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="lg:hidden">
          <Logo size="sm" />
        </div>
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="font-semibold text-[#7047D7]">Zenvora Portal</span>
          <span className="text-slate-300">/</span>
          <span className="capitalize text-slate-700 font-medium">{role} Workspace</span>
        </div>
      </div>

      {/* Zone 2: College Demo Mode Indicator */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#F3EEFF] rounded-full border border-[#7047D7]/15">
        <span className="w-2 h-2 rounded-full bg-[#7047D7]"></span>
        <span className="text-xs font-semibold text-[#45258D]">
          College E-Business Demo • Local Storage Persistence
        </span>
      </div>

      {/* Zone 3: PWA Install, Role Switcher & Profile Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <PWAInstallButton />

        {/* Quick Role Switch Button */}
        <button
          onClick={toggleRole}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:border-[#7047D7]/40 bg-white text-slate-700 hover:text-[#7047D7] transition-colors cursor-pointer"
          title={`Switch to ${role === 'admin' ? 'Teacher' : 'Admin'} view`}
        >
          {role === 'admin' ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#7047D7]" />
              <span className="font-semibold text-slate-800">Admin</span>
              <span className="text-[10px] text-slate-400">→ Teacher</span>
            </>
          ) : (
            <>
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold text-slate-800">Teacher</span>
              <span className="text-[10px] text-slate-400">→ Admin</span>
            </>
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(prev => !prev)}
            className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7047D7] to-[#45258D] text-white flex items-center justify-center text-xs font-bold shadow-xs">
              {currentUser?.avatar || 'ZU'}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-[10px] text-[#7047D7] font-medium capitalize">
                {role} Account
              </p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-1.5 z-40">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F3EEFF] text-[#45258D]">
                  Role: {role.toUpperCase()}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={toggleRole}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#7047D7]" />
                  Switch to {role === 'admin' ? 'Teacher' : 'Admin'} Mode
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowResetConfirm(true);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                  Reset Demo Dataset
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-2">Reset Demo Data?</h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              This will restore all default 14 students, 4 teachers, courses, timetable, attendance records, and simulated fees. Any additions you made will be refreshed.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] rounded-xl"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
