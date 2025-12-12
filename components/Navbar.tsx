import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Sparkles, ChevronDown, Package, Settings, 
  Home, Cpu, Factory, Users, BookOpen, Heart, Briefcase, 
  ArrowRight
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Scroll effect handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Configuration for Menu Items with Icons
  const navItems = [
    { name: 'OEM Platform', path: '/oem-platform', icon: <Cpu size={18} /> },
    { name: 'Manufacturing', path: '/manufacturing', icon: <Factory size={18} /> },
    { name: 'About Us', path: '/about', icon: <Users size={18} /> },
    { name: 'Blog', path: '/blog', icon: <BookOpen size={18} /> },
    { name: 'Life at Durable', path: '/life-at-durable', icon: <Heart size={18} /> },
    { name: 'Careers', path: '/careers', icon: <Briefcase size={18} /> },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 font-sans border-b ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-slate-200 py-3' 
          : 'bg-white border-transparent py-0' // BIG HEIGHT (py-8)
      }`}
    >
      <div className="w-full px-6 lg:px-10">
        <div className="flex justify-between items-center">
      
            {/* =======================================================

          1. LOGO SECTION

         ======================================================= */}

      <div className="flex-shrink-0 flex items-center">

        <Link to="/" className="flex items-center gap-4 group">

          <img 

            src="/durablelogo.png" 

            alt="Logo" 

            className="h-[170px] w-auto object-contain transition-transform duration-300 group-hover:scale-105" 

          />

          <div className="h-11 w-px bg-gray-300 mx-1"></div>

          <img 

            src="/classone.png" 

            alt="Classone" 

            className="h-[140px] w-auto object-contain mt-1"

            onError={(e) => { e.currentTarget.style.display = 'none'; }}

          />

        </Link>

      </div>



          {/* =======================================================
              2. DESKTOP MENU (CENTER)
             ======================================================= */}
          <div className="hidden 2xl:flex flex-1 justify-center items-center gap-2">
            
            {/* Home Link */}
            <Link to="/Home" className={`group relative px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}>
               <Home size={18} className={`transition-transform duration-300 ${isActive('/') ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600 group-hover:scale-110'}`} />
               <span>Home</span>
            </Link>

            {/* Products Dropdown */}
            <div className="relative group px-1">
              <Link 
                to="/products" 
                className={`group relative px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${isActive('/products') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}
              >
                <Package size={18} className={`transition-transform duration-300 ${isActive('/products') ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600 group-hover:scale-110'}`} />
                <span>Products</span>
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300 text-slate-400 group-hover:text-blue-600" />
              </Link>
              
              {/* White Dropdown Content */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[500px] bg-white border border-slate-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 overflow-hidden">
                 
                 {/* Top Colored Line */}
                 <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"></div>

                 <div className="p-6 grid grid-cols-2 gap-4">
                    <Link to="/products?category=fasteners" className="group/item flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                          <Settings size={22} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 group-hover/item:text-blue-700 transition-colors">Fasteners</h4>
                          <p className="text-xs text-slate-500 mt-1 font-medium">High-tensile Screws.</p>
                        </div>
                    </Link>

                    <Link to="/products?category=fittings" className="group/item flex items-start gap-4 p-4 rounded-xl hover:bg-orange-50 transition-colors border border-transparent hover:border-orange-100">
                        <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                          <Package size={22} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 group-hover/item:text-orange-700 transition-colors">Fittings</h4>
                          <p className="text-xs text-slate-500 mt-1 font-medium">Hinges & Magnets.</p>
                        </div>
                    </Link>
                 </div>
              </div>
            </div>

            {/* Dynamic Items */}
            {navItems.map((item) => (
               <Link 
                 key={item.name}
                 to={item.path} 
                 className={`group relative px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${isActive(item.path) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}
               >
                 <span className={`transition-transform duration-300 ${isActive(item.path) ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600 group-hover:scale-110'}`}>{item.icon}</span>
                 <span>{item.name}</span>
               </Link>
            ))}

          </div>

          {/* =======================================================
              3. RIGHT ACTIONS
             ======================================================= */}
          <div className="flex items-center space-x-4 flex-shrink-0">
             
             {/* AI Finder */}
             <Link to="/ai-finder" className="hidden xl:flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-black hover:shadow-lg hover:shadow-slate-900/20 transition-all group">
               <Sparkles size={14} className="text-yellow-400 group-hover:animate-spin-slow" /> 
               <span>AI Finder</span>
             </Link>

             {/* Get Quote - Yellow Button */}
             <Link to="/contact" className="hidden md:flex items-center gap-2 bg-[#fbbf24] text-black px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-yellow-300 transition-all shadow-md hover:shadow-yellow-400/50 transform hover:-translate-y-0.5">
               <span>Get Quote</span>
               <ArrowRight size={14} />
             </Link>
             
             {/* Mobile Toggle */}
             <div className="2xl:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="p-3 text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* =======================================================
           4. MOBILE MENU DRAWER (White Theme)
          ======================================================= */}
      <div className={`2xl:hidden overflow-hidden transition-all duration-500 ease-in-out bg-white border-t border-slate-100 ${isOpen ? 'max-h-screen opacity-100 shadow-xl' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-8 space-y-2 h-screen overflow-y-auto pb-32">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all">
                <Home size={22} className="text-slate-400" /> <span className="font-bold text-lg">Home</span>
            </Link>
            
            <Link to="/products" onClick={() => setIsOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all">
                <Package size={22} className="text-slate-400" /> <span className="font-bold text-lg">Products</span>
            </Link>

            {navItems.map((link) => (
              <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all">
                 <span className="text-slate-400">{React.cloneElement(link.icon as React.ReactElement, { size: 22 })}</span>
                 <span className="font-bold text-lg">{link.name}</span>
              </Link>
            ))}

            <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
                 <Link to="/ai-finder" onClick={() => setIsOpen(false)} className="flex justify-center items-center w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-wide">
                    <Sparkles size={16} className="text-yellow-400 mr-2" /> AI Finder
                 </Link>
                 <Link to="/contact" onClick={() => setIsOpen(false)} className="flex justify-center items-center w-full bg-[#fbbf24] text-black py-4 rounded-xl font-bold uppercase tracking-wide shadow-lg shadow-yellow-400/20">
                    Get Quote
                 </Link>
            </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;