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
              ST Anne's Convent School
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
          'fixed inset-0 bg-blue-deeper z-[60] flex flex-col items-center justify-center transition-transform duration-300 transform',
          isOpen ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-white hover:text-yellow p-2"
        >
          <X size={32} />
        </button>
        <div className="flex flex-col items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={clsx(
                'text-2xl font-medium tracking-wide transition-colors',
                location.pathname === link.path ? 'text-yellow' : 'text-white'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
