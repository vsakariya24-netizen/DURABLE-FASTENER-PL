import React from 'react';
import { 
  ArrowRight, Box, Cpu, Globe, Layers, 
  Microscope, MoveRight, Ruler, Settings, ShieldCheck, 
  Truck, Anchor, Activity 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const OEMPlatform: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-amber-500 selection:text-black font-sans">
      
      {/* ---------------- BACKGROUND EFFECTS ---------------- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {/* Glow effect top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10">
        
        {/* ---------------- HERO SECTION ---------------- */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                  OEM & Export Division
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-8 leading-tight max-w-5xl">
                Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Perfection</span> <br className="hidden md:block"/>
                into Every Fastener.
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
                We are the silent strength behind global machinery. 
                Full-stack manufacturing from CAD design to cold forging, 
                exported from India to the world.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/contact" className="group relative px-8 py-4 bg-amber-500 text-slate-950 font-bold rounded-xl overflow-hidden">
                  <div className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                  <span className="relative flex items-center gap-2">
                    Start Manufacturing <ArrowRight size={18} />
                  </span>
                </Link>
                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                  View Technical Data
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* ---------------- BENTO GRID CAPABILITIES ---------------- */}
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Technical Capabilities</h2>
                <p className="text-slate-400">Precision engineered for high-stress applications.</p>
              </div>
              <div className="hidden md:block h-[1px] flex-1 bg-white/10 mx-8 mb-2"></div>
            </div>

            {/* The Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 grid-rows-[auto_auto_auto]">
              
              {/* Card 1: Main Feature (Large) */}
              <div className="md:col-span-2 lg:col-span-2 row-span-2 bg-slate-900/50 border border-white/10 p-8 rounded-3xl hover:border-amber-500/50 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 bg-amber-500/10 blur-[60px] rounded-full group-hover:bg-amber-500/20 transition-all"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6">
                    <Settings size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Advanced Cold Forging</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Our multi-station headers allow for complex geometries without sacrificing structural integrity. We achieve tighter tolerances and superior grain flow compared to machined parts.
                  </p>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div> M2 to M24 Diameter Range</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div> Up to 300mm Length</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div> 100+ Tons Monthly Capacity</li>
                  </ul>
                </div>
              </div>

              {/* Card 2: Materials */}
              <div className="bg-slate-900/50 border border-white/10 p-6 rounded-3xl hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <Layers className="text-slate-400" size={24} />
                  <span className="text-xs font-mono text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded">ALLOYS</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Material Science</h3>
                <p className="text-sm text-slate-400">
                  SS 304/316, Carbon Steel (Grade 8.8, 10.9, 12.9), Brass, and Copper.
                </p>
              </div>

              {/* Card 3: Quality */}
              <div className="bg-slate-900/50 border border-white/10 p-6 rounded-3xl hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <Microscope className="text-slate-400" size={24} />
                  <span className="text-xs font-mono text-green-500 border border-green-500/30 px-2 py-0.5 rounded">0 PPM</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Quality Labs</h3>
                <p className="text-sm text-slate-400">
                  In-house tensile testing, hardness testing, and salt spray chambers.
                </p>
              </div>

              {/* Card 4: Global Logistics (Wide) */}
              <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
                 <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Globe size={180} />
                 </div>
                 <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                         <Anchor className="text-amber-500" size={20} />
                         <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Export Ready</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Global Logistics & Incoterms</h3>
                      <p className="text-sm text-slate-400 max-w-md">
                        We handle the complexity of international trade. Serving clients in EU, USA, and MENA regions with flexible FOB/CIF terms.
                      </p>
                    </div>
                    <div className="flex gap-4 mt-6">
                       <div className="px-3 py-1 bg-black/30 rounded border border-white/5 text-xs text-slate-300">Mundra Port</div>
                       <div className="px-3 py-1 bg-black/30 rounded border border-white/5 text-xs text-slate-300">Nhava Sheva</div>
                    </div>
                 </div>
              </div>

              {/* Card 5: Certifications */}
              <div className="bg-slate-900/50 border border-white/10 p-6 rounded-3xl flex flex-col justify-center items-center text-center hover:border-green-500/30 transition-colors">
                <ShieldCheck className="text-green-500 mb-3" size={32} />
                <h3 className="text-lg font-bold text-white">ISO 9001:2015</h3>
                <p className="text-xs text-slate-500 mt-1">Certified Manufacturing</p>
              </div>

            </div>
          </div>
        </section>

        {/* ---------------- STREAMLINED PROCESS ---------------- */}
        <section className="py-20 bg-slate-900 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white">The OEM Workflow</h2>
              <p className="text-slate-400 mt-2">Streamlined for speed and transparency.</p>
            </div>

            <div className="relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent -translate-y-1/2 z-0"></div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {[
                  { icon: Ruler, title: "Blueprint", desc: "CAD & Feasibility Analysis" },
                  { icon: Cpu, title: "Prototype", desc: "Sample Development (7 Days)" },
                  { icon: Activity, title: "Production", desc: "High Volume Manufacturing" },
                  { icon: Truck, title: "Delivery", desc: "QC & Global Shipping" },
                ].map((step, index) => (
                  <div key={index} className="bg-slate-950 border border-white/10 p-6 rounded-2xl text-center group hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-16 h-16 mx-auto bg-slate-900 rounded-full flex items-center justify-center border border-white/10 mb-4 group-hover:border-amber-500 transition-colors relative">
                      <step.icon size={24} className="text-white group-hover:text-amber-500 transition-colors" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-400">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- FOOTER CTA ---------------- */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to scale your supply chain?</h2>
            <p className="text-slate-400 mb-10 text-lg">
              Direct from the manufacturer. No middlemen. Just pure engineering excellence.
            </p>
            <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
               <Link to="/rfq" className="px-8 py-3 rounded-full bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors">
                 Get a Quote
               </Link>
               <Link to="/contact" className="px-8 py-3 rounded-full text-white hover:bg-white/5 transition-colors">
                 Contact Sales
               </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default OEMPlatform;