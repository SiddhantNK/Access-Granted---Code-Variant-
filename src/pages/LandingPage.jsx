import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import GhostMascot from '../components/GhostMascot';
import { useAuth } from '../context/AuthContext';

/**
 * LandingPage - Public landing page
 * 
 * Features:
 * - Ghost follows user mouse cursor with smooth physics
 * - Subtle floating code words in Open Sans / Roboto instead of emojis
 * - Cleaned up modern auth card (label: "Password", no demo clutter)
 */

const LandingPage = () => {
  const navigate = useNavigate();
  const { signup, signin, error, isLoading } = useAuth();
  
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [ghostFollowPos, setGhostFollowPos] = useState({ x: 0, y: 0 });
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

  // Smooth mouse float tracking for ghost companion
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate normalized offset relative to window center
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (e.clientX - centerX) / centerX; // -1 to 1
      const deltaY = (e.clientY - centerY) / centerY; // -1 to 1

      // Subtle float bounds
      setGhostFollowPos({
        x: deltaX * 28,
        y: deltaY * 24,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Ghost expression reacts to auth state
  const ghostExpression = formError || error
    ? 'scared'
    : passwordFocused
    ? 'thinking'
    : isSignup
    ? 'happy'
    : 'auto';

  // Elegant code & repository keywords in Roboto / Open Sans
  const floatingKeywords = [
    { text: 'git commit -m "pause"', top: '15%', left: '8%', font: 'font-roboto', delay: '0s' },
    { text: 'const idea = new Vision();', top: '28%', left: '16%', font: 'font-opensans', delay: '2s' },
    { text: '// TODO: revisit after exams', top: '70%', left: '10%', font: 'font-roboto', delay: '4s' },
    { text: 'status: "resting"', top: '85%', left: '22%', font: 'font-opensans', delay: '1s' },
    { text: 'salvage(components, hooks)', top: '18%', right: '12%', font: 'font-roboto', delay: '3s' },
    { text: 'revivalPath: "reborn"', top: '38%', right: '8%', font: 'font-opensans', delay: '1.5s' },
    { text: 'healthScore: 84%', top: '68%', right: '15%', font: 'font-roboto', delay: '5s' },
    { text: 'archive.preserve()', top: '82%', right: '10%', font: 'font-opensans', delay: '2.5s' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative selection:bg-purple-500/30 font-sans">
      
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[130px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[140px] animate-ambientDrift" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] bg-purple-900/10 rounded-full blur-[160px] pointer-events-none" />
      </div>

      {/* Floating subtle typography text in Roboto & Open Sans (replacing emojis) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {floatingKeywords.map((item, i) => (
          <div
            key={i}
            className={`absolute ${item.font} text-xs tracking-wider text-purple-300/25 dark:text-purple-300/20 animate-ambientDrift`}
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              animationDelay: item.delay,
            }}
          >
            <code>{item.text}</code>
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 max-w-6xl mx-auto">
        
        {/* Top Header / Branding */}
        <div className="text-center mb-8 max-w-2xl animate-slideUp">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent mb-3">
            The Project Graveyard
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Document uncompleted projects, remember why you paused, and give valuable ideas a second life.
          </p>
        </div>

        {/* Auth Box with Mouse-Following Floating Ghost */}
        <div className="relative w-full max-w-md animate-slideUp" style={{ animationDelay: '100ms' }}>
          
          {/* Floating Ghost Companion with mouse following dynamics */}
          <div 
            className="absolute -top-16 -right-4 sm:-right-10 z-20 pointer-events-auto transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${ghostFollowPos.x}px, ${ghostFollowPos.y}px)`,
            }}
          >
            <div className="relative">
              <GhostMascot 
                size="md" 
                expression={ghostExpression}
                animated={true}
                trackMouse={true}
                autoCycle={true}
                className="drop-shadow-[0_12px_28px_rgba(168,85,247,0.4)]"
              />
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-purple-500/25 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-purple-950/50 relative">
            
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {isSignup ? 'Create Gravekeeper Account' : 'Welcome Back'}
              </h2>
              <p className="text-white/50 text-xs mt-1">
                {isSignup 
                  ? 'Start cataloging your repository relics' 
                  : 'Access your vaults & archived ventures'}
              </p>
            </div>

            {/* Error Message */}
            {(formError || error) && (
              <div className="mb-5 p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{formError || error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name Field (Signup only) */}
              {isSignup && (
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5 font-roboto">
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
                <label className="block text-xs font-medium text-white/70 mb-1.5 font-roboto">
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
                <label className="block text-xs font-medium text-white/70 mb-1.5 font-roboto">
                  Password
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
                    placeholder="••••••••"
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
                  <span>Entering...</span>
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
                {isSignup ? 'Already have an account?' : 'Need an account?'}
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
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-white/30 text-xs font-roboto">
          <span>The Project Graveyard • Built for makers with unfinished masterpieces</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
