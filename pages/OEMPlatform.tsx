import React from 'react';
import { 
  ArrowRight, Box, Settings, ShieldCheck, 
  Truck, Anchor, Activity, FileText, 
  Database, Zap, Award, CheckCircle2,
  FileCog, Crosshair, Microscope, Globe, MapPin, 
  Download, Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';

const OEMPlatform: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
      
      {/* ---------------- 1. HERO SECTION: INDUSTRIAL AUTHORITY ---------------- */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        
        {/* VIDEO BACKGROUND LAYER */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#020617]/85 z-10"></div> 
          {/* TIP: Replace the poster with a high-quality image of your machine shop */}
          <video 
            autoPlay loop muted playsInline 
            className="w-full h-full object-cover opacity-40 grayscale scale-105"
            poster="https://images.unsplash.com/photo-1565439396693-160756779435?q=80&w=2070&auto=format&fit=crop" 
          >
            {/* <source src="/assets/factory-loop.mp4" type="video/mp4" /> */}
          </video>
          
          {/* Cinematic Grain Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-10 mix-blend-overlay"></div>
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center mt-10">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-amber-500/30 bg-amber-500/5 rounded-full mb-8 backdrop-blur-md animate-fade-in-up">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-xs font-mono text-amber-500 tracking-widest uppercase">
              Rajkot Manufacturing Hub
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.95]">
            BUILT FOR <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-600">
              EXTREME TORQUE.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Tier-1 OEM Partner for Automotive & Industrial Fasteners. 
            From <span className="text-white font-medium border-b border-amber-500/50">Wire Drawing</span> to <span className="text-white font-medium border-b border-amber-500/50">Final Plating</span>—all under one roof.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/rfq" className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-sm transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <FileCog size={20} className="group-hover:rotate-12 transition-transform"/> 
              Upload CAD for Audit
            </Link>
            <button className="px-8 py-4 border border-white/20 hover:bg-white/5 text-white font-mono text-sm tracking-wide rounded-sm transition-colors flex items-center justify-center gap-2 group">
              <Download size={18} className="group-hover:translate-y-1 transition-transform"/>
              DOWNLOAD CATALOG (2025)
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-50 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest text-slate-400">Scroll for Specs</span>
          <ArrowRight className="rotate-90" size={16}/>
        </div>
      </section>

      {/* ---------------- 2. TRUST STRIP (LOGOS) ---------------- */}
      <div className="border-y border-white/5 bg-black/60 backdrop-blur-md relative z-30">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-center text-xs font-mono text-slate-600 uppercase tracking-widest mb-8">
            Certified Manufacturing Excellence
          </p>
          
          {/* LOGO GRID - Replace src with your actual logo files */}
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-700">
            {/* Example Placeholders - Replace these <img> with your actual files */}
            <div className="h-12 flex items-center gap-2">
               <ShieldCheck size={40} className="text-slate-400"/>
               <span className="text-xl font-bold text-slate-400">ISO 9001:2015</span>
            </div>
            <div className="h-12 flex items-center gap-2">
               <Award size={40} className="text-slate-400"/>
               <span className="text-xl font-bold text-slate-400">IATF 16949</span>
            </div>
            <div className="h-12 flex items-center gap-2">
               <Settings size={40} className="text-slate-400"/>
               <span className="text-xl font-bold text-slate-400">CE Certified</span>
            </div>
            <div className="h-12 flex items-center gap-2">
               <Zap size={40} className="text-slate-400"/>
               <span className="text-xl font-bold text-slate-400">Make In India</span>
            </div>
            {/* USE THIS FORMAT FOR REAL IMAGES:
               <img src="/assets/iso-logo.png" alt="ISO Certified" className="h-12 w-auto object-contain" />
            */}
          </div>
        </div>
      </div>

      {/* ---------------- 3. TECHNICAL BLUEPRINT ---------------- */}
      <section className="py-24 px-6 relative bg-[#0F172A]">
        {/* Blueprint Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-amber-500 font-mono text-sm mb-2 flex items-center gap-2">
                <Crosshair size={16}/> TECHNICAL CAPABILITIES
              </h2>
              <h3 className="text-4xl font-black text-white">Production Scope.</h3>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs text-slate-500 font-mono">MACHINERY: MULTI-STATION HEADERS</p>
              <p className="text-xs text-slate-500 font-mono">STATUS: 24/7 OPERATIONAL</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-slate-800 bg-[#020617]/80 backdrop-blur-sm shadow-2xl">
            {[
              { label: "DIAMETER (METRIC)", value: "M2 — M24", sub: "Cold Forging Capacity" },
              { label: "LENGTH (MAX)", value: "300mm", sub: "12 Inches Single Stroke" },
              { label: "TOLERANCE", value: "±0.02mm", sub: "Optical Sorting Available" },
              { label: "MATERIALS", value: "Steel, SS, Brass", sub: "Grades: 8.8, 10.9, 12.9" },
              { label: "HEAD STYLES", value: "All Standard Types", sub: "Hex, Pan, CSK, Truss, Custom" },
              { label: "THREAD TYPES", value: "Machine & Tapping", sub: "Type A, AB, B, Metric, UNC" },
            ].map((spec, i) => (
              <div key={i} className="p-8 border-b border-slate-800 md:border-r hover:bg-slate-800/50 transition-colors group relative overflow-hidden">
                 {/* Corner marker */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="text-xs font-mono text-slate-500 mb-2">{spec.label}</p>
                <p className="text-2xl font-bold text-white mb-1 group-hover:text-amber-500 transition-colors font-mono">{spec.value}</p>
                <p className="text-xs text-slate-600">{spec.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 4. GLOBAL LOGISTICS (NEW SECTION) ---------------- */}
      <section className="py-24 bg-[#0b0f19] border-t border-white/5 relative overflow-hidden">
        {/* World Map SVG Background Effect */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
            <Globe className="absolute -right-20 top-20 w-[600px] h-[600px] text-slate-500" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-bold mb-6 border border-blue-500/20">
                  <Globe size={14} /> GLOBAL EXPORT DIVISION
                </div>
                <h2 className="text-4xl font-black text-white mb-6">
                  Rajkot to the World. <br/>
                  <span className="text-slate-500">Seamless Logistics.</span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                   We understand that for an OEM, delivery time is as critical as quality. 
                   Our dedicated export team handles FOB/CIF shipments, customs documentation, and packaging.
                </p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                   <div className="p-4 bg-slate-900 rounded border border-white/5">
                      <div className="flex items-center gap-2 mb-2 text-white font-bold">
                        <MapPin size={18} className="text-amber-500"/> USA & Europe
                      </div>
                      <p className="text-sm text-slate-500">Primary export markets with established logistics routes.</p>
                   </div>
                   <div className="p-4 bg-slate-900 rounded border border-white/5">
                      <div className="flex items-center gap-2 mb-2 text-white font-bold">
                        <Anchor size={18} className="text-amber-500"/> Mundra Port
                      </div>
                      <p className="text-sm text-slate-500">Proximity to port ensures faster container dispatch.</p>
                   </div>
                </div>
             </div>

             {/* Logistics Stats Card */}
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-1 rounded-2xl border border-white/10 shadow-2xl">
                <div className="bg-[#0b0f19] rounded-xl p-8">
                   <h3 className="text-white font-bold mb-6 flex justify-between">
                     <span>Typical Lead Times</span>
                     <Truck size={20} className="text-slate-500"/>
                   </h3>
                   <div className="space-y-6">
                      {[
                        { dest: "Domestic (India)", time: "3-5 Days", width: "w-20 bg-green-500" },
                        { dest: "Middle East (UAE)", time: "12-15 Days", width: "w-32 bg-amber-500" },
                        { dest: "Europe (Germany/UK)", time: "22-25 Days", width: "w-48 bg-blue-500" },
                        { dest: "North America (USA)", time: "30-35 Days", width: "w-64 bg-indigo-500" },
                      ].map((item, i) => (
                        <div key={i}>
                           <div className="flex justify-between text-xs text-slate-400 mb-2">
                              <span>{item.dest}</span>
                              <span className="font-mono text-white">{item.time}</span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-800 rounded-full">
                              <div className={`h-full rounded-full ${item.width}`}></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ---------------- 5. QUALITY LABS ---------------- */}
      <section className="py-24 bg-neutral-900 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Content */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 text-amber-500 font-bold mb-6">
                <Microscope size={20} />
                <span>IN-HOUSE METALLURGY</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                We trust data,<br/>not luck.
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Every batch undergoes rigorous torque, hardness, and salt-spray testing before dispatch. We provide 
                <span className="text-white font-bold bg-white/10 px-1 mx-1 rounded">MTC (Material Test Certificates)</span> with every shipment.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Spectroscopy Material Analysis",
                  "Vickers & Rockwell Hardness Testing",
                  "Salt Spray Chamber (72h to 1000h)",
                  "Digital Torque & Tensile Testing"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="text-amber-500 shrink-0" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Visual Card */}
            <div className="relative order-1 lg:order-2">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl blur-lg opacity-20"></div>
              <div className="relative bg-[#0b0f19] border border-white/10 rounded-xl p-8 overflow-hidden">
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                  <span className="text-xs font-mono text-slate-500">QC REPORT ID: #8821X</span>
                  <span className="text-xs font-mono text-green-500 border border-green-500/30 px-2 py-1 rounded bg-green-500/10">PASSED</span>
                </div>
                
                {/* Simulated Graph */}
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs mb-1 text-slate-400">
                      <span>Tensile Strength</span>
                      <span>1040 MPa</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-[92%] animate-[pulse_3s_infinite]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1 text-slate-400">
                      <span>Core Hardness</span>
                      <span>34 HRC</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[85%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1 text-slate-400">
                      <span>Plating Thickness</span>
                      <span>12 Microns</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[98%]"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                  <div className="px-4 py-2 bg-white/5 rounded text-center min-w-[80px]">
                    <p className="text-2xl font-bold text-white">0</p>
                    <p className="text-[10px] uppercase text-slate-500">PPM Rejection</p>
                  </div>
                  <div className="px-4 py-2 bg-white/5 rounded text-center min-w-[80px]">
                    <p className="text-2xl font-bold text-white">L3</p>
                    <p className="text-[10px] uppercase text-slate-500">PPAP Level</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 6. INDUSTRIES (GRID LAYOUT) ---------------- */}
      <section className="py-24 px-6 bg-[#020617]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Engineered for Critical Applications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, label: "Automotive", desc: "Chassis & Engine" },
              { icon: Zap, label: "EV Systems", desc: "Battery Pack Fixings" },
              { icon: Anchor, label: "Marine", desc: "SS316 Corrosion Proof" },
              { icon: Database, label: "Infrastructure", desc: "Heavy Construction" },
            ].map((item, i) => (
              <div key={i} className="group p-6 bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800 transition-all cursor-default rounded-xl">
                <item.icon className="text-slate-500 group-hover:text-amber-500 mb-4 transition-colors group-hover:scale-110 duration-300" size={32} />
                <h3 className="text-white font-bold text-lg">{item.label}</h3>
                <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 7. FOOTER CTA ---------------- */}
      <section className="py-24 bg-amber-500 text-black px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight uppercase">
            Start Production.
          </h2>
          <p className="text-xl font-medium mb-10 max-w-2xl mx-auto text-black/80">
            Direct-from-factory pricing. Send us your technical drawing or sample, and get a quote within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="px-10 py-5 bg-black text-white text-lg font-bold rounded-sm hover:scale-105 transition-transform shadow-2xl flex items-center justify-center gap-2">
              <Phone size={20}/> Contact Engineering Team
            </Link>
            <Link to="/rfq" className="px-10 py-5 border-2 border-black text-black text-lg font-bold rounded-sm hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
              <FileCog size={20}/> Request Sample Kit
            </Link>
          </div>
          <div className="mt-12 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-center items-center gap-6 text-sm font-mono opacity-60">
             <span>Durable Fastener Pvt Ltd.</span>
             <span className="hidden md:inline">•</span>
             <span>GIDC, Rajkot, Gujarat, India</span>
             <span className="hidden md:inline">•</span>
             <span>Exp: Since 1998</span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default OEMPlatform;