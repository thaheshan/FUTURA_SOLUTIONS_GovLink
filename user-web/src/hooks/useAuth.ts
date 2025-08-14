// src/hooks/useAuth.ts
import { useState } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    // You can add logic later: save token, call API, etc.
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear token, reset state
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}