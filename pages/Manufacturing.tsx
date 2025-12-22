import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, ShieldCheck, Truck, Package, Factory, 
  Cpu, Layers, Zap, Gauge, History, CheckCircle2,
  ChevronRight, Box
} from 'lucide-react';

const Manufacturing: React.FC = () => {
  return (
    <div className="bg-[#0b0f19] min-h-screen pt-24 font-sans text-slate-300 overflow-x-hidden">
      
      {/* ---------------- 1. DYNAMIC HERO SECTION ---------------- */}
      <div className="relative py-24 border-b border-white/5 overflow-hidden">
        {/* Animated Background Grids */}
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold mb-6 tracking-[0.2em] uppercase">
               Next-Gen Production Unit
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
              PRECISION <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">ENGINEERING LAB.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
              Where high-grade metallurgy meets automated cold-heading technology. 
              Delivering <span className="text-white font-medium">zero-defect fasteners</span> for the world's most demanding sectors.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- 2. INFRASTRUCTURE & SCALE ---------------- */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Facility Visualization */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
               {/* TIP: Use a real high-shutter speed photo of your machine line here */}
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent"></div>
               
               <div className="absolute bottom-8 left-8">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-amber-500 rounded-xl text-black">
                      <Factory size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-white italic">7000 SQ. FT.</h4>
                      <p className="text-amber-500 text-xs font-bold tracking-widest uppercase">Integrated Plant Capacity</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Massive Production Footprint</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Based in the industrial heart of **Rajkot, Gujarat**, Durable Fastener Pvt. Ltd. operates a high-capacity unit designed for scale. Our expanded footprint allows us to process over **100+ tons** of material monthly.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Suppliers Network", val: "350+", icon: Layers },
                { label: "Logistics Fleet", val: "Pan-India", icon: Truck },
                { label: "Inventory Stock", val: "Ready-to-Ship", icon: Package },
                { label: "Workforce", val: "Skilled Engineers", icon: Settings },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center gap-4 group hover:bg-white/10 transition-colors">
                  <item.icon className="text-amber-500" size={24} />
                  <div>
                    <p className="text-lg font-bold text-white">{item.val}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 3. TECHNICAL PROCESS GRID ---------------- */}
      <section className="py-24 bg-black/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">The Precision Cycle</h2>
            <div className="h-1.5 w-24 bg-amber-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: ShieldCheck, title: "Material Integrity", color: "text-green-500",
                desc: "Strict sourcing of Grade-1022, SS304, and SS316 with chemical composition analysis before heading." 
              },
              { 
                icon: Cpu, title: "Automated Cold Heading", color: "text-blue-500",
                desc: "High-speed multi-station machines ensuring dimensional consistency with ±0.02mm tolerance levels." 
              },
              { 
                icon: Gauge, title: "Stress & Load Testing", color: "text-amber-500",
                desc: "Every batch is tested for tensile strength and core hardness to meet international ISO/DIN standards." 
              }
            ].map((step, i) => (
              <div key={i} className="p-10 bg-slate-900/50 border border-white/5 rounded-3xl relative group hover:-translate-y-2 transition-all duration-500">
                <div className={`mb-6 ${step.color} group-hover:scale-110 transition-transform`}>
                  <step.icon size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-amber-500/50 group-hover:text-amber-500 transition-colors uppercase tracking-tighter">
                  Phase 0{i+1} <ChevronRight size={14}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 4. PACKAGING & LOGISTICS ---------------- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-slate-900 to-black rounded-[3rem] p-8 md:p-20 border border-white/10 relative overflow-hidden shadow-3xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[100px] rounded-full"></div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
                Industrial-Grade <br/>
                <span className="text-amber-500 tracking-tighter italic">Shield Packaging.</span>
              </h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                Fasteners are heavy and prone to transit friction. We utilize a **Triple-Layer Protection** strategy to ensure your shipment arrives factory-fresh.
              </p>
              
              <div className="space-y-4">
                {[
                  "Moisture-proof Plastic Interior Sealing",
                  "Double-Wall Corrugated Boxes (High GSM)",
                  "Palletized Master Carton Packing for Export"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-200">
                    <CheckCircle2 className="text-amber-500" size={20} />
                    <span className="text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>

              <Link to="/contact" className="mt-12 inline-flex items-center gap-3 bg-amber-500 text-black px-10 py-5 rounded-2xl font-black hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-amber-500/10 uppercase tracking-wider text-sm">
                Request Capacity Audit <Truck size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Box, label: "Plastic Box", sub: "Retail Ready" },
                { icon: Zap, label: "5+ Layers", sub: "Corrugated" },
                { icon: Package, label: "Eco-Friendly", sub: "Bulk Packs" },
                { icon: History, label: "24h Ready", sub: "In-Stock" },
              ].map((pack, i) => (
                <div key={i} className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 text-center flex flex-col items-center justify-center hover:bg-white/10 transition-colors border-b-4 border-b-amber-500">
                  <pack.icon className="text-amber-500 mb-4" size={40} />
                  <p className="text-white font-black text-lg">{pack.label}</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">{pack.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 5. BOTTOM CTA ---------------- */}
      <section className="py-24 text-center">
        <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-[0.3em]">Built in Rajkot. Delivered Worldwide.</h2>
        <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full mb-8"></div>
        <p className="text-slate-500 max-w-xl mx-auto mb-10">
          We welcome factory audits from OEM partners and procurement agencies. Contact our engineering team for a technical walkthrough.
        </p>
      </section>

    </div>
  );
};

export default Manufacturing;