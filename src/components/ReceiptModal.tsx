import React, { useRef } from 'react';
import { FeePayment, Student } from '../types';
import { useData } from '../context/DataContext';
import { Modal } from './Modal';
import { Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  payment: FeePayment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  payment,
  isOpen,
  onClose
}) => {
  const { students, courses, batches, getStudentPendingBalance } = useData();
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!payment) return null;

  const student = students.find(s => s.id === payment.studentId);
  const course = student ? courses.find(c => c.id === student.courseId) : null;
  const batch = student ? batches.find(b => b.id === student.batchId) : null;
  const { pending } = student ? getStudentPendingBalance(student.id) : { pending: 0 };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Fee Payment Receipt"
      subtitle={`Receipt No: ${payment.receiptNumber}`}
      maxWidth="lg"
    >
      <div className="flex flex-col items-center">
        {/* Printable Receipt Paper */}
        <div
          ref={receiptRef}
          id="fee-receipt-paper"
          className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm print-card-container print-break-inside-avoid text-slate-800"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#7047D7] text-white flex items-center justify-center font-bold text-sm">
                  Z
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Zenvora Academy
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Smart Tuition Management System • College E-Business Project
              </p>
              <p className="text-[11px] text-slate-400">
                102 Knowledge Park, Tech Innovation Hub • Helpline: +91 98200 12345
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 text-[11px] font-bold tracking-wider rounded-md bg-[#F3EEFF] text-[#45258D] uppercase">
                Payment Receipt
              </span>
              <p className="text-xs font-mono font-semibold text-slate-700 mt-2">
                {payment.receiptNumber}
              </p>
              <p className="text-xs text-slate-500">
                Date: {payment.paymentDate}
              </p>
            </div>
          </div>

          {/* Student & Course Particulars */}
          <div className="grid grid-cols-2 gap-4 bg-[#FAF9FF] p-4 rounded-xl border border-slate-100 text-xs mb-6">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                STUDENT DETAILS
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {student?.fullName || 'Student'}
              </p>
              <p className="text-xs font-mono text-[#7047D7]">ID: {payment.studentId}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Phone: {student?.phone}</p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                COURSE & BATCH
              </span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {course?.name || 'Assigned Course'}
              </p>
              <p className="text-[11px] text-slate-600">Batch: {batch?.name || 'Batch Alpha'}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Billing Cycle: {payment.monthCovered || 'Current Month'}
              </p>
            </div>
          </div>

          {/* Ledger Table */}
          <table className="w-full text-xs text-left mb-6">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                <th className="py-2">Description</th>
                <th className="py-2">Mode</th>
                <th className="py-2 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3">
                  <span className="font-semibold text-slate-900 block">
                    Tuition & Lab Fee Payment
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {payment.notes || 'Tuition center monthly coaching fees'}
                  </span>
                </td>
                <td className="py-3 font-medium text-slate-700">
                  {payment.method}
                </td>
                <td className="py-3 text-right font-mono font-bold text-slate-900 text-sm">
                  ₹{payment.amount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200">
                <td colSpan={2} className="py-3 font-bold text-slate-800 text-xs uppercase">
                  Total Paid
                </td>
                <td className="py-3 text-right font-mono font-extrabold text-[#7047D7] text-base">
                  ₹{payment.amount.toLocaleString('en-IN')}
                </td>
              </tr>
              {pending > 0 && (
                <tr className="text-amber-700 bg-amber-50/50">
                  <td colSpan={2} className="py-2 text-xs font-medium px-2">
                    Remaining Outstanding Balance
                  </td>
                  <td className="py-2 text-right font-mono font-bold text-xs px-2">
                    ₹{pending.toLocaleString('en-IN')}
                  </td>
                </tr>
              )}
            </tfoot>
          </table>

          {/* Stamp & Authorized Signature */}
          <div className="flex items-end justify-between pt-4 border-t border-slate-200">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>PAYMENT CONFIRMED (SIMULATED DEMO)</span>
              </div>
              <p className="text-[10px] text-slate-400 max-w-xs">
                This is a simulated tuition management demonstration receipt generated by Zenvora.
                No real banking transactions were made.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 border-b border-dashed border-slate-400 pb-8 flex items-center justify-center">
                <span className="text-[11px] font-mono text-[#7047D7] font-semibold italic">
                  Anita Sharma
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase mt-1">
                Accounts Officer / Seal
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 mt-6 w-full no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] rounded-xl transition-colors cursor-pointer shadow-sm shadow-[#7047D7]/30"
          >
            <Printer className="w-4 h-4" />
            Print Official Receipt
          </button>
        </div>
      </div>
    </Modal>
  );
};
