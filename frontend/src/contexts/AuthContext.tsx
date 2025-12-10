import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Vérifier le localStorage pour une session existante
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('authToken');
      
      if (storedUser && token) {
        // Simuler la validation du token avec le backend
        await new Promise(resolve => setTimeout(resolve, 500));
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      // Nettoyer en cas d'erreur
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simuler l'appel API de connexion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données d'utilisateur fictives (normalement reçues du backend)
      const mockUser: User = {
        id: 'user_' + Date.now(),
        email,
        birthDate: '1990-01-01', // Normalement récupéré du backend
        age: 34,
        preferences: {
          genres: ['action', 'scifi', 'thriller'],
          completedAt: '2024-01-01T00:00:00.000Z'
        },
        createdAt: new Date().toISOString()
      };
      
      // Token fictif (normalement reçu du backend)
      const mockToken = 'jwt_token_' + Date.now();
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('authToken', mockToken);
      
      setUser(mockUser);
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw new Error('Email ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any) => {
    try {
      setIsLoading(true);
      
      // Simuler l'appel API d'inscription
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
        id: 'user_' + Date.now(),
        email: userData.email,
        birthDate: userData.birthDate,
        age: userData.age,
        preferences: userData.preferences,
        createdAt: new Date().toISOString()
      };
      
      const mockToken = 'jwt_token_' + Date.now();
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('authToken', mockToken);
      
      setUser(newUser);
      
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
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}