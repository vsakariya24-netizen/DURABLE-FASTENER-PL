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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  // Reduced icon size slightly for better fit on laptops
  const navItems = [
    { name: 'OEM', path: '/oem-platform', icon: <Cpu size={16} /> }, // Shortened name for space
    { name: 'Mfg', path: '/manufacturing', icon: <Factory size={16} /> }, // Shortened name for space
    { name: 'About', path: '/about', icon: <Users size={16} /> },
    { name: 'Blog', path: '/blog', icon: <BookOpen size={16} /> },
    { name: 'Life', path: '/life-at-durable', icon: <Heart size={16} /> },
    { name: 'Careers', path: '/careers', icon: <Briefcase size={16} /> },
    { name: 'Contact', path:'/contact', icon: <Headset size={16} /> }
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 font-sans border-b ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-slate-200 py-1' 
            : 'bg-white border-transparent py-2' 
        }`}
      >
        <div className="w-full px-4 lg:px-8">
          
          {/* FIXED HEIGHTS: 
             Mobile: h-16 (Standard mobile app feel)
             Desktop: h-20 (Big enough for logos, small enough to see content)
          */}
          <div className="flex justify-between items-center h-16 md:h-20 transition-all duration-300">
         
            {/* LOGO SECTION */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                {/* Logo Adjusted to fit INSIDE the header */}
                <img 
                  src="/durablelogo.png" 
                  alt="Durable Fasteners" 
                  className="h-10 md:h-14 w-auto object-contain" 
                />
                
                {/* Separator Line */}
                <div className="h-8 md:h-10 w-px bg-gray-300 mx-1 md:mx-2"></div>
                
                {/* Classone Logo */}
                <img 
                  src="/classone.png" 
                  alt="Classone" 
                  className="h-8 md:h-12 w-auto object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </Link>
            </div>

            {/* DESKTOP MENU (Hidden on Mobile/Tablet, Visible on XL screens) */}
            <div className="hidden xl:flex flex-1 justify-end items-center gap-1 mx-4">
              <Link to="/" className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                 <Home size={16} /> <span>Home</span>
              </Link>

              {/* Products Dropdown */}
              <div className="relative group px-1">
                <Link to="/products" className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${isActive('/products') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <Package size={16} /> <span>Products</span> <ChevronDown size={14} />
                </Link>
                {/* Dropdown Menu */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[300px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden">
                        <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-400"></div>
                        <div className="p-2 grid grid-cols-1 gap-1">
                          <Link to="/products?category=fasteners" className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg">
                              <div className="bg-blue-100 p-2 rounded text-blue-600"><Settings size={18}/></div>
                              <div><h4 className="font-bold text-sm">Fasteners</h4><p className="text-xs text-gray-500">Screws & Bolts</p></div>
                          </Link>
                          <Link to="/products?category=fittings" className="flex items-center gap-3 p-3 hover:bg-orange-50 rounded-lg">
                              <div className="bg-orange-100 p-2 rounded text-orange-600"><Package size={18}/></div>
                              <div><h4 className="font-bold text-sm">Fittings</h4><p className="text-xs text-gray-500">Hardware Parts</p></div>
                          </Link>
                        </div>
                    </div>
                </div>
              </div>

              {/* Dynamic Menu Items */}
              {navItems.map((item) => (
                 <Link key={item.name} to={item.path} className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${isActive(item.path) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                   {item.icon} <span className="whitespace-nowrap">{item.name}</span>
                 </Link>
              ))}
            </div>

            {/* ACTION BUTTONS & MOBILE HAMBURGER */}
            <div className="flex items-center gap-2 flex-shrink-0">
               {/* AI Finder - Desktop Only */}
               <Link to="/ai-finder" className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase text-white bg-slate-900 hover:bg-black transition">
                 <Sparkles size={14} className="text-yellow-400" /> <span>AI Finder</span>
               </Link>
               
               {/* Quote Button */}
               <Link to="/contact" className="hidden sm:flex items-center gap-2 bg-[#fbbf24] text-black px-5 py-2 rounded-full text-xs font-bold uppercase hover:bg-yellow-300 transition">
                 <span>Quote</span> <ArrowRight size={14} />
               </Link>

               {/* Mobile Menu Button */}
               <div className="xl:hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-700 hover:bg-slate-100 rounded-full focus:outline-none">
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
               </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER MENU */}
      {/* Top padding matched to header height to prevent overlap */}
      <div className={`xl:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsOpen(false)}></div>
      
      <div className={`xl:hidden fixed top-0 right-0 h-full w-[80%] max-w-[300px] bg-white z-50 shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="flex flex-col h-full overflow-y-auto p-4 pt-24 space-y-1">
             {/* Mobile Header Close Button */}
             <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-600">
                <X size={20} />
             </button>

             <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg font-bold text-gray-700"><Home size={20}/> Home</Link>
             <Link to="/products" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg font-bold text-gray-700"><Package size={20}/> Products</Link>
             
             {navItems.map((item) => (
                 <Link key={item.name} to={item.path} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg font-bold text-gray-600 transition">
                     {item.icon} {item.name === 'Mfg' ? 'Manufacturing' : item.name === 'OEM' ? 'OEM Platform' : item.name}
                 </Link>
             ))}

             <div className="mt-6 flex flex-col gap-3">
                 <Link to="/contact" onClick={() => setIsOpen(false)} className="w-full py-3 bg-[#fbbf24] text-center font-bold rounded-lg text-black shadow-sm">Get Quote</Link>
                 <Link to="/ai-finder" onClick={() => setIsOpen(false)} className="w-full py-3 bg-slate-900 text-center font-bold rounded-lg text-white shadow-sm flex justify-center gap-2">
                    <Sparkles size={16} className="text-yellow-400" /> AI Finder
                 </Link>
             </div>
         </div>
      </div>
    </>
  );
}

export default Navbar;
