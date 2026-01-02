import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion'; // npm install framer-motion
import { 
  Mail, Phone, MapPin, Send, Loader2, 
  Globe, Clock, Briefcase, Building2 
} from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
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

    const { error } = await supabase.from('enquiries').insert([formData]);

    setLoading(false);
    if (error) {
      setError('Something went wrong. Please try again.');
    } else {
      setSubmitted(true);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
    }
  };

  // --- Animation Variants ---
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardSlideUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut" } }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      
      {/* --- Section 1: Immersive Hero Header --- */}
      <div className="relative bg-slate-900 text-white pb-32 pt-20 lg:pt-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute top-0 left-0 w-full h-full"
        >
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 L100 0 L100 100 Z" fill="white" />
            </svg>
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm"
          >
            <Globe size={14} className="animate-pulse" /> Global Distribution Network
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            Let's Engineer <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Excellence</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Whether you need a custom manufacturing quote or technical specifications, our engineering team in Rajkot is ready to assist.
          </motion.p>
        </div>
      </div>

      {/* --- Section 2: Floating Contact Interface --- */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20 pb-20">
        <motion.div 
            variants={cardSlideUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[700px]"
        >
          
          {/* LEFT SIDE: Contact Information */}
          <div className="lg:w-2/5 bg-slate-800 text-white p-10 md:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Texture */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Building2 size={300} />
            </div>

            <div>
              <motion.h3 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="text-2xl font-bold mb-2"
              >
                Contact Information
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-slate-400 mb-10 text-sm"
              >
                Fill up the form or reach out to us directly.
              </motion.p>

              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-8 relative z-10"
              >
                <InfoItem 
                    icon={<MapPin size={22} />} 
                    colorClass="bg-blue-500/10 text-blue-400 group-hover:bg-blue-500"
                    title="Factory & HQ"
                    content={<>Plot No.16, Survey No.660, <br/>Surbhi Ind Zone-D, Rajkot-360004,<br/>Gujarat, India</>}
                />
                
                <InfoItem 
                    icon={<Phone size={22} />} 
                    colorClass="bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500"
                    title="Call Us"
                    content="+91 87587 00704/+91 87587 00709"
                    subContent="Mon-Sat, 9am - 7pm"
                />

                <InfoItem 
                    icon={<Mail size={22} />} 
                    colorClass="bg-amber-500/10 text-amber-400 group-hover:bg-amber-500"
                    title="Email Support"
                    content="durablefastener@outlook.com"
                />
              </motion.div>
            </div>

            {/* Bottom Mini Map Preview */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-12 p-4 bg-slate-700/50 rounded-2xl backdrop-blur-sm border border-slate-600/50"
            >
                <div className="flex items-center gap-3 text-slate-300 mb-3">
                    <Clock size={16} /> <span className="text-xs font-medium uppercase tracking-wider">Business Hours</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Monday - Saturday</span>
                    <span className="text-white font-semibold">09:00 - 19:00</span>
                </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE: The Form */}
          <div className="lg:w-3/5 p-10 md:p-14 bg-white">
            <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-bold text-slate-900 mb-8"
            >
                Send us a message
            </motion.h2>
            
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-8"
              >
                 <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Send size={32} className="text-green-600 ml-1" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent Successfully!</h3>
                 <p className="text-slate-500 mb-8">Thank you for contacting Durable Fasteners. Our sales team will review your inquiry and get back to you within 24 hours.</p>
                 <button onClick={() => setSubmitted(false)} className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-2">
                    Send another message <Briefcase size={16} />
                 </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100">
                        {error}
                    </motion.div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Enter first name" />
                  <InputGroup label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Enter last name" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@company.com" />
                    <div className="group">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Topic</label>
                        <motion.div whileTap={{ scale: 0.99 }}>
                            <select 
                                name="subject" value={formData.subject} onChange={handleChange}
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all duration-200 font-medium text-slate-900 cursor-pointer"
                            >
                                <option>General Inquiry</option>
                                <option>Request for Quote (Bulk)</option>
                                <option>Distributorship Application</option>
                                <option>Technical Support</option>
                            </select>
                        </motion.div>
                    </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Message</label>
                  <motion.div whileTap={{ scale: 0.99 }}>
                    <textarea 
                        name="message" rows={4} required value={formData.message} onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all duration-200 font-medium text-slate-900 placeholder-gray-400 resize-none" 
                        placeholder="Tell us about your requirements..."
                    ></textarea>
                  </motion.div>
                </div>

                <div className="pt-4">
                    <motion.button 
                        type="submit" 
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                    {loading ? <Loader2 className="animate-spin" /> : <>Send Message <Briefcase size={20} /></>}
                    </motion.button>
                    <p className="text-center text-slate-400 text-xs mt-4">
                        By submitting this form, you agree to our privacy policy.
                    </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>

      {/* --- Section 3: Wide Map (Now Colorful & Taller) --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        // CHANGED: Removed grayscale, increased height to 500px, added distinct border
        className="w-full h-[500px] bg-white relative border-t-4 border-slate-900 shadow-2xl"
      >
        <iframe 
            width="100%" 
            height="100%" 
            id="gmap_canvas" 
            src="https://maps.google.com/maps?q=Durable%20Fastener%20Pvt.%20Ltd.%20Rajkot&t=&z=14&ie=UTF8&iwloc=&output=embed" 
            frameBorder="0" 
            scrolling="no" 
            title="Durable Fastener Location"
            // No filter applied here, so it will be full color
        ></iframe>
      </motion.div>
    </div>
  );
};

// --- Sub-components to keep code clean ---

const InfoItem = ({ icon, colorClass, title, content, subContent }: any) => (
    <motion.div 
        variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
        }}
        className="flex items-start gap-4 group cursor-default"
    >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:text-white ${colorClass}`}>
            {icon}
        </div>
        <div>
            <h4 className="font-semibold text-lg">{title}</h4>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed">{content}</p>
            {subContent && <p className="text-slate-500 text-xs mt-1">{subContent}</p>}
        </div>
    </motion.div>
);

const InputGroup = ({ label, name, type="text", value, onChange, placeholder }: any) => (
    <div className="group">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
        <motion.div whileTap={{ scale: 0.99 }}>
            <input 
                type={type} name={name} required value={value} onChange={onChange}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all duration-200 font-medium text-slate-900 placeholder-placeholder" 
                placeholder={placeholder} 
            />
        </motion.div>
    </div>
);

export default Contact;