import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram, ArrowRight, ArrowUp } from 'lucide-react';

const { Link } = ReactRouterDOM;

// 👇 1. UPDATE YOUR IMAGE PATHS HERE
const DURABLE_LOGO = "/dfpl.png";   
const CLASSONE_LOGO = "/class.png";


const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-dark text-white relative overflow-hidden font-sans">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-5 pointer-events-none"></div>
      
      {/* Top Gradient Line */}
      <div className="h-1 w-full bg-gradient-to-r from-brand-yellow via-yellow-400 to-brand-yellow"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* ---------------- COLUMN 1: BRANDING ---------------- */}
          <div className="space-y-6">
            
            {/* 👇 MAIN LOGO WITH YOUR CUSTOM SIZE & ANIMATION */}
            <div className="flex flex-col items-start gap-2 group">
               <img 
                 src={DURABLE_LOGO} 
                 alt="Durable Fastener Pvt. Ltd." 
                 // ✅ APPLIED: h-[175px] with hover zoom effect
                 className="h-[150px] w-auto object-contain transition-transform duration-300 group-hover:scale-110" 
               />
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              Engineering the future of hardware with precision and reliability. From humble beginnings to a global manufacturing powerhouse.
            </p>
            
            <div className="flex gap-4">
              {[Facebook, Linkedin, Instagram].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-yellow hover:text-brand-dark transition-all duration-300 transform hover:-translate-y-1">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* ---------------- COLUMN 2: QUICK LINKS ---------------- */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-yellow rounded-full"></span> Quick Links
            </h3>
            <ul className="space-y-3 text-sm font-medium text-gray-400">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/About' },
                { name: 'Our Products', path: '/products' },
                { name: 'Manufacturing', path: '/manufacturing' },
                { name: 'OEM Platform', path: '/oem-platform' },
                { name: 'Blog', path: '/Blog' },
                {name: 'Career', path: '/Careers' },
                
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="hover:text-brand-yellow hover:translate-x-2 transition-all duration-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------------- COLUMN 3: CONTACT INFO ---------------- */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-yellow rounded-full"></span> Reach Us
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-4 group">
                <div className="mt-1 w-8 h-8 rounded bg-white/5 flex items-center justify-center text-brand-yellow flex-shrink-0 group-hover:bg-brand-yellow group-hover:text-brand-dark transition-colors">
                  <MapPin size={16} />
                </div>
                <span className="leading-relaxed">
                  Plot No.16, Survey No.660, Surbhi Ind Zone-D, Ravki, Rajkot-360004, Gujarat, India
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-brand-yellow flex-shrink-0 group-hover:bg-brand-yellow group-hover:text-brand-dark transition-colors">
                  <Phone size={16} />
                </div>
                <span>+91 87587 00709</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-brand-yellow flex-shrink-0 group-hover:bg-brand-yellow group-hover:text-brand-dark transition-colors">
                  <Mail size={16} />
                </div>
                <span>durablefastener@outlook.com</span>
              </li>
            </ul>
          </div>

          {/* ---------------- COLUMN 4: PARTNERS & NEWSLETTER ---------------- */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-yellow rounded-full"></span> Stay Connected
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get the latest catalogue updates and industrial news.
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Enter email address" 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-yellow/50 focus:bg-white/10 transition-all placeholder-gray-600"
              />
              <button className="absolute right-1 top-1 bottom-1 bg-brand-yellow text-brand-dark px-3 rounded-md hover:bg-yellow-400 transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>

            {/* PARTNER LOGOS */}
            <div className="mt-8 flex items-center gap-6">
               <div className="group cursor-default">
                  <img 
                    src={CLASSONE_LOGO} 
                    alt="Classone" 
                    className="h-[50px] w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity" 
                  />
               </div>
               
               <div className="h-8 w-px bg-white/10"></div>
               
              
            </div>
          </div>

        </div>

        {/* ---------------- FOOTER BOTTOM ---------------- */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Durable Fastener Pvt. Ltd. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
             <Link to="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
             <Link to="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
             
             <button 
               onClick={scrollToTop} 
               className="w-10 h-10 bg-brand-yellow text-brand-dark rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg animate-bounce"
               title="Back to Top"
             >
               <ArrowUp size={20} />
             </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;