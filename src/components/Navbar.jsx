import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Academics', path: '/academics' },
    { name: 'Events', path: '/events' },
    { name: 'Holidays', path: '/holidays' },
    { name: 'Notices', path: '/notices' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className={clsx(
          'fixed w-full z-50 transition-all duration-300',
          scrolled || !isHome
            ? 'bg-blue-dark shadow-lg py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="School Logo" className="w-10 h-10 rounded-full bg-white p-0.5 object-cover" />
            <span className="font-display font-semibold text-lg text-white hidden sm:block">
              ST. Anne's Convent School
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'text-[15px] font-medium tracking-wide transition-colors relative',
                  location.pathname === link.path
                    ? 'text-yellow'
                    : 'text-white hover:text-yellow'
                )}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-yellow rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-white hover:text-yellow transition-colors"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={clsx(
          'fixed inset-0 bg-blue-dark z-[60] flex flex-col transition-all duration-500 ease-in-out',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Background Decorative Element */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-yellow/5 rounded-full blur-3xl" />

        <div className="relative flex-1 flex flex-col px-8 py-12">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full bg-white p-0.5" />
              <span className="font-display font-bold text-white tracking-tight">ST. Anne's</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-12 h-12 flex items-center justify-center text-white bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition-all active:scale-90"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-6 overflow-y-auto">
            {links.map((link, idx) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'text-4xl font-display font-black tracking-tight transition-all duration-300 transform',
                  isOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0',
                  location.pathname === link.path ? 'text-yellow' : 'text-white'
                )}
                style={{ transitionDelay: `${150 + idx * 50}ms` }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-10 border-t border-white/10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Quick Contact</p>
            <div className="space-y-3">
              <a href="tel:06654221118" className="flex items-center gap-3 text-blue-100/80 font-medium">
                <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-yellow"><Menu size={16} /></span>
                06654221118
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
