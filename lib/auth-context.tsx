'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from './firebase';
import { User, onAuthStateChanged } from 'firebase/auth';

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  idToken: string | null;
  refreshIdToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const token = await user.getIdToken();
        setIdToken(token);
      } else {
        setIdToken(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refreshIdToken = async () => {
    if (currentUser) {
      const token = await currentUser.getIdToken(true);
      setIdToken(token);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, idToken, refreshIdToken }}>
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
