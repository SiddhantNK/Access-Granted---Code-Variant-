import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
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
  Plus
} from 'lucide-react';

import GhostMascot from './GhostMascot';
import NewBurialModal from './NewBurialModal';
import { useAuth } from '../context/AuthContext';
import { useIntro } from '../context/IntroContext';
import { useTheme } from '../context/ThemeContext';

/**
 * Navbar Component - Restrained Editorial Aesthetic
 * Crisp contrast, semantic theme variables, zero glowing neon gradients
 */
const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { openIntro } = useIntro();
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [burialModalOpen, setBurialModalOpen] = useState(false);
  const [ghostHidden, setGhostHidden] = useState(
    () => localStorage.getItem('pg_ghost_hidden') === 'true'
  );

  const navItems = [
    { label: 'Graveyard', path: '/dashboard' },
    { label: 'Crypt', path: '/crypt' },
    { label: 'Revive', path: '/revive' },
    { label: 'Autopsy', path: '/autopsy' },
  ];

  const isActive = (path) => {
    if (path === '/revive') {
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
    <>
      <header className="sticky top-0 z-40 bg-theme-surface/90 border-b border-theme-border backdrop-blur-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand / Logo */}
            <div className="flex items-center gap-6 flex-shrink-0">
              <Link to="/dashboard" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-theme-surface-secondary border border-theme-border flex items-center justify-center text-theme-accent group-hover:border-theme-accent transition-colors">
                  <span className="font-serif-title font-bold text-base leading-none">†</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-serif-title font-semibold tracking-wide text-theme-text">
                    The Graveyard
                  </span>
                  <span className="text-[10px] text-theme-text-muted font-mono tracking-wider uppercase -mt-0.5">
                    Personal Archive
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Clean Archival Navigation Tabs */}
            <nav className="hidden md:flex items-center justify-center gap-1 flex-1 max-w-sm mx-auto">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      active
                        ? 'bg-theme-surface-secondary text-theme-text font-semibold border border-theme-border shadow-sm'
                        : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-secondary/60 border border-transparent'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions, Theme Toggle, New Burial, PFP */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
              
              {/* New Burial Fast Action */}
              <button
                onClick={() => setBurialModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-theme-mint hover:bg-theme-mint-hover text-theme-mint-foreground transition-all shadow-sm active:scale-95"
                title="Bury an unfinished project"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Burial</span>
              </button>

              {/* Ghost Guide in Header beside New Burial */}
              {!ghostHidden && (
                <div className="relative hidden lg:flex items-center mr-0.5 group">
                  <GhostMascot
                    size="sm"
                    expression="auto"
                    animated={true}
                    trackMouse={false}
                    autoCycle={true}
                    onClick={() => openIntro()}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                  {/* Hover tooltip */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-theme-surface border border-theme-border text-[10px] font-mono text-theme-text-muted px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
                    Need a hand?
                  </div>
                </div>
              )}

              {/* Help / Guide button */}
              <button
                onClick={() => openIntro()}
                className="p-2 text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-secondary rounded-lg transition-colors border border-transparent hover:border-theme-border"
                title="Interactive Guide (Step 1)"
                aria-label="Walkthrough"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-secondary rounded-lg transition-colors border border-transparent hover:border-theme-border"
                title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-theme-gold" /> : <Moon className="w-4 h-4 text-theme-accent" />}
              </button>

              {/* User Profile Avatar Pill (PFP) with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full bg-theme-surface-secondary hover:bg-theme-surface-tertiary border border-theme-border transition-all text-left focus:outline-none focus:ring-2 focus:ring-theme-accent/30"
                  aria-label="User Profile"
                >
                  <div className="w-6 h-6 rounded-full bg-theme-accent text-theme-accent-foreground font-semibold text-[11px] flex items-center justify-center">
                    {initials}
                  </div>
                  <div className="hidden sm:block text-xs">
                    <p className="text-theme-text font-medium leading-none truncate max-w-[90px]">
                      {user?.name || 'Keeper'}
                    </p>
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-theme-surface border border-theme-border rounded-xl shadow-lg p-1.5 z-50 animate-fadeIn"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-3 py-2.5 border-b border-theme-border">
                      <p className="text-xs font-semibold text-theme-text">{user?.name || 'Gravekeeper'}</p>
                      <p className="text-[11px] text-theme-text-muted truncate">{user?.email || 'keeper@graveyard.local'}</p>
                    </div>

                    <div className="py-1">
                      {/* New Burial Option */}
                      <button
                        onClick={() => setBurialModalOpen(true)}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-secondary rounded-lg transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Plus className="w-3.5 h-3.5 text-theme-accent" />
                          <span>New Burial</span>
                        </span>
                        <span className="text-[10px] text-theme-accent font-mono">+New</span>
                      </button>

                      {/* Toggle Ghost Option */}
                      <button
                        onClick={handleToggleGhost}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-secondary rounded-lg transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          {ghostHidden ? <Ghost className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>Ghost Companion</span>
                        </span>
                        <span className={`text-[10px] font-mono ${ghostHidden ? 'text-theme-text-muted' : 'text-theme-accent font-semibold'}`}>
                          {ghostHidden ? 'Hidden' : 'Visible'}
                        </span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-theme-border">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-theme-destructive hover:bg-theme-destructive-surface rounded-lg transition-colors font-medium"
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
                className="md:hidden p-2 text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-secondary rounded-lg transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-theme-border space-y-1 animate-slideUp">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      active
                        ? 'bg-theme-surface-secondary text-theme-text font-semibold'
                        : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-secondary/60'
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setBurialModalOpen(true);
                }}
                className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-theme-accent text-theme-accent-foreground"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Burial</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Burial Modal for creating new entries from anywhere */}
      <NewBurialModal 
        isOpen={burialModalOpen} 
        onClose={() => setBurialModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
