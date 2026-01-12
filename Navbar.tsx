import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Sparkles, ChevronDown, Package, Settings,
  Home, Cpu, Factory, Users, BookOpen, Briefcase,
  ArrowRight, Heart, Headset
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle Scroll Effect (Only for Shadow/Border transparency)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'OEM Platform', path: '/oem-platform', icon: <Cpu size={18} /> },
    { name: 'Manufacturing', path: '/manufacturing', icon: <Factory size={18} /> },
    { name: 'About Us', path: '/about', icon: <Users size={18} /> },
    { name: 'Blog', path: '/blog', icon: <BookOpen size={18} /> },
    { name: 'Life at Durable', path: '/life-at-durable', icon: <Heart size={18} /> },
    { name: 'Careers', path: '/careers', icon: <Briefcase size={18} /> },
    { name: 'Contact Us', path: '/contact', icon: <Headset size={18} /> }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 font-sans transition-all duration-300 border-b bg-white ${
          scrolled
            ? 'shadow-md border-slate-200' 
            : 'shadow-none border-transparent'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1920px] mx-auto">
          
          {/* Main Flex Container - UPDATED HEIGHT to remove white space */}
          {/* Changed h-20/90px to h-16/72px for a tighter fit */}
          <div className="flex justify-between items-center h-16 md:h-[72px]">
            
            {/* --- LOGO SECTION --- */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                {/* Durable Logo - Slightly adjusted for compact height */}
                <img
                  src="/durablelogo.png"
                  alt="Durable Fasteners"
                  className="w-auto object-contain h-8 xs:h-10 md:h-[50px]"
                />
                
                {/* Vertical Divider */}
                <div className="w-px bg-gray-300 mx-2 h-8"></div>
                
                {/* Classone Logo */}
                <img
                  src="/classone.png"
                  alt="Classone"
                  className="w-auto object-contain mt-1 h-6 xs:h-8 md:h-[26px]"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </Link>
            </div>

            {/* --- DESKTOP MENU --- */}
            <div className="hidden 2xl:flex items-center gap-1">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${
                  isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                 <Home size={18} /> <span>Home</span>
              </Link>

              {/* Products Dropdown */}
              <div className="relative group px-1">
                <Link 
                  to="/products" 
                  className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${
                    isActive('/products') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  <Package size={18} /> <span>Products</span> <ChevronDown size={14} />
                </Link>
                
                {/* Mega Menu Dropdown */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[400px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                   <div className="bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden">
                      <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-400"></div>
                      <div className="p-4 grid grid-cols-1 gap-2">
                        <Link to="/products?category=fasteners" className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors group/item">
                            <div className="bg-blue-100 p-2 rounded text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors"><Settings size={18}/></div>
                            <div><h4 className="font-bold text-sm text-slate-800">Fasteners</h4><p className="text-xs text-gray-500">Screws & Bolts</p></div>
                        </Link>
                        <Link to="/products?category=fittings" className="flex items-center gap-3 p-3 hover:bg-orange-50 rounded-lg transition-colors group/item">
                            <div className="bg-orange-100 p-2 rounded text-orange-600 group-hover/item:bg-orange-500 group-hover/item:text-white transition-colors"><Package size={18}/></div>
                            <div><h4 className="font-bold text-sm text-slate-800">Fittings</h4><p className="text-xs text-gray-500">Hardware Parts</p></div>
                        </Link>
                      </div>
                   </div>
                </div>
              </div>

              {/* Dynamic Menu Items */}
              {navItems.map((item) => (
                 <Link 
                   key={item.name} 
                   to={item.path} 
                   className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${
                     isActive(item.path) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                   }`}
                 >
                   {item.icon} <span className="whitespace-nowrap">{item.name}</span>
                 </Link>
              ))}
            </div>

            {/* --- ACTION BUTTONS & HAMBURGER --- */}
            <div className="flex items-center gap-2 xs:gap-4">
               {/* AI Finder */}
               <Link to="/ai-finder" className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase text-white bg-slate-900 hover:bg-black transition-transform hover:scale-105 shadow-lg shadow-slate-200">
                 <Sparkles size={14} className="text-yellow-400" /> <span>AI Finder</span>
               </Link>
               
               {/* Quote Button */}
               <Link to="/contact" className="hidden sm:flex items-center gap-2 bg-[#fbbf24] text-black px-6 py-2.5 rounded-full text-xs font-bold uppercase hover:bg-yellow-300 transition-transform hover:scale-105 shadow-lg shadow-yellow-100">
                 <span>Quote</span> <ArrowRight size={14} />
               </Link>

               {/* Mobile Menu Toggle */}
               <div className="2xl:hidden">
                <button 
                  onClick={() => setIsOpen(!isOpen)} 
                  className="p-2 text-slate-700 hover:bg-slate-100 rounded-full focus:outline-none transition-colors"
                  aria-label="Toggle Menu"
                >
                  {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
               </div>
            </div>

          </div>
        </div>
      </nav>

      {/* --- MOBILE DRAWER (Overlay) --- */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 2xl:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`} 
        onClick={() => setIsOpen(false)}
      />
      
      {/* --- MOBILE DRAWER (Content) --- */}
      <div 
        className={`fixed top-0 right-0 h-full w-[85%] sm:w-[380px] bg-white z-[70] shadow-2xl transition-transform duration-300 ease-out transform 2xl:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
         <div className="flex flex-col h-full">
             
             {/* Drawer Header */}
             <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <span className="text-lg font-bold text-slate-800">Menu</span>
                <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition">
                   <X size={20} />
                </button>
             </div>

             {/* Scrollable Links Area */}
             <div className="flex-1 overflow-y-auto p-4 space-y-1">
                 <Link to="/" className={`flex items-center gap-4 p-4 rounded-xl font-bold transition-all ${isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                    <Home size={20}/> Home
                 </Link>
                 
                 <div className="py-2">
                    <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Products</p>
                    <Link to="/products" className={`flex items-center gap-4 p-4 rounded-xl font-bold transition-all ${isActive('/products') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <Package size={20}/> All Products
                    </Link>
                    <Link to="/products?category=fasteners" className="flex items-center gap-4 p-3 mx-4 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-blue-600">
                        <Settings size={16}/> Fasteners
                    </Link>
                    <Link to="/products?category=fittings" className="flex items-center gap-4 p-3 mx-4 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-orange-600">
                         <Package size={16}/> Fittings
                    </Link>
                 </div>

                 <div className="border-t border-slate-100 my-2"></div>

                 {navItems.map((item) => (
                     <Link key={item.name} to={item.path} className={`flex items-center gap-4 p-4 rounded-xl font-bold transition-all ${isActive(item.path) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                         {item.icon} {item.name}
                     </Link>
                 ))}
             </div>

             {/* Drawer Footer (Action Buttons) */}
             <div className="p-6 border-t border-slate-100 bg-slate-50">
                 <div className="flex flex-col gap-3">
                     <Link to="/contact" className="w-full py-3.5 bg-[#fbbf24] hover:bg-yellow-400 text-center font-bold rounded-xl text-black shadow-sm flex justify-center items-center gap-2 transition-colors">
                        <span>Get Quote</span> <ArrowRight size={16} />
                     </Link>
                     <Link to="/ai-finder" className="w-full py-3.5 bg-slate-900 hover:bg-black text-center font-bold rounded-xl text-white shadow-sm flex justify-center items-center gap-2 transition-colors">
                        <Sparkles size={18} className="text-yellow-400" /> AI Finder
                     </Link>
                 </div>
             </div>
         </div>
      </div>
    </>
  );
}

export default Navbar;
