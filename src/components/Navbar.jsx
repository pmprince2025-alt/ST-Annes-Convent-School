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
          'fixed w-full z-50 transition-all duration-500',
          scrolled || !isHome
            ? 'glass py-3'
            : 'bg-transparent py-6'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src="/logo.png" alt="School Logo" className="w-11 h-11 rounded-full bg-white p-0.5 object-cover shadow-lg group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 rounded-full border border-white/20"></div>
            </div>
            <span className={clsx(
              "font-display font-bold text-xl tracking-tight transition-colors duration-300",
              scrolled || !isHome ? "text-blue-dark" : "text-white"
            )}>
              ST. Anne's <span className={clsx(
                "hidden lg:inline transition-colors duration-300",
                scrolled || !isHome ? "text-blue-primary" : "text-yellow"
              )}>Convent School</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'text-[14px] font-bold tracking-widest uppercase transition-all duration-300 relative group/link',
                  location.pathname === link.path
                    ? (scrolled || !isHome ? 'text-blue-primary' : 'text-yellow')
                    : (scrolled || !isHome ? 'text-gray-text hover:text-blue-primary' : 'text-white/90 hover:text-white')
                )}
              >
                {link.name}
                <span className={clsx(
                  "absolute -bottom-1.5 left-0 h-[2px] transition-all duration-300 rounded-full",
                  location.pathname === link.path ? "w-full" : "w-0 group-hover/link:w-full",
                  scrolled || !isHome ? "bg-blue-primary" : "bg-yellow"
                )} />
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(true)}
            className={clsx(
              "md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95",
              scrolled || !isHome ? "bg-blue-primary/10 text-blue-primary" : "bg-white/10 text-white backdrop-blur-md"
            )}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={clsx(
          'fixed inset-0 z-[60] flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
        )}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-blue-deeper/98 backdrop-blur-2xl" />
        
        {/* Background Decorative Element */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-yellow/5 rounded-full blur-[100px]" />

        <div className="relative flex-1 flex flex-col px-8 py-10">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full bg-white p-0.5" />
              <span className="font-display font-black text-2xl text-white tracking-tight">ST. Anne's</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-12 h-12 flex items-center justify-center text-white bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all active:scale-90"
            >
              <X size={26} />
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
