import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OfflineBanner } from './components/OfflineBanner';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { StudentsPage } from './pages/StudentsPage';
import { ScannerPage } from './pages/ScannerPage';
import { AttendancePage } from './pages/AttendancePage';
import { FeesPage } from './pages/FeesPage';
import { CoursesPage } from './pages/CoursesPage';
import { TeachersPage } from './pages/TeachersPage';
import { TimetablePage } from './pages/TimetablePage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

// Authenticated Layout Container
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FAF9FF] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <OfflineBanner />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              }
            />

            <Route
              path="/students"
              element={
                <AppLayout>
                  <StudentsPage />
                </AppLayout>
              }
            />

            <Route
              path="/scanner"
              element={
                <AppLayout>
                  <ScannerPage />
                </AppLayout>
              }
            />

            <Route
              path="/attendance"
              element={
                <AppLayout>
                  <AttendancePage />
                </AppLayout>
              }
            />

            <Route
              path="/fees"
              element={
                <AppLayout>
                  <FeesPage />
                </AppLayout>
              }
            />

            <Route
              path="/courses"
              element={
                <AppLayout>
                  <CoursesPage />
                </AppLayout>
              }
            />

            <Route
              path="/teachers"
              element={
                <AppLayout>
                  <TeachersPage />
                </AppLayout>
              }
            />

            <Route
              path="/timetable"
              element={
                <AppLayout>
                  <TimetablePage />
                </AppLayout>
              }
            />

            <Route
              path="/announcements"
              element={
                <AppLayout>
                  <AnnouncementsPage />
                </AppLayout>
              }
            />

            <Route
              path="/reports"
              element={
                <AppLayout>
                  <ReportsPage />
                </AppLayout>
              }
            />

            <Route
              path="/settings"
              element={
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
