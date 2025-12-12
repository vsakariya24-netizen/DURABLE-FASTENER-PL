import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

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

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300">Get in touch with our expert team for quotes and inquiries.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Get In Touch</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-brand-blue">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Head Office & Factory</h3>
                  <p className="text-gray-600 mt-1">
                    Plot No.16, Survey No.660, Surbhi Ind Zone-D,<br/>
                    Ravki - Makhavad Main Road, Village-Makhavad,<br/>
                    Taluka-Lodhika, Rajkot-360004, Gujarat, India
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600 mt-1">+91 87587 00709</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600 mt-1">durablefastener@outlook.com</p>
                </div>
              </div>
            </div>
            <div className="mt-12">
               <div className="w-full h-80 bg-gray-200 rounded-xl overflow-hidden shadow-lg border border-gray-200 relative">
                 <iframe 
                   width="100%" 
                   height="100%" 
                   id="gmap_canvas" 
                   src="https://maps.google.com/maps?q=Durable%20Fastener%20Pvt.%20Ltd.%20Rajkot&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                   frameBorder="0" 
                   scrolling="no" 
                   title="Durable Fastener Location"
                   style={{ filter: 'grayscale(0.2) contrast(1.1)' }}
                 ></iframe>
               </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send an Enquiry</h2>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-xl text-center">
                 <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                 <p>Thank you for contacting us. We will respond shortly.</p>
                 <button onClick={() => setSubmitted(false)} className="mt-4 text-sm font-bold underline">Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="text-red-500 text-sm">{error}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input 
                      type="text" name="first_name" required value={formData.first_name} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" placeholder="John" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input 
                      type="text" name="last_name" required value={formData.last_name} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" placeholder="Doe" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" name="email" required value={formData.email} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" placeholder="john@company.com" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select 
                    name="subject" value={formData.subject} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none bg-white"
                  >
                    <option>General Inquiry</option>
                    <option>Request for Quote</option>
                    <option>Distributorship Application</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    name="message" rows={4} required value={formData.message} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" placeholder="Tell us about your requirements..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-brand-yellow text-brand-dark font-bold py-4 rounded-lg hover:bg-yellow-400 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />} Send Message
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
