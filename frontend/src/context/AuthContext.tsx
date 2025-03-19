import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, role: 'normal_user' | 'garbage_man') => Promise<void>;
  register: (email: string, password: string, name: string, role: 'normal_user' | 'garbage_man') => Promise<void>;
  logout: () => void;
}

interface User {
  id: string;
  email: string;
  name: string;
  type: 'garbage_man' | 'normal_user';
}

const AuthContext = createContext<AuthContextType | null>(null);

const BACKEND_URL = 'http://localhost:5001';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string, role: 'normal_user' | 'garbage_man') => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/users/login`, {
        email,
        password,
        role
      });
      setUser(response.data.user);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: 'normal_user' | 'garbage_man') => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/users/register`, {
        email,
        password,
        name,
        role
      });
      setUser(response.data.user);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}