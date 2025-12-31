import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Sparkles, ChevronDown, Package, Settings, 
  Home, Cpu, Factory, Users, BookOpen, Briefcase, 
  ArrowRight
} from 'lucide-react';

const Navbar: React.FC = () => {
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

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'OEM Platform', path: '/oem-platform', icon: <Cpu size={18} /> },
    { name: 'Manufacturing', path: '/manufacturing', icon: <Factory size={18} /> },
    { name: 'About Us', path: '/about', icon: <Users size={18} /> },
    { name: 'Blog', path: '/blog', icon: <BookOpen size={18} /> },
    { name: 'Careers', path: '/careers', icon: <Briefcase size={18} /> },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 font-sans border-b ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-slate-200 py-2' 
          : 'bg-white border-transparent py-2 md:py-4' 
      }`}
    >
      <div className="w-full px-4 xs:px-6 lg:px-10">
        
        {/* ✅ UPDATE 1: Container Height 
            - Mobile: h-24 (Bada kar diya, pehle h-16 tha)
            - Desktop: h-[140px] (Laptop jaisa bada)
        */}
        <div className="flex justify-between items-center h-24 md:h-[140px] transition-all duration-300">
       
          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              
              {/* ✅ UPDATE 2: Logo Height 
                  - Mobile: h-16 (Approx 64px - Ab Mobile pe bada dikhega)
                  - Desktop: h-[130px]
              */}
              <img 
                src="/durablelogo.png" 
                alt="Logo" 
                className="h-16 xs:h-18 md:h-[230px] w-auto object-contain transition-transform duration-300" 
              />
              
              <div className="h-12 xs:h-14 md:h-20 w-px bg-gray-300 mx-2"></div>
              
              <img 
                src="/classone.png" 
                alt="Classone" 
                className="h-14 xs:h-16 md:h-[210px] w-auto object-contain mt-1"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </Link>
          </div>

          {/* ... Baaki ka Menu Code Same Rahega ... */}
          <div className="hidden xl:flex flex-1 justify-center items-center gap-2">
            <Link to="/" className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 ${isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
               <Home size={18} /> <span>Home</span>
            </Link>
            {/* Products Dropdown */}
            <div className="relative group px-1">
              <Link to="/products" className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 ${isActive('/products') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Package size={18} /> <span>Products</span> <ChevronDown size={14} />
              </Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[400px] bg-white border border-slate-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                 <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-400"></div>
                 <div className="p-4 grid grid-cols-1 gap-2">
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
            {navItems.map((item) => (
               <Link key={item.name} to={item.path} className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 ${isActive(item.path) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                 {item.icon} <span>{item.name}</span>
               </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2 xs:space-x-4 flex-shrink-0">
             <Link to="/ai-finder" className="hidden md:flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase text-white bg-slate-900 hover:bg-black">
               <Sparkles size={14} className="text-yellow-400" /> <span>AI Finder</span>
             </Link>
             <Link to="/contact" className="hidden sm:flex items-center gap-2 bg-[#fbbf24] text-black px-6 py-3 rounded-full text-xs font-bold uppercase hover:bg-yellow-300">
               <span>Quote</span> <ArrowRight size={14} />
             </Link>
             <div className="xl:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-700 hover:bg-slate-100 rounded-full">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* ✅ UPDATE 3: Mobile Drawer Top Position
          - top-[100px] kiya kyunki navbar ab bada hai (pehle 70px tha)
      */}
      <div className={`xl:hidden fixed inset-0 top-[100px] bg-white z-40 transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full overflow-y-auto pb-20 p-4 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg font-bold text-gray-700"><Home size={20}/> Home</Link>
            <Link to="/products" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg font-bold text-gray-700"><Package size={20}/> Products</Link>
            {navItems.map((item) => (
                <Link key={item.name} to={item.path} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg font-bold text-gray-700">
                    {item.icon} {item.name}
                </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3">
                <Link to="/contact" onClick={() => setIsOpen(false)} className="w-full py-3 bg-brand-yellow text-center font-bold rounded-lg text-black">Get Quote</Link>
                <Link to="/ai-finder" onClick={() => setIsOpen(false)} className="w-full py-3 bg-slate-900 text-center font-bold rounded-lg text-white">AI Finder</Link>
            </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;