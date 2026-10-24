import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import GhostMascot from '../components/GhostMascot';
import { useAuth } from '../context/AuthContext';

/**
 * LandingPage - Public landing page
 * 
 * Features:
 * - Dynamic interactive Ghost that floats around the auth panel
 * - Seamless login & signup with pre-seeded demo support
 * - Spooky, rich dark aesthetic without cluttered AI template cards
 */

const LandingPage = () => {
  const navigate = useNavigate();
  const { signup, signin, error, isLoading } = useAuth();
  
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await signup(formData.name, formData.email, formData.password);
      } else {
        await signin(formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message);
    }
  };

  // Ghost expression reacts to auth state
  const ghostExpression = formError || error
    ? 'scared'
    : passwordFocused
    ? 'thinking'
    : isSignup
    ? 'happy'
    : 'neutral';

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative selection:bg-purple-500/30">
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[140px] animate-ambientDrift" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none" />
      </div>

      {/* Floating subtle ambient symbols around screen */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <span className="absolute top-16 left-[12%] text-2xl opacity-20 animate-ambientDrift" style={{ animationDelay: '0s' }}>⚰️</span>
        <span className="absolute top-1/3 left-[6%] text-xl opacity-15 animate-ambientDrift" style={{ animationDelay: '2s' }}>✨</span>
        <span className="absolute bottom-24 left-[15%] text-2xl opacity-20 animate-ambientDrift" style={{ animationDelay: '4s' }}>📜</span>
        <span className="absolute top-20 right-[14%] text-xl opacity-20 animate-ambientDrift" style={{ animationDelay: '1.5s' }}>🔮</span>
        <span className="absolute top-1/2 right-[8%] text-2xl opacity-15 animate-ambientDrift" style={{ animationDelay: '3.5s' }}>🕯️</span>
        <span className="absolute bottom-28 right-[18%] text-xl opacity-20 animate-ambientDrift" style={{ animationDelay: '5s' }}>⚡</span>
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 max-w-6xl mx-auto">
        
        {/* Top Header / Branding */}
        <div className="text-center mb-8 max-w-2xl animate-slideUp">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>A Resting Place for Code & Dreams</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent mb-3">
            The Project Graveyard
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-md mx-auto">
            Document uncompleted projects, remember why you paused, and give valuable ideas a second life.
          </p>
        </div>

        {/* Auth Box with Floating Ghost around it */}
        <div className="relative w-full max-w-md animate-slideUp" style={{ animationDelay: '100ms' }}>
          
          {/* Floating Ghost Companion positioned dynamically around the card */}
          <div 
            className="absolute -top-16 -right-6 sm:-right-12 z-20 pointer-events-auto cursor-pointer animate-ghostOrbit transition-all duration-500"
            onClick={() => {
              if (!formData.email) {
                setFormData({ name: 'Gravekeeper Demo', email: 'demo@example.com', password: 'password123' });
              }
            }}
            title="Click ghost to fill test credentials"
          >
            <div className="relative group">
              <GhostMascot 
                size="md" 
                expression={ghostExpression}
                animated={true}
                className="drop-shadow-[0_10px_25px_rgba(168,85,247,0.35)] hover:scale-105 transition-transform"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-purple-300 text-[10px] px-2 py-0.5 rounded border border-purple-500/30 pointer-events-none">
                {passwordFocused ? 'No peeking! 🙈' : 'Hover / Click me! 👻'}
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-slate-900/70 backdrop-blur-2xl border border-purple-500/20 rounded-2xl p-7 sm:p-8 shadow-2xl shadow-purple-950/40 relative">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {isSignup ? 'Create Gravekeeper Account' : 'Welcome Back'}
                </h2>
                <p className="text-white/50 text-xs mt-1">
                  {isSignup 
                    ? 'Start cataloging your repository relics' 
                    : 'Access your vaults & archived ventures'}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {(formError || error) && (
              <div className="mb-5 p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2 animate-shake">
                <span>⚠️</span>
                <span>{formError || error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name Field (Signup only) */}
              {isSignup && (
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    Gravekeeper Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-purple-300/40" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Satoshi or Ada"
                      className="w-full bg-slate-950/60 border border-purple-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-purple-300/40" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@domain.com"
                    className="w-full bg-slate-950/60 border border-purple-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  Secret Key / Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-purple-300/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    onChange={handleInputChange}
                    placeholder={isSignup ? 'Min 6 characters' : '••••••••'}
                    className="w-full bg-slate-950/60 border border-purple-500/20 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 mt-2 text-sm"
              >
                {isLoading ? (
                  <span>Summoning...</span>
                ) : (
                  <>
                    <span>{isSignup ? 'Create Account' : 'Enter The Graveyard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Switch */}
            <div className="mt-6 pt-5 border-t border-purple-500/10 text-center">
              <p className="text-white/50 text-xs">
                {isSignup ? 'Already holding keys to a vault?' : "First time visiting the crypt?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setFormError('');
                    setFormData({ name: '', email: '', password: '' });
                  }}
                  className="text-purple-400 hover:text-purple-300 font-semibold ml-1.5 transition-colors underline-offset-4 hover:underline"
                >
                  {isSignup ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </div>
          </div>

          {/* Quick Demo Autofill Hint below the card */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignup(false);
                setFormData({ name: '', email: 'demo@example.com', password: 'password123' });
                setFormError('');
              }}
              className="text-xs text-white/40 hover:text-purple-300 transition-colors inline-flex items-center gap-1.5 py-1 px-3 rounded-full hover:bg-white/5"
            >
              <span>Quick Test? Auto-fill demo credentials</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-white/30 text-xs">
          <span>The Project Graveyard • Built for makers with unfinished masterpieces</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

