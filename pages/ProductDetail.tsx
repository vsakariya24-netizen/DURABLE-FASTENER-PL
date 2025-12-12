import React, { useState, useMemo, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ChevronRight, ShoppingCart, Loader2, Share2, Printer, 
  Settings, FileText, Check, Ruler, Maximize2, Info, ArrowRight, X 
} from 'lucide-react';
import { PRODUCTS as STATIC_PRODUCTS } from '../constants';
import MagicZoomClone from '../components/MagicZoomClone'; 

const { useParams, Link } = ReactRouterDOM;

// --- STYLING CONSTANTS ---
const BRAND_ACCENT = "amber-500";
const BRAND_PRIMARY_TEXT = "slate-900";
const BRAND_SECONDARY_TEXT = "slate-600";

const blueprintGridStyle = {
  backgroundColor: '#f8fafc', 
  backgroundImage: `
    linear-gradient(to right, rgba(203, 213, 225, 0.4) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(203, 213, 225, 0.4) 1px, transparent 1px)
  `,
  backgroundSize: '20px 20px'
};

// --- NEW COMPONENT: Technical Blueprint Screw ---
// This component now accurately represents the CSK head and the wireframe/solid style from your images.
const CleanScrew = ({ lengthMm, isSelected }: { lengthMm: number, isSelected: boolean }) => {
  // CONFIGURATION
  const scaleMultiplier = 2.8; // How much pixel height per mm
  const headHeight = 10;       // Height of the CSK head part
  const tipHeight = 6;         // Height of the pointy tip
  const totalWidth = 32;       // Total width of the SVG canvas
  
  const bodyHeight = lengthMm * scaleMultiplier; 
  const totalHeight = headHeight + bodyHeight + tipHeight;

  return (
    <div 
      className="flex flex-col items-center justify-start transition-all duration-300 ease-out" 
      style={{ height: `${totalHeight}px` }}
    >
      <svg 
        width={totalWidth} 
        height={totalHeight} 
        viewBox={`0 0 ${totalWidth} ${totalHeight}`} 
        className="overflow-visible"
      >
        <defs>
          {/* DEFINING THE HATCH PATTERN (The "Technical Drawing" Look) */}
          {/* A unique ID is needed per screw to avoid pattern conflicts */}
          <pattern 
            id={`techHatch-${lengthMm}`} 
            patternUnits="userSpaceOnUse" 
            width="4" 
            height="4" 
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="4" stroke="#94a3b8" strokeWidth="1" />
          </pattern>
        </defs>

        <g className="transition-all duration-300">
            {/* 1. CSK SCREW HEAD (Trapezoid Shape) */}
            <path 
                d={`M2,0 L${totalWidth-2},0 L${totalWidth-8},${headHeight} L8,${headHeight} Z`} 
                className={`transition-colors duration-300 ${
                    isSelected 
                    ? 'fill-amber-500 stroke-amber-600' 
                    : 'fill-white stroke-slate-400'
                }`}
                strokeWidth="1.5"
            />
            {/* Head Detail Lines (Top/Side view hint) */}
            <line x1="2" y1="0" x2="2" y2="2" stroke={isSelected ? "#b45309" : "#cbd5e1"} strokeWidth="1" />
            <line x1={totalWidth-2} y1="0" x2={totalWidth-2} y2="2" stroke={isSelected ? "#b45309" : "#cbd5e1"} strokeWidth="1" />

            {/* 2. SCREW BODY (Main Shaft) */}
            <rect 
                x={totalWidth/2 - 5} 
                y={headHeight} 
                width="10" 
                height={bodyHeight} 
                className={`transition-colors duration-300 ${
                    isSelected 
                    ? 'fill-amber-500 stroke-amber-600' 
                    : `fill-[url(#techHatch-${lengthMm})] stroke-slate-400` // Apply Pattern here
                }`}
                strokeWidth="1.5"
            />

            {/* 3. SCREW TIP (Pointy) */}
            <path 
                d={`
                    M${totalWidth/2 - 5},${headHeight + bodyHeight} 
                    L${totalWidth/2 + 5},${headHeight + bodyHeight} 
                    L${totalWidth/2},${headHeight + bodyHeight + tipHeight} 
                    Z
                `}
                className={`transition-colors duration-300 ${
                    isSelected 
                    ? 'fill-amber-500 stroke-amber-600' 
                    : 'fill-white stroke-slate-400'
                }`}
                strokeWidth="1.5"
            />
            
            {/* 4. GLOSSY HIGHLIGHT (Only visible when selected solid screw) */}
            {isSelected && (
                <path 
                    d={`M${totalWidth/2 - 2},${headHeight + 4} L${totalWidth/2 - 2},${headHeight + bodyHeight - 4}`} 
                    stroke="rgba(255,255,255,0.4)" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                />
            )}
        </g>
      </svg>
    </div>
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Rajdhani:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!slug) throw new Error("No product slug");
        const { data: productData, error: productError } = await supabase.from('products').select('*').eq('slug', slug).single();

        if (productError) {
           const staticP = STATIC_PRODUCTS.find(p => p.slug === slug);
           if (staticP) { setProduct(staticP); setLoading(false); return; }
           throw productError;
        }

        const { data: vData } = await supabase.from('product_variants').select('*').eq('product_id', productData.id);
        const apps = Array.isArray(productData.applications) ? productData.applications : [];
        const specs = Array.isArray(productData.specifications) ? productData.specifications : [];
        const dimSpecs = Array.isArray(productData.dimensional_specifications) ? productData.dimensional_specifications : [];

        const fullProduct = { ...productData, applications: apps, variants: vData || [], specifications: specs, dimensional_specifications: dimSpecs };
        setProduct(fullProduct);
        
        if (vData && vData.length > 0) {
            const dias = Array.from(new Set(vData.map((v: any) => v.diameter).filter(Boolean))).sort();
            if (dias.length > 0) setSelectedDia(dias[0] as string);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchProduct();
  }, [slug]);

  const uniqueDiameters = useMemo(() => {
      if (!product?.variants) return [];
      const dias = new Set(product.variants.map((v: any) => v.diameter).filter(Boolean));
      return Array.from(dias).sort(); 
  }, [product]);

  const availableLengths = useMemo(() => {
      if (!product?.variants || !selectedDia) return [];
      
      const rawLengths = product.variants
        .filter((v: any) => v.diameter === selectedDia)
        .map((v: any) => v.length)
        .filter(Boolean);

      const flatLengths = new Set<string>();
      rawLengths.forEach((len: string) => {
        if (len.includes(',')) {
            len.split(',').map(l => l.trim()).forEach(l => flatLengths.add(l));
        } else {
            flatLengths.add(len);
        }
      });

      return Array.from(flatLengths).sort((a: any, b: any) => parseInt(a) - parseInt(b)); 
  }, [product, selectedDia]);

  useEffect(() => {
      if (availableLengths.length > 0 && !availableLengths.includes(selectedLen)) setSelectedLen(availableLengths[0]);
      else if (availableLengths.length === 0) setSelectedLen('');
  }, [selectedDia, availableLengths]);

  const availableFinishes = useMemo(() => {
      if (!product?.variants) return [];
      const relevantVariants = product.variants.filter((v: any) => 
        v.diameter === selectedDia && 
        (v.length === selectedLen || (v.length && v.length.includes(selectedLen))) 
      );
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

  return (
    <div className="bg-slate-50 min-h-screen pb-24" style={fontBody}>
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm bg-opacity-90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-500" style={fontHeading}>
              <Link to="/products" className={`hover:text-${BRAND_ACCENT}`}>Catalog</Link> <ChevronRight size={12} className="mx-2" /> <span>{product.name}</span>
            </div>
            <div className="flex gap-2 text-slate-400"><button className="p-2 hover:bg-slate-100 rounded-full"><Share2 size={18} /></button><button className="p-2 hover:bg-slate-100 rounded-full"><Printer size={18} /></button></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7 flex flex-col gap-8">
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl border border-slate-200 p-8 h-[500px] flex items-center justify-center group z-10">
                  <div className="absolute top-6 left-6 z-20 px-4 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-md shadow-md" style={fontHeading}>Premium Series</div>
                  <div className="relative z-10 w-full h-full flex items-center justify-center"><MagicZoomClone src={currentImage} zoomSrc={currentImage} alt={product.name} zoomLevel={2.5} glassSize={isMobile ? 120 : 220} className="max-h-full max-w-full object-contain" /></div>
              </div>
              
              <div className="flex gap-4 overflow-x-auto py-4 px-1 no-scrollbar justify-center lg:justify-start">
                {displayImages.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedImageIndex(idx)} 
                    className={`relative w-24 h-24 rounded-xl bg-white overflow-hidden p-2 border transition-all duration-300 ${
                        selectedImageIndex === idx 
                        ? `border-${BRAND_ACCENT} ring-2 ring-offset-2 ring-${BRAND_ACCENT} shadow-lg scale-105 opacity-100` 
                        : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-contain" alt="thumbnail" />
                  </button>
                ))}
              </div>
          </div>

          <div className="lg:col-span-5 flex flex-col h-full sticky top-24 space-y-8">
              <div><h1 className={`text-4xl md:text-5xl font-extrabold text-${BRAND_PRIMARY_TEXT} tracking-tight uppercase mb-4`} style={fontHeading}>{product.name}</h1><p className={`text-${BRAND_SECONDARY_TEXT} text-lg leading-relaxed font-light border-l-4 border-${BRAND_ACCENT} pl-4`}>{product.short_description}</p></div>
              <hr className="border-slate-200" />
              
              {/* --- TECHNICAL SELECTION PANEL --- */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-10">
                
                {/* 1. DIAMETER */}
                <div className="space-y-4">
                  <span className={`text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 pl-1`} style={fontHeading}>
                      <div className="w-1.5 h-4 bg-amber-500 rounded-sm"></div> Diameter (Ø)
                  </span>
                  
                  <div className="flex flex-wrap gap-4">
                      {uniqueDiameters.map((dia: any) => {
                          const isSelected = selectedDia === dia;
                          return (
                            <button 
                                key={dia} 
                                onClick={() => setSelectedDia(dia)} 
                                className={`
                                    relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300
                                    ${isSelected 
                                        ? `bg-slate-900 text-white shadow-lg scale-110` 
                                        : `bg-white border border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-500`
                                    }
                                `}
                            >
                                <div className={`absolute inset-1 rounded-full border border-dashed transition-colors ${isSelected ? 'border-slate-600' : 'border-slate-300'}`}></div>
                                <span className="font-bold text-sm font-rajdhani z-10">{dia}</span>
                                {isSelected && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center shadow-md z-20">
                                        <Check size={10} strokeWidth={4} className="text-white" />
                                    </div>
                                )}
                            </button>
                          );
                      })}
                  </div>
                </div>

                {/* 2. LENGTH (L) - The "Staircase" Sequence Layout */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end pl-1">
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={fontHeading}>
                          <div className="w-4 h-1.5 bg-amber-500 rounded-sm"></div> Length (L)
                      </span>
                      <span className="text-xs font-mono text-slate-400 font-bold">
                          {selectedLen ? `${selectedLen} mm` : ''}
                      </span>
                  </div>

                  {/* Container: ITEMS-START creates the "Hanging" effect from the top */}
                  <div className="relative w-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner h-64 flex items-start select-none" style={blueprintGridStyle}>
                      
                      {/* Scrollable Area */}
                      <div className="flex items-start gap-1 px-6 overflow-x-auto w-full h-full no-scrollbar snap-x cursor-grab active:cursor-grabbing pt-6 pb-4">
                          {availableLengths.length > 0 ? availableLengths.map((len: any) => {
                              const isSelected = selectedLen === len;
                              const numericLen = parseInt(len);
                              
                              return (
                                  <button 
                                      key={len} 
                                      onClick={() => setSelectedLen(len)}
                                      // items-start aligns the content to the top of the button container
                                      className="relative flex-shrink-0 flex flex-col items-center justify-start min-w-[55px] group transition-all duration-300 snap-center outline-none h-full"
                                  >
                                      {/* --- SCREW COMPONENT (Hanging from top) --- */}
                                      <div className={`transition-transform duration-300 origin-top ${isSelected ? 'scale-105 z-10' : 'scale-100 opacity-80 hover:opacity-100'}`}>
                                         <CleanScrew lengthMm={numericLen} isSelected={isSelected} />
                                      </div>

                                      {/* --- LABEL BOX (Matches the "Box below tip" style in images) --- */}
                                      <div className={`
                                          mt-2 text-[10px] font-bold font-mono transition-all duration-300
                                          px-2 py-0.5 rounded border
                                          ${isSelected 
                                              ? 'bg-amber-100 text-amber-700 border-amber-300 shadow-sm translate-y-1 scale-110' 
                                              : 'bg-transparent text-slate-400 border-transparent group-hover:text-slate-600'
                                          }
                                      `}>
                                          {numericLen}
                                      </div>
                                      
                                      {/* Dashed Guide Line (Technical Drawing Feel) */}
                                      <div className={`
                                        absolute top-0 bottom-0 w-px border-l border-dashed transition-opacity duration-300 -z-10 left-1/2
                                        ${isSelected ? 'border-amber-200 opacity-100' : 'border-slate-300 opacity-0 group-hover:opacity-20'}
                                      `}></div>

                                  </button>
                              )
                          }) : (
                             <div className="w-full mt-24 text-center text-xs text-slate-400 italic">Select a Diameter first</div>
                          )}
                          <div className="min-w-[40px]"></div>
                      </div>
                      
                      {/* Edges Fade for visual polish */}
                      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-20"></div>
                      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-20"></div>
                  </div>
                </div>

                {/* 3. FINISH OPTIONS */}
                <div className="space-y-4">
                    <span className={`text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 pl-1`} style={fontHeading}>
                          <div className="w-1.5 h-1.5 bg-amber-500 rotate-45 rounded-sm"></div> Finish Options
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {availableFinishes.map((finish: any) => (
                            <button key={finish} onClick={() => handleFinishClick(finish)} className={`px-5 py-2 text-xs font-bold uppercase tracking-wider border rounded-lg transition-all ${activeImageOverride === product.finish_images?.[finish] ? `border-${BRAND_ACCENT} text-${BRAND_PRIMARY_TEXT} bg-amber-50 ring-1 ring-${BRAND_ACCENT}` : `border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm`}`} style={fontHeading}>{finish}</button>
                        ))}
                    </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4"><Link to="/contact" className={`flex-1 bg-${BRAND_ACCENT} hover:bg-amber-600 transition-colors text-white text-center py-4 rounded-lg font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-3`} style={fontHeading}><ShoppingCart size={20} /> Request Quote</Link><button className={`flex-1 bg-white hover:bg-slate-50 text-${BRAND_PRIMARY_TEXT} border-2 border-slate-200 py-4 rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-colors`} style={fontHeading}><FileText size={20} /> Spec Sheet</button></div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-slate-100 relative z-20 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24 items-start">
            <div className="flex flex-col h-full">
              <h3 className={`text-2xl font-bold text-${BRAND_PRIMARY_TEXT} mb-6 flex items-center gap-3 uppercase tracking-wider`} style={fontHeading}>
                <Settings className={`text-${BRAND_ACCENT}`} /> Product Attributes
              </h3>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-grow flex flex-col">
                <div className="divide-y divide-slate-100">
                  {product.material && (
                    <div className="grid grid-cols-[140px_1fr] p-6 hover:bg-slate-50 transition-colors group">
                      <div className="text-slate-400 text-xs font-bold uppercase tracking-widest pt-1">Material</div>
                      <div className="flex flex-col gap-2">
                        {product.material.split(/\s*\|\s*(?![^()]*\))/g).map((mat: string, idx: number) => (
                           <div key={idx} className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-slate-800' : 'bg-slate-400'}`}></div>
                             <span className="text-slate-800 font-semibold font-rajdhani text-lg">{mat.trim()}</span>
                           </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.head_type && <SimpleSpecRow label="Head Type" value={product.head_type} />}
                  {product.drive_type && <SimpleSpecRow label="Drive Type" value={product.drive_type} />}
                  {product.thread_type && <SimpleSpecRow label="Thread Type" value={product.thread_type} />}
                  {product.specifications && product.specifications.map((spec: any, idx: number) => (
                      <SimpleSpecRow key={idx} label={spec.key} value={spec.value} />
                  ))}
                </div>
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 mt-auto">
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                        <Info size={14} /> All specifications are subject to manufacturing tolerances.
                    </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold text-${BRAND_PRIMARY_TEXT} flex items-center gap-3 uppercase tracking-wider`} style={fontHeading}>
                    <Ruler className={`text-${BRAND_ACCENT}`} /> Dimensions
                </h3>
                <span className="text-[10px] font-extrabold bg-amber-100 text-amber-700 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-widest shadow-sm">ISO Standard</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-300 shadow-lg overflow-hidden ring-1 ring-slate-900/5">
                <div className="relative h-[300px] border-b border-slate-200 overflow-hidden group flex items-center justify-center relative" style={blueprintGridStyle}>
                   <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-300 opacity-50 border-l border-dashed border-slate-400"></div>
                   <div className="absolute bottom-4 left-0 right-0 h-px bg-slate-300 opacity-50 border-t border-dashed border-slate-400"></div>
                   {product.technical_drawing ? (
                       <>
                         <img src={product.technical_drawing} alt="Dimensional Drawing" className="relative z-10 h-[200%] w-auto object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                         <button className="absolute bottom-3 right-3 bg-white p-2 rounded-lg shadow-sm text-slate-400 hover:text-slate-800 hover:shadow-md transition-all border border-slate-200">
                            <Maximize2 size={18} />
                         </button>
                       </>
                   ) : (
                       <div className="text-sm text-slate-400 italic font-medium bg-white/50 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-200">No technical drawing available</div>
                   )}
                </div>
                <div className="bg-white">
                  <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-slate-50/80 border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <div className="col-span-5">Feature</div><div className="col-span-3 text-center">Symbol</div><div className="col-span-4 text-right">Value (mm)</div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {product.dimensional_specifications && product.dimensional_specifications.length > 0 ? (
                        product.dimensional_specifications.map((dim: any, idx: number) => (
                            <div key={idx} className="grid grid-cols-12 gap-2 px-6 py-3.5 items-center hover:bg-amber-50/40 transition-colors group">
                                <div className="col-span-5 text-xs font-bold text-slate-700 uppercase tracking-wider group-hover:text-slate-900">{dim.label}</div>
                                <div className="col-span-3 text-center text-sm font-serif italic text-slate-500 font-medium">{renderSymbol(dim.symbol)}</div>
                                <div className="col-span-4 text-right text-sm font-bold text-slate-800" style={fontMono}>{dim.value}</div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-xs text-slate-400 italic">No dimensional specifications found.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

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
        </div>
      </div>
      
      <footer className="bg-white py-10 border-t border-slate-200 text-center text-slate-400 text-sm font-medium" style={fontBody}>
        <p>&copy; {new Date().getFullYear()} Durable Fastener Pvt. Ltd. All rights reserved.</p>
      </footer>

      {fullScreenAppImage && (
        <div 
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setFullScreenAppImage(null)}
        >
            <button 
                className="absolute top-6 right-6 z-[10000] bg-white text-slate-900 rounded-full p-2 hover:scale-110 transition-all shadow-xl hover:bg-slate-200"
                onClick={(e) => {
                    e.stopPropagation();
                    setFullScreenAppImage(null);
                }}
            >
                <X size={32} strokeWidth={3} />
            </button>
            <img 
                src={fullScreenAppImage} 
                alt="Full View" 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl scale-100 animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()} 
            />
        </div>
      )}
    </div>
  );
};

const SimpleSpecRow: React.FC<{label: string, value: string}> = ({label, value}) => (
    <div className="grid grid-cols-[140px_1fr] px-6 py-4 hover:bg-slate-50 transition-colors items-center">
        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">{label}</div>
        <div className="text-slate-800 font-semibold font-rajdhani text-lg">{value}</div>
    </div>
);

const renderSymbol = (sym: string) => {
    if (!sym) return "-";
    if (sym.includes('_')) { 
        const [base, sub] = sym.split('_'); 
        return <>{base}<sub className="text-[10px] ml-0.5 relative -bottom-0.5">{sub}</sub></>; 
    }
    return sym;
};

export default ProductDetail;