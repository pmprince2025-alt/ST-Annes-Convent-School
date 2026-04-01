import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-deeper text-white pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        
        {/* Col 1 */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-full bg-white p-0.5 object-cover" />
            <h3 className="font-display font-bold text-xl">ST Anne's Convent</h3>
          </div>
          <p className="font-mono text-yellow text-sm mb-4">✦ Explore · Experiment · Excel ✦</p>
          <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
            Welcome to ST Anne's Convent School. We strive to provide a nurturing environment where every child can explore their potential, experiment with new ideas, and excel in all their endeavors.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="font-display font-semibold text-lg mb-6 border-b border-white/20 pb-2 inline-block">Quick Links</h4>
          <ul className="grid grid-cols-2 gap-y-3 text-gray-300 text-sm">
            <li><Link to="/" className="hover:text-yellow transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-yellow transition-colors">About</Link></li>
            <li><Link to="/academics" className="hover:text-yellow transition-colors">Academics</Link></li>
            <li><Link to="/events" className="hover:text-yellow transition-colors">Events</Link></li>
            <li><Link to="/notices" className="hover:text-yellow transition-colors">Notice Board</Link></li>
            <li><Link to="/gallery" className="hover:text-yellow transition-colors">Gallery</Link></li>
            <li><Link to="/contact" className="hover:text-yellow transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="font-display font-semibold text-lg mb-6 border-b border-white/20 pb-2 inline-block">Contact Us</h4>
          <ul className="space-y-4 text-gray-300 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-yellow shrink-0 mt-0.5" />
              <span>ST Anne's Convent School,<br />Sonepur, Odisha</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-yellow shrink-0" />
              <span>06654221118</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-yellow shrink-0" />
              <a href="mailto:sacssnp@gmail.com" className="hover:text-yellow transition-colors">sacssnp@gmail.com</a>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-6 text-center text-gray-400 text-xs">
        © {new Date().getFullYear()} ST Anne's Convent School, Sonepur. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
