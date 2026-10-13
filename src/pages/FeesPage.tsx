import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { FeePayment, PaymentMethod } from '../types';
import { Modal } from '../components/Modal';
import { ReceiptModal } from '../components/ReceiptModal';
import { exportToCSV } from '../utils/exportCsv';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Receipt,
  Sparkles,
  Info
} from 'lucide-react';

export const FeesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    students,
    courses,
    fees,
    recordFeePayment,
    getStudentPendingBalance,
    getFinancialSummary
  } = useData();

  // Summary figures
  const { totalCollected, thisMonthCollected, totalPending } = getFinancialSummary();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<FeePayment | null>(null);

  // New Payment Modal
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState<number>(3500);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [monthCovered, setMonthCovered] = useState<string>('October 2026');
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // On student selection in modal, auto-fill pending or monthly fee
  const handleSelectStudentForPayment = (studentId: string) => {
    setSelectedStudentId(studentId);
    const student = students.find(s => s.id === studentId);
    if (student) {
      const { pending } = getStudentPendingBalance(studentId);
      setPaymentAmount(pending > 0 ? pending : student.monthlyFee);
    }
  };

  const handleOpenRecordModal = () => {
    if (students.length > 0) {
      handleSelectStudentForPayment(students[0].id);
    }
    setPaymentNotes('');
    setFormError(null);
    setIsRecordModalOpen(true);
  };

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) {
      setFormError('Payment amount must be greater than ₹0.');
      return;
    }

    const newPayment = recordFeePayment({
      studentId: selectedStudentId,
      amount: paymentAmount,
      paymentDate,
      method: paymentMethod,
      status: 'paid',
      monthCovered,
      notes: paymentNotes.trim() || 'Tuition coaching installment',
      recordedBy: currentUser?.name || 'Accounts Admin'
    });

    setIsRecordModalOpen(false);
    // Open receipt modal immediately for printing/confirmation!
    setSelectedReceipt(newPayment);
  };

  // Export CSV
  const handleExportCSV = () => {
    const rows = fees.map(f => {
      const student = students.find(s => s.id === f.studentId);
      return {
        receiptNumber: f.receiptNumber,
        date: f.paymentDate,
        studentId: f.studentId,
        studentName: student?.fullName || 'Unknown',
        amount: f.amount,
        method: f.method,
        monthCovered: f.monthCovered || '',
        notes: f.notes || '',
        recordedBy: f.recordedBy || ''
      };
    });

    exportToCSV('zenvora_fee_ledger', rows);
  };

  // Filtered Payments
  const filteredFees = useMemo(() => {
    return fees.filter(f => {
      const student = students.find(s => s.id === f.studentId);
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        f.receiptNumber.toLowerCase().includes(query) ||
        f.studentId.toLowerCase().includes(query) ||
        (student && student.fullName.toLowerCase().includes(query));

      const matchesMethod = methodFilter === 'all' || f.method === methodFilter;

      return matchesSearch && matchesMethod;
    });
  }, [fees, students, searchQuery, methodFilter]);

  const selectedStudentDetails = students.find(s => s.id === selectedStudentId);
  const selectedStudentBalance = selectedStudentId ? getStudentPendingBalance(selectedStudentId) : null;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Tuition Fee Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track fee collections in Indian Rupees (₹), record payments, and print official receipts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#7047D7]" />
            <span>Export Ledger CSV</span>
          </button>

          <button
            onClick={handleOpenRecordModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] rounded-xl transition-colors cursor-pointer shadow-sm shadow-[#7047D7]/30"
          >
            <Plus className="w-4 h-4" />
            <span>Record Fee Payment</span>
          </button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Fees Collected</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-slate-900 font-mono block">
            ₹{totalCollected.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-400">All-time center revenue</span>
        </div>

        {/* This Month Collection */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">This Month Inflow</span>
            <div className="w-8 h-8 rounded-xl bg-[#F3EEFF] text-[#7047D7] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-[#7047D7] font-mono block">
            ₹{thisMonthCollected.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#7047D7] font-semibold">October 2026</span>
        </div>

        {/* Total Outstanding Dues */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Outstanding Balances</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-amber-700 font-mono block">
            ₹{totalPending.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-amber-600">Sum of pending student dues</span>
        </div>
      </div>

      {/* Simulated Flow Disclaimer */}
      <div className="p-3.5 bg-[#FAF9FF] border border-[#7047D7]/15 rounded-2xl flex items-center gap-2.5 text-xs text-slate-700 no-print">
        <Sparkles className="w-4 h-4 text-[#7047D7] shrink-0" />
        <span>
          <strong>Simulated Payment Protocol:</strong> Supports Cash, UPI, and Bank Transfer tracking for tuition bookkeeping. No actual bank transfers or card numbers are processed.
        </span>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row gap-3 justify-between no-print">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by receipt number, student name or ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Method:</span>
          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 text-slate-700"
          >
            <option value="all">All Payment Methods</option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Demo Payment">Demo Payment</option>
          </select>
        </div>
      </div>

      {/* Fee Ledger Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9FF] border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Receipt No. & Date</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Period Covered</th>
                <th className="py-3 px-4">Method & Notes</th>
                <th className="py-3 px-4 text-right">Amount (INR)</th>
                <th className="py-3 px-4 text-right no-print">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No fee receipts match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredFees.map(payment => {
                  const student = students.find(s => s.id === payment.studentId);

                  return (
                    <tr key={payment.id} className="hover:bg-[#FAF9FF]/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 block">
                          {payment.receiptNumber}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {payment.paymentDate}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">
                          {student?.fullName || 'Student'}
                        </span>
                        <span className="text-[10px] font-mono text-[#7047D7]">
                          {payment.studentId}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {payment.monthCovered || 'October 2026'}
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                            {payment.method}
                          </span>
                        </div>
                        {payment.notes && (
                          <span className="text-[10px] text-slate-400 truncate max-w-xs block mt-0.5">
                            {payment.notes}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="font-mono font-extrabold text-slate-900 text-sm">
                          ₹{payment.amount.toLocaleString('en-IN')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right no-print">
                        <button
                          onClick={() => setSelectedReceipt(payment)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#7047D7] bg-[#F3EEFF] hover:bg-[#E5D9FA] rounded-lg transition-colors cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Tuition Fee Payment"
        subtitle="Simulated tuition installment entry with instant receipt generation"
        maxWidth="lg"
      >
        <form onSubmit={handleRecordSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Student Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Student *
            </label>
            <select
              value={selectedStudentId}
              onChange={e => handleSelectStudentForPayment(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 text-slate-800"
            >
              {students.filter(s => s.status === 'active').map(s => {
                const bal = getStudentPendingBalance(s.id);
                return (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.id}) — Monthly: ₹{s.monthlyFee} {bal.pending > 0 ? `| Due: ₹${bal.pending}` : '| Up to date'}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Student Pending Balance Info Card */}
          {selectedStudentBalance && (
            <div className="p-3 bg-[#FAF9FF] border border-slate-100 rounded-xl grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">MONTHLY FEE</span>
                <span className="font-bold text-slate-800 font-mono">
                  ₹{selectedStudentDetails?.monthlyFee.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">TOTAL PAID</span>
                <span className="font-bold text-emerald-600 font-mono">
                  ₹{selectedStudentBalance.totalPaid.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">PENDING DUE</span>
                <span className="font-bold text-amber-700 font-mono">
                  ₹{selectedStudentBalance.pending.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Amount (₹ INR) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={paymentAmount}
                onChange={e => setPaymentAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Date *
              </label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method *
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="Bank Transfer">Bank Transfer (NEFT / IMPS)</option>
                <option value="Demo Payment">Demo Payment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Month Covered *
              </label>
              <input
                type="text"
                required
                value={monthCovered}
                onChange={e => setMonthCovered(e.target.value)}
                placeholder="e.g. October 2026"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Transaction Notes / Reference (Optional)
            </label>
            <input
              type="text"
              value={paymentNotes}
              onChange={e => setPaymentNotes(e.target.value)}
              placeholder="e.g. UPI Ref #982182 or Desk receipt notes"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] rounded-xl shadow-sm shadow-[#7047D7]/30"
            >
              Confirm & Generate Receipt
            </button>
          </div>
        </form>
      </Modal>

      {/* Official Receipt Viewer Modal */}
      <ReceiptModal
        payment={selectedReceipt}
        isOpen={selectedReceipt !== null}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};
