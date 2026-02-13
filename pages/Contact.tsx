import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, Loader2, 
  Globe, Clock, Briefcase, Building2 
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// Your Google Apps Script Web App URL
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyijhbaehBavkvP8zmOcdRssVbgSBAK3-FX8Q0dLm4H7E5u2e-yEVAofFe0FyXhxl4/exec';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Prepare the data
    const payload = {
      ...formData,
      timestamp: new Date().toLocaleString(),
      source: 'Website Contact Form'
    };

    try {
      // --- TASK 1: SUPABASE ---
      // We wrap this in its own attempt to see exactly what fails
     const { error: supabaseError } = await supabase
  .from('enquiries')
  .insert([
    {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone, // <--- This MUST match the Supabase column name
      subject: formData.subject,
      message: formData.message
    }
  ]);

      if (supabaseError) {
        console.error("Supabase Database Error:", supabaseError.message);
        throw new Error("Database insert failed");
      }

      // --- TASK 2: GOOGLE SHEETS ---
      // We don't 'await' this strictly to prevent Google Script delays from blocking the user
      fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.error("Google Sheets Sync Error:", err));

      // If we got here, Task 1 succeeded!
      setSubmitted(true);
      setFormData({
        first_name: '', last_name: '', email: '',
        phone: '', subject: 'General Inquiry', message: ''
      });

    } catch (err: any) {
      console.error("Full Submission Error Object:", err);
      // Give a more helpful error message
      setError('Technical glitch! Please call us at +91 87587 00709 so we don’t miss your inquiry.');
    } finally {
      setLoading(false);
    }
  };

  // --- Animation Variants ---
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const cardSlideUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      
      <Helmet>
        <title>Contact Durable Fastener | Top Screw Manufacturer in Rajkot</title>
        <meta name="description" content="Contact Durable Fastener Private Limited, a leading fastener factory and MS screw manufacturer in Rajkot. Call +91 87587 00709." />
        <meta name="keywords" content="durable fastener private limited, ms screw manufacturer in rajkot, fasteners manufacturers in rajkot, high tensile fasteners gujarat" />
      </Helmet>

      {/* --- Hero Header --- */}
      <div className="relative bg-slate-900 text-white pb-32 pt-20 lg:pt-32 overflow-hidden">
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            className="absolute top-0 left-0 w-full h-full"
        >
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 L100 0 L100 100 Z" fill="white" />
            </svg>
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm"
          >
            <Globe size={14} className="animate-pulse" /> Global Fastener Supply
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            Let's Engineer <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Excellence</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Looking for a manufacturing partner in Rajkot? Our engineering team is ready to provide custom quotes and technical support.
          </motion.p>
        </div>
      </div>

      {/* --- Form & Contact Info Interface --- */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20 pb-20">
        <motion.div 
            variants={cardSlideUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[700px]"
        >
          
          {/* LEFT SIDE: Contact Info */}
          <div className="lg:w-2/5 bg-slate-800 text-white p-10 md:p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Building2 size={300} />
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">Contact Details</h3>
              <p className="text-slate-400 mb-10 text-sm">We typically respond to inquiries within 24 hours.</p>

              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-8 relative z-10"
              >
                <InfoItem 
                    icon={<MapPin size={22} />} 
                    colorClass="bg-blue-500/10 text-blue-400"
                    title="Factory Address"
                    content={<>Plot No.16, Surbhi Ind Zone-D, <br/>Ravki, Rajkot-360004, Gujarat</>}
                />
                
                <InfoItem 
                    icon={<Phone size={22} />} 
                    colorClass="bg-emerald-500/10 text-emerald-400"
                    title="Call Us"
                    content={
                        <div className="flex flex-col gap-1">
                           <a href="tel:+918758700704" className="hover:text-emerald-400 transition-colors">+91 87587 00704</a>
                            <a href="tel:+918758700709" className="hover:text-emerald-400 transition-colors">+91 87587 00709</a>
                        </div>
                    }
                    subContent="Mon-Sat, 9:00 AM - 7:00 PM"
                />

                {/* WhatsApp Support */}
                <InfoItem 
                    icon={<Send size={22} />} 
                    colorClass="bg-[#25D366]/10 text-[#25D366]"
                    title="WhatsApp"
                    content={
                        <a 
                            href="https://wa.me/918758700709?text=Hi%20Durable%20Fastener,%20I%20have%20an%20inquiry." 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-bold hover:underline"
                        >
                            Chat with Sales Team
                        </a>
                    }
                />

                <InfoItem 
                    icon={<Mail size={22} />} 
                    colorClass="bg-amber-500/10 text-amber-400"
                    title="Email Us"
                    content="durablefastener@outlook.com"
                />
              </motion.div>
            </div>

            <div className="mt-12 p-4 bg-slate-700/50 rounded-2xl border border-slate-600/50">
                <div className="flex items-center gap-3 text-slate-300 mb-2">
                    <Clock size={16} /> <span className="text-xs font-medium uppercase tracking-wider">Business Hours</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Monday - Saturday</span>
                    <span className="text-white font-semibold">09:00 - 19:00</span>
                </div>
            </div>
          </div>

          {/* RIGHT SIDE: The Form */}
          <div className="lg:w-3/5 p-10 md:p-14 bg-white">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Send an Inquiry</h2>
            
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-8"
              >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <Send size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
                  <p className="text-slate-500 mb-8">Your message has been received and synced to our sales dashboard.</p>
                  <button onClick={() => setSubmitted(false)} className="text-blue-600 font-semibold hover:text-blue-800 underline underline-offset-4">
                    Submit another request
                  </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100">
                        {error}
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="e.g. Rahul" />
                  <InputGroup label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="e.g. Patel" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@company.com" />
                    <InputGroup label="Contact Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 00000 00000" />
                    <div className="group">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Subject</label>
                        <select 
                            name="subject" value={formData.subject} onChange={handleChange}
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all font-medium text-slate-900 cursor-pointer"
                        >
                            <option>General Inquiry</option>
                            <option>Request for Quote (Bulk)</option>
                            <option>Distributorship Application</option>
                            <option>Technical Support</option>
                        </select>
                    </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Message / Requirements</label>
                  <textarea 
                      name="message" rows={4} required value={formData.message} onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder-gray-400 resize-none" 
                      placeholder="Specify screw type, size, or quantity..."
                  ></textarea>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                    {loading ? <Loader2 className="animate-spin" /> : <>Send Message <Briefcase size={20} /></>}
                    </button>
                    <p className="text-center text-slate-400 text-xs mt-4 italic">
                        Data will be securely stored in our ERP and Google Sales Sheet.
                    </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// --- Reusable Sub-components ---

const InfoItem = ({ icon, colorClass, title, content, subContent }: any) => (
    <div className="flex items-start gap-4 group">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${colorClass}`}>
            {icon}
        </div>
        <div>
            <h4 className="font-semibold text-lg leading-tight">{title}</h4>
            <div className="text-slate-400 text-sm mt-1 leading-relaxed">{content}</div>
            {subContent && <p className="text-slate-500 text-xs mt-1">{subContent}</p>}
        </div>
    </div>
);

const InputGroup = ({ label, name, type="text", value, onChange, placeholder }: any) => (
    <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
        <input 
            type={type} name={name} required value={value} onChange={onChange}
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder-gray-300" 
            placeholder={placeholder} 
        />
    </div>
);

export default Contact;
