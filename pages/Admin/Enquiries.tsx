import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Calendar, Trash2, CheckCircle, Loader2, MessageSquare } from 'lucide-react';

interface Enquiry {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'contacted';
}

const Enquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('enquiries')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus as any } : e));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this enquiry?')) return;
    const { error } = await supabase.from('enquiries').delete().eq('id', id);
    if (!error) {
      setEnquiries(prev => prev.filter(e => e.id !== id));
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-dark" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Enquiries</h1>
          <p className="text-gray-500">Manage incoming messages and quote requests.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm text-sm font-bold text-gray-600">
          Total: {enquiries.length}
        </div>
      </div>

      {enquiries.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center">
          <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900">No Enquiries Yet</h3>
          <p className="text-gray-500">Messages from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {enquiries.map((enquiry) => (
            <div 
              key={enquiry.id} 
              className={`bg-white p-6 rounded-xl shadow-sm border transition-all ${enquiry.status === 'new' ? 'border-l-4 border-l-brand-yellow border-gray-200' : 'border-gray-200 opacity-75 hover:opacity-100'}`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${enquiry.status === 'new' ? 'bg-brand-dark' : 'bg-gray-400'}`}>
                    {enquiry.first_name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{enquiry.first_name} {enquiry.last_name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><Mail size={14} /> {enquiry.email}</span>
                      <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(enquiry.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {enquiry.status === 'new' && (
                    <button 
                      onClick={() => handleStatusUpdate(enquiry.id, 'read')}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <CheckCircle size={16} /> Mark Read
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(enquiry.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
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