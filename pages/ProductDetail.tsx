import React, { useState, useMemo, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ChevronRight, ShoppingCart, Loader2, Share2, Printer, 
  Settings, FileText, Check, Ruler, Maximize2, Info, X,
  ShieldCheck, ArrowRight, Lock, Activity, FileCheck, Scan, Zap, 
  CheckCircle, CheckCircle2 // <--- Add this
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import MagicZoomClone from '../components/MagicZoomClone'; 

const { useParams, Link } = ReactRouterDOM;

// --- STYLING CONSTANTS ---
const BRAND_ACCENT = "amber-500";
const BRAND_PRIMARY_TEXT = "slate-900";
const BRAND_SECONDARY_TEXT = "slate-600";

const blueprintGridStyle = {
    backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.05) 1px, transparent 1px)',
    backgroundSize: '20px 20px'
};

// --- PERFORMANCE KEYS TO LOOK FOR (ORDER MATTERS) ---
const PERFORMANCE_KEYS_DISPLAY = [
  "Core Hardness",
  "Surface Hardness",
  "Tensile Strength",
  "Shear Strength",
  "Salt Spray Resistance",
  "Installation Speed",
  "Temperature Range"
];

// --- INTERNAL KEYS TO HIDE (Include Performance Keys here so they don't show in Attributes list) ---
const HIDDEN_SPECS = [
    'hardness', 'sst', 'torque', 'salt', 'box_qty', 'carton_qty', 
    'standard', 'seo_keywords', 'tds_url', 'mtc_url',
    ...PERFORMANCE_KEYS_DISPLAY.map(s => s.toLowerCase())
];

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const containerVar = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
  }
};

const itemVar = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 50, damping: 20 } 
  }
};

const floatVar = {
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// --- HELPER FUNCTIONS ---
const getSpecValue = (specs: any[], keyPart: string) => {
    if (!specs) return null;
    const found = specs.find((s: any) => s.key.toLowerCase() === keyPart.toLowerCase());
    return found ? found.value : null;
};

// --- HELPER COMPONENTS ---

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [5, -5]);
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);

    return (
        <motion.div
            style={{ x, y, rotateX, rotateY, z: 100 }}
            drag
            dragElastic={0.1}
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            whileHover={{ cursor: "grabbing" }}
            className={`perspective-1000 ${className}`}
        >
            {children}
        </motion.div>
    );
};

const ShimmerButton = ({ children, onClick, className }: any) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`relative overflow-hidden ${className}`}
        >
            <motion.div
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                animate={{ translateX: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 1 }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
        </motion.button>
    );
};

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

  // Check Mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Rajdhani:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // Fetch Data
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

  // Derived Data
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
  const fontMono = { fontFamily: '"JetBrains Mono", monospace' };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className={`animate-spin text-${BRAND_ACCENT}`} size={48} /></div>;
  if (!product) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50"><h2 className="text-3xl font-bold mb-4" style={fontHeading}>Product Not Found</h2><Link to="/products">Back to Catalog</Link></div>;

  const currentImage = displayImages[selectedImageIndex];
  const standard = getSpecValue(product.specifications, 'standard');
  const showDimensions = product.technical_drawing || (product.dimensional_specifications && product.dimensional_specifications.length > 0);
  const displayMaterial = product.material || '';
  const displayHeadType = product.head_type ? product.head_type.replace(/Buggel/gi, 'Bugle') : '';

  return (
    <div className="bg-slate-50 min-h-screen pb-24 selection:bg-amber-100 selection:text-amber-900" style={fontBody}>
      {/* Header */}
      <motion.div initial={{ y: -50 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 100 }} className="bg-white/90 border-b border-slate-200 sticky top-0 z-40 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-500" style={fontHeading}>
              <Link to="/products" className={`hover:text-${BRAND_ACCENT} transition-colors`}>Catalog</Link> <ChevronRight size={12} className="mx-2" /> <span className="text-slate-900">{product.name}</span>
            </div>
            <div className="flex gap-2 text-slate-400">
                <motion.button whileHover={{ scale: 1.1, color: '#f59e0b' }} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Share2 size={18} /></motion.button>
                <motion.button whileHover={{ scale: 1.1, color: '#f59e0b' }} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Printer size={18} /></motion.button>
            </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        {/* Title Section with Stagger */}
        <motion.div variants={containerVar} initial="hidden" animate="visible" className="mb-10 md:mb-14 max-w-4xl relative">
            <motion.h1 variants={itemVar} className={`text-4xl md:text-5xl lg:text-6xl font-extrabold text-${BRAND_PRIMARY_TEXT} tracking-tight uppercase mb-4 leading-none`} style={fontHeading}>
                {product.name}
            </motion.h1>
            <motion.div variants={itemVar} className="flex items-start gap-4">
                <div className={`w-1 self-stretch bg-${BRAND_ACCENT} rounded-full`}></div>
                <p className={`text-${BRAND_SECONDARY_TEXT} text-lg md:text-xl font-light leading-relaxed`}>{product.short_description}</p>
            </motion.div>
            {/* Background Decoration */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-100 rounded-full blur-[100px] opacity-50 -z-10 animate-pulse"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* --- LEFT COLUMN: Images & Finish Options --- */}
          <div className="lg:col-span-7 flex flex-col gap-8">
              {/* Gallery */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="flex flex-col-reverse md:flex-row gap-4 h-auto md:h-[500px]">
                  <div className="hidden md:flex flex-col gap-3 overflow-y-auto w-20 py-1 pr-1 custom-scrollbar">
                      {displayImages.map((img: string, idx: number) => (
                          <motion.button 
                            key={idx} 
                            whileHover={{ x: 2 }}
                            onClick={() => setSelectedImageIndex(idx)} 
                            className={`relative w-full aspect-square rounded-lg bg-white overflow-hidden border transition-all ${selectedImageIndex === idx ? `border-${BRAND_ACCENT} ring-1 ring-${BRAND_ACCENT}` : 'border-slate-200 opacity-60 hover:opacity-100'}`}
                          >
                              <img src={img} className="w-full h-full object-contain p-1" />
                          </motion.button>
                      ))}
                  </div>
                  {/* MAIN IMAGE WITH FLOATING ANIMATION */}
                  <motion.div 
                    variants={floatVar}
                    animate="animate"
                    className="flex-1 relative rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-200 p-8 flex items-center justify-center h-[400px] md:h-full overflow-hidden"
                  >
                      {standard && (
                          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute top-4 left-4 z-20">
                              <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-md flex items-center gap-1">
                                  <ShieldCheck size={12}/> {standard.split('/')[0]}
                              </span>
                          </motion.div>
                      )}
                      <AnimatePresence mode='wait'>
                        <motion.div 
                            key={currentImage} 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0 }} 
                            transition={{ duration: 0.3 }}
                            className="w-full h-full flex items-center justify-center"
                        >
                            <MagicZoomClone src={currentImage} zoomSrc={currentImage} alt={product.name} zoomLevel={2.5} glassSize={isMobile ? 120 : 200} className="max-h-full max-w-full object-contain" />
                        </motion.div>
                      </AnimatePresence>
                  </motion.div>
              </motion.div>

              {/* Finish Options (Staggered Entry) */}
              <motion.div variants={containerVar} initial="hidden" animate="visible">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <motion.span variants={itemVar} className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4" style={fontHeading}>
                        <div className="w-1.5 h-1.5 bg-amber-500 rotate-45 rounded-sm"></div> Finish Options
                    </motion.span>
                    <div className="flex flex-wrap gap-3">
                        {availableFinishes.map((finish: any, i) => (
                            <motion.button 
                                key={finish} 
                                variants={itemVar}
                                whileHover={{ y: -2, backgroundColor: "#fffbeb", borderColor: "#fcd34d" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleFinishClick(finish)} 
                                className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border rounded-lg transition-all ${activeImageOverride === product.finish_images?.[finish] ? `border-${BRAND_ACCENT} text-${BRAND_PRIMARY_TEXT} bg-amber-50 ring-1 ring-${BRAND_ACCENT} shadow-md` : `border-slate-200 bg-white text-slate-600`}`} style={fontHeading}
                            >
                                {finish}
                            </motion.button>
                        ))}
                    </div>
                </div>
              </motion.div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="lg:col-span-5 flex flex-col h-full sticky top-24 space-y-6">
              
              <motion.div variants={containerVar} initial="hidden" animate="visible" className="space-y-6">
                
                {/* 1. CONFIGURATOR BOX */}
                <motion.div variants={itemVar} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-10 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -z-10"></div>

                    {/* DIAMETER */}
                    <div className="space-y-4">
                      <span className={`text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 pl-1`} style={fontHeading}>
                          <div className="w-1.5 h-4 bg-amber-500 rounded-sm"></div> Diameter (Ø)
                      </span>
                      <div className="flex flex-wrap gap-4">
                          {uniqueDiameters.map((dia: any) => {
                              const isSelected = selectedDia === dia;
                              return (
                                <motion.button 
                                    key={dia} 
                                    onClick={() => setSelectedDia(dia)} 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${isSelected ? `bg-slate-900 text-white shadow-lg shadow-slate-900/30` : `bg-white border border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-500`}`}
                                >
                                    <div className={`absolute inset-1 rounded-full border border-dashed transition-colors ${isSelected ? 'border-slate-600' : 'border-slate-300'}`}></div>
                                    <span className="font-bold text-sm font-rajdhani z-10">{dia}</span>
                                    {isSelected && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center shadow-md z-20">
                                            <Check size={10} strokeWidth={4} className="text-white" />
                                        </motion.div>
                                    )}
                                </motion.button>
                              );
                          })}
                      </div>
                    </div>

                    {/* LENGTH */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-end pl-1">
                          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={fontHeading}>
                              <div className="w-4 h-1.5 bg-amber-500 rounded-sm"></div> Length (L)
                          </span>
                          <span className="text-xs font-mono text-slate-400 font-bold">{selectedLen ? `${selectedLen}mm` : ''}</span>
                      </div>
                      <div className="relative w-full bg-white border border-slate-200 rounded-xl shadow-inner h-28 flex items-end px-4 py-2 overflow-hidden" style={blueprintGridStyle}>
                          <div className="flex w-full items-end justify-between relative z-10">
                              {availableLengths.length > 0 ? availableLengths.map((len: any) => {
                                  const isSelected = selectedLen === len;
                                  return (
                                      <button key={len} onClick={() => setSelectedLen(len)} className="group relative flex-1 flex flex-col items-center justify-end outline-none min-w-0">
                                          <span className={`mb-3 text-xs sm:text-sm font-bold font-mono transition-all duration-300 select-none whitespace-nowrap ${isSelected ? 'text-amber-500 scale-125 -translate-y-1' : 'text-slate-600 group-hover:text-slate-900'}`}>{parseInt(len)}</span>
                                          <motion.div 
                                            layoutId="ruler-mark"
                                            className={`w-[2px] rounded-t-sm transition-all duration-300 ${isSelected ? 'h-10 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)] z-10' : 'h-5 bg-slate-300 group-hover:bg-slate-400 group-hover:h-6'}`}
                                          ></motion.div>
                                      </button>
                                  )
                              }) : (<div className="w-full text-center text-xs text-slate-400 italic pb-4">Select a Diameter first</div>)}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-slate-200"></div>
                      </div>
                    </div>
                </motion.div>

                {/* 2. ATTRIBUTES BOX */}
                <motion.div variants={itemVar} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <Settings className={`text-${BRAND_ACCENT}`} size={18} />
                        <span className="text-slate-900 text-sm font-bold uppercase tracking-widest" style={fontHeading}>Attributes</span>
                    </div>
                    <div className="rounded-xl border border-slate-100 divide-y divide-slate-100 bg-slate-50/50">
                        {displayMaterial && (
                            <div className="grid grid-cols-[140px_1fr] px-6 py-3.5 items-start">
                              <div className="text-slate-400 text-xs font-bold uppercase tracking-widest pt-1.5">Material</div>
                              <div className="flex flex-col gap-1.5">
                                {displayMaterial.split(/\|/g).map((mat: string, idx: number) => {
                                  const parts = mat.split('(Grade');
                                  return (<div key={idx} className="flex flex-wrap items-center gap-2"><span className="text-slate-900 font-bold font-rajdhani text-lg leading-tight">{parts[0].trim()}</span>{parts[1] && <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded border border-slate-200">Grade {parts[1].replace(')', '').trim()}</span>}</div>);
                                })}
                              </div>
                            </div>
                        )}
                        {displayHeadType && <SimpleSpecRow label="Head Type" value={displayHeadType} />}
                        {product.drive_type && <SimpleSpecRow label="Drive Type" value={product.drive_type} />}
                        {product.thread_type && <SimpleSpecRow label="Thread Type" value={product.thread_type} />}
                        {product.specifications?.filter((s:any) => !HIDDEN_SPECS.includes(s.key.toLowerCase())).map((spec: any, idx: number) => (
                            <SimpleSpecRow key={idx} label={spec.key} value={spec.value} />
                        ))}
                    </div>
                </motion.div>

              </motion.div>

              {/* ACTION BUTTONS (With Shimmer Effect) */}
              <motion.div variants={itemVar} initial="hidden" animate="visible" className="flex gap-4">
                  <div className="flex-1">
                      <ShimmerButton className={`w-full bg-${BRAND_ACCENT} text-white py-4 rounded-lg font-bold uppercase tracking-widest shadow-lg shadow-amber-200`} onClick={() => {}}>
                          <Link to="/contact" className="flex items-center justify-center gap-3 w-full h-full" style={fontHeading}>
                              <ShoppingCart size={20} /> Bulk Quote
                          </Link>
                      </ShimmerButton>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`flex-1 bg-white border-2 border-slate-200 py-4 rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:border-slate-400 text-slate-700`} style={fontHeading}>
                      <FileText size={20} /> Spec Sheet
                  </motion.button>
              </motion.div>

          </div>
        </div>
      </div>
      
      {/* --- COMBINED TECHNICAL SECTION: DIMENSIONS + PERFORMANCE VAULT --- */}
      <div className="bg-white border-t border-slate-100 relative z-20 shadow-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {showDimensions && (
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} className="w-full">
                
                <div className="flex items-center justify-between mb-8">
                    <h3 className={`text-3xl font-bold text-${BRAND_PRIMARY_TEXT} flex items-center gap-3 uppercase tracking-wider`} style={fontHeading}>
                        <FileCheck className={`text-${BRAND_ACCENT}`} size={32} /> Technical Specifications
                    </h3>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden ring-1 ring-slate-900/5 flex flex-col">
                    
                    {/* TOP SECTION: SPLIT VIEW */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                        
                        {/* LEFT: Technical Drawing (Interactive Scanner Effect) */}
                        <div className="lg:col-span-8 relative p-10 bg-slate-50 flex items-center justify-center group overflow-hidden" 
                             style={{ backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}>
                            
                            {/* The Radar Scan Animation */}
                            <motion.div 
                                className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/10 to-transparent z-10 pointer-events-none"
                                animate={{ top: ['-100%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            />
                            
                            <div className="absolute top-6 left-6 flex gap-2">
                                <span className="bg-white/80 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 rounded border border-slate-200">ISO View</span>
                            </div>

                            {product.technical_drawing ? (
                                <>
                                    <motion.img 
                                        initial={{ opacity: 0, scale: 0.9 }} 
                                        whileInView={{ opacity: 1, scale: 1 }} 
                                        transition={{ duration: 0.8 }} 
                                        src={product.technical_drawing} 
                                        className="relative z-10 max-h-[350px] w-auto object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" 
                                    />
                                    <motion.button whileHover={{ scale: 1.1 }} className="absolute bottom-6 right-6 bg-white p-3 rounded-xl shadow-md text-slate-500 hover:text-slate-900 border border-slate-200 z-20">
                                        <Maximize2 size={24} />
                                    </motion.button>
                                </>
                            ) : (<div className="text-sm text-slate-400 italic font-medium bg-white/50 px-6 py-3 rounded-full border border-slate-200">No technical drawing available</div>)}
                        </div>

                        {/* RIGHT: Performance Vault (Sidebar Style) */}
                        <div className="lg:col-span-4 bg-white p-8 flex flex-col relative overflow-hidden">
                             {/* Background Activity Icon */}
                             <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                                className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none origin-center"
                             >
                                <Activity size={120} />
                             </motion.div>
                             
                             <div className="mb-6 pb-4 border-b border-slate-100">
                                 <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                     <Activity size={16} className={`text-${BRAND_ACCENT}`} /> Performance Data
                                 </h4>
                             </div>

                             <div className="flex-1 space-y-4">
                                {/* DYNAMIC PERFORMANCE DATA RENDERING */}
                                {PERFORMANCE_KEYS_DISPLAY.map((key, i) => {
                                    // CHECK IF THIS KEY EXISTS IN SPECS (Value doesn't matter, just presence)
                                    const hasSpec = product.specifications.find((s:any) => s.key.toLowerCase() === key.toLowerCase());
                                    if (!hasSpec) return null; // Hide if not enabled in Admin

                                    return (
                                        <motion.div 
                                            key={i} 
                                            initial={{ x: 20, opacity: 0 }}
                                            whileInView={{ x: 0, opacity: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex justify-between items-center group/item p-2 rounded hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide group-hover/item:text-slate-800 transition-colors">{key}</span>
                                            <div className="relative overflow-hidden rounded bg-green-50 px-3 py-1 flex items-center gap-1 border border-green-100">
                                                <CheckCircle2 size={12} className="text-green-600" />
                                                <span className="text-green-700 text-[10px] font-bold uppercase tracking-widest">Verified</span>
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                {PERFORMANCE_KEYS_DISPLAY.every(key => !product.specifications.find((s:any) => s.key.toLowerCase() === key.toLowerCase())) && (
                                    <div className="text-center py-10">
                                        <span className="text-xs text-slate-400 italic">Standard performance compliance.</span>
                                    </div>
                                )}
                             </div>

                             <div className="mt-8">
                                <Link to="/contact" className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-100 transition-all group overflow-hidden relative">
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Lock size={14} className="group-hover:hidden" /> 
                                        <Zap size={14} className="hidden group-hover:block" />
                                        Unlock Full Report
                                    </span>
                                </Link>
                             </div>
                        </div>
                    </div>

                    {/* BOTTOM: Specification Table (Full Width) */}
                    <div className="w-full bg-white border-t border-slate-200">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full min-w-[600px] border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                        <th className="text-left py-6 pl-10 text-[11px] font-bold text-slate-400 uppercase tracking-widest min-w-[180px]">Feature</th>
                                        <th className="text-center py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest w-24">Symbol</th>
                                        {uniqueDiameters.map((dia: any) => (
                                            <th key={dia} className={`text-center py-6 px-4 text-[11px] font-bold uppercase tracking-widest min-w-[80px] ${selectedDia === dia ? `text-${BRAND_ACCENT} bg-amber-50/30` : 'text-slate-400'}`}>
                                                Ø {dia}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {product.dimensional_specifications && product.dimensional_specifications.length > 0 ? (
                                        product.dimensional_specifications.map((dim: any, idx: number) => {
                                            return (
                                                <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                                                    <td className="py-5 pl-10">
                                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{dim.label}</span>
                                                    </td>
                                                    <td className="py-5 text-center flex justify-center">
                                                        <span className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 font-serif italic text-sm font-medium rounded-md border border-slate-200 group-hover:border-slate-300 transition-colors">
                                                            {dim.symbol || '-'}
                                                        </span>
                                                    </td>
                                                    {uniqueDiameters.map((dia: any) => {
                                                        let val = '-';
                                                        if (dim.values && typeof dim.values === 'object') {
                                                            val = dim.values[dia] || '-';
                                                        } else if (dia === selectedDia) { 
                                                            val = dim.value || '-';
                                                        }
                                                        const isActive = selectedDia === dia;
                                                        return (
                                                            <td key={dia} className={`py-5 text-center px-4 transition-colors ${isActive ? 'bg-amber-50/50' : ''}`}>
                                                                <span className={`text-sm font-bold ${val === '-' ? 'text-slate-300' : isActive ? 'text-slate-900' : 'text-slate-600'} transition-colors`} style={fontMono}>
                                                                    {val}
                                                                </span>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr><td colSpan={uniqueDiameters.length + 2} className="py-12 text-center text-sm text-slate-400 italic">No specifications found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="py-4 bg-slate-50 border-t border-slate-100 text-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                <Info size={14} /> ISO 2768-m Standard Tolerances Apply
                            </span>
                        </div>
                    </div>
                </div>
                </motion.div>
            )}
        </div>
      </div>

      {/* --- INDUSTRY APPLICATIONS SECTION (3D TILT CARDS) --- */}
  {product.applications && product.applications.length > 0 && (
            <div className="mb-20">
                <div className="text-center mb-12">
                    <h3 className={`text-3xl font-bold text-${BRAND_PRIMARY_TEXT} uppercase tracking-wider`} style={fontHeading}>Industry Applications</h3>
                    <div className={`w-24 h-1.5 bg-${BRAND_ACCENT} mx-auto mt-5 rounded-full`}></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {product.applications.map((app: any, idx: number) => {
                        const appName = typeof app === 'string' ? app : app.name;
                        const appImage = typeof app === 'object' ? app.image : null;
                        const slugUrl = appName.toLowerCase().replace(/\s+/g, '-');

                        return (
                          <div key={idx} className="group h-64 [perspective:1000px]">
                            <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                                
                                {/* Front of Card */}
                                <div className="absolute inset-0 h-full w-full bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-6 [backface-visibility:hidden]">
                                    <div className={`w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-${BRAND_ACCENT} mb-4 border border-slate-100`}>
                                        <Check size={28} strokeWidth={2.5} />
                                    </div>
                                    <h4 className={`text-${BRAND_PRIMARY_TEXT} text-sm font-bold uppercase tracking-widest text-center`} style={fontHeading}>
                                        {appName}
                                    </h4>
                                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-400 font-medium flex items-center gap-1">
                                        Flip for Image <ChevronRight size={12}/>
                                    </div>
                                </div>

                                {/* Back of Card */}
                                <div className="absolute inset-0 h-full w-full bg-slate-800 rounded-2xl overflow-hidden [transform:rotateY(180deg)] [backface-visibility:hidden] relative">
                                    {appImage ? (
                                        <>
                                            <img src={appImage} alt={appName} className="h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-110" />
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    e.preventDefault();
                                                    setFullScreenAppImage(appImage);
                                                }}
                                                className="absolute top-3 right-3 z-30 bg-black/50 hover:bg-amber-500 text-white p-2 rounded-full backdrop-blur-sm transition-colors shadow-lg"
                                                title="View Full Image"
                                            >
                                                <Maximize2 size={16} />
                                            </button>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 pointer-events-none">
                                                <span className="text-white text-xs font-bold uppercase tracking-widest mb-1 opacity-80">{appName}</span>
                                                <div className="pointer-events-auto">
                                                    <Link to={`/applications/${slugUrl}`} className="inline-flex items-center gap-2 text-white font-bold text-sm hover:text-amber-400 transition-colors">
                                                        View Details <ArrowRight size={16} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="h-full w-full flex flex-col items-center justify-center bg-slate-900 p-6 text-center">
                                            <span className="text-white text-sm font-bold uppercase tracking-widest mb-4">{appName}</span>
                                            <Link to={`/applications/${slugUrl}`} className="px-4 py-2 bg-white text-slate-900 rounded-full text-xs font-bold uppercase tracking-wide hover:bg-amber-400 transition-colors">
                                                Explore
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                          </div>
                        );
                    })}
                </div>
            </div>
          )}
       
      
      <footer className="bg-white py-10 border-t border-slate-200 text-center text-slate-400 text-sm font-medium" style={fontBody}>
        <p>&copy; {new Date().getFullYear()} Durable Fastener Pvt. Ltd. All rights reserved.</p>
      </footer>
      <AnimatePresence>
        {fullScreenAppImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setFullScreenAppImage(null)}>
                <button className="absolute top-6 right-6 z-[10000] bg-white text-slate-900 rounded-full p-2 hover:scale-110 shadow-xl" onClick={(e) => { e.stopPropagation(); setFullScreenAppImage(null); }}><X size={32} strokeWidth={3} /></button>
                <motion.img initial={{ scale: 0.8 }} animate={{ scale: 1 }} src={fullScreenAppImage} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SimpleSpecRow: React.FC<{label: string, value: string}> = ({label, value}) => (
    <motion.div whileHover={{ x: 5, backgroundColor: "#f8fafc" }} className="grid grid-cols-[140px_1fr] px-6 py-3.5 transition-colors items-start cursor-default">
        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest pt-1">{label}</div>
        <div className="text-slate-800 font-semibold font-rajdhani text-lg leading-relaxed break-words">
            {value.split(',').join(', ')}
        </div>
    </motion.div>
);

export default ProductDetail;