import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { Settings, UserCircle } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import AnalyzePage from './pages/AnalyzePage';
import ImpactPage from './pages/ImpactPage';
import AboutPage from './pages/AboutPage';
import MobileUploadPage from './pages/MobileUploadPage';

function App() {
  return (
    <Router>
      <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body">
        <header className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50 flex justify-between items-center px-8 h-16">
          <Link to="/" className="text-2xl font-bold tracking-widest text-white font-display uppercase">LITTERVISION AI</Link>
          <nav className="hidden md:flex items-center space-x-8 font-display tracking-tighter uppercase text-sm">
            <NavLink className={({ isActive }) => `transition-colors duration-100 ${isActive ? 'text-red-500' : 'text-neutral-400 hover:text-red-500'}`} to="/">Home</NavLink>
            <NavLink className={({ isActive }) => `transition-colors duration-100 ${isActive ? 'text-red-500' : 'text-neutral-400 hover:text-red-500'}`} to="/analyze">Analyze</NavLink>
            <NavLink className={({ isActive }) => `transition-colors duration-100 ${isActive ? 'text-red-500' : 'text-neutral-400 hover:text-red-500'}`} to="/impact">Impact</NavLink>
            <NavLink className={({ isActive }) => `transition-colors duration-100 ${isActive ? 'text-red-500' : 'text-neutral-400 hover:text-red-500'}`} to="/about">About</NavLink>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-neutral-800/50 transition-colors" aria-label="Settings">
              <Settings className="w-6 h-6 text-on-surface" />
            </button>
            <button className="p-2 hover:bg-neutral-800/50 transition-colors" aria-label="Account">
              <UserCircle className="w-6 h-6 text-on-surface" />
            </button>
          </div>
        </header>

        <main className="flex-grow pt-16 flex flex-col relative z-0">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/mobile-upload/:sessionId" element={<MobileUploadPage />} />
          </Routes>
        </main>

        <footer className="bg-neutral-950 mt-auto border-t border-neutral-900 w-full relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 max-w-screen-2xl mx-auto w-full">
            <div className="font-display text-lg text-white mb-6 md:mb-0 uppercase tracking-widest font-bold">LITTERVISION AI</div>
            <div className="font-body text-[10px] uppercase tracking-[0.2em] text-neutral-500 text-center md:text-left mb-6 md:mb-0">© 2024 LITTERVISION AI. TECHNICAL PRECISION FOR URBAN SUSTAINABILITY.</div>
            <div className="flex gap-8 font-body text-xs uppercase tracking-widest">
              <a className="text-neutral-500 hover:text-red-500 transition-opacity duration-200" href="#">Privacy</a>
              <a className="text-neutral-500 hover:text-red-500 transition-opacity duration-200" href="#">Terms</a>
              <a className="text-neutral-500 hover:text-red-500 transition-opacity duration-200" href="#">API</a>
              <a className="text-neutral-500 hover:text-red-500 transition-opacity duration-200" href="#">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
