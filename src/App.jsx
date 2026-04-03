import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/ChatBot';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Academics = React.lazy(() => import('./pages/Academics'));
const Events = React.lazy(() => import('./pages/Events'));
const Holidays = React.lazy(() => import('./pages/Holidays'));
const Notices = React.lazy(() => import('./pages/Notices'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const Contact = React.lazy(() => import('./pages/Contact'));

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <React.Suspense fallback={
            <div className="h-screen flex flex-col items-center justify-center bg-blue-deeper">
              <div className="w-12 h-12 rounded-full border-[4px] border-yellow border-t-transparent animate-spin mb-6 shadow-2xl shadow-yellow/20"></div>
              <div className="text-center">
                <span className="font-display font-black text-white text-[10px] uppercase tracking-[0.5em] block mb-1">ST. Anne's</span>
                <span className="font-mono text-yellow/40 text-[8px] uppercase tracking-[0.3em]">Convent School</span>
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/events" element={<Events />} />
              <Route path="/holidays" element={<Holidays />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </React.Suspense>
        </main>
        <Footer />
        <Chatbot />
        <Toaster position="bottom-center" />
      </div>
    </BrowserRouter>
  );
}

export default App;
