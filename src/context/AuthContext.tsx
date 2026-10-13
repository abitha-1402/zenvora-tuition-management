import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { loadFromStorage, saveToStorage, removeFromStorage, STORAGE_KEYS } from '../utils/storage';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAdmin: boolean;
  isTeacher: boolean;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  demoLogin: (role: UserRole) => void;
  logout: () => void;
}

const DEFAULT_ADMIN: User = {
  id: 'USR-ADMIN-01',
  name: 'Anita Sharma',
  email: 'admin@zenvora.edu',
  role: 'admin',
  avatar: 'AS'
};

const DEFAULT_TEACHER: User = {
  id: 'USR-TCH-01',
  name: 'Prof. Rajesh Verma',
  email: 'rajesh.verma@zenvora.edu',
  role: 'teacher',
  assignedTeacherId: 'TCH-01',
  avatar: 'RV'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return loadFromStorage<User | null>(STORAGE_KEYS.AUTH, DEFAULT_ADMIN);
  });

  useEffect(() => {
    if (currentUser) {
      saveToStorage(STORAGE_KEYS.AUTH, currentUser);
    } else {
      removeFromStorage(STORAGE_KEYS.AUTH);
    }
  }, [currentUser]);

  const login = (email: string, pass: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }
    if (!pass) {
      return { success: false, error: 'Please enter your password.' };
    }

    if (trimmedEmail.includes('teacher') || trimmedEmail.includes('rajesh')) {
      setCurrentUser(DEFAULT_TEACHER);
      return { success: true };
    }

    if (trimmedEmail.includes('admin') || trimmedEmail === 'admin@zenvora.edu') {
      setCurrentUser(DEFAULT_ADMIN);
      return { success: true };
    }

    // Default demo login creates admin session with provided name
    const namePart = trimmedEmail.split('@')[0] || 'Tutor';
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    setCurrentUser({
      id: `USR-${Date.now()}`,
      name: formattedName,
      email: trimmedEmail,
      role: 'admin',
      avatar: formattedName.slice(0, 2).toUpperCase()
    });
    return { success: true };
  };

  const demoLogin = (selectedRole: UserRole) => {
    if (selectedRole === 'admin') {
      setCurrentUser(DEFAULT_ADMIN);
    } else {
      setCurrentUser(DEFAULT_TEACHER);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const role: UserRole = currentUser?.role || 'admin';
  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAdmin,
        isTeacher,
        login,
        demoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
