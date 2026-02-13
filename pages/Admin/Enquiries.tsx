import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Calendar, Trash2, CheckCircle, Loader2, MessageSquare, Share, Phone } from 'lucide-react';

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyijhbaehBavkvP8zmOcdRssVbgSBAK3-FX8Q0dLm4H7E5u2e-yEVAofFe0FyXhxl4/exec';

interface Enquiry {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string; // 1. Added phone to interface
  subject: string;
  message: string;
  status: 'new' | 'read' | 'contacted';
}

const Enquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching enquiries:', error);
    else setEnquiries(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const syncToSheet = async (enquiry: Enquiry) => {
    setSyncingId(enquiry.id);
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
  ...enquiry,
  phone: enquiry.phone, // <--- This label must match the script
  timestamp: new Date(enquiry.created_at).toLocaleString()
})
      });
      alert('Success: Data (including Phone) synced to Google Sheets!');
    } catch (err) {
      console.error("Sync failed:", err);
      alert('Sync failed.');
    } finally {
      setSyncingId(null);
    }
  };

  // ... (handleStatusUpdate and handleDelete remain same)

  return (
    <div className="space-y-6">
      {/* ... (Header remains same) */}

      {enquiries.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center">
          <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900">No Enquiries Yet</h3>
        </div>
      ) : (
        <div className="grid gap-4">
          {enquiries.map((enquiry) => (
            <div 
              key={enquiry.id} 
              className={`bg-white p-6 rounded-xl shadow-sm border transition-all ${enquiry.status === 'new' ? 'border-l-4 border-l-yellow-500 border-gray-200' : 'border-gray-200 opacity-90'}`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${enquiry.status === 'new' ? 'bg-slate-900' : 'bg-gray-400'}`}>
                    {enquiry.first_name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{enquiry.first_name} {enquiry.last_name}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><Mail size={14} /> {enquiry.email}</span>
                      
                      {/* 3. NEW: Displaying Phone in Admin Side */}
                      <span className="flex items-center gap-1 text-blue-600 font-medium">
                        <Phone size={14} /> {enquiry.phone || 'No Number'}
                      </span>
                      
                      <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(enquiry.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* ... (Buttons remain same) */}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">{enquiry.subject}</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{enquiry.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Enquiries;