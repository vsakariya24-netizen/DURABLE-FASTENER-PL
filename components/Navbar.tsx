import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Menu, X, Sparkles, ChevronDown, Package, Settings,
  Home, Cpu, Factory, Users, BookOpen, Briefcase,
  ArrowRight, Heart, Headset
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- TYPES ---
interface NavItemProps {
  path: string;
  name: string;
  isActive: boolean;
  setHoveredPath: (path: string | null) => void;
  hoveredPath: string | null;
}

interface MobileNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  delay: number;
  isSub?: boolean;
}

// Utility for cleaner tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  
  const location = useLocation();
  const { scrollY } = useScroll();
  
  // --- FLOATING ISLAND ANIMATION VALUES ---
  const width = useTransform(scrollY, [0, 100], ['100%', '92%']);
  const top = useTransform(scrollY, [0, 100], ['0px', '20px']);
  const borderRadius = useTransform(scrollY, [0, 100], ['0px', '24px']);
  
  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location]);
  
  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  // --- MERGED MENU ITEMS ---
  const navItems = [
    { name: 'OEM Platform', path: '/oem-platform', icon: <Cpu size={16} /> },
    { name: 'Manufacturing', path: '/manufacturing', icon: <Factory size={16} /> },
    { name: 'About', path: '/about', icon: <Users size={16} /> },
    { name: 'Blog', path: '/blog', icon: <BookOpen size={16} /> },
    { name: 'Life at Durable', path: '/life-at-durable', icon: <Heart size={16} /> },
    { name: 'Careers', path: '/careers', icon: <Briefcase size={16} /> },
    { name: 'Contact', path: '/contact', icon: <Headset size={16} /> }
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center items-start pt-0">
        <motion.nav
          style={{ width, top, borderRadius }}
          className="relative backdrop-blur-xl bg-white/90 shadow-2xl shadow-slate-200/50 border border-slate-200/60 max-w-[1920px] mx-auto transition-all duration-300"
        >
          {/* Background Gradient Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent opacity-50 pointer-events-none rounded-[inherit]" />

          <div className="px-4 sm:px-6 lg:px-8 h-16 md:h-[93px] flex items-center justify-between relative z-10">
            
            {/* --- LOGO SECTION --- */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-3 group relative">
                <img
                  src="/durablelogo.png"
                  alt="Durable Fasteners"
                  className="w-auto h-8 xs:h-9 md:h-12 object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="w-px bg-slate-300 mx-1 h-8 opacity-60"></div>
                <img
                  src="/classone.png"
                  alt="Classone"
                  className="w-auto h-5 xs:h-6 md:h-7 object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-80 group-hover:opacity-100"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </Link>
            </div>

            {/* --- DESKTOP MENU (Centered & Animated) --- */}
            <div className="hidden 2xl:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              <div className="flex p-1 bg-slate-100/50 rounded-full border border-slate-200/50 backdrop-blur-sm">
                
                {/* 1. Home Link */}
                <NavItem 
                  path="/" 
                  name="Home" 
                  isActive={location.pathname === '/'} 
                  setHoveredPath={setHoveredPath} 
                  hoveredPath={hoveredPath}
                />

                {/* 2. Products Dropdown Trigger */}
                <div 
                  className="relative px-1"
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onMouseLeave={() => setIsProductsOpen(false)}
                >
                  <button
                    className={cn(
                      "relative px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 flex items-center gap-1.5 z-20",
                      location.pathname.includes('/products') ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    <span>Products</span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Mega Menu Dropdown */}
                  <AnimatePresence>
                    {isProductsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[380px]"
                      >
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-2">
                          <Link to="/products?category=fasteners" className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors group">
                            <div className="bg-blue-100/50 text-blue-600 p-3 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <Settings size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">Fasteners</h4>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Precision engineered screws, bolts, and industrial fasteners.</p>
                            </div>
                          </Link>
                          <Link to="/products?category=fittings" className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors group mt-1">
                            <div className="bg-orange-100/50 text-orange-600 p-3 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
                              <Package size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">Fittings</h4>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">High-quality hardware fittings and custom components.</p>
                            </div>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. Rest of Nav Items (Mapped) */}
                {navItems.map((item) => (
                   <NavItem 
                    key={item.path}
                    path={item.path} 
                    name={item.name} 
                    isActive={location.pathname === item.path} 
                    setHoveredPath={setHoveredPath} 
                    hoveredPath={hoveredPath}
                  />
                ))}
              </div>
            </div>

            {/* --- ACTION BUTTONS --- */}
            <div className="flex items-center gap-3">
              <Link to="/ai-finder" className="hidden lg:flex group relative px-6 py-2.5 rounded-full bg-slate-900 text-white overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <div className="flex items-center gap-2 relative z-10 text-xs font-bold uppercase tracking-wide">
                  <Sparkles size={14} className="text-yellow-400" />
                  <span>AI Finder</span>
                </div>
              </Link>
              
              <Link to="/contact" className="hidden sm:flex items-center gap-2 bg-[#FBBF24] text-slate-900 px-6 py-2.5 rounded-full text-xs font-bold uppercase hover:bg-[#f59e0b] transition-all hover:scale-105 shadow-lg shadow-orange-500/20">
                <span>Get Quote</span> <ArrowRight size={14} />
              </Link>

              {/* Mobile Hamburger */}
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="2xl:hidden p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </motion.nav>
      </div>

      {/* --- MOBILE DRAWER --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm 2xl:hidden"
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85%] sm:w-[400px] bg-white z-[70] shadow-2xl 2xl:hidden border-l border-slate-100"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                  <span className="text-xl font-bold text-slate-800 tracking-tight">Navigation</span>
                  <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:rotate-90 transition-transform duration-300">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-2">
                    <MobileNavItem to="/" icon={<Home size={18}/>} label="Home" delay={0.1} />
                    
                    <div className="py-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Products</p>
                      <MobileNavItem to="/products" icon={<Package size={18}/>} label="All Products" delay={0.15} />
                      <div className="pl-6 mt-2 space-y-2 border-l-2 border-slate-100 ml-4">
                          <MobileNavItem to="/products?category=fasteners" icon={<Settings size={16}/>} label="Fasteners" delay={0.2} isSub />
                          <MobileNavItem to="/products?category=fittings" icon={<Package size={16}/>} label="Fittings" delay={0.25} isSub />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 my-4" />
                    
                    {navItems.map((item, idx) => (
                      <MobileNavItem 
                        key={item.path} 
                        to={item.path} 
                        icon={item.icon} 
                        label={item.name} 
                        delay={0.3 + (idx * 0.05)} 
                      />
                    ))}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100">
                   <Link to="/contact" className="w-full py-4 bg-[#FBBF24] hover:bg-[#f59e0b] rounded-xl text-slate-900 font-bold shadow-lg shadow-orange-500/10 flex justify-center items-center gap-2 mb-3">
                      <span>Request Quote</span> <ArrowRight size={18} />
                   </Link>
                   <Link to="/ai-finder" className="w-full py-4 bg-slate-900 hover:bg-black rounded-xl text-white font-bold shadow-lg shadow-slate-200 flex justify-center items-center gap-2">
                      <Sparkles size={18} className="text-yellow-400" /> <span>AI Finder</span>
                   </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// --- SUB-COMPONENTS FIXED ---
// Added ': React.FC<...>' to explicitly tell TS these are Components that accept 'key'

const NavItem: React.FC<NavItemProps> = ({ path, name, isActive, setHoveredPath, hoveredPath }) => {
  return (
    <Link 
      to={path}
      onMouseEnter={() => setHoveredPath(path)}
      onMouseLeave={() => setHoveredPath(null)}
      className={cn(
        "relative px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 z-20 whitespace-nowrap",
        isActive ? "text-blue-700" : "text-slate-600 hover:text-slate-900"
      )}
    >
      {hoveredPath === path && (
        <motion.div
          layoutId="navbar-hover"
          className="absolute inset-0 bg-white rounded-full shadow-sm border border-slate-200 -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      {isActive && !hoveredPath && (
        <motion.div
          layoutId="navbar-active"
          className="absolute inset-0 bg-blue-100/50 rounded-full -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{name}</span>
    </Link>
  );
};

const MobileNavItem: React.FC<MobileNavItemProps> = ({ to, icon, label, delay, isSub = false }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Link 
        to={to} 
        className={cn(
          "flex items-center gap-4 p-3 rounded-xl transition-all duration-300",
          isActive ? "bg-blue-50 text-blue-700 font-bold shadow-sm" : "text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600 font-medium",
          isSub && "text-sm"
        )}
      >
        <span className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"}>{icon}</span>
        {label}
      </Link>
    </motion.div>
  );
};

export default Navbar;