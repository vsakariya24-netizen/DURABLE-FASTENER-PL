import React, { useState, useMemo, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Hammer, Grid, Armchair, Wrench, ArrowUpRight,
  ChevronRight, ShoppingCart, Loader2, Share2, Printer, 
  Ruler, Maximize2, Info, X,
  ArrowRight, Lock, Activity, FileCheck, Layers, Hash,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MagicZoomClone from '../components/MagicZoomClone'; 
import { Helmet } from 'react-helmet-async';


const { useParams, Link } = ReactRouterDOM;

// --- THEME CONSTANTS ---
const THEME = {
  bg: "bg-[#dbdbdc]", 
  sectionBg: "bg-neutral-50",
  textPrimary: "text-neutral-900",     
  textSecondary: "text-neutral-700",  
  textMuted: "text-neutral-500",       
  accent: "bg-yellow-500",            
  accentHover: "hover:bg-yellow-400",
  accentText: "text-yellow-700",
  accentBorder: "border-yellow-500",
  border: "border-neutral-200",       
  surface: "bg-white shadow-sm",
};

// --- FONTS ---
const fontHeading = { fontFamily: '"Oswald", sans-serif', letterSpacing: '0.03em' };
const fontBody = { fontFamily: '"Roboto", sans-serif' };
const fontMono = { fontFamily: '"Roboto Mono", monospace' };

const getAppIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('wood')) return Hammer;
    if (n.includes('furniture')) return Armchair;
    if (n.includes('metal') || n.includes('framing')) return Grid;
    if (n.includes('gypsum') || n.includes('pop')) return Layers;
    return Wrench;
  };

const blueprintGridStyleLight = {
  backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)',
  backgroundSize: '24px 24px'
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
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 20 } }
};

// --- HEADER COMPONENT ---
const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className={`flex items-center gap-2.5 mb-5 border-b ${THEME.border} pb-3`}>
    <Icon size={20} className="text-yellow-600" />
    <span className={`text-lg font-bold uppercase tracking-wide text-neutral-900`} style={fontHeading}>
      {title}
    </span>
  </div>
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
    link.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Roboto+Mono:wght@400;500;700&display=swap';
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

  if (loading) return <div className={`h-screen flex items-center justify-center ${THEME.bg}`}><Loader2 className="animate-spin text-yellow-500" size={48} /></div>;
  if (!product) return <div className={`min-h-screen flex flex-col items-center justify-center ${THEME.bg}`}><h2 className={`text-3xl font-bold mb-4 ${THEME.textPrimary}`} style={fontHeading}>Product Not Found</h2><Link to="/products" className={THEME.accentText}>Back to Catalog</Link></div>;

  const currentImage = displayImages[selectedImageIndex];
  const standard = product.specifications?.find((s:any) => s.key.toLowerCase() === 'standard')?.value;
  const showDimensions = product.technical_drawing || (product.dimensional_specifications && product.dimensional_specifications.length > 0);
  const displayMaterial = product.material || '';
  const displayHeadType = product.head_type ? product.head_type.replace(/Buggel/gi, 'Bugle') : '';

  return (
    // Padding Top Adjustments:
    // pt-[140px] for Mobile (Nav 96px + Breadcrumb ~44px)
    // pt-[200px] for Desktop (Nav 140px + Breadcrumb ~60px)
    <div className={`${THEME.bg} min-h-screen pb-24 pt-[140px] md:pt-[200px] selection:bg-yellow-500/30 selection:text-black`} style={fontBody}>
      <Helmet>
        {/* 1. Dynamic Title & Description */}
        <title>{product ? `${product.name} Manufacturer | Durable Fastener Rajkot` : 'Product Details'}</title>
        <meta 
          name="description" 
          content={product ? `Buy ${product.name} directly from factory. ISO certified ${product.category || 'Fastener'} manufacturer in Rajkot, Gujarat. Check specifications and bulk pricing.` : 'Product details'} 
        />

        {/* 2. PRODUCT SCHEMA (SEO & AEO) */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": "${product.name}",
              "image": "${displayImages[0] || 'https://durablefastener.com/default-product.jpg'}",
              "description": "${(product.description || product.short_description || '').replace(/"/g, '\\"')}",
              "brand": {
                "@type": "Brand",
                "name": "Durable Fastener"
              },
              "sku": "${product.id}",
              "mpn": "${product.slug}",
              "category": "${product.category || 'Industrial Fasteners'}",
              "manufacturer": {
                "@type": "Organization",
                "name": "Durable Fastener Pvt Ltd",
                "url": "https://durablefastener.com",
                "logo": "https://durablefastener.com/durablefastener.png",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+91 87587 00709",
                  "contactType": "sales"
                },
                "address": {
                   "@type": "PostalAddress",
                   "addressLocality": "Rajkot",
                   "addressRegion": "Gujarat",
                   "addressCountry": "IN"
                }
              },
              "offers": {
                "@type": "Offer",
                "url": "https://durablefastener.com/product/${product.slug}",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition",
                "price": "0", 
                "priceValidUntil": "2026-12-31",
                "seller": {
                  "@type": "Organization",
                  "name": "Durable Fastener Pvt Ltd"
                }
              }
            }
          `}
        </script>

        {/* 3. BREADCRUMB SCHEMA */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://durablefastener.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Products",
                  "item": "https://durablefastener.com/products"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "${product.name}"
                }
              ]
            }
          `}
        </script>
      </Helmet>
      {/* ✅ FIX 1: DARK THEME BREADCRUMB */}
      {/* Color change (bg-neutral-900) ensures visual separation from Navbar */}
    <div className="fixed top-[80px] md:top-[140px] left-0 w-full z-30 bg-neutral-900 border-b border-neutral-800 shadow-md transition-all duration-300">
  <div className="max-w-7xl mx-auto px-5 py-10"> {/* Reduced py-3 to py-2.5 for sleek look */}
    <nav className="flex items-center gap-2 text-[13px] md:text-[14px] font-medium tracking-wide">
      {/* Home Link */}
      <Link to="/" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1">
        Home
      </Link>
      
      <ChevronRight size={12} className="text-neutral-600" />
      
      {/* Products Link */}
      <Link to="/products" className="text-neutral-400 hover:text-white transition-colors">
        Products
      </Link>
      
      <ChevronRight size={12} className="text-neutral-600" />
      
      {/* Active Page Name */}
      <span className="text-yellow-500 font-bold uppercase tracking-wider text-xs md:text-sm truncate max-w-[180px] md:max-w-none">
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
                    <motion.div variants={itemVar} className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded bg-yellow-100 border border-yellow-200 text-yellow-900 text-[12px] font-bold uppercase tracking-widest`}>
                            Industrial Series
                        </span>
                        {standard && <span className="text-neutral-600 text-[12px] font-mono font-bold tracking-wider px-2 py-1 bg-white rounded border border-neutral-200">{standard}</span>}
                    </motion.div>
                    
                    <motion.h1 variants={itemVar} className={`text-4xl md:text-5xl lg:text-6xl font-semibold ${THEME.textPrimary} uppercase leading-tight tracking-wide`} style={fontHeading}>
                        {product.name}
                    </motion.h1>
                </div>
                
                <motion.div variants={itemVar} className="flex gap-3">
                    <button className="p-3 bg-white rounded-lg text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 transition-all border border-neutral-200 shadow-sm hover:shadow-md">
                        <Share2 size={20} />
                    </button>
                    <button className="p-3 bg-white rounded-lg text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 transition-all border border-neutral-200 shadow-sm hover:shadow-md">
                        <Printer size={20} />
                    </button>
                </motion.div>
            </div>
            
            <motion.div variants={itemVar} className="flex items-start gap-5 mt-6 border-l-4 border-yellow-500 pl-6">
                 <p className={`${THEME.textSecondary} text-lg font-normal leading-relaxed max-w-4xl tracking-normal`}>
                    {product.short_description}
                 </p>
            </motion.div>
        </motion.div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* --- LEFT COLUMN: Visuals --- */}
          <div className="lg:col-span-7 flex flex-col gap-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col-reverse md:flex-row gap-4 h-auto md:h-[950px]">
                  
                  {/* Thumbnails */}
                  <div className="hidden md:flex flex-col gap-3 overflow-y-auto w-24 py-1 pr-1 custom-scrollbar">
                      {displayImages.map((img: string, idx: number) => (
                          <button 
                            key={idx} 
                            onClick={() => setSelectedImageIndex(idx)} 
                            className={`relative w-full aspect-square rounded-xl overflow-hidden transition-all duration-200 ${selectedImageIndex === idx ? 'ring-2 ring-yellow-500 opacity-100 scale-100' : 'opacity-60 hover:opacity-100 scale-90'}`}
                          >
                              <img src={img} className="w-full h-full object-contain bg-transparent" />
                          </button>
                      ))}
                  </div>

                  {/* Main Viewer */}
                  <div className="flex-1 relative flex items-center justify-center h-[400px] md:h-full overflow-visible group">
                      
                      <div className="absolute top-4 right-4 z-20">
                          <button className="p-2 bg-neutral-200/50 hover:bg-white/80 backdrop-blur rounded-full text-neutral-600 hover:text-neutral-900 transition-all">
                             <Maximize2 size={24} />
                          </button>
                      </div>

                      <AnimatePresence mode='wait'>
                        <motion.div 
                            key={currentImage} 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full flex items-center justify-center relative z-10"
                        >
                            <MagicZoomClone 
                                src={currentImage} 
                                zoomSrc={currentImage} 
                                alt={product.name} 
                                zoomLevel={2.5} 
                                glassSize={isMobile ? 120 : 200} 
                                className="max-h-full max-w-full object-contain drop-shadow-2xl" 
                            />
                        </motion.div>
                      </AnimatePresence>
                  </div>
              </motion.div>
          </div>
          {/* --- RIGHT COLUMN: Configurator --- */}
          <div className="lg:col-span-5 flex flex-col space-y-8 sticky top-[200px]">
              
              <motion.div variants={containerVar} initial="hidden" animate="visible" className="space-y-8">
                
                {/* 1. CONFIG PANEL */}
                <motion.div variants={itemVar} className={`bg-white border border-neutral-200 p-8 rounded-2xl shadow-lg relative overflow-hidden`}>
                    
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
                                    relative w-14 h-12 rounded-lg flex items-center justify-center text-lg transition-all duration-200 border-2
                                    ${isSelected 
                                      ? 'bg-yellow-500 text-neutral-900 border-yellow-500 shadow-md font-bold' 
                                      : 'bg-neutral-50 text-neutral-600 border-neutral-100 hover:border-neutral-300 hover:text-neutral-900 hover:bg-white font-medium'}
                                  `}
                                  style={fontMono}
                              >
                                  {dia}
                              </button>
                            );
                        })}
                      </div>
                    </div>

                    {/* LENGTH SELECTION */}
                    <div className="mb-8">
                      <div className="flex justify-between items-end mb-4 border-b border-neutral-100 pb-2">
                        <SectionHeader icon={Maximize2} title="Select Length (mm)" />
                        <span className="text-4xl font-bold text-neutral-900 tracking-tight" style={fontHeading}>
                            {selectedLen ? selectedLen : '--'}<span className="text-sm text-neutral-400 ml-1 font-sans font-medium">mm</span>
                        </span>
                      </div>
                      
                      {/* RULER VISUALIZATION */}
                      <div className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-5 relative overflow-hidden">
                        
                        {/* Faint Background Grid */}
                         <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
                           backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                           backgroundSize: '12px 12px'
                         }}></div>

                         <div className="flex items-end justify-between h-32 gap-1 relative z-10 w-full px-1">
                             {availableLengths.length > 0 ? availableLengths.map((len: any) => {
                                 const isSelected = selectedLen === len;
                                 
                                 return (
                                     <button 
                                       key={len} 
                                       onClick={() => setSelectedLen(len)} 
                                       className="group flex-1 flex flex-col items-center justify-end h-full gap-3 focus:outline-none relative"
                                     >
                                         {/* Number Label */}
                                         <span className={`
                                           font-mono transition-all duration-200 whitespace-nowrap block
                                           ${isSelected 
                                               ? 'text-base font-bold text-neutral-900 -translate-y-2 scale-110' 
                                               : 'text-xs sm:text-sm text-neutral-500 font-medium group-hover:text-neutral-900 group-hover:font-bold'}
                                         `}>
                                             {parseInt(len)}
                                         </span>
                                         
                                         {/* The Ruler Bar */}
                                         <div className={`
                                           w-1.5 sm:w-2 rounded-t-[2px] transition-all duration-300 ease-out relative
                                           ${isSelected 
                                               ? 'h-full bg-yellow-500 shadow-md' 
                                               : 'h-8 bg-neutral-300 group-hover:h-12 group-hover:bg-neutral-400'}
                                         `}>
                                         </div>
                                         
                                         {/* Bottom baseline marker */}
                                         <div className="absolute bottom-0 w-full h-[1px] bg-neutral-300 -z-10"></div>
                                     </button>
                                 )
                             }) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm italic">
                                    Select Diameter to view lengths
                                </div>
                             )}
                         </div>
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
                                  px-5 py-2.5 text-[14px] font-medium uppercase tracking-wide border rounded-md transition-all
                                  ${activeImageOverride === product.finish_images?.[finish] 
                                    ? 'border-yellow-500 text-neutral-900 bg-yellow-400 shadow-sm font-bold' 
                                    : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 hover:bg-white'}
                                `}
                                style={fontHeading}
                             >
                                  {finish}
                             </button>
                          ))}
                      </div>
                    </div>
                </motion.div>
                </motion.div>

                {/* --- ATTRIBUTES SUMMARY --- */}
                <motion.div variants={itemVar} className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-md">
                  <div className="bg-neutral-100 px-6 py-4 border-b border-neutral-200 flex items-center gap-2">
                    <FileCheck size={18} className="text-yellow-600" />
                    <span className="text-sm font-bold uppercase tracking-widest text-neutral-800" style={fontHeading}>Specification Details</span>
                  </div>

                  <div className="p-6 flex flex-col gap-0 divide-y divide-neutral-100">
                    
                    {displayMaterial && (
                      <div className="flex flex-row justify-between py-4 first:pt-0">
                        <span className="text-neutral-500 font-bold uppercase text-xs tracking-wider min-w-[100px] pt-1">Material</span>
                        <div className="flex flex-col text-right gap-1">
                          {displayMaterial.split(/\|/g).map((mat: string, idx: number) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2">
                                <span className={`text-base font-bold text-neutral-900`}>{mat.split('(')[0].trim()}</span>
                                {mat.includes('(') && (
                                  <span className="text-[11px] text-neutral-700 font-bold font-mono bg-neutral-100 px-2 py-1 rounded border border-neutral-200">
                                    {mat.split('(')[1].replace(')', '')}
                                  </span>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {displayHeadType && (
                      <div className="flex flex-row justify-between py-4">
                        <span className="text-neutral-500 font-bold uppercase text-xs tracking-wider min-w-[100px] pt-1">Head Type</span>
                        <span className={`text-base font-semibold text-neutral-900 text-right`}>{displayHeadType}</span>
                      </div>
                    )}

                    {product.drive_type && (
                      <div className="flex flex-row justify-between py-4">
                        <span className="text-neutral-500 font-bold uppercase text-xs tracking-wider min-w-[100px] pt-1">Drive</span>
                        <span className={`text-base font-semibold text-neutral-900 text-right`}>{product.drive_type}</span>
                      </div>
                    )}

                    {product.specifications?.filter((s:any) => !HIDDEN_SPECS.includes(s.key.toLowerCase())).map((spec: any, idx: number) => (
                      <div key={idx} className="flex flex-row justify-between py-4 last:pb-0">
                        <span className="text-neutral-500 font-bold uppercase text-xs tracking-wider min-w-[100px] pt-1">{spec.key}</span>
                        <span className="text-base font-medium text-neutral-900 font-mono text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

              {/* ACTION BUTTONS */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                      <button className="col-span-1 bg-yellow-500 hover:bg-yellow-400 text-neutral-900 h-14 rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition-all text-sm border border-yellow-600/10 hover:translate-y-[-2px]" style={fontHeading}>
                          <ShoppingCart size={20} /> Bulk Quote
                      </button>
                      <button className="col-span-1 bg-neutral-900 border border-neutral-900 text-white hover:bg-black h-14 rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-sm hover:translate-y-[-2px] shadow-lg" style={fontHeading}>
                          <FileCheck size={20} /> Spec Sheet
                      </button>
                  </div>
          </div>
        </div>
      </div>
      
      {/* --- TECHNICAL VAULT --- */}
     {/* --- TECHNICAL VAULT --- */}
<div className="bg-[#aaaaab] border-t border-neutral-300 relative z-20 overflow-hidden text-neutral-900">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    {showDimensions && (
      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }} 
        variants={containerVar}
      >
        
        {/* HEADER WITH ISO BADGE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          
          {/* Left: Title */}
          <div className="flex items-center gap-3">
            <Activity className="text-yellow-600" size={32} />
            <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 uppercase tracking-wider" style={fontHeading}>
              Technical Specifications
            </h3>
          </div>

          {/* Right: ISO Badge (Designed per image) */}
         <div className="flex flex-wrap gap-4 mt-6">
  {product.certifications && product.certifications.length > 0 ? (
    product.certifications.map((cert: any, idx: number) => (
      <div key={idx} className="bg-neutral-900 rounded-md py-2 px-3 flex items-center gap-3 border border-neutral-800 shadow-2xl self-start md:self-auto transform hover:scale-105 transition-transform duration-300">
        <div className="p-1 rounded-full border-2 border-emerald-500/30">
           <ShieldCheck className="text-emerald-500" size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col justify-center">
           <span className="text-white font-black text-sm tracking-wide leading-none font-sans">
             {cert.title}
           </span>
           <span className="text-emerald-500 text-[9px] font-bold tracking-[0.25em] uppercase leading-none mt-1.5 font-mono">
             {cert.subtitle}
           </span>
        </div>
      </div>
    ))
  ) : (
    /* Fallback if nothing added */
    <div className="hidden"></div> 
  )}
</div>
</div>

        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden flex flex-col lg:flex-row shadow-xl">
            
            {/* LEFT: Blueprint Viewer */}
            <div className="lg:w-2/3 relative p-12 bg-white flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-neutral-200 group">
                <div className="absolute inset-0 opacity-100" style={blueprintGridStyleLight}></div>
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent z-10 pointer-events-none border-b border-yellow-500/20"
                    animate={{ top: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />
                <div className="absolute top-6 left-6 z-20">
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded bg-neutral-100 border border-neutral-300 text-[11px] font-mono uppercase text-neutral-600 font-bold tracking-wider`}>
                        ISO View
                      </span>
                </div>
                {product.technical_drawing ? (
                    <motion.img 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        whileInView={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 0.8 }}
                        src={product.technical_drawing} 
                        className="relative z-10 max-h-[450px] w-auto object-contain opacity-90 transition-transform duration-500 group-hover:scale-105 mix-blend-multiply" 
                        alt="Technical Drawing"
                    />
                ) : <div className="text-neutral-500 font-mono text-sm tracking-wide border border-neutral-200 px-6 py-3 rounded bg-neutral-50">[ DRAWING DATA UNAVAILABLE ]</div>}
            </div>

            {/* RIGHT: Performance Data */}
            <div className="lg:w-1/3 bg-neutral-50 p-8 flex flex-col border-l border-neutral-200 relative">
                  <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none text-neutral-900">
                     <Activity size={140} />
                  </div>

                  <div className="mb-6 pb-4 border-b border-neutral-200 flex items-center justify-between relative z-10">
                     <h4 className="text-lg font-bold uppercase tracking-widest text-neutral-900 flex items-center gap-2" style={fontHeading}>
                          <Layers size={18} className="text-yellow-600" /> Performance Data
                     </h4>
                     <div className="flex gap-2 items-center bg-white px-3 py-1 rounded border border-neutral-200 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[15px] text-green-700 font-mono uppercase font-bold">Verified</span>
                     </div>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar relative z-10 pr-2">
                    {PERFORMANCE_KEYS_DISPLAY.map((key, i) => {
                        const hasSpec = product.specifications.find((s:any) => s.key.toLowerCase() === key.toLowerCase());
                        if (!hasSpec) return null;
                        return (
                            <motion.div 
                                key={i} 
                                initial={{ x: 20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex justify-between items-center p-3.5 bg-white rounded border border-neutral-200 hover:border-neutral-400 transition-colors group shadow-sm"
                            >
                                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-800 transition-colors" style={fontHeading}>{key}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-neutral-900 font-mono text-sm font-bold tracking-wide">{hasSpec.value}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                    {!product.specifications.some((s:any) => PERFORMANCE_KEYS_DISPLAY.map(k=>k.toLowerCase()).includes(s.key.toLowerCase())) && (
                        <div className="text-center text-neutral-500 text-xs italic py-4 font-mono">No specific performance data listed.</div>
                    )}
                  </div>

                  <button className="w-full mt-6 flex items-center justify-center gap-2 bg-neutral-900 text-white py-3.5 rounded text-sm font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-all relative z-10 border border-neutral-900 hover:border-yellow-500 shadow-md" style={fontHeading}>
                     <Lock size={14} /> Unlock Engineering Report
                  </button>
            </div>
        </div>

        {/* DIMENSIONS TABLE */}
        <div className="w-full bg-white border border-t-0 border-neutral-200 mt-0 rounded-b-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-100">
                            <th className="py-6 pl-8 text-sm font-bold text-neutral-800 uppercase tracking-widest sticky left-0 z-10 bg-neutral-100 border-r border-neutral-200 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.1)]" style={fontHeading}>Feature</th>
                            <th className="py-6 text-center text-sm font-bold text-neutral-600 uppercase tracking-widest w-28 bg-neutral-100 border-r border-neutral-200" style={fontHeading}>Symbol</th>
                            {uniqueDiameters.map((dia: any) => (
                                <th key={dia} className={`py-6 px-6 text-center text-base font-bold uppercase tracking-widest whitespace-nowrap ${selectedDia === dia ? 'text-yellow-700 bg-yellow-50 border-b-2 border-yellow-500' : 'text-neutral-500'}`} style={fontHeading}>
                                     {dia}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-sm font-mono">
                         {product.dimensional_specifications?.map((dim: any, idx: number) => (
                            <tr key={idx} className="hover:bg-neutral-50 transition-colors group">
                                    <td className="py-5 pl-8 text-neutral-800 font-bold text-sm uppercase tracking-wider sticky left-0 bg-white group-hover:bg-neutral-50 transition-colors border-r border-neutral-200 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)]" style={fontHeading}>
                                      {dim.label}
                                    </td>
                                    <td className="py-5 text-center text-yellow-600/90 font-serif italic font-bold bg-neutral-50/50 border-r border-neutral-200">{dim.symbol || '-'}</td>
                                    {uniqueDiameters.map((dia: any) => {
                                        let val = '-';
                                        if (dim.values && typeof dim.values === 'object') val = dim.values[dia] || '-';
                                        else if (dia === selectedDia) val = dim.value || '-';
                                        
                                        const isActive = selectedDia === dia;
                                        return (
                                            <td key={dia} className={`py-5 text-center transition-colors font-medium ${isActive ? 'bg-yellow-50 text-neutral-900 font-bold text-base shadow-[inset_0_0_20px_rgba(234,179,8,0.1)]' : 'text-neutral-500'}`}>
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
            <div className={`py-24 ${THEME.bg}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-6 mb-16">
                        <div className="h-px bg-neutral-200 flex-1"></div>
                        <h3 className={`text-3xl font-bold text-neutral-900 uppercase tracking-widest`} style={fontHeading}>Industry Applications</h3>
                        <div className="h-px bg-neutral-200 flex-1"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {product.applications.map((app: any, idx: number) => {
                            const appName = typeof app === 'string' ? app : app.name;
                            const appImage = typeof app === 'object' ? app.image : null;
                            const slugUrl = appName.toLowerCase().replace(/\s+/g, '-');

                            return (
                              <div key={idx} className="group h-72 [perspective:1000px]">
                                <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                                    <div className="absolute inset-0 bg-white border border-neutral-200 rounded-xl flex flex-col items-center justify-center p-8 [backface-visibility:hidden] hover:border-yellow-500 hover:shadow-lg transition-all">
                                        <Hash className="text-neutral-300 mb-6 group-hover:text-yellow-500 transition-colors" size={36} />
                                        <h4 className="text-neutral-900 text-lg font-bold uppercase tracking-widest text-center leading-relaxed" style={fontHeading}>{appName}</h4>
                                        <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-neutral-400 uppercase tracking-widest flex items-center gap-1 font-bold">
                                            Flip for Details <ChevronRight size={10} />
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-xl">
                                        {appImage ? (
                                            <>
                                                <img src={appImage} className="h-full w-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-110" />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-4">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setFullScreenAppImage(appImage); }}
                                                        className="text-white hover:text-yellow-400 transition-colors bg-white/10 p-2 rounded-full backdrop-blur-sm"
                                                    >
                                                        <Maximize2 size={24} />
                                                    </button>
                                                    <Link to={`/applications/${slugUrl}`} className="border border-white/40 bg-black/60 backdrop-blur px-5 py-2.5 rounded-md text-white text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 hover:border-yellow-500 hover:text-black transition-all" style={fontHeading}>
                                                        View Case Study
                                                    </Link>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-neutral-900">
                                                <Link to={`/applications/${slugUrl}`} className="text-yellow-500 text-xs font-bold uppercase tracking-widest border-b border-yellow-500 pb-1 hover:text-white hover:border-white transition-colors" style={fontHeading}>Read More</Link>
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
       
      <AnimatePresence>
        {fullScreenAppImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setFullScreenAppImage(null)}>
                <button className="absolute top-6 right-6 z-[10000] text-neutral-500 hover:text-black bg-white border border-neutral-200 p-3 rounded-full shadow-xl" onClick={() => setFullScreenAppImage(null)}><X size={24} /></button>
                <img src={fullScreenAppImage} className="max-w-full max-h-[85vh] object-contain rounded-lg border border-neutral-200 shadow-2xl" onClick={(e) => e.stopPropagation()} />
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;