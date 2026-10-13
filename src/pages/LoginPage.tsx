import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import { Eye, EyeOff, ShieldCheck, UserCheck, ArrowRight, Lock, Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.error || 'Authentication failed');
      }
    }, 300);
  };

  const handleQuickDemo = (role: 'admin' | 'teacher') => {
    demoLogin(role);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-block mb-3">
          <Logo size="xl" showTagline={true} />
        </div>
        <p className="mt-2 text-sm text-slate-600 font-medium">
          Smarter Classes. Simpler Management.
        </p>
        <p className="text-xs text-[#7047D7] font-semibold mt-1">
          College E-Business Management Project Prototype
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-[#7047D7]/5 rounded-3xl border border-slate-100 sm:px-10">
          {/* Quick Demo Login Options */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#7047D7]" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Instant Demo Access (Recommended)
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="flex flex-col items-start p-3 rounded-2xl border-2 border-[#7047D7]/30 hover:border-[#7047D7] bg-[#F3EEFF]/40 hover:bg-[#F3EEFF] transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#45258D]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#7047D7]" />
                    <span>Admin Mode</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-[#7047D7] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[11px] text-slate-600 leading-tight">
                  Anita Sharma (Principal)
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Students, Fees, Reports & All
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('teacher')}
                className="flex flex-col items-start p-3 rounded-2xl border-2 border-emerald-500/20 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Teacher Mode</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[11px] text-slate-600 leading-tight">
                  Prof. Rajesh Verma (Physics)
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Batches, Camera Scanner & Attendance
                </span>
              </button>
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 font-medium">
                Or Sign In with Email
              </span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@zenvora.edu or teacher@zenvora.edu"
                  required
                  className="block w-full pl-9 pr-3 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 focus:border-[#7047D7] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter any password for demo"
                  required
                  className="block w-full pl-9 pr-10 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7047D7]/30 focus:border-[#7047D7] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#7047D7] hover:bg-[#45258D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7047D7] transition-all cursor-pointer shadow-md shadow-[#7047D7]/25"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Zenvora</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Prototype disclaimer notice */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong>College Project Note:</strong> This application utilizes browser LocalStorage for demonstration persistence without incurring paid backend database costs. Suitable for academic presentations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
