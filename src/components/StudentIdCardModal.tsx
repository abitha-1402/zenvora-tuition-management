import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Student } from '../types';
import { useData } from '../context/DataContext';
import { Modal } from './Modal';
import { Printer, Download, Sparkles, Phone, ShieldCheck } from 'lucide-react';

interface StudentIdCardModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentIdCardModal: React.FC<StudentIdCardModalProps> = ({
  student,
  isOpen,
  onClose
}) => {
  const { courses, batches } = useData();
  const cardRef = useRef<HTMLDivElement>(null);

  if (!student) return null;

  const course = courses.find(c => c.id === student.courseId);
  const batch = batches.find(b => b.id === student.batchId);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    // Generate QR PNG via hidden canvas
    const svgElement = cardRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 400;
    canvas.height = 400;

    img.onload = () => {
      if (!ctx) return;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `Zenvora_QR_${student.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Identity Card & QR Code"
      subtitle={`Unique Identifier: ${student.id}`}
      maxWidth="md"
    >
      <div className="flex flex-col items-center">
        {/* Printable Card */}
        <div
          ref={cardRef}
          id="student-id-badge"
          className="w-full max-w-sm rounded-2xl bg-white border-2 border-[#7047D7]/30 shadow-lg overflow-hidden print-card-container print-break-inside-avoid relative"
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#45258D] to-[#7047D7] p-4 text-white relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-bold text-white text-xs">
                  Z
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight">Zenvora Academy</h4>
                  <p className="text-[10px] text-white/80">Smart Tuition Centre</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                ID CARD
              </span>
            </div>
          </div>

          {/* Student Profile Content */}
          <div className="p-5 flex flex-col items-center text-center bg-white">
            {/* Student Avatar */}
            <div className="w-16 h-16 rounded-full bg-[#F3EEFF] border-2 border-[#7047D7] flex items-center justify-center text-lg font-bold text-[#7047D7] mb-3 shadow-sm">
              {student.fullName.slice(0, 2).toUpperCase()}
            </div>

            <h3 className="text-base font-bold text-slate-900">{student.fullName}</h3>
            <p className="text-xs font-mono font-semibold text-[#7047D7] mt-0.5 tracking-wide">
              {student.id}
            </p>

            <div className="w-full my-3 border-t border-slate-100" />

            {/* Course & Batch info */}
            <div className="w-full grid grid-cols-2 gap-2 text-left text-xs mb-4">
              <div className="bg-[#FAF9FF] p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">COURSE</span>
                <span className="font-semibold text-slate-800 text-[11px] truncate block">
                  {course?.name || 'Class 10 CBSE'}
                </span>
              </div>
              <div className="bg-[#FAF9FF] p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">BATCH</span>
                <span className="font-semibold text-slate-800 text-[11px] truncate block">
                  {batch?.name || 'Batch Alpha'}
                </span>
              </div>
            </div>

            {/* The QR Code (Encodes ONLY Student ID) */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs mb-3 inline-block">
              <QRCodeSVG
                value={student.id}
                size={140}
                level="H"
                includeMargin={false}
                fgColor="#45258D"
              />
            </div>
            
            <p className="text-[10px] text-slate-400 font-mono tracking-tight mb-2">
              Scan for Automated Kiosk Attendance
            </p>

            {/* Guardian & Emergency contact */}
            <div className="w-full pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                {student.guardianPhone}
              </span>
              <span className="flex items-center gap-1 font-medium text-emerald-600">
                <ShieldCheck className="w-3 h-3" />
                Active Student
              </span>
            </div>
          </div>

          {/* Footer Ribbon */}
          <div className="bg-[#FAF9FF] py-2 px-4 text-center border-t border-slate-100">
            <p className="text-[9px] text-slate-400">
              Official Property of Zenvora Tuition Centre • Encoded ID: {student.id}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 w-full no-print">
          <button
            onClick={handleDownloadQR}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#7047D7]" />
            Download QR (PNG)
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] rounded-xl transition-colors cursor-pointer shadow-sm shadow-[#7047D7]/30"
          >
            <Printer className="w-4 h-4" />
            Print Student Badge
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center mt-3 no-print">
          <Sparkles className="w-3 h-3 inline mr-1 text-[#7047D7]" />
          QR code contains pure student ID (<code className="font-mono text-[#7047D7]">{student.id}</code>) with zero raw PII stored in payload.
        </p>
      </div>
    </Modal>
  );
};
