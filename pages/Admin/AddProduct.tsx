import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft, Save, Loader2, Trash2, Upload,
  X, Check, Ruler, Image as ImageIcon,
  LayoutGrid, Settings, Hammer, Plus, Info,
  Search, ListPlus, Activity, ShieldCheck,
  Palette, Box, Tag
} from 'lucide-react';

// --- TYPES ---
type CategoryStructure = {
  id: string;
  name: string;
  sub_categories: { id: string; name: string }[];
};

type SpecItem = { key: string; value: string };

type DimItem = {
  label: string;
  symbol: string;
  values: Record<string, string>;
};

type CertItem = { title: string; subtitle: string };
type MaterialRow = { name: string; grades: string };
type AppItem = { name: string; image: string; loading?: boolean };

// --- SUGGESTIONS & CONSTANTS ---
const HEAD_TYPES = ["Bugle Head", "Countersunk (CSK)", "Pan Head", "Wafer Head"];
const DRIVE_TYPES = ["Phillips No.2", "Pozi (PZ)", "Torx (Star)", "Slotted"];
const THREAD_TYPES = ["Fine Thread", "Coarse Thread", "Twinfast", "Hi-Lo"];
const MATERIALS = ["C1022 Hardened Carbon Steel", "Stainless Steel 304", "Mild Steel", "Zinc Alloy", "Aluminium", "Brass"];

const KNOWN_CORE_KEYS = [
  "Head Type", "Drive Type", "Thread Type",
  "Point Type", "Coating", "Plating", "Surface Finish", "Shank Type", "Washer Type",
  "Material", "Grade", "Standard"
];

const DEFAULT_PERFORMANCE_KEYS = [
  "Core Hardness", "Surface Hardness", "Tensile Strength",
  "Shear Strength", "Salt Spray Resistance", "Installation Speed", "Temperature Range"
];

const AddProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<CategoryStructure[]>([]);

  const [materialRows, setMaterialRows] = useState<MaterialRow[]>([{ name: '', grades: '' }]);

  // --- EXPERT / FITTING DATA ---
  const [expertData, setExpertData] = useState({ seo_keywords: '' });
  
  // Specific Data for Fittings (from Code 1)
  const [fittingExtras, setFittingExtras] = useState({
    colors: '',       // "Available Colors"
    general_names: '', // "General Names"
    packing: ''        // "Standard Packing"
  });

  // Main Form Data
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    sub_category: '',
    material: '',
    material_grade: '',
    short_description: '',
    long_description: '',
    images: [] as string[],
    technical_drawing: '',
    specifications: [] as SpecItem[],
    dimensional_specifications: [] as DimItem[],
    applications: [] as AppItem[],
    certifications: [] as CertItem[]
  });

  // --- DYNAMIC CORE SPECS STATE (Fasteners) ---
  const [dynamicCoreSpecs, setDynamicCoreSpecs] = useState<SpecItem[]>([
    { key: 'Head Type', value: '' },
    { key: 'Drive Type', value: '' },
    { key: 'Thread Type', value: '' }
  ]);

  // --- DYNAMIC PERFORMANCE STATE (Fasteners) ---
  const [availablePerfKeys, setAvailablePerfKeys] = useState<string[]>(DEFAULT_PERFORMANCE_KEYS);
  const [selectedPerformance, setSelectedPerformance] = useState<string[]>([]);
  const [isAddingPerf, setIsAddingPerf] = useState(false);
  const [newPerfName, setNewPerfName] = useState('');

  // --- VARIANTS ---
  const [sizes, setSizes] = useState<Array<{ diameter: string, length: string }>>([{ diameter: '', length: '' }]);
  const [finishes, setFinishes] = useState<Array<{ name: string, image: string, loading: boolean }>>([{ name: '', image: '', loading: false }]);

  // --- LOGIC: DETECT CATEGORY TYPE ---
  // This toggles between "Fastener Layout" and "Fitting Layout"
  const isFittingCategory = useMemo(() => {
    const cat = formData.category?.toLowerCase() || '';
    const sub = formData.sub_category?.toLowerCase() || '';
    return (
        cat.includes('fitting') || cat.includes('channel') || cat.includes('hinge') || 
        cat.includes('handle') || cat.includes('lock') || cat.includes('hardware') ||
        sub.includes('fitting') || sub.includes('channel')
    );
  }, [formData.category, formData.sub_category]);

  // --- 1. INITIAL FETCH ---
  useEffect(() => {
    const fetchCategories = async () => {
      const { data: cats } = await supabase.from('categories').select('*');
      const { data: subs } = await supabase.from('sub_categories').select('*');
      if (cats && subs) {
        setCategories(cats.map(cat => ({
          id: cat.id, name: cat.name,
          sub_categories: subs.filter(sub => sub.category_id === cat.id)
        })));
      }
    };
    fetchCategories();
  }, []);

  // --- 2. FETCH PRODUCT ---
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        const { data: product, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) { console.error(error); return; }

        if (product) {
          // Parse Apps
          let loadedApps: AppItem[] = [];
          if (Array.isArray(product.applications)) {
             loadedApps = product.applications.map((app: any) => {
                 if (typeof app === 'string') return { name: app, image: '' };
                 return { name: app.name, image: app.image || '' };
             });
          }

          // Parse Material
          let parsedRows: MaterialRow[] = [{ name: '', grades: '' }];
          if (product.material) {
             const smartSplitRegex = /\s*\|\s*(?![^()]*\))/g;
             let rawParts = (product.material.match(smartSplitRegex) || product.material.includes('|')) 
               ? product.material.split(smartSplitRegex).map((s: string) => s.trim())
               : product.material.split(',').map((s: string) => s.trim());
             parsedRows = rawParts.map((part: string) => {
                const match = part.match(/^(.*?)\s*\(Grade\s*([^)]*)\)$/i);
                return match ? { name: match[1].trim(), grades: match[2].trim() } : { name: part.replace(/\(Grade.*?\)/, '').trim(), grades: '' };
             });
          }
          setMaterialRows(parsedRows.length > 0 ? parsedRows : [{ name: '', grades: '' }]);

          const specs = Array.isArray(product.specifications) ? product.specifications : [];
          const getVal = (k:string) => specs.find((s:any) => s.key === k)?.value || '';
          
          setExpertData({ seo_keywords: getVal('seo_keywords') });
          
          // Populate Fitting Extras
          setFittingExtras({
            colors: specs.find((s:any) => s.key === 'Available Colors')?.value || '',
            general_names: specs.find((s:any) => s.key === 'General Names')?.value || '',
            packing: specs.find((s:any) => s.key === 'Standard Packing')?.value || ''
          });

          // --- SPLIT LOGIC (Core vs Performance vs Other) ---
          const loadedCoreSpecs: SpecItem[] = [];
          const loadedOtherSpecs: SpecItem[] = [];
          const loadedPerfKeys: string[] = [];
          const dynamicAvailableKeys = new Set(DEFAULT_PERFORMANCE_KEYS);

          if (product.head_type) loadedCoreSpecs.push({ key: 'Head Type', value: product.head_type });
          if (product.drive_type) loadedCoreSpecs.push({ key: 'Drive Type', value: product.drive_type });
          if (product.thread_type) loadedCoreSpecs.push({ key: 'Thread Type', value: product.thread_type });
          
          specs.forEach((s: any) => {
              const key = s.key.trim();
              const lowerKey = key.toLowerCase();
              const val = s.value || ''; 

              // Skip keys we handle manually
              if (['seo_keywords', 'available colors', 'general names', 'standard packing', 'standard', 'tds_url', 'mtc_url'].includes(lowerKey)) return;
              if (['head type', 'drive type', 'thread type'].includes(lowerKey)) return;

              const isDefaultPerfKey = DEFAULT_PERFORMANCE_KEYS.some(pk => pk.toLowerCase() === lowerKey);
              const isCustomPerfKey = val.trim().toLowerCase() === "standard";

              if (isDefaultPerfKey || isCustomPerfKey) {
                  const exactKey = DEFAULT_PERFORMANCE_KEYS.find(pk => pk.toLowerCase() === lowerKey) || key;
                  dynamicAvailableKeys.add(exactKey);
                  loadedPerfKeys.push(exactKey);
              } else if (KNOWN_CORE_KEYS.some(k => k.toLowerCase() === lowerKey)) {
                  loadedCoreSpecs.push({ key: s.key, value: s.value });
              } else {
                  loadedOtherSpecs.push({ key: s.key, value: s.value });
              }
          });

          setAvailablePerfKeys(Array.from(dynamicAvailableKeys));

          // Ensure basic core specs exist
          if (!loadedCoreSpecs.find(x => x.key === 'Head Type')) loadedCoreSpecs.unshift({ key: 'Head Type', value: '' });
          if (!loadedCoreSpecs.find(x => x.key === 'Drive Type')) loadedCoreSpecs.splice(1, 0, { key: 'Drive Type', value: '' });
          if (!loadedCoreSpecs.find(x => x.key === 'Thread Type')) loadedCoreSpecs.splice(2, 0, { key: 'Thread Type', value: '' });

          setDynamicCoreSpecs(loadedCoreSpecs);
          setSelectedPerformance(loadedPerfKeys);

          // Handle Dimensions
          let parsedDims: DimItem[] = [];
          if (Array.isArray(product.dimensional_specifications)) {
             parsedDims = product.dimensional_specifications.map((d: any) => ({
                 label: d.label || '',
                 symbol: d.symbol || '',
                 values: typeof d.values === 'object' ? d.values : {} 
             }));
          }

          // Handle Certifications
          let parsedCerts: CertItem[] = [];
          if(Array.isArray(product.certifications) && product.certifications.length > 0) {
             parsedCerts = product.certifications;
          } else if (product.iso_certified === true) {
             parsedCerts = [{ title: "ISO 9001:2015", subtitle: "Certified Facility" }];
          }

          setFormData({
            name: product.name || '',
            slug: product.slug || '',
            category: product.category || '',
            sub_category: product.sub_category || '',
            material: product.material || '',
            material_grade: product.material_grade || '',
            short_description: product.short_description || '',
            long_description: product.long_description || '',
            images: product.images || [],
            technical_drawing: product.technical_drawing || '',
            specifications: loadedOtherSpecs,
            dimensional_specifications: parsedDims,
            applications: loadedApps,
            certifications: parsedCerts
          });

          // Variants
          const { data: variantData } = await supabase.from('product_variants').select('*').eq('product_id', id);
          if (variantData && variantData.length > 0) {
            const uniqueSizes = variantData.reduce((acc: any[], curr) => {
                const exists = acc.find(s => s.diameter === curr.diameter && s.length === curr.length);
                if (!exists && (curr.diameter || curr.length)) acc.push({ diameter: curr.diameter, length: curr.length });
                return acc;
            }, []);
            setSizes(uniqueSizes.length ? uniqueSizes : [{ diameter: '', length: '' }]);

            const uniqueFinishes = variantData.reduce((acc: any[], curr) => {
                const exists = acc.find(f => f.name === curr.finish);
                if (!exists && curr.finish) {
                    const img = product.finish_images ? product.finish_images[curr.finish] : '';
                    acc.push({ name: curr.finish, image: img, loading: false });
                }
                return acc;
            }, []);
            setFinishes(uniqueFinishes.length ? uniqueFinishes : [{ name: '', image: '', loading: false }]);
          }
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  // --- SYNC MATERIAL ---
  useEffect(() => {
    const combinedMaterials = materialRows
      .filter(r => r.name.trim() !== '')
      .map(r => {
        const name = r.name.trim();
        const grade = r.grades.trim();
        return grade ? `${name} (Grade ${grade})` : name;
      })
      .join(' | '); 
    setFormData(prev => ({ ...prev, material: combinedMaterials }));
  }, [materialRows]);

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExpertChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setExpertData({ ...expertData, [e.target.name]: e.target.value });
  };
  
  const handleFittingChange = (e: any) => setFittingExtras(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Performance Logic
  const togglePerformanceSpec = (key: string) => {
    setSelectedPerformance(prev => {
        return prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
    });
  };

  const handleAddCustomPerf = () => {
    const trimmedName = newPerfName.trim();
    if (!trimmedName) { setIsAddingPerf(false); setNewPerfName(''); return; }
    if (!availablePerfKeys.some(k => k.toLowerCase() === trimmedName.toLowerCase())) {
        setAvailablePerfKeys(prev => [...prev, trimmedName]); 
        setSelectedPerformance(prev => [...prev, trimmedName]); 
    }
    setNewPerfName('');
    setIsAddingPerf(false);
  };

  // Helper Functions
  const addCoreSpec = () => setDynamicCoreSpecs([...dynamicCoreSpecs, { key: '', value: '' }]);
  const removeCoreSpec = (idx: number) => setDynamicCoreSpecs(dynamicCoreSpecs.filter((_, i) => i !== idx));
  const updateCoreSpec = (idx: number, field: 'key' | 'value', val: string) => {
    const newSpecs = [...dynamicCoreSpecs];
    newSpecs[idx][field] = val;
    setDynamicCoreSpecs(newSpecs);
  };

  const addSpec = () => setFormData(p => ({ ...p, specifications: [...p.specifications, { key: '', value: '' }] }));
  const removeSpec = (idx: number) => setFormData(p => ({ ...p, specifications: p.specifications.filter((_, i) => i !== idx) }));
  const updateSpec = (idx: number, field: 'key'|'value', val: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[idx][field] = val;
    setFormData(p => ({ ...p, specifications: newSpecs }));
  };

  const addDim = () => setFormData(p => ({ ...p, dimensional_specifications: [...p.dimensional_specifications, { label: '', symbol: '', values: {} }] }));
  const removeDim = (idx: number) => setFormData(p => ({ ...p, dimensional_specifications: p.dimensional_specifications.filter((_, i) => i !== idx) }));
  const updateDim = (idx: number, field: 'label' | 'symbol' | 'values', val: string, diameterKey?: string) => {
    const newDims = [...formData.dimensional_specifications];
    if (field === 'values' && diameterKey) {
        newDims[idx].values = { ...newDims[idx].values, [diameterKey]: val };
    } else if (field === 'label' || field === 'symbol') {
        newDims[idx][field] = val;
    }
    setFormData(p => ({ ...p, dimensional_specifications: newDims }));
  };

  // Certifications
  const addCert = () => setFormData(p => ({ ...p, certifications: [...p.certifications, { title: 'ISO 9001:2015', subtitle: 'Certified Facility' }] }));
  const removeCert = (idx: number) => setFormData(p => ({ ...p, certifications: p.certifications.filter((_, i) => i !== idx) }));
  const updateCert = (idx: number, field: 'title' | 'subtitle', val: string) => {
      const newCerts = [...formData.certifications];
      newCerts[idx][field] = val;
      setFormData(p => ({ ...p, certifications: newCerts }));
  };

  // Material Helpers
  const addMaterialRow = () => setMaterialRows([...materialRows, { name: '', grades: '' }]);
  const removeMaterialRow = (idx: number) => setMaterialRows(materialRows.filter((_, i) => i !== idx));
  const updateMaterialRow = (idx: number, field: 'name' | 'grades', val: string) => {
      const newRows = [...materialRows];
      newRows[idx][field] = val;
      setMaterialRows(newRows);
  };

  // Files
  const uploadFile = async (file: File, folder: string) => {
    const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const { error } = await supabase.storage.from('product-images').upload(fileName, file); 
    if (error) throw error;
    const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleAppImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    if (!e.target.files?.[0]) return;
    const newApps = [...formData.applications]; newApps[idx].loading = true; setFormData(p => ({ ...p, applications: newApps }));
    try { const url = await uploadFile(e.target.files[0], 'applications'); newApps[idx].image = url; } catch(err) { alert('Upload failed'); }
    newApps[idx].loading = false; setFormData(p => ({ ...p, applications: newApps }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try { const url = await uploadFile(e.target.files[0], 'gallery'); setFormData(prev => ({ ...prev, images: [url, ...prev.images] })); } catch(err) { alert('Upload failed'); }
    setUploading(false);
  };

  const handleTechDrawingUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try { const url = await uploadFile(e.target.files[0], 'tech'); setFormData(prev => ({ ...prev, technical_drawing: url })); } catch(err) { alert('Upload failed'); }
    setUploading(false);
  };

  // Apps, Sizes, Finishes Helpers
  const addApp = () => setFormData(p => ({ ...p, applications: [...p.applications, { name: '', image: '' }] }));
  const updateAppName = (idx: number, val: string) => { const newApps = [...formData.applications]; newApps[idx].name = val; setFormData(p => ({ ...p, applications: newApps })); };
  const removeApp = (idx: number) => setFormData(p => ({ ...p, applications: p.applications.filter((_, i) => i !== idx) }));

  const addSizeRow = () => setSizes([...sizes, { diameter: '', length: '' }]);
  const removeSizeRow = (idx: number) => setSizes(sizes.filter((_, i) => i !== idx));
  const handleSizeChange = (idx: number, field: 'diameter'|'length', val: string) => { const n = [...sizes]; n[idx][field] = val; setSizes(n); };
  
  const addFinishRow = () => setFinishes([...finishes, { name: '', image: '', loading: false }]);
  const removeFinishRow = (idx: number) => setFinishes(finishes.filter((_, i) => i !== idx));
  const handleFinishNameChange = (idx: number, val: string) => { const n = [...finishes]; n[idx].name = val; setFinishes(n); };
  const handleFinishImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
     if(!e.target.files?.[0]) return;
     const n = [...finishes]; n[idx].loading = true; setFinishes(n);
     try { const url = await uploadFile(e.target.files[0], 'finishes'); n[idx].image = url; } catch(err) { alert('Finish upload failed'); }
     n[idx].loading = false; setFinishes(n);
  };

  const uniqueDiameters = Array.from(new Set<string>(
    sizes.map(s => s.diameter.trim()).filter(d => d !== '')
  )).sort((a: string, b: string) => parseFloat(a) - parseFloat(b));

  // --- SUBMIT FUNCTION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalSlug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const finishImageMap: Record<string, string> = {};
    finishes.forEach(f => { if(f.name && f.image) finishImageMap[f.name] = f.image; });

    const findValue = (keyName: string) => {
        const found = dynamicCoreSpecs.find(s => s.key.trim().toLowerCase() === keyName.toLowerCase());
        return found ? found.value : '';
    };

    const extraCoreSpecs = dynamicCoreSpecs.filter(s => 
        !['head type', 'drive type', 'thread type'].includes(s.key.trim().toLowerCase()) && s.key.trim() !== ''
    );

    const formattedPerformanceSpecs = selectedPerformance.map(key => ({ key: key, value: "Standard" }));

    // MERGE ALL SPECS (General + Performance + Core Extras + Fitting Extras)
    const mergedSpecs = [
        ...formData.specifications.filter(s => s.key && s.value),
        ...extraCoreSpecs,
        ...formattedPerformanceSpecs,
        { key: 'Available Colors', value: fittingExtras.colors },
        { key: 'General Names', value: fittingExtras.general_names },
        { key: 'Standard Packing', value: fittingExtras.packing },
        { key: 'seo_keywords', value: expertData.seo_keywords }
    ].filter(s => s.value && s.value.trim() !== ''); 

    const validDimensions = formData.dimensional_specifications.filter(d => d.label.trim() !== '');
    const validCerts = formData.certifications.filter(c => c.title.trim() !== '');

    const payload = {
      ...formData,
      slug: finalSlug,
      certifications: validCerts,
      head_type: findValue('Head Type'),   
      drive_type: findValue('Drive Type'),
      thread_type: findValue('Thread Type'),
      finish_images: finishImageMap,
      applications: formData.applications.filter(a => a.name.trim() !== '').map(({loading, ...rest}) => rest),
      specifications: mergedSpecs,
      dimensional_specifications: validDimensions
    };

    try {
      let productId = id;
      if (isEditMode) {
        const { error } = await supabase.from('products').update(payload).eq('id', id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('products').insert([payload]).select().single();
        if (error) throw error;
        productId = data.id;
      }

      if (productId) {
        await supabase.from('product_variants').delete().eq('product_id', productId);
        const validSizes = sizes.filter(s => s.diameter || s.length);
        const validFinishes = finishes.filter(f => f.name);
        const variantsToInsert: any[] = [];

        if (validSizes.length > 0) {
           validSizes.forEach(size => {
              if (validFinishes.length > 0) {
                  validFinishes.forEach(finish => { variantsToInsert.push({ product_id: productId, diameter: size.diameter, length: size.length, finish: finish.name }); });
              } else { variantsToInsert.push({ product_id: productId, diameter: size.diameter, length: size.length, finish: '' }); }
           });
        } else if (validFinishes.length > 0) {
           validFinishes.forEach(finish => variantsToInsert.push({ product_id: productId, diameter: '', length: '', finish: finish.name }));
        }
        if (variantsToInsert.length > 0) await supabase.from('product_variants').insert(variantsToInsert);
      }
      
      navigate('/admin/products');
      
    } catch (error: any) {
      console.error("Error saving product:", error);
      alert('Failed to save product: ' + error.message);
    } finally { setLoading(false); }
  };

  const activeSubCategories = categories.find(c => c.name === formData.category)?.sub_categories || [];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <datalist id="headTypeOptions">{HEAD_TYPES.map(o => <option key={o} value={o} />)}</datalist>
        <datalist id="driveTypeOptions">{DRIVE_TYPES.map(o => <option key={o} value={o} />)}</datalist>
        <datalist id="threadTypeOptions">{THREAD_TYPES.map(o => <option key={o} value={o} />)}</datalist>
        <datalist id="materialOptions">{MATERIALS.map(o => <option key={o} value={o} />)}</datalist>
        <datalist id="coreAttributesSuggestions"><option value="Head Type" /><option value="Drive Type" /><option value="Thread Type" /><option value="Point Type" /><option value="Coating" /></datalist>

        {/* 1. Basic Info & SEO */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2"><Check size={18} className="text-blue-600" /> Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div><label className="block text-sm font-bold mb-1">Product Name</label><input name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-sm font-bold mb-1">Category</label><select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg"><option value="">Select...</option>{categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
                <div><label className="block text-sm font-bold mb-1">Sub Category</label><select name="sub_category" value={formData.sub_category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg"><option value="">Select...</option>{activeSubCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
              </div>
          </div>
          <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-2"><Search size={14}/> SEO Keywords (Comma Separated)</label>
              <input name="seo_keywords" value={expertData.seo_keywords} onChange={handleExpertChange} placeholder="e.g. Drywall Screw, Black Phosphate, Gypsum Screw" className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-sm"/>
          </div>
          <textarea name="short_description" value={formData.short_description} onChange={handleChange} placeholder="Short Description" className="w-full px-4 py-2 border rounded-lg mb-4" rows={2} />
          <textarea name="long_description" value={formData.long_description} onChange={handleChange} placeholder="Long Description" className="w-full px-4 py-2 border rounded-lg" rows={4} />
        </div>

        {/* 2. CERTIFICATIONS & BADGES */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="font-bold text-gray-900 flex items-center gap-2"><ShieldCheck size={18} className="text-emerald-600" /> Certifications</h3>
                <button type="button" onClick={addCert} className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded hover:bg-emerald-200 flex items-center gap-1"><Plus size={14} /> Add Badge</button>
            </div>
            <div className="space-y-3">
                {formData.certifications.length === 0 && <div className="text-center text-sm text-gray-400 py-2 italic bg-gray-50 rounded">No certifications added.</div>}
                {formData.certifications.map((cert, idx) => (
                    <div key={idx} className="flex gap-4 items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="pt-2"><ShieldCheck className="text-gray-300" size={24} /></div>
                        <div className="flex-1 space-y-2">
                            <div><label className="block text-[10px] font-bold text-gray-400 uppercase">Title</label><input value={cert.title} onChange={(e) => updateCert(idx, 'title', e.target.value)} className="w-full px-3 py-1.5 border rounded text-sm font-bold text-gray-800" placeholder="Certification Name"/></div>
                            <div><label className="block text-[10px] font-bold text-gray-400 uppercase">Subtitle</label><input value={cert.subtitle} onChange={(e) => updateCert(idx, 'subtitle', e.target.value)} className="w-full px-3 py-1.5 border rounded text-sm text-gray-600" placeholder="Description or Type"/></div>
                        </div>
                        <button type="button" onClick={() => removeCert(idx)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18} /></button>
                    </div>
                ))}
            </div>
        </div>

        {/* 3. CORE SPECS + MATERIAL (Standard for All) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><Hammer size={18} /> Core Specs</h3>
                  {!isFittingCategory && (
                    <button type="button" onClick={addCoreSpec} className="text-xs bg-black text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-slate-800 transition-colors"><ListPlus size={14}/> Add Attribute</button>
                  )}
              </div>
              
              {/* Material Builder (Used for both Fasteners and Fittings) */}
              <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase">Material Composition</label>
                      <button type="button" onClick={addMaterialRow} className="text-xs bg-white border border-gray-300 text-gray-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-gray-100"><Plus size={12}/> Add Grade</button>
                  </div>
                  <div className="space-y-2">
                      {materialRows.map((row, idx) => (
                          <div key={idx} className="flex gap-2 items-start">
                              <div className="flex-1"><input value={row.name} list="materialOptions" onChange={(e) => updateMaterialRow(idx, 'name', e.target.value)} placeholder="Material Name" className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                              <div className="flex-1"><input value={row.grades} onChange={(e) => updateMaterialRow(idx, 'grades', e.target.value)} placeholder="Grade" className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                              {materialRows.length > 1 && (<button type="button" onClick={() => removeMaterialRow(idx)} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={16}/></button>)}
                          </div>
                      ))}
                  </div>
              </div>

              {/* DYNAMIC LAYOUT SWITCH */}
              {isFittingCategory ? (
                 // --- FITTING LAYOUT: Architectural DNA ---
                 <div className="border border-orange-200 bg-orange-50/50 p-4 rounded-xl">
                    <h3 className="font-bold mb-4 flex gap-2 text-orange-800"><LayoutGrid size={18} className="text-orange-600"/> Architectural DNA</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded border border-orange-100">
                             <label className="text-xs font-bold uppercase block mb-1 flex items-center gap-2 text-gray-600"><Palette size={14}/> Available Colors/Finishes</label>
                             <input name="colors" value={fittingExtras.colors} onChange={handleFittingChange} placeholder="Gold, Silver, Black Antique..." className="w-full border p-2 rounded text-sm"/>
                        </div>
                        <div className="bg-white p-3 rounded border border-orange-100">
                             <label className="text-xs font-bold uppercase block mb-1 flex items-center gap-2 text-gray-600"><Box size={14}/> Standard Packing</label>
                             <input name="packing" value={fittingExtras.packing} onChange={handleFittingChange} placeholder="100 pcs/box..." className="w-full border p-2 rounded text-sm"/>
                        </div>
                        <div className="col-span-1 md:col-span-2 bg-white p-3 rounded border border-orange-100">
                             <label className="text-xs font-bold uppercase block mb-1 flex items-center gap-2 text-gray-600"><Tag size={14}/> General Names / Tags</label>
                             <input name="general_names" value={fittingExtras.general_names} onChange={handleFittingChange} placeholder="Door Hinge, Cabinet Handle..." className="w-full border p-2 rounded text-sm"/>
                        </div>
                    </div>
                 </div>
              ) : (
                 // --- FASTENER LAYOUT: Head/Drive/Thread ---
                 <div className="space-y-3">
                    {dynamicCoreSpecs.map((spec, idx) => (
                        <div key={idx} className="flex gap-4">
                            <input list="coreAttributesSuggestions" value={spec.key} onChange={(e) => updateCoreSpec(idx, 'key', e.target.value)} placeholder="Attribute Name" className="flex-1 px-3 py-2 border rounded-lg" />
                            <input list={spec.key === 'Head Type' ? "headTypeOptions" : spec.key === 'Drive Type' ? "driveTypeOptions" : spec.key === 'Thread Type' ? "threadTypeOptions" : ""} value={spec.value} onChange={(e) => updateCoreSpec(idx, 'value', e.target.value)} placeholder="Value" className="flex-1 px-3 py-2 border rounded-lg" />
                            <button type="button" onClick={() => removeCoreSpec(idx)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                        </div>
                    ))}
                 </div>
              )}
        </div>

        {/* 4. PERFORMANCE DATA (Only for Fasteners) */}
        {!isFittingCategory && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-4 border-b pb-2 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Activity size={18} className="text-amber-500" /> Performance Specifications</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {isAddingPerf ? (
                            <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-4 duration-300">
                                <input autoFocus type="text" value={newPerfName} onChange={(e) => setNewPerfName(e.target.value)} placeholder="Feature Name..." className="text-sm px-2 py-1 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 w-40" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomPerf(); }}} />
                                <button type="button" onClick={handleAddCustomPerf} className="bg-green-600 text-white p-1.5 rounded hover:bg-green-700"><Check size={14} /></button>
                                <button type="button" onClick={() => setIsAddingPerf(false)} className="bg-gray-200 text-gray-600 p-1.5 rounded hover:bg-gray-300"><X size={14} /></button>
                            </div>
                        ) : (
                            <button type="button" onClick={() => setIsAddingPerf(true)} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 font-bold px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-amber-100 transition-colors"><Plus size={14} /> Add Custom</button>
                        )}
                      </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {availablePerfKeys.map((key) => {
                        const isSelected = selectedPerformance.includes(key);
                        return (
                            <div key={key} onClick={() => togglePerformanceSpec(key)} className={`cursor-pointer rounded-lg p-3 border text-sm font-medium flex items-center gap-3 transition-all ${isSelected ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}>
                                <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-colors ${isSelected ? 'bg-amber-500 border-amber-500' : 'bg-white border-gray-300'}`}>{isSelected && <Check size={14} className="text-white" strokeWidth={3} />}</div>
                                <span className="break-words leading-tight">{key}</span>
                            </div>
                        );
                    })}
                  </div>
            </div>
        )}

        {/* 5. Blueprint Data (Tech Drawing & Dimensions Table) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4 border-b pb-2"><h3 className="font-bold text-gray-900 flex items-center gap-2"><Ruler size={18} /> Blueprint Data</h3><button type="button" onClick={addDim} className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded hover:bg-amber-200">+ Add Feature</button></div>
              <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300 flex items-center gap-6">
                  <div className="w-32 h-20 bg-white border flex items-center justify-center overflow-hidden rounded">{formData.technical_drawing ? <img src={formData.technical_drawing} className="w-full h-full object-contain mix-blend-multiply" /> : <ImageIcon className="text-gray-300" />}</div>
                  <div><label className="block text-sm font-bold mb-1">Drawing Image</label><input type="file" onChange={handleTechDrawingUpload} className="text-sm" /></div>
              </div>
              <div className="overflow-x-auto pb-4">
                  {uniqueDiameters.length === 0 ? (
                      <div className="text-center p-4 text-red-500 bg-red-50 rounded text-sm border border-red-100">⚠️ Please add "Sizes" in the "Dimensions (Variants)" section below to generate columns for this table.</div>
                  ) : (
                      <table className="w-full min-w-[600px] border-collapse text-sm">
                        <thead><tr className="bg-gray-100 text-xs uppercase text-gray-500 font-bold text-left"><th className="p-3 border-b min-w-[150px]">Feature Name</th><th className="p-3 border-b w-[80px]">Symbol</th>{uniqueDiameters.map(dia => (<th key={dia} className="p-3 border-b min-w-[120px] text-blue-600">Dia ({dia})</th>))}<th className="p-3 border-b w-[40px]"></th></tr></thead>
                        <tbody>{formData.dimensional_specifications.map((dim, idx) => (<tr key={idx} className="border-b hover:bg-gray-50 transition-colors"><td className="p-2"><input value={dim.label} onChange={(e) => updateDim(idx, 'label', e.target.value)} placeholder="Feature Name" className="w-full px-2 py-1 border rounded bg-transparent focus:bg-white" /></td><td className="p-2"><input value={dim.symbol} onChange={(e) => updateDim(idx, 'symbol', e.target.value)} placeholder="dk" className="w-full px-2 py-1 border rounded bg-transparent focus:bg-white font-mono text-center" /></td>{uniqueDiameters.map(dia => (<td key={dia} className="p-2"><input value={dim.values[dia] || ''} onChange={(e) => updateDim(idx, 'values', e.target.value, dia)} placeholder={`Val`} className="w-full px-2 py-1 border rounded bg-blue-50/30 focus:bg-white text-center" /></td>))}<td className="p-2 text-center"><button type="button" onClick={() => removeDim(idx)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button></td></tr>))}</tbody>
                      </table>
                  )}
              </div>
        </div>

        {/* 6. Additional Specs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4 border-b pb-2"><h3 className="font-bold text-gray-900 flex items-center gap-2"><Settings size={18} /> Other Specs</h3><button type="button" onClick={addSpec} className="text-xs bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded">+ Add Spec</button></div>
              <div className="space-y-3">
                  {formData.specifications.map((spec, idx) => (
                      <div key={idx} className="flex gap-4">
                          <input value={spec.key} onChange={(e) => updateSpec(idx, 'key', e.target.value)} placeholder="Label" className="flex-1 px-3 py-2 border rounded-lg" />
                          <input value={spec.value} onChange={(e) => updateSpec(idx, 'value', e.target.value)} placeholder="Value" className="flex-1 px-3 py-2 border rounded-lg" />
                          <button type="button" onClick={() => removeSpec(idx)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                      </div>
                  ))}
              </div>
        </div>

        {/* 7. Applications */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <div className="flex justify-between items-center mb-4 border-b pb-2"><h3 className="font-bold text-gray-900 flex items-center gap-2"><LayoutGrid size={18} /> Applications</h3><button type="button" onClick={addApp} className="text-xs bg-green-100 text-green-800 font-bold px-3 py-1 rounded">+ Add</button></div>
           <div className="bg-yellow-50 text-yellow-800 p-3 rounded text-xs mb-4 flex gap-2"><Info size={16} /><p>Use keywords like "Wood", "Gypsum", "Electrical" in App Name to auto-trigger icons.</p></div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {formData.applications.map((app, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <div className="relative w-14 h-14 bg-white border border-gray-200 rounded flex-shrink-0 flex items-center justify-center overflow-hidden group">
                       {app.image ? (<img src={app.image} className="w-full h-full object-cover" />) : (<ImageIcon size={20} className="text-gray-300" />)}
                       {app.loading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 size={16} className="animate-spin text-green-600"/></div>}
                       <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white"><Upload size={16} /><input type="file" className="hidden" onChange={(e) => handleAppImageUpload(e, idx)} /></label>
                   </div>
                   <div className="flex-1"><label className="text-[10px] uppercase font-bold text-gray-400">App Name</label><input value={app.name} onChange={(e) => updateAppName(idx, e.target.value)} className="w-full px-2 py-1 border rounded text-sm" /></div>
                   <button type="button" onClick={() => removeApp(idx)} className="text-red-400 p-2"><Trash2 size={18}/></button>
                </div>
             ))}
           </div>
        </div>

        {/* 8. Sizes & Finishes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold">Dimensions (Variants)</h3><button type="button" onClick={addSizeRow} className="text-blue-600 text-sm font-bold">+ Add Size</button></div>
                <div className="space-y-2 max-h-60 overflow-y-auto">{sizes.map((s, idx) => (<div key={idx} className="flex gap-2"><input value={s.diameter} onChange={e=>handleSizeChange(idx,'diameter',e.target.value)} placeholder="Dia" className="w-20 px-2 py-1 border rounded" /><input value={s.length} onChange={e=>handleSizeChange(idx,'length',e.target.value)} placeholder="Len" className="flex-1 px-2 py-1 border rounded" /><button type="button" onClick={()=>removeSizeRow(idx)}><Trash2 size={16} className="text-red-400"/></button></div>))}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold">Finishes (Variants)</h3><button type="button" onClick={addFinishRow} className="text-purple-600 text-sm font-bold">+ Add Finish</button></div>
                <div className="space-y-2 max-h-60 overflow-y-auto">{finishes.map((f, idx) => (<div key={idx} className="flex items-center gap-2 border p-2 rounded"><div className="w-10 h-10 bg-gray-100 rounded overflow-hidden relative"><img src={f.image} className="w-full h-full object-cover"/><input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e=>handleFinishImageUpload(e, idx)}/></div><input value={f.name} onChange={e=>handleFinishNameChange(idx,e.target.value)} placeholder="Finish" className="flex-1 px-2 py-1 border rounded" /><button type="button" onClick={()=>removeFinishRow(idx)}><Trash2 size={16} className="text-red-400"/></button></div>))}</div>
            </div>
        </div>

        {/* 9. Gallery */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold mb-4">Product Gallery</h3>
            <div className="flex flex-wrap gap-4">
                {formData.images.map((img, idx) => (
                    <div key={idx} className="w-24 h-24 border rounded overflow-hidden relative group"><img src={img} className="w-full h-full object-cover"/><button type="button" onClick={()=>setFormData(p=>({...p, images: p.images.filter((_, i)=>i!==idx)}))} className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100"><X size={12}/></button></div>
                ))}
                <label className="w-24 h-24 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">{uploading ? <Loader2 className="animate-spin"/> : <Upload className="text-gray-400"/>}<span className="text-xs text-gray-500 mt-1">Upload</span><input type="file" className="hidden" onChange={handleImageUpload}/></label>
            </div>
        </div>

        <div className="flex justify-end pb-10">
            <button type="submit" disabled={loading} className="bg-black text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">{loading ? <Loader2 className="animate-spin"/> : <Save size={20}/>} {isEditMode ? 'Update Product' : 'Save Product'}</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;