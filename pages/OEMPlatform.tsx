import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Adjust path to your supabase client
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

  // Helper icons map (to keep the dynamic loop working for manufacturing limits)
  const iconMap: any = {
    "DIAMETER": Layers,
    "TOLERANCE": Activity,
    "GRADES": Settings,
    "COATING": ShieldCheck
  };

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
          >
             {/* If you want to make the actual video file dynamic, you can add a field for it too */}
          </video>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-blue-500/30 bg-blue-500/5 rounded-full mb-8 backdrop-blur-md">
            <span className="text-xs font-mono text-blue-400 tracking-widest uppercase font-bold">
              Durable Fasteners Pvt Ltd | Precision Engineering
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
             {/* Split title logic: This assumes standard format, or you can just dump the whole string */}
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
      <section className="py-24 px-6 relative bg-[#0F172A] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-l-4 border-blue-600 pl-6">
            <div>
              <h2 className="text-blue-500 font-mono text-sm mb-2 uppercase tracking-tighter font-bold">Manufacturing Limits</h2>
              <h3 className="text-4xl font-black text-white">Technical Baseline.</h3>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-800 border border-slate-800">
            {content?.mfg_limits?.map((spec: any, i: number) => {
              const IconComponent = iconMap[spec.label] || Layers; // Fallback icon
              return (
                <div key={i} className="p-10 bg-[#020617] hover:bg-slate-900 transition-colors group">
                  <IconComponent className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={24} />
                  <p className="text-xs font-mono text-slate-500 mb-2 uppercase font-bold">{spec.label}</p>
                  <p className="text-3xl font-bold text-white font-mono">{spec.value}</p>
                  <p className="text-sm text-slate-600 mt-2">{spec.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. HEAD & DRIVE PLATFORM */}
      <section className="py-24 px-6 bg-[#0b0f19]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Head Styles Card */}
            <div className="p-10 bg-slate-900/40 border border-white/10 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
                <div className="p-3 bg-blue-600/10 rounded-lg">
                  <Component className="text-blue-500" size={28} />
                </div>
                <h4 className="text-3xl font-black text-white tracking-tight uppercase">
                  Head Styles
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {content?.head_styles?.map((h: string) => (
                  <div key={h} className="group flex items-center justify-center p-5 border border-white/10 bg-white/5 text-center rounded-lg hover:border-blue-500 hover:bg-blue-600/10 transition-all duration-300">
                    <span className="text-sm md:text-base font-bold text-slate-300 group-hover:text-white uppercase tracking-wider">
                      {h}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Drive Systems Card */}
            <div className="p-10 bg-slate-900/40 border border-white/10 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
                <div className="p-3 bg-blue-600/10 rounded-lg">
                  <Cpu className="text-blue-400" size={28} />
                </div>
                <h4 className="text-3xl font-black text-white tracking-tight uppercase">
                  Drive Systems
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {content?.drive_systems?.map((d: string) => (
                  <div key={d} className="group flex items-center justify-center p-5 border border-white/10 bg-white/5 text-center rounded-lg hover:border-blue-400 hover:bg-blue-600/10 transition-all duration-300">
                    <span className="text-sm md:text-base font-bold text-slate-300 group-hover:text-white uppercase tracking-wider">
                      {d}
                    </span>
                  </div>
                ))}
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

      {/* 5. CALL TO ACTION (Static for now, but easy to make dynamic if needed) */}
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