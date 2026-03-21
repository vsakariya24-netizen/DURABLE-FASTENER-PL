import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Image as ImageIcon, FileText, Type, User, Upload, X, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const AddBlog = () => {
  const { id } = useParams(); // Get ID from URL if editing
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Industry Trends',
    excerpt: '',
    content: '',
    author: 'Admin',
    image_url: '' // store existing URL here
  });

  // Load data if Editing
  useEffect(() => {
    if (isEditing) {
      const fetchBlog = async () => {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error(error);
          alert('Error fetching blog details');
        } else if (data) {
          setFormData({
            title: data.title,
            category: data.category,
            excerpt: data.excerpt,
            content: data.content,
            author: data.author,
            image_url: data.image_url
          });
          setImagePreview(data.image_url);
        }
      };
      fetchBlog();
    }
  }, [id, isEditing]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.image_url;

      // 1. Upload NEW Image if selected
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(fileName);

        finalImageUrl = publicUrlData.publicUrl;
      }

      // 2. Insert or Update Database
      if (isEditing) {
        // UPDATE Existing
        const { error } = await supabase
          .from('blogs')
          .update({
            title: formData.title,
            category: formData.category,
            excerpt: formData.excerpt,
            content: formData.content,
            author: formData.author,
            image_url: finalImageUrl
          })
          .eq('id', id);

        if (error) throw error;
        alert('Blog Updated Successfully! ✅');
        navigate('/admin/blogs'); // Go back to list

      } else {
        // INSERT New
        const { error } = await supabase
          .from('blogs')
          .insert([{
            ...formData,
            image_url: finalImageUrl
          }]);

        if (error) throw error;
        alert('Blog Published Successfully! ✅');
        navigate('/admin/blogs'); // Go back to list
      }

    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/admin/blogs" className="inline-flex items-center text-gray-500 hover:text-black mb-4 gap-1 text-sm font-medium">
          <ArrowLeft size={16} /> Back to List
        </Link>
        <h1 className="text-3xl font-black text-zinc-900">
          {isEditing ? 'Edit Article' : 'Write New Article'}
        </h1>
        <p className="text-gray-500">Share industry insights and company news.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 space-y-6">
        
        {/* Title */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <Type size={16} /> Article Title
          </label>
          <input 
            required 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            type="text" 
            placeholder="e.g. The Future of Titanium Fasteners"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <FileText size={16} /> Category
            </label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option>Industry Trends</option>
              <option>Technical Guide</option>
              <option>Company News</option>
              <option>Case Study</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <User size={16} /> Author Name
            </label>
            <input 
              name="author" 
              value={formData.author} 
              onChange={handleChange} 
              type="text" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <ImageIcon size={16} /> Cover Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {imagePreview ? (
              <div className="relative z-20 inline-block">
                 <img src={imagePreview} alt="Preview" className="h-48 rounded-lg shadow-md object-cover" />
                 <button 
                  type="button"
                  onClick={(e) => { e.preventDefault(); removeImage(); }}
                  className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-sm"
                 >
                   <X size={16} />
                 </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <Upload size={32} className="mb-2 text-gray-400" />
                <p className="font-medium">Click to upload (or drag & drop)</p>
              </div>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            Short Description
          </label>
          <textarea 
            required 
            name="excerpt" 
            value={formData.excerpt} 
            onChange={handleChange} 
            maxLength={180}
            rows={2}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
          ></textarea>
        </div>

        {/* Content */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            Full Article Content
          </label>
          <textarea 
            required 
            name="content" 
            value={formData.content} 
            onChange={handleChange} 
            rows={10}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 font-mono text-sm"
          ></textarea>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Processing...' : <><Save size={20} /> {isEditing ? 'Update Article' : 'Publish Article'}</>}
        </button>

      </form>
    </div>
  );
};

export default AddBlog;