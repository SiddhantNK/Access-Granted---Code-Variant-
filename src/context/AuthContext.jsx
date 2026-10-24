import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext - Simulated Frontend Authentication
 * 
 * For MVP: Uses localStorage only. No real backend.
 * Stores users locally and maintains session state.
 */

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const sessionUser = localStorage.getItem('pg_session');
    if (sessionUser) {
      try {
        setUser(JSON.parse(sessionUser));
      } catch (err) {
        console.error('Failed to load session:', err);
        localStorage.removeItem('pg_session');
      }
    }
    setIsLoading(false);
  }, []);

  // Pre-seed demo user if empty or not present
  const ensureDemoUser = (users) => {
    const demoEmail = 'demo@example.com';
    if (!users.some((u) => u.email === demoEmail)) {
      const demoUser = {
        id: 'user_demo_default',
        name: 'Gravekeeper Demo',
        email: demoEmail,
        password: 'password123',
        createdAt: new Date().toISOString(),
      };
      const updated = [demoUser, ...users];
      localStorage.setItem('pg_users', JSON.stringify(updated));
      return updated;
    }
    return users;
  };

  // Get all users from localStorage
  const getAllUsers = () => {
    try {
      const usersStr = localStorage.getItem('pg_users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      return ensureDemoUser(users);
    } catch (e) {
      console.error('Failed to parse users:', e);
      return [];
    }
  };

  // Save users to localStorage
  const saveUsers = (users) => {
    localStorage.setItem('pg_users', JSON.stringify(users));
  };

  // Sign up new user
  const signup = async (name, email, password) => {
    setError(null);
    try {
      // Validate inputs
      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }

      if (!email.includes('@')) {
        throw new Error('Invalid email address');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const users = getAllUsers();

      // Check if user already exists
      if (users.some((u) => u.email === email)) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password, // ⚠️ NEVER store plain passwords in real app!
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      saveUsers(users);

      // Auto login after signup
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('pg_session', JSON.stringify(userWithoutPassword));

      return userWithoutPassword;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign in existing user
  const signin = async (email, password) => {
    setError(null);
    try {
      const users = getAllUsers();
      const foundUser = users.find((u) => u.email === email && u.password === password);

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('pg_session', JSON.stringify(userWithoutPassword));

      return userWithoutPassword;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign out
  const logout = () => {
    setUser(null);
    localStorage.removeItem('pg_session');
    setError(null);
  };

  // Update user profile
  const updateProfile = (updates) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('pg_session', JSON.stringify(updatedUser));

    // Update in users list
    const users = getAllUsers();
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      saveUsers(users);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    signup,
    signin,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
