import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('codeping_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('codeping_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (payload) => {
    localStorage.setItem('codeping_token', payload.token);
    localStorage.setItem('codeping_user', JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  };

  const logout = () => {
    localStorage.removeItem('codeping_token');
    localStorage.removeItem('codeping_user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(token), login, logout, setUser }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
