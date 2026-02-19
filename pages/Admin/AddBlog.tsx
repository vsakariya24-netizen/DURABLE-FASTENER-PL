import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Plus, Trash2, ArrowLeft, Upload, X, Layout } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const AddBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Sections state to store multiple heading/body pairs
  const [sections, setSections] = useState([{ heading: '', body: '' }]);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical Guide',
    excerpt: '',
    author: 'Durable Editorial',
    image_url: ''
  });

  useEffect(() => {
    if (isEditing) {
      const fetchBlog = async () => {
        // FIX: Added 'id' column name to .eq()
        const { data } = await supabase.from('blogs').select('*').eq('id', id).single(); 
        if (data) {
          setFormData(data);
          setImagePreview(data.image_url);
          // Parse saved JSON content back into sections array
          try { 
            const savedSections = JSON.parse(data.content);
            setSections(savedSections);
          } catch (err) {
            setSections([{ heading: '', body: data.content }]); 
          }
        }
      };
      fetchBlog();
    }
  }, [id, isEditing]);

  const addSection = () => setSections([...sections, { heading: '', body: '' }]);
  const removeSection = (index: number) => setSections(sections.filter((_, i) => i !== index));
  const updateSection = (index: number, field: string, value: string) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setSections(newSections);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = formData.image_url;
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        await supabase.storage.from('blog-images').upload(fileName, imageFile);
        finalImageUrl = supabase.storage.from('blog-images').getPublicUrl(fileName).data.publicUrl;
      }

      // Payload includes sections converted to a JSON string
      const payload = { 
        ...formData, 
        image_url: finalImageUrl,
        content: JSON.stringify(sections) 
      };

      const { error } = isEditing 
        ? await supabase.from('blogs').update(payload).eq('id', id) 
        : await supabase.from('blogs').insert([payload]);

      if (error) throw error;
      navigate('/admin/blogs');
    } catch (err: any) { 
      alert(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 min-h-screen bg-[#F9F9F9]">
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-zinc-200 shadow-sm sticky top-4 z-50">
          <Link to="/admin/blogs" className="text-zinc-400 hover:text-black flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
            <ArrowLeft size={16}/> BACK
          </Link>
          <button disabled={loading} className="bg-zinc-900 text-yellow-500 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-black transition-all">
            <Save size={18}/> {loading ? 'SAVING...' : 'PUBLISH BLOG'}
          </button>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-zinc-200 shadow-sm space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block text-center">ARTICLE TITLE</label>
                    <textarea 
                        value={formData.title} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full text-3xl font-black border-none focus:ring-0 bg-zinc-50 rounded-2xl p-6 text-center"
                        placeholder="e.g. Drywall Screws vs Nails"
                    />
                </div>
                <div className="relative group aspect-video bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl overflow-hidden flex flex-col items-center justify-center cursor-pointer">
                    {imagePreview ? (
                        <>
                            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview"/>
                            <button onClick={() => {setImagePreview(null); setImageFile(null);}} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg"><X size={16}/></button>
                        </>
                    ) : (
                        <div className="text-center">
                            <Upload className="text-zinc-300 mx-auto mb-2" size={32}/>
                            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Upload Cover</p>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                                if(e.target.files?.[0]) {
                                    setImageFile(e.target.files[0]);
                                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                                }
                            }}/>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black text-zinc-900 flex items-center gap-2">
            <Layout size={20} className="text-yellow-500"/> BUILD CONTENT SECTIONS
          </h3>
          {sections.map((section, index) => (
            <div key={index} className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm relative group hover:border-yellow-400 transition-all">
                <button type="button" onClick={() => removeSection(index)} className="absolute top-6 right-6 text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={18}/>
                </button>
                <div className="space-y-4">
                    <input 
                      type="text" 
                      value={section.heading} 
                      onChange={(e) => updateSection(index, 'heading', e.target.value)}
                      placeholder="Section Heading (e.g. Why Confusion Exists)"
                      className="w-full text-xl font-black border-none focus:ring-0 bg-zinc-50 rounded-xl p-4"
                    />
                    <textarea 
                      value={section.body} 
                      onChange={(e) => updateSection(index, 'body', e.target.value)}
                      placeholder="Detailed content for this section..."
                      rows={5}
                      className="w-full text-lg border-none focus:ring-0 bg-zinc-50 rounded-xl p-4 font-serif leading-relaxed"
                    />
                </div>
            </div>
          ))}
          <button 
            type="button" 
            onClick={addSection}
            className="w-full py-8 border-2 border-dashed border-zinc-200 rounded-[2.5rem] text-zinc-400 font-black flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all"
          >
            <Plus size={20}/> ADD NEW CONTENT SECTION
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;