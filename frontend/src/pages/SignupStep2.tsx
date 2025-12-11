import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, contentAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function SignupStep2() {
  const navigate = useNavigate();
  const { setAuthUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step1Data, setStep1Data] = useState<any>(null);
  const [movieGenres, setMovieGenres] = useState<string[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const response = await contentAPI.getCategories('movie');
        if (response.success) {
          setMovieGenres(response.data);
        }
      } catch (error) {
        console.error('Erreur chargement genres:', error);
      } finally {
        setLoadingGenres(false);
      }
    };

    loadGenres();
  }, []);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/');
      return;
    }
    
    // Récupérer les données de l'étape 1
    const data = localStorage.getItem('signupStep1Data');
    if (!data) {
      navigate('/signup');
      return;
    }
    setStep1Data(JSON.parse(data));
  }, [navigate, isAuthenticated, authLoading]);

  const toggleGenre = (genreName: string) => {
    setSelectedGenres(prev => 
      prev.includes(genreName)
        ? prev.filter(name => name !== genreName)
        : [...prev, genreName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedGenres.length < 3) {
      alert('Veuillez sélectionner au moins 3 genres pour personnaliser vos recommandations.');
      return;
    }

    setIsLoading(true);
    
    try {
      const userData = {
        name: step1Data.name,
        email: step1Data.email,
        password: step1Data.password,
        age: step1Data.age,
        gender: step1Data.gender,
        preferences: {
          genres: selectedGenres,
          completedAt: new Date().toISOString()
        }
      };
      
      // Appel API d'inscription
      const response = await authAPI.signup(userData);
      
      if (response.success && response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setAuthUser(response.data.user);
        
        console.log('Inscription complète:', response.data.user);
        
        localStorage.removeItem('signupStep1Data');
        
        navigate('/', { 
          state: { 
            newUser: true, 
            message: 'Bienvenue ! Votre compte a été créé avec succès.' 
          }
        });
      }
      
    } catch (error: any) {
      console.error('Erreur inscription étape 2:', error);
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de la création de votre compte.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/signup');
  };

  if (!step1Data || loadingGenres) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-white">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1489599408017-293606b66a6d?w=1920&h=1080&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8">
            <h1 className="text-4xl font-bold text-white">ReCommend</h1>
          </Link>
          
          {/* Progress */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-medium">✓</div>
              <div className="w-16 h-0.5 bg-red-600"></div>
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-medium">2</div>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Personnalisez vos goûts</h2>
          <p className="text-gray-400 mb-4">Étape 2/2 : Sélectionnez vos genres préférés</p>
          <p className="text-sm text-gray-500">
            Choisissez au moins 3 genres pour que notre IA puisse vous recommander les meilleurs films
          </p>
        </div>

        {/* Sélecteur de genres */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700 mb-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                Vos genres favoris ({selectedGenres.length}/{movieGenres.length})
              </h3>
              {selectedGenres.length >= 3 && (
                <div className="flex items-center text-green-400">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Parfait ! Vous pouvez continuer
                </div>
              )}
            </div>
            
            {selectedGenres.length < 3 && (
              <div className="bg-amber-600/20 border border-amber-600/50 text-amber-400 px-4 py-3 rounded-lg text-sm mb-6">
                ⚠️ Sélectionnez au moins {3 - selectedGenres.length} genre(s) supplémentaire(s) pour continuer
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {movieGenres.map((genre) => (
              <div
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedGenres.includes(genre)
                    ? 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium text-base ${
                    selectedGenres.includes(genre) ? 'text-white' : 'text-gray-300'
                  }`}>
                    {genre}
                  </h3>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-2 ${
                    selectedGenres.includes(genre)
                      ? 'border-red-500 bg-red-500'
                      : 'border-gray-500'
                  }`}>
                    {selectedGenres.includes(genre) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3 px-6 border-2 border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-700 hover:border-gray-500 transition-colors"
            >
              ← Retour
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={selectedGenres.length < 3 || isLoading}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                selectedGenres.length < 3 || isLoading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/25'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création du compte...
                </div>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </div>
        </div>

        {/* Preview des recommandations */}
        {selectedGenres.length >= 3 && (
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              Aperçu de vos recommandations
            </h3>
            <p className="text-gray-400 mb-4">
              Basé sur vos genres sélectionnés, voici le type de films que nous vous recommanderons :
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedGenres.map((genre) => (
                <div key={genre} className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium">
                  {genre}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}