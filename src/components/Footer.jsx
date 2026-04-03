import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-deeper text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        
        {/* Col 1: Branding */}
        <div className="md:col-span-5">
          <Link to="/" className="flex items-center gap-4 mb-6 group">
            <div className="relative">
              <img src="/logo.png" alt="Logo" className="w-14 h-14 rounded-full bg-white p-0.5 object-cover shadow-2xl group-hover:rotate-12 transition-transform duration-500" />
              <div className="absolute inset-0 rounded-full border border-white/10"></div>
            </div>
            <div>
              <h3 className="font-display font-black text-2xl tracking-tight">ST. Anne's</h3>
              <p className="text-blue-primary font-mono text-[10px] uppercase tracking-[0.3em]">Convent School</p>
            </div>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8">
            Empowering young minds through a holistic approach to education. We foster an environment of exploration, experimentation, and excellence.
          </p>
          <div className="flex items-center gap-4">
             <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-yellow hover:bg-yellow hover:text-blue-deeper transition-all cursor-pointer">
               <span className="font-bold text-xs">FB</span>
             </div>
             <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-yellow hover:bg-yellow hover:text-blue-deeper transition-all cursor-pointer">
               <span className="font-bold text-xs">IG</span>
             </div>
             <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-yellow hover:bg-yellow hover:text-blue-deeper transition-all cursor-pointer">
               <span className="font-bold text-xs">YT</span>
             </div>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="md:col-span-3">
          <h4 className="font-bold text-sm uppercase tracking-[0.2em] text-white/40 mb-8">Navigation</h4>
          <ul className="grid grid-cols-1 gap-y-4 text-gray-300 text-[15px] font-medium">
            <li><Link to="/" className="hover:text-yellow transition-all flex items-center gap-2 group/item"><span className="w-1.5 h-1.5 rounded-full bg-blue-primary group-hover/item:w-3 transition-all"></span> Home</Link></li>
            <li><Link to="/about" className="hover:text-yellow transition-all flex items-center gap-2 group/item"><span className="w-1.5 h-1.5 rounded-full bg-blue-primary group-hover/item:w-3 transition-all"></span> About Us</Link></li>
            <li><Link to="/academics" className="hover:text-yellow transition-all flex items-center gap-2 group/item"><span className="w-1.5 h-1.5 rounded-full bg-blue-primary group-hover/item:w-3 transition-all"></span> Academics</Link></li>
            <li><Link to="/events" className="hover:text-yellow transition-all flex items-center gap-2 group/item"><span className="w-1.5 h-1.5 rounded-full bg-blue-primary group-hover/item:w-3 transition-all"></span> Events & News</Link></li>
            <li><Link to="/notices" className="hover:text-yellow transition-all flex items-center gap-2 group/item"><span className="w-1.5 h-1.5 rounded-full bg-blue-primary group-hover/item:w-3 transition-all"></span> Notice Board</Link></li>
          </ul>
        </div>

        {/* Col 3: Contact */}
        <div className="md:col-span-4">
          <h4 className="font-bold text-sm uppercase tracking-[0.2em] text-white/40 mb-8">Contact Info</h4>
          <ul className="space-y-6 text-gray-300 text-[15px]">
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-yellow shrink-0 border border-white/10">
                <MapPin size={20} />
              </div>
              <span className="leading-relaxed">ST. Anne's Convent School,<br /><span className="text-white font-semibold">Sonepur, Odisha, India</span></span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-yellow shrink-0 border border-white/10">
                <Phone size={20} />
              </div>
              <span className="font-semibold text-white tracking-wide">06654221118</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-yellow shrink-0 border border-white/10">
                <Mail size={20} />
              </div>
              <a href="mailto:sacssnp@gmail.com" className="hover:text-white transition-colors border-b border-transparent hover:border-yellow">sacssnp@gmail.com</a>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-gray-500 text-xs font-medium">
          © {new Date().getFullYear()} ST. Anne's Convent School. All rights reserved.
        </p>
        <div className="flex gap-8 text-gray-500 text-xs font-bold uppercase tracking-widest">
           <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
           <Link to="#" className="hover:text-white transition-colors">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
