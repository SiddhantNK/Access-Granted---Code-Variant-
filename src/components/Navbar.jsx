import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Settings, LogOut, HelpCircle } from 'lucide-react';

import GhostMascot from './GhostMascot';
import { useAuth } from '../context/AuthContext';
import { useIntro } from '../context/IntroContext';
import { useTheme } from '../context/ThemeContext';

/**
 * Navbar Component
 * 
 * Features:
 * - Navigation tabs with icons
 * - Ghost mascot that floats and can navigate
 * - Settings menu
 * - Mobile hamburger menu
 * - Ghost expression changes based on app state
 */

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { openIntro } = useIntro();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ghostExpression, setGhostExpression] = useState('happy');

  const navItems = [
    { label: 'Graveyard', path: '/dashboard', icon: '🏠' },
    { label: 'Crypt', path: '/crypt', icon: '⚰️' },
    { label: 'Revive', path: '/revive', icon: '✨' },
    { label: 'Autopsy', path: '/autopsy', icon: '📊' },
  ];

  const isActive = (path) => location.pathname === path;

  // Update ghost expression based on page
  React.useEffect(() => {
    if (location.pathname === '/crypt') {
      setGhostExpression('thinking');
    } else if (location.pathname === '/autopsy') {
      setGhostExpression('neutral');
    } else {
      setGhostExpression('happy');
    }
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-40 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-purple-500/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center text-lg font-bold text-white">
                ⚰️
              </div>
              <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                Graveyard
              </span>
            </Link>
          </div>

          {/* Navigation Tabs - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/50'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Ghost Mascot - Desktop */}
          <div className="hidden lg:flex flex-1 justify-center">
            <GhostMascot
              size="sm"
              expression={ghostExpression}
              animated={true}
              onClick={() => openIntro()}
              className="cursor-help hover:opacity-80 transition-opacity"
              title="Click to replay intro"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* Help Button */}
            <button
              onClick={() => openIntro()}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Replay intro walkthrough"
              aria-label="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {settingsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-purple-500/20 rounded-lg shadow-xl overflow-hidden animate-slideUp">
                  <button
                    onClick={toggleTheme}
                    className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm"
                  >
                    🌓 Toggle Theme
                  </button>
                  <button
                    onClick={() => {
                      // Toggle ghost visibility
                      const hidden = localStorage.getItem('pg_ghost_hidden') === 'true';
                      localStorage.setItem('pg_ghost_hidden', hidden ? 'false' : 'true');
                      setSettingsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm"
                  >
                    👻 Toggle Ghost
                  </button>
                  <a
                    href="/settings"
                    className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm block"
                  >
                    ⚙️ Settings
                  </a>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm border-t border-white/10"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 animate-slideUp">
            <div className="px-2 py-3 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-purple-600/20 text-purple-300'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
