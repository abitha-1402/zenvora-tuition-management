import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Student, AttendanceStatus } from '../types';
import { playSuccessChime, playWarningBeep } from '../utils/sound';
import { getTodayDateString } from '../utils/demoData';
import {
  Camera,
  CameraOff,
  QrCode,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  CreditCard,
  UserCheck,
  Calendar,
  Clock,
  ArrowRight,
  ShieldAlert,
  Info,
  ExternalLink
} from 'lucide-react';

export const ScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    students,
    courses,
    batches,
    attendance,
    fees,
    recordAttendance,
    getStudentPendingBalance
  } = useData();

  // Scanner Operating Mode: 'attendance' | 'fee_lookup'
  const [scannerMode, setScannerMode] = useState<'attendance' | 'fee_lookup'>('attendance');

  // Camera & Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [availableCameras, setAvailableCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');

  // Scanned Student State
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  const [scanMessage, setScanMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);

  // Manual search fallback input
  const [manualQuery, setManualQuery] = useState('');

  // Cooldown / debounce tracker to prevent multi-triggering while code remains in lens
  const lastScannedCodeRef = useRef<string>('');
  const lastScannedTimeRef = useRef<number>(0);
  const scannerInstanceRef = useRef<Html5Qrcode | null>(null);

  // Handle scanned student ID
  const handleStudentFound = useCallback((studentId: string) => {
    const cleanId = studentId.trim().toUpperCase();
    const student = students.find(s => s.id.toUpperCase() === cleanId);

    if (!student) {
      playWarningBeep();
      setScannedStudent(null);
      setScanMessage({
        text: `Unrecognized Student Identifier: "${studentId}". Please ensure the student is enrolled in Zenvora.`,
        type: 'warning'
      });
      return;
    }

    setScannedStudent(student);

    if (scannerMode === 'attendance') {
      const today = getTodayDateString();
      // Check if already marked for today and batch
      const existing = attendance.find(
        a => a.studentId.toUpperCase() === student.id.toUpperCase() &&
             a.batchId === student.batchId &&
             a.date === today
      );

      if (existing) {
        playWarningBeep();
        setScanMessage({
          text: `Attendance already recorded today for ${student.fullName}! Marked as ${existing.status.toUpperCase()} at ${existing.time}. Duplicate entry prevented.`,
          type: 'warning'
        });
      } else {
        playSuccessChime();
        setScanMessage({
          text: `Student verified: ${student.fullName} (${student.id}). Ready to confirm attendance.`,
          type: 'info'
        });
      }
    } else {
      // Fee Lookup Mode
      playSuccessChime();
      const balance = getStudentPendingBalance(student.id);
      setScanMessage({
        text: `Fee Record Loaded: ${student.fullName}. Outstanding balance: ₹${balance.pending.toLocaleString('en-IN')}.`,
        type: 'info'
      });
    }
  }, [students, attendance, scannerMode, getStudentPendingBalance]);

  // Handle successful QR Decode
  const onScanSuccess = useCallback((decodedText: string) => {
    const now = Date.now();
    // 3 second debounce if scanning same code
    if (decodedText === lastScannedCodeRef.current && now - lastScannedTimeRef.current < 3000) {
      return;
    }

    lastScannedCodeRef.current = decodedText;
    lastScannedTimeRef.current = now;

    handleStudentFound(decodedText);
  }, [handleStudentFound]);

  // Initialize and list video input cameras
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then(cameras => {
        if (cameras && cameras.length > 0) {
          setAvailableCameras(cameras.map(c => ({ id: c.id, label: c.label || `Camera ${c.id.slice(0, 5)}` })));
          // Prefer environment / rear camera if available
          const rearCam = cameras.find(c => c.label.toLowerCase().includes('back') || c.label.toLowerCase().includes('rear') || c.label.toLowerCase().includes('environment'));
          setSelectedCameraId(rearCam ? rearCam.id : cameras[0].id);
        } else {
          setCameraError('No camera devices detected on this hardware. You can use the instant Manual Search backup below.');
        }
      })
      .catch(err => {
        console.warn('Camera enumeration note:', err);
        // Browser might require user interaction before getCameras
      });

    return () => {
      // Cleanup on page unmount
      if (scannerInstanceRef.current && scannerInstanceRef.current.isScanning) {
        scannerInstanceRef.current.stop().catch(console.error);
      }
    };
  }, []);

  // Start Camera Scanning
  const startCamera = async () => {
    setCameraError(null);
    try {
      const elementId = 'zenvora-qr-reader';
      const container = document.getElementById(elementId);
      if (!container) return;

      if (!scannerInstanceRef.current) {
        scannerInstanceRef.current = new Html5Qrcode(elementId);
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      const cameraParam = selectedCameraId
        ? { deviceId: { exact: selectedCameraId } }
        : { facingMode: 'environment' };

      await scannerInstanceRef.current.start(
        cameraParam,
        config,
        onScanSuccess,
        () => {
          // Frame scan error (no QR in view yet) - normal, ignore
        }
      );

      setIsScanning(true);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('Error starting camera scanner:', err);
      if (errorMsg.includes('Permission') || errorMsg.includes('NotAllowedError')) {
        setCameraError('Camera access permission was denied. Please allow camera permissions in your browser address bar (lock/camera icon) or use the Manual ID backup.');
      } else if (errorMsg.includes('secure') || errorMsg.includes('HTTPS')) {
        setCameraError('Browsers restrict live camera access to secure HTTPS or localhost origins. Use HTTPS or the manual search fallback below.');
      } else {
        setCameraError(`Camera initialisation failed (${errorMsg}). Use the manual backup below.`);
      }
      setIsScanning(false);
    }
  };

  // Stop Camera Scanning
  const stopCamera = async () => {
    if (scannerInstanceRef.current && scannerInstanceRef.current.isScanning) {
      try {
        await scannerInstanceRef.current.stop();
      } catch (err) {
        console.error('Error stopping camera:', err);
      }
    }
    setIsScanning(false);
  };

  // Confirm Attendance Action
  const handleConfirmAttendance = (status: AttendanceStatus = 'present') => {
    if (!scannedStudent) return;

    const result = recordAttendance({
      studentId: scannedStudent.id,
      batchId: scannedStudent.batchId,
      date: getTodayDateString(),
      status,
      method: 'qr_scan',
      recordedBy: currentUser?.name || 'Gate Scanner'
    });

    if (result.success) {
      playSuccessChime();
      setScanMessage({
        text: `Success! ${scannedStudent.fullName} marked as ${status.toUpperCase()} for today's session.`,
        type: 'success'
      });
    } else {
      playWarningBeep();
      setScanMessage({
        text: result.message,
        type: 'warning'
      });
    }
  };

  // Manual Student Selection
  const handleManualSelect = (student: Student) => {
    handleStudentFound(student.id);
  };

  // Manual Query Matches
  const manualMatches = manualQuery.trim()
    ? students.filter(
        s =>
          s.fullName.toLowerCase().includes(manualQuery.toLowerCase()) ||
          s.id.toLowerCase().includes(manualQuery.toLowerCase()) ||
          s.phone.includes(manualQuery)
      ).slice(0, 4)
    : [];

  const course = scannedStudent ? courses.find(c => c.id === scannedStudent.courseId) : null;
  const batch = scannedStudent ? batches.find(b => b.id === scannedStudent.batchId) : null;
  const balance = scannedStudent ? getStudentPendingBalance(scannedStudent.id) : null;
  const studentPayments = scannedStudent ? fees.filter(f => f.studentId === scannedStudent.id) : [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Real Camera QR Scanner
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F3EEFF] text-[#45258D] border border-[#7047D7]/20">
              Hardware Camera API
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time student card reader for automated gate attendance and instant fee ledger inquiries
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => {
              setScannerMode('attendance');
              setScanMessage(null);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              scannerMode === 'attendance'
                ? 'bg-[#7047D7] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Attendance Mode</span>
          </button>

          <button
            onClick={() => {
              setScannerMode('fee_lookup');
              setScanMessage(null);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              scannerMode === 'fee_lookup'
                ? 'bg-[#7047D7] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Fee Lookup Mode</span>
          </button>
        </div>
      </div>

      {/* Main Scanner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Camera Box & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
            {/* Viewfinder Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-[#FAF9FF]">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
                <span className="text-xs font-bold text-slate-800">
                  {isScanning ? 'Camera Scanner Active' : 'Camera Ready to Connect'}
                </span>
              </div>

              {availableCameras.length > 1 && (
                <select
                  value={selectedCameraId}
                  onChange={e => setSelectedCameraId(e.target.value)}
                  disabled={isScanning}
                  className="text-xs py-1 px-2 rounded-lg border border-slate-200 bg-white text-slate-700"
                >
                  {availableCameras.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.label.slice(0, 20)}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Viewfinder Container */}
            <div className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-[320px] bg-slate-950 text-white relative">
              {/* html5-qrcode mounts here */}
              <div
                id="zenvora-qr-reader"
                className={`w-full max-w-[340px] rounded-2xl overflow-hidden ${!isScanning ? 'hidden' : 'block'}`}
              />

              {!isScanning && (
                <div className="flex flex-col items-center text-center p-6 space-y-4 max-w-sm">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                    <QrCode className="w-8 h-8 text-[#FAF9FF]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Live Camera Preview</h3>
                    <p className="text-xs text-white/70 mt-1">
                      Point rear phone camera or web cam directly at the student QR pass badge.
                    </p>
                  </div>
                  <button
                    onClick={startCamera}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7047D7] hover:bg-[#855eec] text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Start Live Camera</span>
                  </button>
                </div>
              )}

              {/* Stop Camera Floating Action */}
              {isScanning && (
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={stopCamera}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                  >
                    <CameraOff className="w-4 h-4" />
                    <span>Stop Camera</span>
                  </button>
                </div>
              )}
            </div>

            {/* Camera Error / HTTPS Guidance Callout */}
            {cameraError && (
              <div className="p-4 bg-amber-50 border-t border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{cameraError}</p>
                  <p className="text-[11px] text-amber-700 mt-1">
                    <strong>Tip:</strong> If testing in iframe or without camera hardware, test instantly using the manual ID search below or 1-click test buttons.
                  </p>
                </div>
              </div>
            )}

            {/* Instruction Footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-white text-[11px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#7047D7]" />
                Rear camera prioritized on smartphones
              </span>
              <span className="text-slate-400">Unique ID Payload</span>
            </div>
          </div>

          {/* Manual ID Search / Instant Demo QR Clicker */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#7047D7]" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Manual ID Entry / Backup Simulation
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Simulate barcode/QR scan</span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={manualQuery}
                onChange={e => setManualQuery(e.target.value)}
                placeholder="Type student name or ID (e.g. ZNV-2026-001)..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>

            {/* Autocomplete list */}
            {manualMatches.length > 0 && (
              <div className="mt-2 space-y-1.5 border border-slate-100 rounded-xl p-2 bg-[#FAF9FF]">
                {manualMatches.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      handleManualSelect(m);
                      setManualQuery('');
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-white hover:bg-[#F3EEFF] border border-slate-100 transition-colors text-left text-xs cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{m.fullName}</span>
                      <span className="text-[10px] text-[#7047D7] font-mono ml-2">{m.id}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">Select & Scan →</span>
                  </button>
                ))}
              </div>
            )}

            {/* Quick 1-Click Test Badges */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Quick 1-Click Test Passes:
              </span>
              <div className="flex flex-wrap gap-2">
                {students.slice(0, 3).map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleStudentFound(s.id)}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-[#F3EEFF] text-slate-700 hover:text-[#7047D7] transition-colors cursor-pointer"
                  >
                    {s.fullName} ({s.id})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scan Result & Action Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Feedback Toast Banner */}
          {scanMessage && (
            <div
              className={`p-4 rounded-2xl border text-xs font-medium flex items-start gap-2.5 transition-all ${
                scanMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : scanMessage.type === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-[#F3EEFF] border-[#7047D7]/30 text-[#45258D]'
              }`}
            >
              {scanMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : scanMessage.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-[#7047D7] shrink-0 mt-0.5" />
              )}
              <span>{scanMessage.text}</span>
            </div>
          )}

          {/* Student Profile & Action Box */}
          {scannedStudent ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-5">
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Verified Student Pass
                </span>
                <span className="text-xs font-mono font-bold text-[#7047D7] bg-[#F3EEFF] px-2.5 py-0.5 rounded-full">
                  {scannedStudent.id}
                </span>
              </div>

              {/* Student Identity Lockup */}
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7047D7] to-[#45258D] text-white flex items-center justify-center text-lg font-bold shadow-sm">
                  {scannedStudent.fullName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {scannedStudent.fullName}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {course?.name || 'Class 10 CBSE'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Batch: {batch?.name || 'Batch Alpha'}
                  </p>
                </div>
              </div>

              {/* Current Date & Time Display */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-[#FAF9FF] p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-[#7047D7]" />
                  <span>{getTodayDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-[#7047D7]" />
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Mode Specific Logic */}
              {scannerMode === 'attendance' ? (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    Mark Daily Attendance Status:
                  </span>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleConfirmAttendance('present')}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex flex-col items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Present</span>
                    </button>

                    <button
                      onClick={() => handleConfirmAttendance('late')}
                      className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex flex-col items-center gap-1"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Late Entry</span>
                    </button>

                    <button
                      onClick={() => handleConfirmAttendance('absent')}
                      className="py-2.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex flex-col items-center gap-1"
                    >
                      <span>Absent</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400 text-center pt-2">
                    System prevents duplicate submissions for the same student on the same date.
                  </p>
                </div>
              ) : (
                /* Fee Lookup Mode */
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Monthly Fee
                      </span>
                      <span className="text-sm font-bold font-mono text-slate-900 block mt-0.5">
                        ₹{scannedStudent.monthlyFee.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl">
                      <span className="text-[10px] text-amber-700 uppercase font-semibold block">
                        Pending Dues
                      </span>
                      <span className="text-sm font-bold font-mono text-amber-800 block mt-0.5">
                        ₹{balance?.pending.toLocaleString('en-IN') || 0}
                      </span>
                    </div>
                  </div>

                  {/* Recent Payments */}
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-2">
                      Recent Payment Transactions:
                    </span>
                    {studentPayments.length === 0 ? (
                      <p className="text-xs text-slate-400">No payment receipts recorded yet.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {studentPayments.slice(0, 2).map(p => (
                          <div
                            key={p.id}
                            className="p-2 bg-[#FAF9FF] rounded-lg border border-slate-100 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-semibold text-slate-800 block">
                                {p.receiptNumber}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {p.paymentDate} · {p.method}
                              </span>
                            </div>
                            <span className="font-mono font-bold text-emerald-600">
                              ₹{p.amount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Link to Fee Manager */}
                  <button
                    onClick={() => navigate('/fees')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#7047D7] hover:bg-[#45258D] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Proceed to Fee Management Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <p className="text-[10px] text-slate-400 text-center">
                    Note: QR scanning does not deduct money. Fees are only recorded when authorized in Fee Management.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-8 text-center flex flex-col items-center justify-center min-h-[320px]">
              <div className="w-14 h-14 rounded-2xl bg-[#F3EEFF] text-[#7047D7] flex items-center justify-center mb-3">
                <QrCode className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Awaiting QR Scan</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Scan any student card using the camera viewfinder or pick a student from the manual simulation list.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
