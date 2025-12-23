import React from 'react';
import { 
  ArrowRight, Box, Settings, ShieldCheck, 
  Truck, Anchor, Activity, FileText, 
  Database, Zap, Award, CheckCircle2,
  FileCog, Crosshair, Microscope, Globe, MapPin, 
  Download, Phone, Layers, Cpu, Component
} from 'lucide-react';
import { Link } from 'react-router-dom';

const OEMPlatform: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#020617]/85 z-10"></div> 
          <video 
            autoPlay loop muted playsInline 
            className="w-full h-full object-cover opacity-40 grayscale"
            poster="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2070" 
          >
          </video>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-10 mix-blend-overlay"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-amber-500/30 bg-amber-500/5 rounded-full mb-8 backdrop-blur-md animate-pulse">
            <span className="text-xs font-mono text-amber-500 tracking-widest uppercase">
              Precision Fastening Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
            OEM FOUNDATION <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-600">
              ENGINEERED TO LAST.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            Rajkot's premier OEM platform for custom cold-forged fasteners. We don't just supply parts; we provide the <span className="text-white font-medium italic">structural integrity</span> your product depends on.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/rfq" className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-sm transition-all flex items-center justify-center gap-2 group">
              <FileCog size={20} className="group-hover:rotate-90 transition-transform duration-500"/> 
              GET TECHNICAL QUOTE
            </Link>
            <button className="px-8 py-4 border border-white/20 hover:bg-white/5 text-white font-mono text-sm tracking-wide rounded-sm transition-colors flex items-center justify-center gap-2">
              <Download size={18}/> 2025 SPEC SHEET
            </button>
          </div>
        </div>
      </section>

      {/* 2. PRODUCTION SCOPE (Enhanced Grid) */}
      <section className="py-24 px-6 relative bg-[#0F172A] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-l-4 border-amber-500 pl-6">
            <div>
              <h2 className="text-amber-500 font-mono text-sm mb-2 uppercase tracking-tighter">Manufacturing Limits</h2>
              <h3 className="text-4xl font-black text-white">Technical Baseline.</h3>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-800 border border-slate-800">
            {[
              { icon: Layers, label: "DIAMETER", value: "M1.2 — M24", sub: "Micro to Heavy Duty" },
              { icon: Activity, label: "TOLERANCE", value: "±0.01mm", sub: "Precision Precision" },
              { icon: Settings, label: "GRADES", value: "4.8 - 12.9", sub: "High Tensile Options" },
              { icon: ShieldCheck, label: "COATING", value: "1000h SST", sub: "Salt Spray Tested" },
            ].map((spec, i) => (
              <div key={i} className="p-10 bg-[#020617] hover:bg-slate-900 transition-colors group">
                <spec.icon className="text-amber-500 mb-6 group-hover:scale-110 transition-transform" size={24} />
                <p className="text-xs font-mono text-slate-500 mb-2 uppercase">{spec.label}</p>
                <p className="text-3xl font-bold text-white font-mono">{spec.value}</p>
                <p className="text-sm text-slate-600 mt-2">{spec.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HEAD & DRIVE PLATFORM (New Visual Section) */}
      <section className="py-24 px-6 bg-[#0b0f19]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="p-8 bg-slate-900/50 border border-white/5 rounded-2xl">
              <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Component className="text-amber-500" /> Head Styles
              </h4>
              <div className="grid grid-cols-3 gap-4 text-xs font-mono text-slate-400">
                {['Hexagon', 'Pan Head', 'Countersunk', 'Truss', 'Button', 'Socket Cap', 'Flange', 'Bugle', 'Custom'].map(h => (
                  <div key={h} className="p-3 border border-white/5 bg-black/40 text-center rounded hover:border-amber-500/50 transition-colors">{h}</div>
                ))}
              </div>
            </div>
            <div className="p-8 bg-slate-900/50 border border-white/5 rounded-2xl">
              <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Cpu className="text-blue-500" /> Drive Systems
              </h4>
              <div className="grid grid-cols-3 gap-4 text-xs font-mono text-slate-400">
                {['Phillips', 'Torx/Star', 'Allen/Hex', 'Slotted', 'Square', 'Pozi', 'Tri-Wing', 'One-Way', 'Security'].map(d => (
                  <div key={d} className="p-3 border border-white/5 bg-black/40 text-center rounded hover:border-blue-500/50 transition-colors">{d}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. QUALITY CONTROL HUB (Simulated Lab) */}
      <section className="py-24 bg-black relative">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="flex items-center gap-2 text-blue-500 font-bold mb-4">
              <Microscope size={22} />
              <span className="uppercase tracking-widest text-sm">Testing Protocol</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-6">Zero-Defect Philosophy.</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Our OEM platform includes an integrated quality lab. Every shipment is backed by a <span className="text-white">Full Dimensional Inspection Report</span> and <span className="text-white">Chemical Analysis.</span>
            </p>
            <div className="space-y-4">
              {["Material Traceability (MTC)", "Optical Sorting (100% sorting)", "Profile Projector Measurement", "Thread Ring/Plug Gauging"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300 bg-white/5 p-3 rounded-lg border border-white/5">
                  <CheckCircle2 className="text-green-500" size={18} /> {item}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[#0F172A] p-8 rounded-3xl border border-white/10 shadow-3xl">
              <div className="flex justify-between items-center mb-8">
                <div className="text-xs font-mono text-slate-500">REAL-TIME QC DATA</div>
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <div className="space-y-8">
                <div>
                   <div className="flex justify-between mb-2"><span className="text-sm">Batch Hardness (HRC)</span><span className="text-amber-500">32-38 OK</span></div>
                   <div className="h-1 bg-slate-800"><div className="h-full bg-amber-500 w-[88%]"></div></div>
                </div>
                <div>
                   <div className="flex justify-between mb-2"><span className="text-sm">Thread Pitch Accuracy</span><span className="text-blue-500">99.9%</span></div>
                   <div className="h-1 bg-slate-800"><div className="h-full bg-blue-500 w-[99%]"></div></div>
                </div>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-4">
                 <div className="bg-black/50 p-4 rounded border border-white/5 text-center">
                    <div className="text-2xl font-bold">1.67</div>
                    <div className="text-[10px] text-slate-500">Cpk INDEX</div>
                 </div>
                 <div className="bg-black/50 p-4 rounded border border-white/5 text-center">
                    <div className="text-2xl font-bold">12.9</div>
                    <div className="text-[10px] text-slate-500">MAX CLASS</div>
                 </div>
              </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-20 bg-amber-500">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-6">READY TO SCALE YOUR PRODUCTION?</h2>
          <p className="text-black/70 text-lg mb-10 font-medium italic">"High precision fasteners delivered from Rajkot to the world."</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="px-12 py-5 bg-black text-white font-bold rounded shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
              <Phone size={20}/> TALK TO AN ENGINEER
            </button>
            <button className="px-12 py-5 border-2 border-black text-black font-bold rounded hover:bg-black/5 transition-all">
              REQUEST FREE SAMPLE KIT
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OEMPlatform;