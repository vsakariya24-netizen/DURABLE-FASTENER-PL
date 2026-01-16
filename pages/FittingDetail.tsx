import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, Layers, ChevronRight, Maximize2, X, 
  Info, Phone, Palette, Tag, Factory, Globe, 
  CheckCircle2, LayoutGrid, ShieldCheck, Download,
  ArrowRight, Share2, Printer, Hash, FileCheck, Activity,
  Search, Scan, FileText, Check 
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// --- THEME CONSTANTS ---
const THEME = {
  bg: "bg-[#dbdbdc]", 
  sectionBg: "bg-white",
  textPrimary: "text-neutral-900",      
  textSecondary: "text-neutral-700",   
  accent: "bg-yellow-500",             
  accentText: "text-yellow-700",
  border: "border-neutral-200",       
};

// --- FONTS ---
const fontHeading = { fontFamily: '"Oswald", sans-serif', letterSpacing: '0.05em' };
const fontBody = { fontFamily: '"Roboto", sans-serif' };
const fontMono = { fontFamily: '"Roboto Mono", monospace' };

// --- HELPERS ---
const getColorClass = (colorName: string) => {
  const c = colorName.toLowerCase().trim();
  if (c.includes('ivory')) return 'bg-[#FFFFF0] border-neutral-300';
  if (c.includes('white')) return 'bg-white border-neutral-200';
  if (c.includes('brown')) return 'bg-[#8B4513] border-[#8B4513]';
  if (c.includes('black')) return 'bg-neutral-900 border-neutral-900';
  if (c.includes('brass') || c.includes('gold')) return 'bg-amber-400 border-amber-500';
  if (c.includes('zinc') || c.includes('silver') || c.includes('chrome')) return 'bg-neutral-300 border-neutral-400';
  if (c.includes('antique')) return 'bg-amber-800 border-amber-900';
  return 'bg-neutral-200 border-neutral-300';
};

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className={`flex items-center gap-2.5 mb-5 border-b ${THEME.border} pb-3`}>
    <Icon size={20} className="text-yellow-600" />
    <span className={`text-lg font-bold uppercase tracking-wide text-neutral-900`} style={fontHeading}>
      {title}
    </span>
  </div>
);

const FittingDetail = ({ product }: { product: any }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [displayImage, setDisplayImage] = useState('');
  const [fullScreenAppImage, setFullScreenAppImage] = useState<string | null>(null);
  
  // State for selected model row in the bottom table
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  
  // State for selected finish
  const [selectedFinish, setSelectedFinish] = useState<string | null>(null);

  // --- GOOGLE FONTS ---
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Roboto+Mono:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // --- 1. DATA PARSING ---
  const images = useMemo(() => product?.images?.length > 0 ? product.images : ['https://via.placeholder.com/600x600?text=No+Image'], [product?.images]);
  useEffect(() => { setDisplayImage(images[0]); }, [images]);

  const specs = product?.specifications || [];
  const packing = specs.find((s: any) => s.key === 'Standard Packing')?.value || 'Standard Export';
  const colorsSpec = specs.find((s: any) => s.key === 'Available Colors')?.value;
  const generalNames = specs.find((s: any) => s.key === 'General Names')?.value?.split(',').map((s:string) => s.trim()) || [];
  
  const materials = product?.material ? product.material.split(/\|/).map((s: string) => s.trim()) : ['Standard'];
  const applications = product?.applications || [];
  const certifications = product?.certifications || [];

  // --- 2. FINISHES LOGIC ---
  const uniqueFinishes = useMemo(() => {
    const set = new Set<string>();
    if (product?.variants) product.variants.forEach((v: any) => v.finish && set.add(v.finish.trim()));
    if (colorsSpec) colorsSpec.split(',').forEach((c: string) => set.add(c.trim()));
    return Array.from(set);
  }, [product?.variants, colorsSpec]);

  const finishImages = product?.finish_images || {};

  const handleFinishClick = (finishName: string) => {
    setSelectedFinish(finishName); // Update selection state
    if (finishImages[finishName]) {
      setDisplayImage(finishImages[finishName]);
      setActiveImageIndex(-1);
    }
  };

  // --- 3. MODELS LOGIC ---
  const uniqueModels = useMemo(() => {
    const seen = new Set();
    const rawVariants = product?.variants || [];
    return rawVariants.filter((item: any) => {
      const key = `${item.diameter?.trim()}-${item.length?.trim()}`;
      if (seen.has(key)) return false;
      if (!item.diameter && !item.length && rawVariants.length > 1) return false;
      seen.add(key);
      return true;
    });
  }, [product?.variants]);

  // --- 4. ANIMATION VARIANTS ---
  const containerVar = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVar = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    // UPDATED: Adjusted pt (padding-top) to match the new header height offsets
    <div className={`${THEME.bg} min-h-screen pb-24 pt-[110px] md:pt-[150px] selection:bg-yellow-500/30 selection:text-black font-sans`} style={fontBody}>
      <Helmet>
        <title>{product ? `${product.name} | Durable Fastener` : 'Product Details'}</title>
      </Helmet>

      {/* --- BREADCRUMB --- */}
      {/* UPDATED: Changed top values to fit standard headers (top-60px mobile / top-80px desktop) and increased z-index */}
      <div className="fixed top-[60px] md:top-[80px] left-0 w-full z-40 bg-neutral-900 border-b border-neutral-800 shadow-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-5 py-2.5">
          <nav className="flex items-center gap-2 text-[13px] md:text-[14px] font-medium tracking-wide">
            <Link to="/" className="text-neutral-400 hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} className="text-neutral-600" />
            <Link to="/products" className="text-neutral-400 hover:text-white transition-colors">Products</Link>
            <ChevronRight size={12} className="text-neutral-600" />
            <span className="text-yellow-500 font-bold uppercase tracking-wider text-xs md:text-sm truncate max-w-[180px] md:max-w-none">
              {product?.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        
        {/* --- HERO SECTION --- */}
        <motion.div variants={containerVar} initial="hidden" animate="visible" className="mb-10 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                <div>
                    <motion.div variants={itemVar} className="flex items-center gap-3 mb-3">
                        
                        {/* Tags */}
                        {generalNames.slice(0, 3).map((tag: string, i: number) => (
                            <span key={i} className="text-neutral-600 text-[11px] font-bold tracking-wider px-2 py-1 bg-white rounded border border-neutral-200 uppercase">{tag}</span>
                        ))}
                    </motion.div>
                    
                    <motion.h1 variants={itemVar} className={`text-4xl md:text-5xl lg:text-6xl font-semibold ${THEME.textPrimary} uppercase leading-tight tracking-wide`} style={fontHeading}>
                        {product?.name}
                    </motion.h1>
                </div>
                
                <motion.div variants={itemVar} className="flex gap-3">
                    <button className="p-3 bg-white rounded-lg text-neutral-500 hover:text-neutral-900 border border-neutral-200 shadow-sm hover:shadow-md transition-all"><Share2 size={20} /></button>
                    <button className="p-3 bg-white rounded-lg text-neutral-500 hover:text-neutral-900 border border-neutral-200 shadow-sm hover:shadow-md transition-all"><Printer size={20} /></button>
                </motion.div>
            </div>
            
            <motion.div variants={itemVar} className="flex items-start gap-5 mt-6 border-l-4 border-yellow-500 pl-6">
                 <p className={`${THEME.textSecondary} text-lg font-normal leading-relaxed max-w-4xl tracking-normal`}>
                    {product?.short_description || "Premium quality architectural hardware designed for durability and aesthetic appeal."}
                 </p>
            </motion.div>
        </motion.div>

        {/* --- MAIN DISPLAY AREA (Combined Gallery + Configurator) --- */}
        <div className="flex flex-col-reverse md:flex-row gap-6 items-start justify-center">
            
            {/* 1. THUMBNAILS (Sticky Left) */}
            <div className="hidden md:flex flex-col gap-3 sticky top-40 w-24 flex-shrink-0">
                {images.map((img: string, idx: number) => (
                    <button key={idx} onClick={() => { setActiveImageIndex(idx); setDisplayImage(img); }} className={`relative w-full aspect-square rounded-xl overflow-hidden transition-all duration-200 bg-white border ${activeImageIndex === idx ? 'ring-2 ring-yellow-500 opacity-100 scale-100 border-yellow-500' : 'opacity-60 hover:opacity-100 border-neutral-200'}`}>
                        <img src={img} className="w-full h-full object-contain p-1" />
                    </button>
                ))}
            </div>

            {/* 2. MAIN CONTENT STACK (Center/Right) */}
            <div className="flex-1 w-full max-w-5xl flex flex-col gap-8">
                
                {/* A. IMAGE VIEWER */}
                <div className="relative w-full bg-white rounded-3xl shadow-sm border border-neutral-200 aspect-[4/3] md:aspect-[16/9] flex items-center justify-center p-8 md:p-12 overflow-hidden group">
                      {/* Cert Badge */}
                      <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                          {certifications[0] && (
                             <span className="bg-emerald-50/90 backdrop-blur text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-2 shadow-sm">
                                 <ShieldCheck size={12} /> {certifications[0].title}
                             </span>
                          )}
                       </div>

                      {/* Expand Button */}
                      <div className="absolute top-4 right-4 z-20">
                          <button onClick={() => setShowFullScreen(true)} className="p-2 bg-white/50 backdrop-blur hover:bg-white rounded-full text-neutral-600 hover:text-neutral-900 transition-all shadow-sm border border-neutral-200/50">
                             <Maximize2 size={20} />
                          </button>
                      </div>

                      {/* Image */}
                      <motion.div 
                        key={displayImage} 
                        initial={{ opacity: 0.8, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 0.4 }} 
                        className="w-full h-full flex items-center justify-center"
                    >
                        <img 
                            src={displayImage} 
                            className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-105" 
                            alt={product?.name} 
                        />
                    </motion.div>
                </div>

                {/* B. CONFIGURATOR (Finish & Actions) - Directly Below Image */}
                <div className="flex flex-col gap-8 px-1 md:px-0">
                    
                    {/* Select Finish */}
                    <div>
                          <div className="flex items-center gap-2 mb-4">
                             <Palette size={18} className="text-yellow-600" />
                             <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-800" style={fontHeading}>Select Finish</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                             {uniqueFinishes.map((finish, idx) => {
                               const isSelected = selectedFinish === finish;
                               return (
                                   <button 
                                        key={idx}
                                        onClick={() => handleFinishClick(finish)}
                                        className={`relative flex items-center gap-4 p-3 rounded-xl border transition-all duration-200 group text-left h-16
                                            ${isSelected 
                                                ? 'bg-white border-yellow-500 ring-1 ring-yellow-500 shadow-md transform scale-[1.02]' 
                                                : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
                                            }`}
                                   >
                                        {/* Color Swatch */}
                                        <span className={`w-10 h-10 rounded-full shadow-inner border flex-shrink-0 ${getColorClass(finish)}`}></span>
                                        
                                        <div className="flex flex-col justify-center">
                                            <span className={`text-xs font-bold uppercase tracking-widest ${isSelected ? 'text-neutral-900' : 'text-neutral-600'}`}>
                                                {finish}
                                            </span>
                                            {isSelected && (
                                                 <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 uppercase tracking-wide">
                                                     <CheckCircle2 size={10} /> Previewing
                                                 </span>
                                            )}
                                        </div>
                                   </button>
                               )
                            })}
                          </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-neutral-900 py-4 px-6 rounded-xl shadow-lg shadow-yellow-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 group">
                            <Phone size={20} className="fill-neutral-900/10 stroke-neutral-900" />
                            <span className="font-bold font-heading text-lg tracking-wider uppercase">Bulk Quote</span>
                        </button>

                        <button className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white py-4 px-6 rounded-xl shadow-lg shadow-neutral-900/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 group">
                            <FileText size={20} className="text-neutral-400 group-hover:text-yellow-400 transition-colors" />
                            <span className="font-bold font-heading text-lg tracking-wider uppercase">Spec Sheet</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
      </div>

      <section className="bg-neutral-50 border-t border-neutral-200 relative overflow-hidden py-16 md:py-24">
  {/* Subtitle / Background Pattern - Engineering Grid Effect */}
  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
       style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, size: '40px 40px', backgroundSize: '30px 30px' }} 
  />

  <div className="max-w-7xl mx-auto px-4 relative z-10">
    
    {/* Header Area */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-yellow-600">
          <Activity size={20} strokeWidth={2.5} />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Technical Specifications</span>
        </div>
        <h3 className="text-4xl md:text-5xl font-bold text-neutral-900 uppercase tracking-tight" style={fontHeading}>
          Engineering <span className="text-neutral-400">Data</span>
        </h3>
      </div>

      {/* ISO / Quality Badge */}
      {certifications.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xl shadow-neutral-200/50"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
            <ShieldCheck size={28} />
          </div>
          <div>
            <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Certified Quality</div>
            <div className="text-lg font-bold text-neutral-900 leading-none uppercase" style={fontHeading}>{certifications[0].title}</div>
            <div className="text-[11px] text-neutral-500 font-medium mt-1 uppercase tracking-tighter">{certifications[0].subtitle}</div>
          </div>
        </motion.div>
      )}
    </div>

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT: Specification "Specs At A Glance" */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-neutral-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-yellow-500/20 transition-colors" />
            
            <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                <FileCheck className="text-yellow-500" size={20} />
                <h4 className="text-sm font-bold uppercase tracking-widest" style={fontHeading}>Material & Build</h4>
            </div>

            <div className="space-y-6">
                {/* Material Item */}
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Base Material</span>
                    <div className="flex flex-wrap gap-2">
                        {materials.map((m, i) => (
                            <span key={i} className="text-lg font-bold text-white border-b-2 border-yellow-500/30">{m}</span>
                        ))}
                    </div>
                </div>

                {/* Packing Item */}
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Standard Packaging</span>
                    <span className="text-lg font-bold text-white font-mono">{packing}</span>
                </div>

                {/* Dynamic Attributes */}
                {product.specifications?.filter((s:any) => !['available colors', 'general names', 'standard packing'].includes(s.key.toLowerCase())).map((spec: any, idx: number) => (
                    <div key={idx} className="flex flex-col gap-1 pt-4 border-t border-white/5">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{spec.key}</span>
                        <span className="text-md font-bold text-yellow-500/90 font-mono tracking-tight">{spec.value}</span>
                    </div>
                ))}
            </div>

            <button className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group">
                <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> 
                Download Data Sheet
            </button>
        </div>
      </div>

      {/* RIGHT: Model Matrix Table */}
      <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200 shadow-xl shadow-neutral-200/40 overflow-hidden">
        <div className="px-8 py-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center text-neutral-900">
                <Hash size={18} strokeWidth={2.5} />
             </div>
             <h4 className="font-bold text-neutral-900 uppercase tracking-wider" style={fontHeading}>Product Matrix</h4>
          </div>
          <div className="px-4 py-1.5 bg-white border border-neutral-200 rounded-full text-[11px] font-bold text-neutral-500 uppercase tracking-tighter">
            {uniqueModels.length} Dimensions Available
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50">
                <th className="px-8 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100">Model Ref.</th>
                <th className="px-8 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100">Dimensional Specs</th>
                <th className="px-8 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {uniqueModels.map((m: any, idx: number) => {
                const isSelected = selectedVariantId === idx;
                return (
                  <tr 
                    key={idx} 
                    onClick={() => setSelectedVariantId(idx)}
                    className={`group cursor-pointer transition-all duration-200 ${isSelected ? 'bg-yellow-50/50' : 'hover:bg-neutral-50/80'}`}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full transition-colors ${isSelected ? 'bg-yellow-500' : 'bg-neutral-200 group-hover:bg-neutral-400'}`} />
                        <span className={`font-mono text-sm font-bold ${isSelected ? 'text-neutral-900' : 'text-neutral-600'}`}>
                          {m.diameter || 'STD-00'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide px-3 py-1 bg-neutral-100 rounded-md group-hover:bg-white transition-colors">
                        {m.length || 'Standard Design'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                         ${isSelected ? 'bg-neutral-900 text-white shadow-lg' : 'text-neutral-400 opacity-0 group-hover:opacity-100'}`}>
                         <Check size={12} strokeWidth={3} /> Active
                        </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer / Prompt */}
        <div className="p-6 bg-neutral-50/50 border-t border-neutral-100 text-center">
            <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest">
                Select a model row to view detailed loading capacities and blueprints
            </p>
        </div>
      </div>

    </div>
  </div>
</section>
      {/* --- APPLICATIONS (3D Flip Cards) --- */}
      {applications.length > 0 && (
         <div className="bg-neutral-100 py-24 border-t border-neutral-200">
            <div className="max-w-7xl mx-auto px-4">
               <div className="flex items-center gap-6 mb-16">
                  <div className="h-px bg-neutral-300 flex-1"></div>
                  <h3 className="text-3xl font-bold text-neutral-900 uppercase tracking-widest" style={fontHeading}>Industry Applications</h3>
                  <div className="h-px bg-neutral-300 flex-1"></div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                  {applications.map((app: any, idx: number) => {
                      const appName = typeof app === 'string' ? app : app.name;
                      const appImage = typeof app === 'object' ? app.image : null;
                      return (
                         <div key={idx} className="group h-72 [perspective:1000px]">
                            <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                              {/* Front */}
                              <div className="absolute inset-0 bg-white border border-neutral-200 rounded-xl flex flex-col items-center justify-center p-8 [backface-visibility:hidden] shadow-sm hover:border-yellow-500 hover:shadow-lg transition-all">
                                 <LayoutGrid className="text-neutral-300 mb-6 group-hover:text-yellow-500 transition-colors" size={36} />
                                 <h4 className="text-neutral-900 text-lg font-bold uppercase tracking-widest text-center leading-relaxed" style={fontHeading}>{appName}</h4>
                                 <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-neutral-400 uppercase tracking-widest flex items-center gap-1 font-bold">
                                    View Use Case <ChevronRight size={10} />
                                 </div>
                              </div>
                              {/* Back */}
                              <div className="absolute inset-0 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-xl flex items-center justify-center">
                                 {appImage ? (
                                    <>
                                       <img src={appImage} className="absolute inset-0 h-full w-full object-cover opacity-60" />
                                       <div className="relative z-10">
                                          <button onClick={() => setFullScreenAppImage(appImage)} className="bg-white/10 hover:bg-yellow-500 text-white hover:text-black p-3 rounded-full backdrop-blur transition-all">
                                              <Maximize2 size={24} />
                                          </button>
                                       </div>
                                    </>
                                 ) : <span className="text-neutral-500 font-mono text-xs uppercase tracking-widest">No Image</span>}
                              </div>
                           </div>
                         </div>
                      );
                  })}
               </div>
            </div>
         </div>
      )}

      {/* --- MODALS --- */}
      <AnimatePresence>
        {/* Gallery Fullscreen */}
        {showFullScreen && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setShowFullScreen(false)}>
              <button className="absolute top-6 right-6 p-4 rounded-full bg-neutral-100 hover:bg-neutral-200">
                 <X size={24} className="text-neutral-600"/>
              </button>
              <img src={displayImage} className="max-h-[85vh] max-w-[90vw] object-contain drop-shadow-2xl" alt="Fullscreen view" onClick={(e) => e.stopPropagation()}/>
              <div className="absolute bottom-8 text-2xl font-black uppercase text-neutral-900 tracking-widest" style={fontHeading}>{product?.name}</div>
           </motion.div>
        )}
        
        {/* App Image Fullscreen */}
        {fullScreenAppImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-neutral-900/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setFullScreenAppImage(null)}>
                <button className="absolute top-6 right-6 z-[10000] text-white hover:text-yellow-500" onClick={() => setFullScreenAppImage(null)}><X size={32} /></button>
                <img src={fullScreenAppImage} className="max-w-full max-h-[90vh] object-contain rounded-lg border border-neutral-700 shadow-2xl" onClick={(e) => e.stopPropagation()} />
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FittingDetail;