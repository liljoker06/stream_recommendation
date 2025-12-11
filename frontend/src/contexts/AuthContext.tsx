import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  email: string;
  birthDate: string;
  age: number;
  preferences: {
    genres: string[];
    completedAt: string;
  };
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (userData: any) => Promise<void>;
  setAuthUser: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Vérifier la validité du token auprès du serveur
      const response = await authAPI.verifyToken();
      
      if (response.success && response.data?.user) {
        // Token valide, mise à jour de l'utilisateur
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        // Token invalide ou utilisateur non trouvé
        throw new Error('Token invalide');
      }
    } catch (error) {
      console.error('Token invalide ou expiré:', error);
      // Nettoyer le localStorage si le token est invalide
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (_email: string, _password: string) => {
    try {
      setIsLoading(true);
      
      // L'authentification est maintenant gérée directement dans Login.tsx
      // Cette fonction est gardée pour compatibilité mais n'est plus utilisée
      console.warn('login() appelé depuis AuthContext - utilisez la page Login à la place');
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw new Error('Email ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (_userData: any) => {
    try {
      setIsLoading(true);
      
      // L'inscription est maintenant gérée directement dans SignupStep2.tsx
      // Cette fonction est gardée pour compatibilité mais n'est plus utilisée
      console.warn('signup() appelé depuis AuthContext - utilisez la page Signup à la place');
      
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw new Error('Erreur lors de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Nettoyer le localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const setAuthUser = (userData: any) => {
    setUser(userData);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup,
    setAuthUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}