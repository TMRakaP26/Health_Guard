import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { ShieldPlus, User, Mail, Lock, AlertCircle, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { useAuth } from '../state/AuthContext';
import { getQuickUsers, removeQuickUserByEmail } from '../utils/cookies';
import type { QuickUser } from '../utils/cookies';

export function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);

  // Only show client-role users in Quick Sign In
  const [quickUsers, setQuickUsers] = useState<QuickUser[]>(
    () => getQuickUsers().filter(u => u.role === 'client')
  );

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'analyst' ? '/analyst' : '/client', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleQuickLogin = async (target: QuickUser) => {
    setError('');
    setIsLoading(true);
    try {
      await login(target.email, target.password);
      navigate('/client', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/client', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = (targetEmail: string) => {
    removeQuickUserByEmail(targetEmail);
    setQuickUsers(getQuickUsers().filter(u => u.role === 'client'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <ShieldPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HealthGuard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Insurance Claims Management System
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-sm text-rose-700 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!showManualForm ? (
            <>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">
                Quick Sign In
              </p>

              {quickUsers.length > 0 ? (
                <div className="space-y-2">
                  {quickUsers.map((qUser) => (
                    <div key={qUser.email} className="group relative">
                      <button
                        onClick={() => handleQuickLogin(qUser)}
                        disabled={isLoading}
                        className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center bg-blue-50 text-blue-600">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="text-left min-w-0">
                            <div className="font-semibold text-slate-900 text-sm truncate">{qUser.name}</div>
                            <div className="text-xs text-slate-400 truncate">{qUser.email}</div>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleRemoveUser(qUser.email)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:border-rose-200 opacity-0 group-hover:opacity-100 transition-all"
                        title="Remove from this device"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                    <User className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-500 mb-1">Welcome back!</p>
                  <p className="text-xs text-slate-400 mb-4">Sign in to access your account</p>
                  <button
                    onClick={() => setShowManualForm(true)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors shadow-sm shadow-blue-200"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {quickUsers.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => setShowManualForm(true)}
                    className="w-full py-2 text-sm font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    Sign in with another account
                  </button>
                </div>
              )}

              <div className="mt-4 text-center">
                <span className="text-xs text-slate-400">Don't have an account? </span>
                <Link to="/register" className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Create one
                </Link>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setShowManualForm(false);
                  setQuickUsers(getQuickUsers().filter(u => u.role === 'client'));
                }}
                className="text-xs text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to quick sign in
              </button>

              <form onSubmit={handleManualLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="mt-5 text-center">
                <span className="text-xs text-slate-400">Don't have an account? </span>
                <Link to="/register" className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Create one
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          &copy; 2026 HealthGuard Insurance. All rights reserved.
        </p>
      </div>
    </div>
  );
}
