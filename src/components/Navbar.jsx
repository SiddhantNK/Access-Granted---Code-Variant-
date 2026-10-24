import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Archive, 
  RefreshCw, 
  BarChart3, 
  Menu, 
  X, 
  LogOut, 
  HelpCircle, 
  Sun, 
  Moon, 
  Ghost, 
  EyeOff, 
  Sparkles
} from 'lucide-react';

import GhostMascot from './GhostMascot';
import { useAuth } from '../context/AuthContext';
import { useIntro } from '../context/IntroContext';
import { useTheme } from '../context/ThemeContext';

/**
 * Navbar Component - Modern, Centered, Zero Emojis
 */

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { openIntro } = useIntro();
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [ghostHidden, setGhostHidden] = useState(
    () => localStorage.getItem('pg_ghost_hidden') === 'true'
  );

  const navItems = [
    { label: 'Graveyard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Crypt', path: '/crypt', icon: Archive },
    { label: 'Revive', path: '/revive/overview', icon: RefreshCw },
    { label: 'Autopsy', path: '/autopsy', icon: BarChart3 },
  ];

  const isActive = (path) => {
    if (path.startsWith('/revive')) {
      return location.pathname.startsWith('/revive');
    }
    return location.pathname === path;
  };

  const handleToggleGhost = () => {
    const nextState = !ghostHidden;
    setGhostHidden(nextState);
    localStorage.setItem('pg_ghost_hidden', nextState ? 'true' : 'false');
    window.dispatchEvent(new Event('ghost_visibility_change'));
  };

  // User initials for PFP avatar
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'GK';

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/85 dark:bg-slate-950/85 border-b border-purple-500/20 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand / Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-900/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-purple-200" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                  Project Graveyard
                </span>
                <span className="text-[10px] text-white/40 font-medium tracking-wider uppercase -mt-0.5">
                  Vault & Archive
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Clean Centered Navigation Tabs */}
          <div className="hidden md:flex items-center justify-center gap-1.5 flex-1 max-w-md mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                    active
                      ? 'bg-purple-500/15 text-purple-200 border border-purple-500/30 shadow-sm shadow-purple-950/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-purple-300' : 'text-white/50'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: Actions, Theme Toggle, Ghost, and PFP Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            
            {/* Ghost Guide in Header */}
            {!ghostHidden && (
              <div className="hidden lg:flex items-center mr-1">
                <GhostMascot
                  size="sm"
                  expression="auto"
                  animated={true}
                  trackMouse={true}
                  autoCycle={true}
                  onClick={() => openIntro()}
                  className="cursor-pointer hover:scale-110 transition-transform"
                />
              </div>
            )}

            {/* Help / Guide button */}
            <button
              onClick={() => openIntro()}
              className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-purple-500/20"
              title="Interactive Walkthrough"
              aria-label="Walkthrough"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Quick Theme Toggle Icon Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-purple-500/20"
              title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-purple-400" />}
            </button>

            {/* User Profile Avatar Pill (PFP) with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-purple-500/20 transition-all text-left focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                aria-label="User Profile"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                  {initials}
                </div>
                <div className="hidden sm:block text-xs">
                  <p className="text-white font-medium leading-none truncate max-w-[100px]">
                    {user?.name || 'Gravekeeper'}
                  </p>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-slate-900 border border-purple-500/20 rounded-2xl shadow-2xl p-1.5 z-50 animate-scaleIn backdrop-blur-2xl"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-3 py-2.5 border-b border-purple-500/10">
                    <p className="text-xs font-semibold text-white">{user?.name || 'Gravekeeper'}</p>
                    <p className="text-[11px] text-white/40 truncate">{user?.email || 'keeper@graveyard.local'}</p>
                  </div>

                  <div className="py-1">
                    {/* Toggle Theme Option */}
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-purple-400" />}
                        <span>Theme Mode</span>
                      </span>
                      <span className="text-[10px] text-purple-300 capitalize">{theme}</span>
                    </button>

                    {/* Toggle Ghost Option */}
                    <button
                      onClick={handleToggleGhost}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        {ghostHidden ? <Ghost className="w-3.5 h-3.5 text-purple-400" /> : <EyeOff className="w-3.5 h-3.5 text-purple-400" />}
                        <span>Ghost Companion</span>
                      </span>
                      <span className={`text-[10px] font-semibold ${ghostHidden ? 'text-white/40' : 'text-emerald-400'}`}>
                        {ghostHidden ? 'Hidden' : 'Active'}
                      </span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-purple-500/10">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-purple-500/15 space-y-1 animate-slideUp">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    active
                      ? 'bg-purple-500/15 text-purple-300 font-semibold'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
