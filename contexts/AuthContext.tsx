import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://UR-IP:3000/api';

type User = {
  id: string;
  username: string;
  email: string;
  profileImage?: string | null;
  main?: string | null;
  description?: string | null;
  favoriteCharacters?: Array<{ characterName: string; series: string }>;
  mainCharacter?: { characterName: string; series: string };
  skillLevel?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: { username?: string; email?: string; profileImage?: string | null; main?: string | null; description?: string | null }) => Promise<void>;
  deleteAccount: () => Promise<void>;
  isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Errore logout:', error);
    }
  };

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Verifica che il token sia ancora valido
        await verifyToken(storedToken);
      }
    } catch (error) {
      console.error('Errore caricamento auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${tokenToVerify}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          await AsyncStorage.setItem('user', JSON.stringify(data.user));
        }
      } else if (res.status === 401) {
        // Token non valido, logout
        await logout();
      }
    } catch (error) {
      console.error('Errore verifica token:', error);
      // Se c'è un errore di connessione, non fare logout (l'utente potrebbe essere offline)
      // Mantieni i dati salvati localmente
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
      } else {
        throw new Error(data.error || 'Errore login');
      }
    } catch (error: any) {
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
      } else {
        throw new Error(data.error || data.errors?.[0]?.msg || 'Errore registrazione');
      }
    } catch (error: any) {
      throw error;
    }
  };

  const updateProfile = async (updates: { username?: string; email?: string; profileImage?: string | null }) => {
    if (!token) {
      throw new Error('Non autenticato');
    }

    try {
      const res = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
      } else {
        throw new Error(data.error || 'Errore aggiornamento profilo');
      }
    } catch (error: any) {
      throw error;
    }
  };

  const deleteAccount = async () => {
    if (!token) {
      throw new Error('Non autenticato');
    }

    try {
      const res = await fetch(`${API_URL}/user/profile`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        // Rimuovi dati locali e esegui logout
        await logout();
      } else {
        throw new Error(data.error || 'Errore cancellazione account');
      }
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
        isLoggedIn: !!user && !!token,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve essere usato dentro AuthProvider');
  }
  return context;
}
