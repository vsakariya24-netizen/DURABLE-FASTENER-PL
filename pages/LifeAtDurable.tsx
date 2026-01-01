import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { 
  Heart, Zap, Users, AlertTriangle, CheckCircle, XCircle, 
  Anchor, Coffee, Clock, TrendingUp, Award, ArrowRight, 
  Star, ShieldCheck, Smile, Sun, ChevronRight
} from 'lucide-react';

// --- Animated Counter Component ---
const Counter = ({ from, to, label }: { from: number; to: number; label: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (inView) {
      let start = from;
      const duration = 2000;
      const incrementTime = (duration / (to - from)) * Math.abs(1);
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === to) clearInterval(timer);
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [inView, from, to]);

  return (
    <div ref={ref} className="text-center p-6 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-5xl md:text-6xl font-black text-blue-900 font-sans mb-2">
        {count}+
      </h3>
      <p className="text-sm font-bold tracking-widest uppercase text-slate-500">{label}</p>
    </div>
  );
};

// --- Marquee Component ---
const Marquee = ({ text }: { text: string }) => {
  return (
    <div className="bg-slate-900 text-white py-3 overflow-hidden border-y border-slate-800 relative z-20">
      <motion.div 
        className="whitespace-nowrap flex gap-10 text-sm md:text-base font-bold uppercase tracking-widest"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {Array(10).fill(text).map((t, i) => (
          <span key={i} className="flex items-center gap-4 text-slate-400">
            {t} <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// --- Main Page ---

const LifeAtDurable: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 200]);
  
  const [galleryItems, setGalleryItems] = useState<any[]>([]);

  // Fetch Gallery Data
  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase
        .from('life_gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        setGalleryItems(data);
      } else {
        // Fallback Data
        setGalleryItems([
           { title: "Diwali Puja", image_url: "https://images.unsplash.com/photo-1605218439502-861c8340d042?w=800", tag: "Tradition", size: "large" },
           { title: "Floor Action", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800", tag: "Grit", size: "small" },
           { title: "Team Lunch", image_url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800", tag: "Bonding", size: "small" },
           { title: "Quality Check", image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800", tag: "Focus", size: "wide" },
        ]);
      }
    };
    fetchGallery();
  }, []);

  // --- NEW TIMELINE DATA FOR SECTION 4 ---
  const timelineData = [
    {
      time: "09:00 AM",
      title: "The Morning Spark",
      desc: "It starts with a handshake. We check the safety gear, share a laugh, and set our intentions. It's not just about hitting targets; it's about returning home safe.",
      icon: Sun,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop" 
    },
    {
      time: "11:30 AM",
      title: "Symphony of Steel",
      desc: "The floor comes alive. The rhythm of the machines is our heartbeat. Every screw produced is a promise of durability kept to a customer somewhere in the world.",
      icon: Zap,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      img: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=800&auto=format&fit=crop" 
    },
    {
      time: "04:00 PM",
      title: "Chai, Smiles & Solutions",
      desc: "The machines pause, but the minds don't. Over steaming cups of tea, hierarchies dissolve. The best ideas usually come from a joke cracked during this break.",
      icon: Coffee,
      color: "text-red-500",
      bgColor: "bg-red-50",
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop" 
    },
    {
      time: "06:00 PM",
      title: "Pride in the Finish",
      desc: "Silence returns. We wipe down the tools and look at the bins full of finished work. We leave tired, but with the satisfaction of a day well spent.",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      img: "https://images.unsplash.com/photo-1469533778471-92a68acc3633?q=80&w=800&auto=format&fit=crop" 
    }
  ];

  return (
    <div ref={targetRef} className="bg-slate-50 min-h-screen font-sans text-slate-900 overflow-x-hidden selection:bg-blue-600 selection:text-white">

      {/* =========================================
          1. HERO SECTION: FIRST EMOTIONAL HOOK
      ========================================= */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <motion.div style={{ y: heroY, scale: 1.1 }} className="absolute inset-0 opacity-50">
             {/* Use a real-looking team photo here */}
             <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" alt="Durable Team" className="w-full h-full object-cover"/>
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md mb-8">
               <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
               <span className="text-xs font-bold text-white uppercase tracking-widest">Life at Durable</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.1] tracking-tight mb-8">
                NOT JUST A DUTY. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">A SHARED JOURNEY.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed mb-12">
                "Here, we don't just manufacture fasteners. We manufacture careers, confidence, and character."
            </p>

            <motion.button whileHover={{ scale: 1.05 }} className="bg-blue-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50">
               See Open Positions
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Marquee text="Respect • Integrity • Growth • Safety • Brotherhood • Excellence • " />

      {/* =========================================
          2. WHAT MAKES DURABLE DIFFERENT (Core Soul)
      ========================================= */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">OUR DNA</h2>
              <p className="text-slate-500 text-lg">Four pillars that hold this company together.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                 { icon: Zap, color: "text-amber-500", title: "We Value Thinking", text: "Ideas don’t need permission. If it improves quality or safety, we listen." },
                 { icon: Anchor, color: "text-blue-600", title: "We Respect Work", text: "Whether on the shop floor or the office, every role builds the same dream." },
                 { icon: TrendingUp, color: "text-green-600", title: "We Grow Together", text: "Learning is part of our daily work—not a yearly formality." },
                 { icon: Heart, color: "text-red-500", title: "We Care Beyond Work", text: "We celebrate wins. We support during tough days. We are a family." }
              ].map((item, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   className="bg-slate-50 p-8 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-slate-100"
                 >
                    <item.icon size={40} className={`mb-6 ${item.color}`} />
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.text}</p>
                 </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* =========================================
          3. REAL STORIES (Emotional Credibility)
      ========================================= */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="container mx-auto px-6 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">STORIES FROM INSIDE</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* Story 1 */}
               <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="Ramesh" className="w-full h-full object-cover"/>
                     </div>
                     <div>
                        <h4 className="font-bold text-xl">Ramesh Bhai</h4>
                        <p className="text-blue-400 text-sm">Production Team • Joined 2019</p>
                     </div>
                  </div>
                  <p className="text-lg text-slate-300 italic">
                     "I joined as a helper. Today, I handle operations independently. Durable gave me trust before I had confidence. They taught me that my background doesn't matter, my hard work does."
                  </p>
               </motion.div>

               {/* Story 2 */}
               <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" alt="Priya" className="w-full h-full object-cover"/>
                     </div>
                     <div>
                        <h4 className="font-bold text-xl">Priya Ben</h4>
                        <p className="text-blue-400 text-sm">Quality Control • Joined 2021</p>
                     </div>
                  </div>
                  <p className="text-lg text-slate-300 italic">
                     "In other companies, QC is just a department. Here, it is a mindset. I am empowered to stop the production line if I see a defect. That respect for quality keeps me here."
                  </p>
               </motion.div>
            </div>
         </div>
      </section>

      {/* =========================================
          4. A DAY AT DURABLE (REDESIGNED: VISUAL STORYBOARD)
      ========================================= */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              THE PULSE OF <span className="text-blue-600">PRODUCTION</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
              Every day is a story of iron will, human connection, and the pursuit of perfection.
            </p>
          </div>

          <div className="relative">
            {/* The Central Line (Hidden on mobile) */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-amber-200 via-blue-200 to-emerald-200 hidden md:block rounded-full opacity-50"></div>

            <div className="space-y-24">
              {timelineData.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className={`relative flex flex-col md:flex-row gap-8 md:gap-0 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  
                  {/* 1. Image Side (Visual Emotion) */}
                  <div className="w-full md:w-1/2 px-4 md:px-12 group">
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl transform transition-transform duration-500 hover:-translate-y-2">
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10`} />
                      <img 
                        src={item.img} 
                        alt={item.title} 
                        className="w-full h-64 md:h-80 object-cover transform group-hover:scale-110 transition-transform duration-700" 
                      />
                      {/* Glassmorphism Time Badge */}
                      <div className="absolute bottom-6 left-6 z-20 bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                        <item.icon size={16} className="text-white" />
                        <span className="text-white font-bold text-sm tracking-wide">{item.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Center Marker (The Heartbeat) */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center justify-center z-20">
                    <div className={`w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${item.bgColor}`}>
                      <item.icon size={20} className={item.color} />
                    </div>
                  </div>

                  {/* 3. Text Side (The Story) */}
                  <div className="w-full md:w-1/2 px-4 md:px-12 text-center md:text-left">
                    <div className={`p-6 md:p-8 rounded-3xl transition-all duration-300 hover:bg-white hover:shadow-xl border border-transparent hover:border-slate-100`}>
                      <h3 className="text-2xl font-bold text-slate-800 mb-3 flex items-center justify-center md:justify-start gap-3">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-lg">
                        {item.desc}
                      </p>
                      
                      {/* Special Badge for Tea Time */}
                      {item.title.includes("Chai") && (
                         <div className="mt-4 flex items-center justify-center md:justify-start gap-2 text-sm text-red-500 font-medium bg-red-50 inline-flex px-3 py-1 rounded-full">
                            <Heart size={14} className="fill-red-500 animate-pulse" />
                            <span>Team Favorite Time</span>
                         </div>
                      )}
                    </div>
                  </div>

                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          5. GROWTH & OPPORTUNITIES (Path not Promise)
      ========================================= */}
      <section className="py-24 bg-blue-50">
         <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <div>
                  <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">Your Career Path</span>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-2 mb-6">GROWTH IS NOT ABOUT YEARS. <br/> IT'S ABOUT <span className="text-blue-600">WILL.</span></h2>
                  <p className="text-slate-600 text-lg mb-8">
                     We don't believe in waiting for "your turn." If you show interest, we teach you.
                  </p>
                  <ul className="space-y-4">
                     {[
                        "Technical training on latest CNC/Header machines",
                        "Leadership workshops for junior managers",
                        "English and Soft-skills improvement",
                        "Direct mentorship from senior leadership"
                     ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                           <Award className="text-blue-500 shrink-0" size={20} />
                           <span className="font-bold text-slate-700">{item}</span>
                        </li>
                     ))}
                  </ul>
               </div>
               
               {/* Impact Numbers */}
               <div className="grid grid-cols-1 gap-6">
                  <Counter from={0} to={85} label="Team Members" />
                  <Counter from={0} to={12} label="Promotions Last Year" />
                  <Counter from={0} to={100} label="% Support for Learning" />
               </div>
            </div>
         </div>
      </section>

      {/* =========================================
          6 & 7. CULTURE & LIFE BEYOND WORK (Gallery)
      ========================================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">LIFE BEYOND THE MACHINES</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
            {galleryItems.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative group overflow-hidden rounded-2xl ${
                  item.size === 'large' ? 'md:col-span-2 md:row-span-2' : 
                  item.size === 'wide' ? 'md:col-span-2' : ''
                }`}
              >
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">{item.tag}</span>
                  <h4 className="text-white text-xl font-bold">{item.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          8. THE FILTER (Who is this for?)
      ========================================= */}
      <section className="py-24 bg-slate-100">
        <div className="container mx-auto px-6 max-w-5xl">
           <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                 
                 {/* NOT FOR YOU */}
                 <div className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-400 flex items-center gap-2">
                       <XCircle className="text-red-400" /> WE ARE <span className="text-red-500 underline">NOT</span> FOR YOU
                    </h3>
                    <ul className="space-y-4">
                       {["If you prefer comfort over growth.", "If you hide mistakes.", "If you say 'That's not my job'."].map((t, i) => (
                          <li key={i} className="flex gap-3 text-slate-500">
                             <span className="w-1.5 h-1.5 bg-red-300 rounded-full mt-2.5 shrink-0"></span> {t}
                          </li>
                       ))}
                    </ul>
                 </div>

                 {/* FOR YOU */}
                 <div className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                       <CheckCircle className="text-green-500" /> YOU BELONG <span className="text-green-500 underline">HERE</span>
                    </h3>
                    <ul className="space-y-4">
                       {["If you are obsessed with quality.", "If you are hungry to learn.", "If you treat the factory like home."].map((t, i) => (
                          <li key={i} className="flex gap-3 text-slate-800 font-bold">
                             <CheckCircle className="text-green-500 w-5 h-5 shrink-0" /> {t}
                          </li>
                       ))}
                    </ul>
                 </div>

             </div>
           </div>
        </div>
      </section>

      {/* =========================================
          CTA: JOIN THE BRIGADE
      ========================================= */}
      <section className="py-32 bg-blue-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
           <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl md:text-7xl font-black mb-6">
                 THIS FEELS LIKE A PLACE <br/>
                 <span className="text-blue-300">I WANT TO GROW.</span>
              </h2>
              <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                 If you just said that to yourself, we want to meet you.
              </p>
              
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <button className="bg-white text-blue-900 px-10 py-5 rounded-full text-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-3">
                  View Open Positions <ArrowRight size={20}/>
                </button>
                <button className="text-blue-200 hover:text-white font-medium underline underline-offset-4 transition-all">
                  Walk-in Opportunities
                </button>
              </div>
           </motion.div>
        </div>
      </section>

    </div>
  );
};

export default LifeAtDurable;
