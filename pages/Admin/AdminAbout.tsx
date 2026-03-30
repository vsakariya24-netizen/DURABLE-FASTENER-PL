import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Info, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminAbout: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    foundation_sqft: 0,
    current_hub_sqft: 0,
    market_partners: 0,
    foundation_year: ''
  });

  useEffect(() => {
    fetchAboutSettings();
  }, []);

  async function fetchAboutSettings() {
    try {
      const { data, error } = await supabase.from('about_settings').select('*').single();
      if (error) throw error;
      if (data) setStats(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase.from('about_settings').upsert({ id: 1, ...stats });
    if (error) alert("Error updating settings");
    else alert("About Page updated successfully!");
    setSaving(false);
  }

  if (loading) return <div className="p-10">Loading Settings...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <Link to="/admin" className="text-gray-500 hover:text-black flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-amber-500 text-black px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-amber-400 transition-all"
        >
          <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-2 text-gray-900 italic">Edit About Page Stats</h1>
      <p className="text-gray-500 mb-8 text-sm">Update the live numbers and history shown on your main About page.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <label className="block text-xs font-black uppercase text-gray-400 mb-2">Foundation Size (SQ FT)</label>
          <input 
            type="number" 
            className="w-full p-3 bg-gray-50 border rounded-xl"
            value={stats.foundation_sqft}
            onChange={(e) => setStats({...stats, foundation_sqft: parseInt(e.target.value)})}
          />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <label className="block text-xs font-black uppercase text-gray-400 mb-2">Current Hub Size (SQ FT)</label>
          <input 
            type="number" 
            className="w-full p-3 bg-gray-50 border rounded-xl"
            value={stats.current_hub_sqft}
            onChange={(e) => setStats({...stats, current_hub_sqft: parseInt(e.target.value)})}
          />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <label className="block text-xs font-black uppercase text-gray-400 mb-2">B2B Network Partners</label>
          <input 
            type="number" 
            className="w-full p-3 bg-gray-50 border rounded-xl"
            value={stats.market_partners}
            onChange={(e) => setStats({...stats, market_partners: parseInt(e.target.value)})}
          />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <label className="block text-xs font-black uppercase text-gray-400 mb-2">Founding Year</label>
          <input 
            type="text" 
            className="w-full p-3 bg-gray-50 border rounded-xl"
            value={stats.foundation_year}
            onChange={(e) => setStats({...stats, foundation_year: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;