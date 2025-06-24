import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturesSection from './components/FeaturesSection';
import Companies from './components/Companies';
import IntegrationsSection from './components/IntegrationsSection';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Account from './components/Account';
import Dashboard from './components/Dashboard';
import PresentationViewer from './components/PresentationViewer';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import './App.css';

const LandingPage = () => {
  // Prevent copy operations
  const preventCopy = (e) => {
    e.preventDefault();
    return false;
  };

  // Prevent context menu
  const preventContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  // Prevent keyboard shortcuts for copy
  const preventKeyboardCopy = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
      return false;
    }
  };

  return (
    <div 
      className="bg-[#0A0A0A] text-white min-h-screen landing-page"
      onCopy={preventCopy}
      onCut={preventCopy}
      onPaste={preventCopy}
      onContextMenu={preventContextMenu}
      onKeyDown={preventKeyboardCopy}
    >
      <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(33, 150, 243, 0.1), transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(10, 158, 106, 0.1), transparent 50%)',
        }}
      ></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex flex-col">
          <div className="min-h-screen flex items-center justify-center">
            <Hero />
          </div>
          <Companies />
          <FeaturesSection />
          <IntegrationsSection />
          <FAQ />
        </main>
        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/presentation/:id" element={<ProtectedRoute><PresentationViewer /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
