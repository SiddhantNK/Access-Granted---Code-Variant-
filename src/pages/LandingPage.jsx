import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, Compass, ShieldCheck, Archive } from 'lucide-react';
import GhostMascot from '../components/GhostMascot';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

/**
 * LandingPage - Distinctive Archival & Thoughtful Design
 * 
 * Features:
 * - Editorial typography, calm atmosphere, zero neon/purple gradients
 * - Clear primary CTA ("Enter the Graveyard")
 * - Explain product benefits: preserve context, salvage components, choose revival paths
 * - High contrast in both light (#F5F1E8) and dark (#1B1D1A) modes
 */

const LandingPage = () => {
  const navigate = useNavigate();
  const { signup, signin, error, isLoading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
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

  const ghostExpression = formError || error
    ? 'scared'
    : passwordFocused
    ? 'thinking'
    : 'happy';

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text font-sans transition-colors duration-200">
      
      {/* Top Subtle Utility Bar */}
      <div className="border-b border-theme-border/60 py-3 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-serif-title font-bold text-sm text-theme-accent">†</span>
          <span className="text-xs uppercase font-mono tracking-widest text-theme-text-muted">
            The Graveyard // Archival Registry
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className="text-xs font-mono text-theme-text-muted hover:text-theme-text border border-theme-border px-2.5 py-1 rounded-md transition-colors"
        >
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Product Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-surface-secondary border border-theme-border text-xs text-theme-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-theme-accent" />
              <span>A purposeful resting place for unfinished software</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-title font-medium tracking-tight text-theme-text leading-[1.12]">
              Where unfinished ideas get a second chance.
            </h1>

            <p className="text-base sm:text-lg text-theme-text-muted leading-relaxed max-w-xl">
              Don&apos;t let abandoned repositories silently rot in folders. Record what you built, document why you stopped, catalog reusable components, and decide when to revive, pivot, or let them rest in peace.
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-theme-border">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg border border-theme-border bg-theme-surface text-theme-accent flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                </div>
                <p className="text-xs font-mono uppercase tracking-wider text-theme-accent font-semibold">01. Preserve</p>
                <h3 className="text-sm font-semibold text-theme-text">Capture Context</h3>
                <p className="text-xs text-theme-text-muted">Save the exact mental state, architecture notes, and reason for pause.</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg border border-theme-border bg-theme-surface text-theme-accent flex items-center justify-center">
                  <Archive className="w-4 h-4" aria-hidden="true" />
                </div>
                <p className="text-xs font-mono uppercase tracking-wider text-theme-accent font-semibold">02. Salvage</p>
                <h3 className="text-sm font-semibold text-theme-text">Tag Components</h3>
                <p className="text-xs text-theme-text-muted">Extract hooks, contracts, and UI patterns for your active projects.</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg border border-theme-border bg-theme-surface text-theme-accent flex items-center justify-center">
                  <Compass className="w-4 h-4" aria-hidden="true" />
                </div>
                <p className="text-xs font-mono uppercase tracking-wider text-theme-accent font-semibold">03. Awaken</p>
                <h3 className="text-sm font-semibold text-theme-text">Set Revival Paths</h3>
                <p className="text-xs text-theme-text-muted">Schedule time capsules or restart with a smaller, sharper scope.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Authentication Dossier */}
          <div className="lg:col-span-5">
            <div className="relative bg-theme-surface border border-theme-border rounded-2xl p-6 sm:p-8 shadow-md">
              
              {/* Guardian Mascot Header */}
              <div className="flex items-center justify-between pb-5 border-b border-theme-border mb-6">
                <div>
                  <h2 className="text-xl font-serif-title font-semibold text-theme-text">
                    {isSignup ? 'Open New Tomb' : 'Enter the Graveyard'}
                  </h2>
                  <p className="text-xs text-theme-text-muted mt-0.5">
                    {isSignup ? 'Catalog your dormant repository relics' : 'Access your archived vaults'}
                  </p>
                </div>
                <GhostMascot 
                  size="sm" 
                  expression={ghostExpression} 
                  animated={true} 
                  trackMouse={true} 
                />
              </div>

              {/* Error Alert */}
              {(formError || error) && (
                <div className="mb-4 p-3 rounded-lg bg-theme-destructive-surface border border-theme-destructive/30 text-theme-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError || error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                  <div>
                    <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
                      Keeper Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-theme-text-subtle" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Ada Lovelace"
                        className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-theme-surface-secondary border border-theme-border text-xs sm:text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-accent focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-theme-text-subtle" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="keeper@graveyard.local"
                      className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-theme-surface-secondary border border-theme-border text-xs sm:text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-accent focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-theme-text-muted mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-theme-text-subtle" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 rounded-lg bg-theme-surface-secondary border border-theme-border text-xs sm:text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-accent focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-theme-text-subtle hover:text-theme-text transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-foreground text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Entering Archive...</span>
                  ) : (
                    <>
                      <span>{isSignup ? 'Create Gravekeeper Vault' : 'Enter the Graveyard'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Switch Auth Mode */}
              <div className="mt-5 pt-4 border-t border-theme-border text-center">
                <p className="text-xs text-theme-text-muted">
                  {isSignup ? 'Already have an archive vault?' : 'Need a new vault?'}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignup(!isSignup);
                      setFormError('');
                    }}
                    className="ml-1 text-theme-accent font-semibold hover:underline"
                  >
                    {isSignup ? 'Sign in' : 'Create an account'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-theme-border flex flex-col sm:flex-row items-center justify-between text-xs text-theme-text-muted gap-4">
          <p>© The Project Graveyard. For makers who dare to start many things.</p>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Privacy-first</span>
            <span>•</span>
            <span>Local Storage</span>
            <span>•</span>
            <span>JSON Exportable</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
