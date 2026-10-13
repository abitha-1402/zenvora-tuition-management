import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  Settings,
  RefreshCw,
  Database,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Info,
  Camera,
  Layers,
  Terminal
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser, role, demoLogin } = useAuth();
  const {
    students,
    teachers,
    courses,
    batches,
    attendance,
    fees,
    resetDemoData
  } = useData();

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState(false);

  const handleConfirmReset = () => {
    resetDemoData();
    setIsResetDialogOpen(false);
    setResetSuccessMessage(true);
    setTimeout(() => setResetSuccessMessage(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          System Settings & Demonstration Details
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Academic year configuration, local-storage state manager, and college project documentation
        </p>
      </div>

      {resetSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Demo dataset successfully refreshed to default 14 students, 4 faculty, and attendance logs.</span>
        </div>
      )}

      {/* Demo Reset Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Reset Demo Application Records
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Restores standard fictional tuition centre data for clean demonstrations
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsResetDialogOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] rounded-xl transition-colors cursor-pointer shadow-sm shadow-[#7047D7]/20 whitespace-nowrap shrink-0"
          >
            Reset Demo Data
          </button>
        </div>

        {/* Current Storage Counts */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
          <div className="bg-[#FAF9FF] p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-semibold">STUDENTS</span>
            <span className="font-mono font-bold text-slate-800">{students.length}</span>
          </div>
          <div className="bg-[#FAF9FF] p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-semibold">FACULTY</span>
            <span className="font-mono font-bold text-slate-800">{teachers.length}</span>
          </div>
          <div className="bg-[#FAF9FF] p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-semibold">COURSES</span>
            <span className="font-mono font-bold text-slate-800">{courses.length}</span>
          </div>
          <div className="bg-[#FAF9FF] p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-semibold">BATCHES</span>
            <span className="font-mono font-bold text-slate-800">{batches.length}</span>
          </div>
          <div className="bg-[#FAF9FF] p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-semibold">ATTENDANCE</span>
            <span className="font-mono font-bold text-slate-800">{attendance.length}</span>
          </div>
        </div>
      </div>

      {/* Architecture & College Project Architecture Note */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Database className="w-5 h-5 text-[#7047D7]" />
          <h3 className="text-sm font-bold text-slate-900">
            Storage Architecture & Database Roadmap
          </h3>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            <strong>College Demonstration Architecture:</strong> Zenvora implements client-side persistent storage utilizing the HTML5 Web Storage API (<code>localStorage</code>). This guarantees zero database costs during project evaluation while persisting all newly added students, modified schedules, scanned QR attendance check-ins, and fee receipts across browser refreshes and tab reloads.
          </p>
          <p>
            <strong>Production Database Migration Path:</strong> The data model in <code>src/types/index.ts</code> and repository methods in <code>src/context/DataContext.tsx</code> are deliberately structured as isolated async-compatible interfaces. To connect a production cloud database (such as Supabase, PostgreSQL, or Firebase), simply replace the local storage functions in <code>src/utils/storage.ts</code> with API routes or client SDK calls.
          </p>
        </div>
      </div>

      {/* PWA & Mobile Camera Scanner Protocol */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Smartphone className="w-5 h-5 text-[#7047D7]" />
          <h3 className="text-sm font-bold text-slate-900">
            PWA Installation & Camera Permissions Note
          </h3>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            • <strong>Hardware Camera API (html5-qrcode):</strong> Modern mobile and desktop browsers require an HTTPS origin or localhost to grant camera sensor access. If testing on a smartphone via a local Wi-Fi IP, ensure HTTPS or use the manual student ID search backup.
          </p>
          <p>
            • <strong>Installable PWA:</strong> Zenvora includes a Web App Manifest and Service Worker via <code>vite-plugin-pwa</code>. When launched in Chrome or Safari, click the <em>Install App</em> button in the header or use <em>Add to Home Screen</em> to run full-screen as a standalone application.
          </p>
          <p>
            • <strong>Android APK Packaging:</strong> To package Zenvora into a native Android APK for college submission, run <code>npx @bubblewrap/cli init --manifest=https://YOUR_DOMAIN/manifest.webmanifest</code> or use PWABuilder (pwabuilder.com) to generate signed Android App Bundles (AAB/APK).
          </p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        title="Reset All Demo Data?"
        message="Are you sure you want to restore the default sample dataset? Any newly created student records or fee receipts will be replaced with the initial 14 students, 4 teachers, and attendance logs."
        confirmText="Yes, Reset Records"
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetDialogOpen(false)}
      />
    </div>
  );
};
