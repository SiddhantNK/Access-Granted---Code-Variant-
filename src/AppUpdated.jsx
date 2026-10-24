import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import ThemeProvider from './context/ThemeContext';
import IntroProvider from './context/IntroContext';
import AuthProvider, { useAuth } from './context/AuthContext';
import ProjectProvider from './context/ProjectContext';

// Components
import IntroWalkthrough from './components/IntroWalkthrough';
import Navbar from './components/Navbar';
import { useIntro } from './context/IntroContext';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Crypt from './pages/Crypt';
import GraveView from './pages/GraveView';
import RevivePage from './pages/RevivePage';
import Autopsy from './pages/Autopsy';

/**
 * Protected Route Component
 * Redirects to landing page if user is not authenticated
 */
const ProtectedRoute = ({ element }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-theme-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-theme-border border-t-theme-accent rounded-full animate-spin mx-auto" />
          <p className="text-theme-text-muted mt-4 text-xs font-mono">Entering the Archive...</p>
        </div>
      </div>
    );
  }

  return user ? element : <Navigate to="/" replace />;
};

/**
 * App Content Component
 * Separated so useIntro hook works
 */
const AppContent = () => {
  const { user } = useAuth();
  const { showIntro, closeIntro } = useIntro();

  return (
    <div className="min-h-screen">
      <Router>
        {/* Show Navbar only to authenticated users */}
        {user && <Navbar />}

        <Routes>
          {/* Public Route - Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/crypt" element={<ProtectedRoute element={<Crypt />} />} />
          <Route path="/grave/:projectId" element={<ProtectedRoute element={<GraveView />} />} />
          <Route path="/revive" element={<ProtectedRoute element={<RevivePage />} />} />
          <Route path="/revive/:projectId" element={<ProtectedRoute element={<RevivePage />} />} />
          <Route path="/autopsy" element={<ProtectedRoute element={<Autopsy />} />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Intro Walkthrough */}
        <IntroWalkthrough isOpen={showIntro} onClose={closeIntro} />
      </Router>
    </div>
  );
};

/**
 * Main App Component
 * All providers wrapped here
 */
const App = () => {
  return (
    <ThemeProvider>
      <IntroProvider>
        <AuthProvider>
          <ProjectProvider>
            <AppContent />
          </ProjectProvider>
        </AuthProvider>
      </IntroProvider>
    </ThemeProvider>
  );
};

export default App;
