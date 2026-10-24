import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * IntroContext
 * 
 * Manages global state for the intro walkthrough.
 * Stores whether the user has seen the intro in localStorage.
 * Provides functions to show/hide/reset the intro.
 */
const IntroContext = createContext();

export const useIntro = () => {
  const context = useContext(IntroContext);
  if (!context) {
    throw new Error('useIntro must be used within IntroProvider');
  }
  return context;
};

export const IntroProvider = ({ children }) => {
  const [showIntro, setShowIntro] = useState(false);
  const [introSeen, setIntroSeen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const seen = localStorage.getItem('pg_intro_seen') === 'true';
    setIntroSeen(seen);
    // Only show intro to new users
    setShowIntro(!seen);
    setIsLoading(false);
  }, []);

  const openIntro = () => {
    setShowIntro(true);
  };

  const closeIntro = () => {
    setShowIntro(false);
    setIntroSeen(true);
    localStorage.setItem('pg_intro_seen', 'true');
  };

  const resetIntro = () => {
    setIntroSeen(false);
    setShowIntro(true);
    localStorage.removeItem('pg_intro_seen');
  };

  const value = {
    showIntro,
    introSeen,
    isLoading,
    openIntro,
    closeIntro,
    resetIntro,
  };

  return (
    <IntroContext.Provider value={value}>
      {children}
    </IntroContext.Provider>
  );
};

export default IntroProvider;
