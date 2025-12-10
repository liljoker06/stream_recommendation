import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Login from './pages/Login';
import SignupStep1 from './pages/SignupStep1';
import SignupStep2 from './pages/SignupStep2';
import MovieDetails from './pages/MovieDetails';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Routes d'authentification (sans navbar/footer) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupStep1 />} />
          <Route path="/signup/preferences" element={<SignupStep2 />} />
          
          {/* Routes principales */}
          <Route path="/*" element={
            <ProtectedRoute>
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/movies" element={<Movies />} />
                  <Route path="/series" element={<Series />} />
                  <Route path="/movie/:id" element={<MovieDetails />} />
                </Routes>
              </main>
              <Footer />
            </ProtectedRoute>
          } />
        </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}