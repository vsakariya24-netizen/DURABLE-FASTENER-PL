import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Mail, Calendar, Trash2, CheckCircle, Loader2, 
  MessageSquare, Phone, Eye 
} from 'lucide-react';

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxKBWWA_2TJuzAtccTqPYF9Wbm3sp084dCoD6bNH1shMYyCCH3gGsj2SjjG8ZojNsI/exec';

interface Enquiry {
  id: string;
  enquiry_id: string; // Ticket ID add kiya
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'contacted';
}

const Enquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null); // Status update loader

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

  // --- NEW: Handle Status Update (Mark as Read) ---
 const handleStatusUpdate = async (id: string, newStatus: 'read' | 'contacted') => {
  setUpdatingId(id);
  
  // Debugging ke liye console log
  console.log("Updating ID:", id, "to status:", newStatus);

  const { data, error } = await supabase
    .from('enquiries')
    .update({ status: newStatus }) // Yahan status column update ho raha hai
    .eq('id', id) // 'id' primary key honi chahiye
    .select(); // Update ke baad data wapas mangwayein verify karne ke liye

  if (error) {
    console.error("Supabase Update Error:", error.message);
    alert("Error: " + error.message);
  } else {
    console.log("Updated Data:", data);
    // Local state update
    setEnquiries(prev => 
      prev.map(enq => enq.id === id ? { ...enq, status: newStatus } : enq)
    );
  }
  setUpdatingId(null);
};

  const syncToSheet = async (enquiry: Enquiry) => {
    setSyncingId(enquiry.id);
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...enquiry,
          timestamp: new Date(enquiry.created_at).toLocaleString()
        })
      });
      alert('Success: Synced to Google Sheets!');
      // Sync ke baad auto-read mark kar sakte hain
      handleStatusUpdate(enquiry.id, 'read');
    } catch (err) {
      alert('Sync failed.');
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Customer Enquiries</h2>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
          Total: {enquiries.length}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center">
          <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900">No Enquiries Yet</h3>
        </div>
      ) : (
        <div className="grid gap-6">
          {enquiries.map((enquiry) => (
            <div 
              key={enquiry.id} 
              className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${
                enquiry.status === 'new' 
                ? 'border-l-8 border-l-yellow-500 border-gray-200 shadow-md' 
                : 'border-gray-200 opacity-80'
              }`}
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shrink-0 ${
                    enquiry.status === 'new' ? 'bg-blue-600' : 'bg-slate-400'
                  }`}>
                    {enquiry.first_name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-slate-900 text-lg">{enquiry.first_name} {enquiry.last_name}</h3>
                      {enquiry.status === 'new' && (
                        <span className="bg-yellow-100 text-yellow-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded">New</span>
                      )}
                    </div>
                    
                    {/* Unique Ticket ID Display */}
                    <p className="text-xs font-mono text-blue-600 font-semibold mb-2">ID: {enquiry.enquiry_id || 'N/A'}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <a href={`mailto:${enquiry.email}`} className="flex items-center gap-1 hover:text-blue-600"><Mail size={14} /> {enquiry.email}</a>
                      <a href={`tel:${enquiry.phone}`} className="flex items-center gap-1 text-emerald-600 font-medium hover:underline">
                        <Phone size={14} /> {enquiry.phone}
                      </a>
                      <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(enquiry.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* --- Action Buttons --- */}
                <div className="flex flex-wrap gap-2 items-center">
                  {/* Mark as Read Button */}
                  {enquiry.status === 'new' && (
                    <button 
                      onClick={() => handleStatusUpdate(enquiry.id, 'read')}
                      disabled={updatingId === enquiry.id}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-semibold disabled:opacity-50"
                    >
                      {updatingId === enquiry.id ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
                      Mark Read
                    </button>
                  )}

                  {/* Sync Button */}
                  <button 
                    onClick={() => syncToSheet(enquiry)}
                    disabled={syncingId === enquiry.id}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold disabled:opacity-50"
                  >
                    {syncingId === enquiry.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    Sync to Sheet
                  </button>

                  <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-700 mb-2 text-xs uppercase tracking-wider">Subject: {enquiry.subject}</h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{enquiry.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Enquiries;