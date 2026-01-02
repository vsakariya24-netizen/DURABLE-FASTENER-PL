import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  ArrowRight, Box, Settings, ShieldCheck, 
  Truck, Anchor, Activity, FileText, 
  Database, Zap, Award, CheckCircle2,
  FileCog, Crosshair, Microscope, Globe, MapPin, 
  Download, Phone, Layers, Cpu, Component
} from 'lucide-react';
import { Link } from 'react-router-dom';

const OEMPlatform: React.FC = () => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase.from('oem_content').select('*').single();
      if (data) setContent(data);
    } catch (error) {
      console.error("Error fetching OEM content", error);
    } finally {
      setLoading(false);
    }
  };

  // --- ULTIMATE CLEANING FUNCTION ---
  const getCleanData = (input: any) => {
    let clean = { name: '', img: '' };

    const unwrap = (val: any): any => {
      if (typeof val === 'string' && val.trim().startsWith('{')) {
        try { return unwrap(JSON.parse(val)); } 
        catch { return val; }
      }
      return val;
    };

    const unwrappedInput = unwrap(input);

    if (typeof unwrappedInput === 'object' && unwrappedInput !== null) {
      clean.name = unwrappedInput.name || '';
      clean.img = unwrappedInput.img || '';

      const nestedData = unwrap(clean.name);
      if (typeof nestedData === 'object' && nestedData !== null) {
         if (nestedData.name) clean.name = nestedData.name;
         if (nestedData.img) clean.img = nestedData.img; 
      }
    } else {
      clean.name = String(unwrappedInput);
    }

    return clean;
  };
  // -----------------------------------------------------------

  // --- TECHNICAL SPECS CONFIG ---
  interface TechnicalSpecItem {
    label: string;
    value: string;
    icon: any;
    colSpan: string;
    highlight: boolean;
  }

  const specs = content?.technical_specs || {};
  
  const newTechnicalSpecs: TechnicalSpecItem[] = [
    {
      label: "Material Spec",
      value: specs.material || "MS & SS",
      icon: Component,
      colSpan: "md:col-span-1",
      highlight: false
    },
    {
      label: "Diameter Range",
      value: specs.diameter || "2.2mm - 5.5mm",
      icon: Crosshair,
      colSpan: "md:col-span-1",
      highlight: false
    },
    {
      label: "Length Range",
      value: specs.length || "4.5mm - 125mm",
      icon: MapPin,
      colSpan: "md:col-span-1",
      highlight: false
    },
    {
      label: "Thread Type",
      value: specs.thread || "Fine, Coarse & Metric",
      icon: Settings,
      colSpan: "md:col-span-1",
      highlight: false
    },
    {
      label: "Surface Finish Capabilities",
      value: specs.finish || "Black Phosphate, Zinc...",
      icon: ShieldCheck,
      colSpan: "md:col-span-2",
      highlight: true
    }
  ];

  const liveHeadStyles = content?.head_styles || [];
  const liveDriveSystems = content?.drive_systems || [];

  if (loading) return <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-white">Loading OEM Platform...</div>;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#020617]/90 z-10"></div> 
          <video 
            autoPlay loop muted playsInline 
            className="w-full h-full object-cover opacity-30 grayscale"
            poster={content?.hero_video_url}
            src={content?.hero_video_url} 
          >
          </video>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-blue-500/30 bg-blue-500/5 rounded-full mb-8 backdrop-blur-md">
            <span className="text-xs font-mono text-blue-400 tracking-widest uppercase font-bold">
              Durable Fasteners Pvt Ltd | Precision Engineering
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
             {content?.hero_title || "OEM FOUNDATION"} 
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            {content?.hero_subtitle || "Rajkot's premier platform for custom cold-forged fasteners."}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/rfq" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-sm transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/20">
              <FileCog size={20} className="group-hover:rotate-90 transition-transform duration-500"/> 
              GET TECHNICAL QUOTE
            </Link>
            <button className="px-8 py-4 border border-white/20 hover:bg-white/5 text-white font-mono text-sm tracking-wide rounded-sm transition-colors flex items-center justify-center gap-2">
              <Download size={18}/> 2025 SPEC SHEET
            </button>
          </div>
        </div>
      </section>

      {/* 2. PRODUCTION SCOPE */}
      <section className="py-24 px-6 relative bg-[#0b0f19]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="border-l-4 border-blue-600 pl-6">
              <h2 className="text-blue-500 font-mono text-sm mb-2 uppercase tracking-tighter font-bold">Factory Capabilities</h2>
              <h3 className="text-5xl font-black text-white tracking-tight">Technical Baseline.</h3>
            </div>
            <div className="hidden md:block text-right">
               <div className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-1">Last Audit: 2025</div>
               <div className="flex items-center gap-2 text-green-400 font-bold font-mono text-sm justify-end">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> OPERATIONAL
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newTechnicalSpecs.map((spec, i) => (
              <div 
                key={i} 
                className={`
                  relative overflow-hidden rounded-2xl p-8 group transition-all duration-300
                  ${spec.colSpan}
                  ${spec.highlight 
                    ? 'bg-gradient-to-br from-blue-900/40 to-[#020617] border border-blue-500/30' 
                    : 'bg-[#0F172A]/50 border border-white/5 hover:border-blue-500/30 hover:bg-[#0F172A]'}
                `}
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all duration-500"></div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex flex-col gap-2">
                        <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${spec.highlight ? 'text-blue-300' : 'text-slate-500'}`}>
                          {spec.label}
                        </span>
                    </div>
                    <spec.icon className={`${spec.highlight ? 'text-blue-400' : 'text-slate-600'} group-hover:text-blue-500 transition-colors`} size={24} />
                  </div>

                  <div>
                    <h4 className={`font-mono font-medium text-white leading-tight ${spec.highlight ? 'text-xl md:text-2xl' : 'text-3xl'}`}>
                      {spec.value}
                    </h4>
                    {!spec.highlight && (
                      <div className="w-8 h-1 bg-blue-600/50 mt-4 rounded-full group-hover:w-16 transition-all duration-300"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HEAD & DRIVE PLATFORM (MAJOR UPDATE FOR IMAGE VISIBILITY) */}
      <section className="py-24 px-6 bg-[#0b0f19] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* --- Head Styles Section --- */}
            <div className="p-8 bg-slate-900/40 border border-white/5 rounded-3xl backdrop-blur-md">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <Component className="text-blue-400" size={28} />
                </div>
                <div>
                   <h4 className="text-2xl font-black text-white tracking-tight uppercase">Head Styles</h4>
                   <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">Forming Capabilities</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                {liveHeadStyles.map((item: any, i: number) => {
                  const { name, img } = getCleanData(item);

                  return (
                    <div 
                      key={i} 
                      className="group flex items-center gap-4 p-4 border border-white/5 bg-[#0F172A] rounded-2xl hover:border-blue-500/40 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-blue-900/20"
                    >
                      {/* Bigger Image Container with Glow Effect like uploaded image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-[#0b0f19] rounded-xl border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.8)] transition-all duration-500 relative overflow-hidden">
                        
                        {img ? (
                          <img 
                            src={img} 
                            alt={name} 
                            className="w-10 h-10 sm:w-14 sm:h-14 object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" 
                          />
                        ) : (
                          <Component size={24} className="text-blue-900" />
                        )}
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-blue-400 transition-colors">
                          {name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono mt-1 group-hover:text-slate-400">
                          STD-ISO
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* --- Drive Systems Section --- */}
            <div className="p-8 bg-slate-900/40 border border-white/5 rounded-3xl backdrop-blur-md">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <Cpu className="text-emerald-400" size={28} />
                </div>
                 <div>
                   <h4 className="text-2xl font-black text-white tracking-tight uppercase">Drive Systems</h4>
                   <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">Torque Profiles</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                {liveDriveSystems.map((item: any, i: number) => {
                  const { name, img } = getCleanData(item);
                  
                  return (
                    <div 
                      key={i} 
                      className="group flex items-center gap-4 p-4 border border-white/5 bg-[#0F172A] rounded-2xl hover:border-emerald-500/40 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-emerald-900/20"
                    >
                      {/* Bigger Image Container with Glow Effect */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-[#0b0f19] rounded-xl border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(16,185,129,0.5)] group-hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.8)] transition-all duration-500 relative overflow-hidden">
                        
                        {img ? (
                          <img 
                            src={img} 
                            alt={name} 
                            className="w-10 h-10 sm:w-14 sm:h-14 object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" 
                          />
                        ) : (
                          <Cpu size={24} className="text-emerald-900" />
                        )}
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
                          {name}
                        </span>
                         <span className="text-[10px] text-slate-500 font-mono mt-1 group-hover:text-slate-400">
                          PRECISION
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. QUALITY CONTROL HUB */}
      <section className="py-24 bg-black relative">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="flex items-center gap-2 text-blue-500 font-bold mb-4">
              <Microscope size={22} />
              <span className="uppercase tracking-widest text-sm">Testing Protocol</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-6">Zero-Defect Philosophy.</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Every shipment is backed by a <span className="text-white font-bold">Full Dimensional Inspection Report</span> and <span className="text-white font-bold">Chemical Analysis</span> conducted in our in-house lab.
            </p>
            <div className="space-y-4">
              {["Material Traceability (MTC)", "Optical Sorting (100% sorting)", "Profile Projector Measurement", "Thread Ring/Plug Gauging"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-200 bg-white/5 p-4 rounded-lg border border-white/5 font-medium">
                  <CheckCircle2 className="text-blue-500" size={20} /> {item}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[#0F172A] p-8 rounded-3xl border border-white/10 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <div className="text-xs font-mono text-slate-500 font-bold uppercase tracking-widest">Live Quality Analytics</div>
                <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
              </div>
              <div className="space-y-8">
                <div>
                    <div className="flex justify-between mb-2"><span className="text-sm font-bold">Batch Hardness (HRC)</span><span className="text-blue-400 font-mono">32-38 OK</span></div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[88%] transition-all duration-1000"></div></div>
                </div>
                <div>
                    <div className="flex justify-between mb-2"><span className="text-sm font-bold">Thread Pitch Accuracy</span><span className="text-blue-400 font-mono">99.9%</span></div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-400 w-[99.9%] transition-all duration-1000"></div></div>
                </div>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-4">
                 <div className="bg-black/50 p-6 rounded-xl border border-white/5 text-center">
                   <div className="text-3xl font-black text-white">{content?.qa_cpk || '1.67'}</div>
                   <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">Cpk INDEX</div>
                 </div>
                 <div className="bg-black/50 p-6 rounded-xl border border-white/5 text-center">
                   <div className="text-3xl font-black text-white">{content?.qa_max_class || '12.9'}</div>
                   <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">MAX CLASS</div>
                 </div>
              </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-[#0b0f19] mb-6">READY TO SCALE?</h2>
          <p className="text-slate-600 text-xl mb-12 font-medium">"Premium fasteners delivered from Durable Fasteners Pvt Ltd (Rajkot) to the global market."</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="px-12 py-5 bg-blue-600 text-white font-black rounded-sm shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 text-lg">
              <Phone size={22}/> TALK TO AN ENGINEER
            </button>
            <button className="px-12 py-5 border-2 border-[#0b0f19] text-[#0b0f19] font-black rounded-sm hover:bg-[#0b0f19] hover:text-white transition-all text-lg">
              REQUEST SAMPLE KIT
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OEMPlatform;