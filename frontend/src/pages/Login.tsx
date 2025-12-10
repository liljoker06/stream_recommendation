import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur lors de la saisie
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Appel API de connexion
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      if (response.success && response.data) {
        // Sauvegarder le token et les infos utilisateur
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Mettre à jour le contexte d'authentification
        setAuthUser(response.data.user);
        
        console.log('Connexion réussie:', response.data.user);
        
        // Redirection vers la page d'accueil
        navigate('/');
      }
      
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      const errorMessage = error.response?.data?.message || 'Email ou mot de passe incorrect';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-b from-netflix-black via-transparent to-netflix-black"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-4xl font-black text-netflix-red tracking-tight">ReCommend</h1>
            <h2 className="text-3xl font-bold text-netflix-white mb-2">S'identifier</h2>
        </div>

        {/* Formulaire ReCommend */}
        <div className="bg-netflix-black/70 backdrop-blur-sm rounded p-8 md:p-12 border border-netflix-gray">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Erreur générale */}
            {errors.general && (
              <div className="bg-netflix-red/20 border border-netflix-red text-netflix-white px-4 py-3 rounded text-sm">
                {errors.general}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-netflix-white mb-2">
                E-mail ou numéro de téléphone
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-netflix-gray border rounded text-netflix-white placeholder-netflix-text-dark focus:outline-none focus:ring-2 focus:ring-netflix-white transition-all ${
                  errors.email 
                    ? 'border-netflix-red' 
                    : 'border-netflix-gray'
                }`}
                placeholder="E-mail ou numéro de téléphone"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-netflix-red">{errors.email}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-netflix-white mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-netflix-gray border rounded text-netflix-white placeholder-netflix-text-dark focus:outline-none focus:ring-2 focus:ring-netflix-white transition-all pr-12 ${
                    errors.password 
                      ? 'border-netflix-red' 
                      : 'border-netflix-gray'
                  }`}
                  placeholder="Mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-netflix-text-dark hover:text-netflix-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-netflix-red">{errors.password}</p>
              )}
            </div>

            {/* Bouton de connexion ReCommend */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded text-sm font-bold transition-colors ${
                isLoading 
                  ? 'bg-netflix-red/50 cursor-not-allowed text-netflix-text-dark' 
                  : 'bg-netflix-red hover:bg-netflix-red-dark text-netflix-white'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-netflix-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>


            {/* Se souvenir */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 bg-netflix-gray border-netflix-gray rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-netflix-text-gray">
                Se souvenir de moi
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-netflix-text-gray">
            Première visite sur ReCommend ?{' '}
            <Link to="/signup" className="text-netflix-white hover:underline font-medium">
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}