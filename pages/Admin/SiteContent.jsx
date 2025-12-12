import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'; // Apna sahi path check karein
import { Edit2, Save, X, Globe, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

const SiteContent = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [editingItem, setEditingItem] = useState(null);
  const [tempValue, setTempValue] = useState('');

  // 1. Data Fetch Karna
  const fetchAssets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_assets')
      .select('*')
      .order('id', { ascending: true });
    
    if (data) setAssets(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // 2. Edit Button Click Logic
  const handleEditClick = (item) => {
    setEditingItem(item);
    setTempValue(item.asset_value);
  };

  // 3. Save Logic
  const handleSave = async () => {
    if (!editingItem) return;

    const { error } = await supabase
      .from('site_assets')
      .update({ asset_value: tempValue })
      .eq('id', editingItem.id);

    if (!error) {
      // Local state update (taaki refresh na karna pade)
      setAssets(assets.map(a => a.id === editingItem.id ? { ...a, asset_value: tempValue } : a));
      setEditingItem(null);
      alert('Updated Successfully!');
    } else {
      alert('Error updating asset');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Site Content Manager</h1>
            <p className="text-gray-500">Manage global images, banners, and social links.</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium text-sm">
            <tr>
              <th className="p-4">Asset Title</th>
              <th className="p-4">Type</th>
              <th className="p-4">Current Value / Preview</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {assets.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-400 font-mono">{item.key_name}</div>
                  <span className="inline-block mt-1 text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                    {item.section}
                  </span>
                </td>
                <td className="p-4 text-gray-500">
                    {item.type === 'image' ? <ImageIcon size={18} /> : <LinkIcon size={18} />}
                </td>
                <td className="p-4">
                  {item.type === 'image' ? (
                    <img 
                        src={item.asset_value} 
                        alt="Preview" 
                        className="h-12 w-auto object-contain rounded border border-gray-200 bg-gray-50" 
                    />
                  ) : (
                    <a href={item.asset_value} target="_blank" className="text-blue-600 hover:underline text-sm truncate max-w-xs block">
                      {item.asset_value}
                    </a>
                  )}
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleEditClick(item)}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black text-sm font-medium inline-flex items-center gap-2"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="p-8 text-center text-gray-500">Loading assets...</div>}
      </div>

      {/* Edit Modal (Popup) */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Edit {editingItem.title}</h3>
                <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-red-500">
                    <X size={24} />
                </button>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        New URL ({editingItem.type})
                    </label>
                    <input 
                        type="text" 
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                        placeholder="Paste new link here..."
                    />
                </div>
                
                {/* Preview agar image hai */}
                {editingItem.type === 'image' && tempValue && (
                    <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">New Preview:</p>
                        <img src={tempValue} className="h-24 w-auto rounded border" onError={(e) => e.target.style.display='none'} />
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <button 
                        onClick={() => setEditingItem(null)}
                        className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="flex-1 py-3 bg-yellow-500 text-black font-bold hover:bg-yellow-400 rounded-xl flex justify-center items-center gap-2"
                    >
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteContent;