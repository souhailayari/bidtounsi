import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('bidtounsi_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem('bidtounsi_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.userType === 'admin');
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Try backend first
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const token = data.token;
        // Save token and a minimal user snapshot
        localStorage.setItem('bidtounsi_token', token);
        const snapshot: User = {
          email,
          password: '',
          id: '',
          createdAt: new Date().toISOString(),
          userType: 'acheteur',
        } as User;
        setUser(snapshot);
        setIsAuthenticated(true);
        setIsAdmin(snapshot.userType === 'admin');
        localStorage.setItem('bidtounsi_user', JSON.stringify(snapshot));
        return true;
      }
    } catch (e) {
      // backend unavailable - fall back to localStorage behavior below
    }

    // Fallback: localStorage mock (existing behavior)
    const users = JSON.parse(localStorage.getItem('bidtounsi_users') || '[]');
    const foundUser = users.find((u: User) => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      setIsAdmin(foundUser.userType === 'admin');
      localStorage.setItem('bidtounsi_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const createUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    // Seul l'admin peut créer des utilisateurs
    if (!isAdmin) {
      return false;
    }

    // Vérifier si l'email existe déjà
    const users = JSON.parse(localStorage.getItem('bidtounsi_users') || '[]');
    const existingUser = users.find((u: User) => u.email === userData.email);
    
    if (existingUser) {
      return false; // Email déjà utilisé
    }

    // Try backend creation first (admin should be logged in and have token)
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(userData),
      });
      if (res.ok) return true;
    } catch (e) {
      // Ignore and fallback to localStorage below
    }

    // Fallback: create locally in localStorage
    const newUser: User = {
      ...userData,
      password: 'motdepasse123', // Mot de passe par défaut
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    } as User;

    users.push(newUser);
    localStorage.setItem('bidtounsi_users', JSON.stringify(users));
    return true;
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    // Mettre à jour l'utilisateur
    const updatedUser = { ...user, ...userData };
    
    // Mettre à jour dans la liste des utilisateurs
    const users = JSON.parse(localStorage.getItem('bidtounsi_users') || '[]');
    const updatedUsers = users.map((u: User) => u.id === user.id ? updatedUser : u);
    localStorage.setItem('bidtounsi_users', JSON.stringify(updatedUsers));
    
    // Mettre à jour l'utilisateur connecté
    localStorage.setItem('bidtounsi_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('bidtounsi_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      createUser,
      updateUser,
      logout,
      isAuthenticated,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}