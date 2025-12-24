import React, { useState, useMemo, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Hammer, Grid, Armchair, Wrench, ArrowUpRight,
  ChevronRight, ShoppingCart, Loader2, Share2, Printer, 
  Ruler, Maximize2, Info, X,
  ArrowRight, Lock, Activity, FileCheck, Layers, Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MagicZoomClone from '../components/MagicZoomClone'; 

const { useParams, Link } = ReactRouterDOM;

// --- 1. DESIGN THEME CONSTANTS ---
const THEME = {
  bg: "bg-slate-950",
  card: "bg-slate-900",
  textPrimary: "text-slate-100",
  textSecondary: "text-slate-400",
  accent: "amber-500",
  accentText: "text-amber-500",
  border: "border-slate-800",
};
const getAppIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('wood')) return Hammer;
    if (n.includes('furniture')) return Armchair;
    if (n.includes('metal') || n.includes('framing')) return Grid;
    if (n.includes('gypsum') || n.includes('pop')) return Layers;
    return Wrench; // Default fallback icon
  };
const blueprintGridStyle = {
  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
  backgroundSize: '20px 20px'
};

const PERFORMANCE_KEYS_DISPLAY = [
  "Core Hardness", "Surface Hardness", "Tensile Strength",
  "Shear Strength", "Salt Spray Resistance", "Installation Speed", "Temperature Range"
];

const HIDDEN_SPECS = [
    'hardness', 'sst', 'torque', 'salt', 'box_qty', 'carton_qty', 
    'standard', 'seo_keywords', 'tds_url', 'mtc_url',
    ...PERFORMANCE_KEYS_DISPLAY.map(s => s.toLowerCase())
];

// --- ANIMATION VARIANTS ---
const containerVar = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
};

const itemVar = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
};

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
    <Icon size={16} className={THEME.accentText} />
    <span className={`text-xs font-bold uppercase tracking-[0.2em] ${THEME.textSecondary} font-rajdhani`}>
      {title}
    </span>
  </div>
);

const TechBadge = ({ children }: { children: React.ReactNode }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 border ${THEME.border} text-[10px] font-mono uppercase text-slate-300`}>
    {children}
  </span>
);

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // States
  const [selectedDia, setSelectedDia] = useState<string>('');
  const [selectedLen, setSelectedLen] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeImageOverride, setActiveImageOverride] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [fullScreenAppImage, setFullScreenAppImage] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Rajdhani:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!slug) throw new Error("No product slug");
        const { data: productData, error } = await supabase.from('products').select('*').eq('slug', slug).single();
        if (error) throw error;

        const { data: vData } = await supabase.from('product_variants').select('*').eq('product_id', productData.id);
        
        const fullProduct = { 
            ...productData, 
            applications: productData.applications || [], 
            variants: vData || [], 
            specifications: productData.specifications || [], 
            dimensional_specifications: productData.dimensional_specifications || [] 
        };
        
        setProduct(fullProduct);
        
        if (vData && vData.length > 0) {
            const dias = Array.from(new Set(vData.map((v: any) => v.diameter).filter(Boolean))).sort((a:any,b:any) => parseFloat(a)-parseFloat(b));
            if (dias.length > 0) setSelectedDia(dias[0] as string);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchProduct();
  }, [slug]);

  const uniqueDiameters = useMemo(() => {
      if (!product?.variants) return [];
      const dias = new Set(product.variants.map((v: any) => v.diameter).filter(Boolean));
      return Array.from(dias).sort((a:any,b:any) => parseFloat(a)-parseFloat(b)); 
  }, [product]);

  const availableLengths = useMemo(() => {
      if (!product?.variants || !selectedDia) return [];
      const rawLengths = product.variants.filter((v: any) => v.diameter === selectedDia).map((v: any) => v.length).filter(Boolean);
      const flatLengths = new Set<string>();
      rawLengths.forEach((len: string) => {
        if (len.includes(',')) len.split(',').map(l => l.trim()).forEach(l => flatLengths.add(l));
        else flatLengths.add(len);
      });
      return Array.from(flatLengths).sort((a: any, b: any) => parseInt(a) - parseInt(b)); 
  }, [product, selectedDia]);

  useEffect(() => {
      if (availableLengths.length > 0 && !availableLengths.includes(selectedLen)) setSelectedLen(availableLengths[0]);
      else if (availableLengths.length === 0) setSelectedLen('');
  }, [selectedDia, availableLengths]);

  const availableFinishes = useMemo(() => {
      if (!product?.variants) return [];
      const relevantVariants = product.variants.filter((v: any) => v.diameter === selectedDia && (v.length === selectedLen || (v.length && v.length.includes(selectedLen))));
      return Array.from(new Set(relevantVariants.map((v: any) => v.finish).filter(Boolean)));
  }, [product, selectedDia, selectedLen]);

  const handleFinishClick = (finish: string) => {
      if (product.finish_images && product.finish_images[finish]) { setActiveImageOverride(product.finish_images[finish]); setSelectedImageIndex(0); } 
      else { setActiveImageOverride(null); }
  };

  const displayImages = useMemo(() => {
    let images = product?.images || ['https://via.placeholder.com/600x600?text=No+Image'];
    if (activeImageOverride) return [activeImageOverride, ...images];
    return images;
  }, [product, activeImageOverride]);

  const fontHeading = { fontFamily: '"Rajdhani", sans-serif' };
  const fontBody = { fontFamily: '"Inter", sans-serif' };

  if (loading) return <div className={`h-screen flex items-center justify-center ${THEME.bg}`}><Loader2 className={`animate-spin ${THEME.accentText}`} size={48} /></div>;
  if (!product) return <div className={`min-h-screen flex flex-col items-center justify-center ${THEME.bg}`}><h2 className={`text-3xl font-bold mb-4 ${THEME.textPrimary}`} style={fontHeading}>Product Not Found</h2><Link to="/products" className={THEME.accentText}>Back to Catalog</Link></div>;

  const currentImage = displayImages[selectedImageIndex];
  const standard = product.specifications?.find((s:any) => s.key.toLowerCase() === 'standard')?.value;
  const showDimensions = product.technical_drawing || (product.dimensional_specifications && product.dimensional_specifications.length > 0);
  const displayMaterial = product.material || '';
  const displayHeadType = product.head_type ? product.head_type.replace(/Buggel/gi, 'Bugle') : '';

  // ... upar ka sara logic same rahega ...

 // ... baaki upar ka code same rahega ...

  return (
    // CHANGE 1: Added 'pt-28' (padding-top) here. 
    // Yeh content ko niche push karega taaki Fixed Header ke peeche na chhupe.
    <div className={`${THEME.bg} min-h-screen pb-24 pt-28 lg:pt-32 selection:bg-amber-500/30 selection:text-amber-200`} style={fontBody}>
      
      {/* --- VISIBLE BREADCRUMB SECTION --- */}
      {/* CHANGE 2: Changed bg-slate-950/50 to solid bg-slate-950 so it's not transparent */}
      <div className="border-b border-slate-800 bg-slate-950 relative z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
           <nav className="flex items-center gap-2 text-sm font-medium">
              <Link 
                to="/" 
                className="text-slate-500 hover:text-amber-500 transition-colors flex items-center gap-1"
              >
                Home
              </Link>
              
              <ChevronRight size={14} className="text-slate-700" />
              
              <Link 
                to="/products" 
                className="text-slate-500 hover:text-amber-500 transition-colors"
              >
                Products
              </Link>
              
              <ChevronRight size={14} className="text-slate-700" />
              
              <span className="text-amber-500 font-bold tracking-wide">
                {product.name}
              </span>
           </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        
        {/* --- TITLE BLOCK --- */}
        <motion.div variants={containerVar} initial="hidden" animate="visible" className="mb-10 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                <div>
                    <motion.div variants={itemVar} className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest`}>
                            Industrial Series
                        </span>
                        {standard && <span className="text-slate-500 text-xs font-mono font-bold tracking-wider">{standard}</span>}
                    </motion.div>
                    <motion.h1 variants={itemVar} className={`text-4xl md:text-6xl font-extrabold ${THEME.textPrimary} tracking-tight uppercase leading-none`} style={fontHeading}>
                        {product.name}
                    </motion.h1>
                </div>
                
                <motion.div variants={itemVar} className="flex gap-3">
                    <button className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-amber-500 transition-colors border border-slate-700">
                        <Share2 size={20} />
                    </button>
                    <button className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-amber-500 transition-colors border border-slate-700">
                        <Printer size={20} />
                    </button>
                </motion.div>
            </div>
            
            <motion.div variants={itemVar} className="flex items-start gap-4">
                 <div className="w-1 self-stretch bg-amber-500 rounded-full"></div>
                 <p className={`${THEME.textSecondary} text-lg font-light leading-relaxed max-w-3xl`}>
                    {product.short_description}
                 </p>
            </motion.div>
        </motion.div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* --- LEFT COLUMN: Visuals --- */}
          <div className="lg:col-span-7 flex flex-col gap-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col-reverse md:flex-row gap-4 h-auto md:h-[780px]">
                  
                  {/* Thumbnails */}
                  <div className="hidden md:flex flex-col gap-3 overflow-y-auto w-20 py-1 pr-1 custom-scrollbar">
                      {displayImages.map((img: string, idx: number) => (
                          <button 
                            key={idx} 
                            onClick={() => setSelectedImageIndex(idx)} 
                            className={`relative w-full aspect-square rounded bg-white overflow-hidden border transition-all ${selectedImageIndex === idx ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-700 opacity-50 hover:opacity-100'}`}
                          >
                              <img src={img} className="w-full h-full object-contain p-1" />
                          </button>
                      ))}
                  </div>

                  {/* Main Viewer */}
                  <div className="flex-1 relative rounded-lg bg-slate-900 border border-slate-800 p-8 flex items-center justify-center h-[400px] md:h-full overflow-hidden group">
                      <div className="absolute inset-0 opacity-20 pointer-events-none" style={blueprintGridStyle}></div>
                      <div className="absolute top-0 right-0 p-4 z-20">
                          <Maximize2 className="text-slate-600 group-hover:text-amber-500 transition-colors" size={20} />
                      </div>

                      <AnimatePresence mode='wait'>
                        <motion.div 
                            key={currentImage} 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full flex items-center justify-center relative z-10"
                        >
                            <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <MagicZoomClone src={currentImage} zoomSrc={currentImage} alt={product.name} zoomLevel={2.5} glassSize={isMobile ? 120 : 200} className="max-h-full max-w-full object-contain drop-shadow-2xl" />
                        </motion.div>
                      </AnimatePresence>
                  </div>
              </motion.div>
          </div>

          {/* --- RIGHT COLUMN: Configurator --- */}
          <div className="lg:col-span-5 flex flex-col space-y-6 sticky top-24">
              
              <motion.div variants={containerVar} initial="hidden" animate="visible" className="space-y-6">
                
                {/* 1. CONFIG PANEL */}
                <motion.div variants={itemVar} className={`bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl relative overflow-hidden`}>
                   <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -z-10"></div>

                   {/* DIAMETER SELECTION */}
                   <div className="mb-8">
                      <SectionHeader icon={Ruler} title="Select Diameter" />
                      <div className="flex flex-wrap gap-3">
                        {uniqueDiameters.map((dia: any) => {
                            const isSelected = selectedDia === dia;
                            return (
                              <button 
                                  key={dia} 
                                  onClick={() => setSelectedDia(dia)} 
                                  className={`
                                    relative w-12 h-12 rounded flex items-center justify-center text-sm font-mono font-bold transition-all duration-200 border
                                    ${isSelected 
                                      ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'}
                                  `}
                              >
                                  {dia}
                              </button>
                            );
                        })}
                      </div>
                   </div>

                   {/* LENGTH SELECTION */}
                   <div className="mb-8">
                    <div className="flex justify-between items-end mb-4 border-b border-slate-800 pb-2">
                        <SectionHeader icon={Maximize2} title="Select Length (mm)" />
                        <span className="text-2xl font-mono text-amber-500 font-bold tracking-tighter drop-shadow-lg">
                            {selectedLen ? selectedLen : '--'}<span className="text-xs text-slate-500 ml-1 font-sans font-medium">mm</span>
                        </span>
                    </div>
                    
                    <div className="bg-slate-950 border border-slate-800 rounded h-24 relative flex items-end px-3 w-full overflow-hidden" style={blueprintGridStyle}>
                        <div className="flex w-full items-end justify-between relative z-10 h-full">
                            {availableLengths.length > 0 ? availableLengths.map((len: any, index: number) => {
                                const isSelected = selectedLen === len;
                                const alignmentClass = index === 0 ? 'items-start' : (index === availableLengths.length - 1 ? 'items-end' : 'items-center');
                                return (
                                    <button 
                                      key={len} 
                                      onClick={() => setSelectedLen(len)} 
                                      className={`group relative flex-1 flex flex-col justify-end outline-none h-full ${alignmentClass}`}
                                    >
                                        <span className={`
                                            mb-2 font-mono text-xs transition-all duration-200 select-none whitespace-nowrap tracking-tight block
                                            ${isSelected 
                                                ? 'text-amber-400 font-black -translate-y-1 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' 
                                                : 'text-slate-500 font-medium group-hover:text-slate-300'
                                            }
                                        `}>
                                            {parseInt(len)}
                                        </span>
                                        <div className={`
                                            w-px rounded-t-sm transition-all duration-300 mx-auto
                                            ${isSelected 
                                                ? 'h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] opacity-100'
                                                : 'h-4 bg-slate-700 group-hover:bg-slate-500 group-hover:h-6 opacity-80'
                                            }
                                          `}
                                        ></div>
                                    </button>
                                )
                            }) : <div className="w-full text-center text-xs text-slate-600 font-mono italic self-center pb-4">Select Diameter first</div>}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-slate-700 z-0"></div>
                    </div>
                   </div>

                   {/* FINISH SELECTION */}
                   <div>
                      <SectionHeader icon={Layers} title="Surface Finish" />
                      <div className="flex flex-wrap gap-2">
                          {availableFinishes.map((finish: any) => (
                             <button 
                                key={finish} 
                                onClick={() => handleFinishClick(finish)} 
                                className={`
                                  px-4 py-2 text-xs font-bold uppercase tracking-wider border rounded transition-all
                                  ${activeImageOverride === product.finish_images?.[finish] 
                                    ? 'border-amber-500 text-amber-500 bg-amber-500/10' 
                                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-600 hover:text-slate-200'}
                                `}
                             >
                                  {finish}
                             </button>
                          ))}
                      </div>
                   </div>
                </motion.div>
                </motion.div>

                {/* --- ATTRIBUTES SUMMARY --- */}
                <motion.div variants={itemVar} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                  <div className="bg-slate-950/50 px-5 py-3 border-b border-slate-800 flex items-center gap-2">
                    <FileCheck size={14} className="text-amber-500" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Specification Details</span>
                  </div>

                  <div className="p-5 flex flex-col gap-0 divide-y divide-slate-800">
                    
                    {displayMaterial && (
                      <div className="flex flex-row justify-between py-3 first:pt-0">
                        <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest min-w-[100px] pt-1">Material</span>
                        <div className="flex flex-col text-right gap-1">
                          {displayMaterial.split(/\|/g).map((mat: string, idx: number) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-1">
                                <span className={`text-sm font-bold ${THEME.textPrimary} font-rajdhani`}>{mat.split('(')[0].trim()}</span>
                                {mat.includes('(') && (
                                  <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                                    {mat.split('(')[1].replace(')', '')}
                                  </span>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {displayHeadType && (
                      <div className="flex flex-row justify-between py-3">
                        <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest min-w-[100px] pt-1">Head Type</span>
                        <span className={`text-sm font-medium ${THEME.textPrimary} font-rajdhani text-right`}>{displayHeadType}</span>
                      </div>
                    )}

                    {product.drive_type && (
                      <div className="flex flex-row justify-between py-3">
                        <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest min-w-[100px] pt-1">Drive</span>
                        <span className={`text-sm font-medium ${THEME.textPrimary} font-rajdhani text-right`}>{product.drive_type}</span>
                      </div>
                    )}

                    {product.specifications?.filter((s:any) => !HIDDEN_SPECS.includes(s.key.toLowerCase())).map((spec: any, idx: number) => (
                      <div key={idx} className="flex flex-row justify-between py-3 last:pb-0">
                        <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest min-w-[100px] pt-1">{spec.key}</span>
                        <span className="text-sm font-medium text-slate-200 font-mono text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

              {/* ACTION BUTTONS */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                      <button className="col-span-1 bg-amber-500 hover:bg-amber-400 text-slate-900 h-12 rounded font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 transition-all text-xs">
                          <ShoppingCart size={16} /> Bulk Quote
                      </button>
                      <button className="col-span-1 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white h-12 rounded font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-xs hover:bg-slate-700">
                          <FileCheck size={16} /> Spec Sheet
                      </button>
                  </div>
          </div>
        </div>
      </div>
      
      {/* --- TECHNICAL VAULT --- */}
      <div className="bg-slate-900 border-t border-slate-800 relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {showDimensions && (
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVar}>
                
                <div className="flex items-center gap-3 mb-8">
                    <Activity className="text-amber-500" size={24} />
                    <h3 className="text-2xl font-bold text-white uppercase tracking-wider" style={fontHeading}>Technical Specifications</h3>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col lg:flex-row shadow-2xl">
                    
                    {/* LEFT: Blueprint Viewer */}
                    <div className="lg:w-2/3 relative p-10 bg-slate-950 flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800 group">
                        <div className="absolute inset-0 opacity-10" style={blueprintGridStyle}></div>
                        <motion.div 
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent z-10 pointer-events-none border-b border-amber-500/20"
                            animate={{ top: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        />
                        <div className="absolute top-6 left-6 z-20">
                             <TechBadge>ISO View</TechBadge>
                        </div>
                        {product.technical_drawing ? (
                            <motion.img 
                                initial={{ opacity: 0, scale: 0.9 }} 
                                whileInView={{ opacity: 1, scale: 1 }} 
                                transition={{ duration: 0.8 }}
                                src={product.technical_drawing} 
                                className="relative z-10 max-h-[400px] w-auto object-contain invert mix-blend-lighten opacity-90 transition-transform duration-500 group-hover:scale-105" 
                                alt="Technical Drawing"
                            />
                        ) : <div className="text-slate-500 font-mono text-sm tracking-wide border border-slate-800 px-4 py-2 rounded">[ DRAWING DATA UNAVAILABLE ]</div>}
                    </div>

                    {/* RIGHT: Performance Data */}
                    <div className="lg:w-1/3 bg-slate-900 p-8 flex flex-col border-l border-slate-800 relative">
                          <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                             <Activity size={120} />
                          </div>

                          <div className="mb-6 pb-4 border-b border-slate-800 flex items-center justify-between relative z-10">
                             <h4 className="text-sm font-bold uppercase tracking-widest text-slate-100 flex items-center gap-2 font-rajdhani">
                                 <Layers size={16} className="text-amber-500" /> Performance Data
                             </h4>
                             <div className="flex gap-1 items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-[10px] text-green-400 font-mono uppercase font-bold">Verified</span>
                             </div>
                          </div>

                          <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar relative z-10">
                            {PERFORMANCE_KEYS_DISPLAY.map((key, i) => {
                                const hasSpec = product.specifications.find((s:any) => s.key.toLowerCase() === key.toLowerCase());
                                if (!hasSpec) return null;
                                return (
                                    <motion.div 
                                        key={i} 
                                        initial={{ x: 20, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex justify-between items-center p-3 bg-slate-950/80 rounded border border-slate-800 hover:border-slate-600 transition-colors group"
                                    >
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-rajdhani group-hover:text-slate-200 transition-colors">{key}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-mono text-sm font-medium">{hasSpec.value}</span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            {!product.specifications.some((s:any) => PERFORMANCE_KEYS_DISPLAY.map(k=>k.toLowerCase()).includes(s.key.toLowerCase())) && (
                                <div className="text-center text-slate-500 text-xs italic py-4 font-mono">No specific performance data listed.</div>
                            )}
                          </div>

                          <button className="w-full mt-6 flex items-center justify-center gap-2 bg-slate-800 text-slate-200 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-slate-900 transition-all relative z-10 border border-slate-700 hover:border-amber-500">
                             <Lock size={12} /> Unlock Engineering Report
                          </button>
                    </div>
                </div>

                {/* DIMENSIONS TABLE */}
                <div className="w-full bg-slate-900 border-t border-slate-800 mt-0">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-950">
                                    <th className="py-5 pl-8 text-xs font-bold text-slate-300 uppercase tracking-widest sticky left-0 z-10 bg-slate-950 border-r border-slate-800 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.5)]">Feature</th>
                                    <th className="py-5 text-center text-xs font-bold text-slate-400 uppercase tracking-widest w-24 bg-slate-950/50">Symbol</th>
                                    {uniqueDiameters.map((dia: any) => (
                                        <th key={dia} className={`py-5 px-4 text-center text-sm font-bold uppercase tracking-widest whitespace-nowrap font-rajdhani ${selectedDia === dia ? 'text-amber-500 bg-amber-500/10 border-b-2 border-amber-500' : 'text-slate-400'}`}>
                                            Ø {dia}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-sm font-mono">
                                 {product.dimensional_specifications?.map((dim: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="py-4 pl-8 text-slate-200 font-rajdhani font-semibold text-sm uppercase tracking-wider sticky left-0 bg-slate-900 group-hover:bg-slate-800 transition-colors border-r border-slate-800 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.5)]">
                                          {dim.label}
                                        </td>
                                        <td className="py-4 text-center text-amber-500/80 font-serif italic font-bold bg-slate-900/30">{dim.symbol || '-'}</td>
                                        {uniqueDiameters.map((dia: any) => {
                                            let val = '-';
                                            if (dim.values && typeof dim.values === 'object') val = dim.values[dia] || '-';
                                            else if (dia === selectedDia) val = dim.value || '-';
                                            
                                            const isActive = selectedDia === dia;
                                            return (
                                                <td key={dia} className={`py-4 text-center transition-colors font-medium ${isActive ? 'bg-amber-500/10 text-white font-bold text-base shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]' : 'text-slate-400'}`}>
                                                    {val}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                 ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                </motion.div>
            )}
        </div>
      </div>

      {/* --- APPLICATIONS --- */}
      {product.applications && product.applications.length > 0 && (
            <div className={`py-20 ${THEME.bg}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px bg-slate-800 flex-1"></div>
                        <h3 className={`text-2xl font-bold ${THEME.textPrimary} uppercase tracking-wider`} style={fontHeading}>Industry Applications</h3>
                        <div className="h-px bg-slate-800 flex-1"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {product.applications.map((app: any, idx: number) => {
                            const appName = typeof app === 'string' ? app : app.name;
                            const appImage = typeof app === 'object' ? app.image : null;
                            const slugUrl = appName.toLowerCase().replace(/\s+/g, '-');

                            return (
                              <div key={idx} className="group h-64 [perspective:1000px]">
                                <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                                    <div className="absolute inset-0 bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center justify-center p-6 [backface-visibility:hidden] hover:border-amber-500/50 transition-colors shadow-xl">
                                        <Hash className="text-slate-700 mb-4 group-hover:text-amber-500 transition-colors" size={32} />
                                        <h4 className="text-slate-200 text-sm font-bold uppercase tracking-widest text-center" style={fontHeading}>{appName}</h4>
                                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                            Flip <ChevronRight size={10} />
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden [transform:rotateY(180deg)] [backface-visibility:hidden]">
                                        {appImage ? (
                                            <>
                                                <img src={appImage} className="h-full w-full object-cover opacity-50 group-hover:opacity-80 transition-all duration-700 group-hover:scale-110" />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 gap-3">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setFullScreenAppImage(appImage); }}
                                                        className="text-white hover:text-amber-500 transition-colors"
                                                    >
                                                        <Maximize2 size={24} />
                                                    </button>
                                                    <Link to={`/applications/${slugUrl}`} className="border border-white/30 bg-black/50 backdrop-blur px-4 py-2 rounded text-white text-xs font-bold uppercase tracking-widest hover:bg-amber-500 hover:border-amber-500 hover:text-slate-900 transition-all">
                                                        View Case
                                                    </Link>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-slate-900">
                                                <Link to={`/applications/${slugUrl}`} className="text-amber-500 text-xs font-bold uppercase tracking-widest border-b border-amber-500 pb-1 hover:text-white hover:border-white transition-colors">Read More</Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                              </div>
                            );
                        })}
                    </div>
                </div>
            </div>
      )}
       
      <footer className="bg-slate-950 py-10 border-t border-slate-900 text-center text-slate-600 text-xs font-mono uppercase tracking-widest">
        <p>&copy; {new Date().getFullYear()} Durable Fastener Pvt. Ltd. // OEM Division</p>
      </footer>
      
      <AnimatePresence>
        {fullScreenAppImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setFullScreenAppImage(null)}>
                <button className="absolute top-6 right-6 z-[10000] text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full" onClick={() => setFullScreenAppImage(null)}><X size={24} /></button>
                <img src={fullScreenAppImage} className="max-w-full max-h-[85vh] object-contain rounded border border-slate-800 shadow-2xl" onClick={(e) => e.stopPropagation()} />
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;