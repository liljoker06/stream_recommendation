import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/Navbar';


export default function App() {
  return (
      <Router>
        <div className="flex flex-col min-h-screen">
        <Routes>

          
          {/* Routes principales (avec navbar/footer) */}
          <Route path="/*" element={
              <Navbar />

          } />
        </Routes>
        </div>
      </Router>
  );
}


