import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Save, Plus, Trash2, ArrowLeft, Upload, X, Layout,
  Table as TableIcon, Type, Quote, Image as ImageIcon,
  List, Code, Minus, AlertCircle, Eye, EyeOff,
  Zap, Heading1, Heading2, Grid, Link as LinkIcon
} from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';

// ─── TYPES ───────────────────────────────────────────────────────────────────

type BlockType =
  | 'text' | 'heading2' | 'heading3'
  | 'quote' | 'callout' | 'highlight'
  | 'table' | 'list' | 'code' | 'divider'
  | 'image' | 'image_row';

interface ImageItem { url: string; caption: string; }

interface Block {
  id: string;
  type: BlockType;
  heading?: string;
  body?: string;
  headers?: string[];
  rows?: string[][];
  listType?: 'bullet' | 'numbered';
  items?: string[];
  calloutVariant?: 'info' | 'warning' | 'tip' | 'danger';
  imageUrl?: string;
  caption?: string;
  language?: string;
  highlightColor?: string;
  images?: ImageItem[];
  columns?: 2 | 3;
}

const genId = () => Math.random().toString(36).slice(2, 9);

// ─── PALETTE ─────────────────────────────────────────────────────────────────

const PALETTE: { type: BlockType; label: string; icon: React.ReactNode; desc: string; accent: string }[] = [
  { type: 'text',      label: 'Paragraph',     icon: <Type size={15}/>,        desc: 'Body text + optional heading', accent: '#6366f1' },
  { type: 'heading2',  label: 'H2 Heading',    icon: <Heading1 size={15}/>,    desc: 'Major section title',          accent: '#7c3aed' },
  { type: 'heading3',  label: 'H3 Heading',    icon: <Heading2 size={15}/>,    desc: 'Sub-section title',            accent: '#a78bfa' },
  { type: 'list',      label: 'List',           icon: <List size={15}/>,        desc: 'Bullet or numbered list',      accent: '#0891b2' },
  { type: 'quote',     label: 'Blockquote',     icon: <Quote size={15}/>,       desc: 'Pull quote or attribution',    accent: '#db2777' },
  { type: 'callout',   label: 'Callout',        icon: <AlertCircle size={15}/>, desc: 'Info / Tip / Warning box',     accent: '#d97706' },
  { type: 'highlight', label: 'Key Takeaway',   icon: <Zap size={15}/>,        desc: 'Highlighted insight or stat',  accent: '#ea580c' },
  { type: 'image',     label: 'Single Image',   icon: <ImageIcon size={15}/>,   desc: 'Full-width image + caption',   accent: '#059669' },
  { type: 'image_row', label: 'Image Row',      icon: <Grid size={15}/>,        desc: '2–3 images side by side',      accent: '#0d9488' },
  { type: 'table',     label: 'Table',          icon: <TableIcon size={15}/>,   desc: 'Comparison or data table',     accent: '#16a34a' },
  { type: 'code',      label: 'Code Block',     icon: <Code size={15}/>,        desc: 'Code or command snippet',      accent: '#65a30d' },
  { type: 'divider',   label: 'Divider',        icon: <Minus size={15}/>,       desc: 'Visual section separator',     accent: '#94a3b8' },
];

const CALLOUT_META: Record<string, { bg: string; border: string; icon: string; label: string }> = {
  info:    { bg: '#eff6ff', border: '#3b82f6', icon: 'ℹ️', label: 'Info'      },
  tip:     { bg: '#f0fdf4', border: '#22c55e', icon: '💡', label: 'Tip'       },
  warning: { bg: '#fffbeb', border: '#f59e0b', icon: '⚠️', label: 'Warning'   },
  danger:  { bg: '#fef2f2', border: '#ef4444', icon: '🚫', label: 'Important' },
};

// ─── BLOCK FACTORY ────────────────────────────────────────────────────────────

const makeBlock = (type: BlockType): Block => {
  const id = genId();
  switch (type) {
    case 'table':     return { id, type, heading: '', headers: ['Feature', 'Option A', 'Option B'], rows: [['', '', '']] };
    case 'list':      return { id, type, heading: '', listType: 'bullet', items: [''] };
    case 'callout':   return { id, type, calloutVariant: 'info', body: '' };
    case 'code':      return { id, type, heading: '', language: 'bash', body: '' };
    case 'image':     return { id, type, imageUrl: '', caption: '' };
    case 'image_row': return { id, type, columns: 2, images: [{ url: '', caption: '' }, { url: '', caption: '' }] };
    case 'divider':   return { id, type };
    case 'highlight': return { id, type, body: '', highlightColor: '#fef9c3' };
    default:          return { id, type, heading: '', body: '' };
  }
};

// ─── PREVIEW BLOCK ────────────────────────────────────────────────────────────

const PreviewBlock: React.FC<{ block: Block }> = ({ block }) => {
  const pf = "'Playfair Display', Georgia, serif";
  const bf = "'Georgia', serif";

  switch (block.type) {
    case 'text':
      return (
        <div style={{ marginBottom: 26 }}>
          {block.heading && <h4 style={{ fontFamily: pf, fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 9, marginTop: 0 }}>{block.heading}</h4>}
          <p style={{ fontFamily: bf, fontSize: 17, lineHeight: 1.9, color: '#374151', margin: 0 }}>
            {block.body || <em style={{ color: '#ccc' }}>Empty paragraph…</em>}
          </p>
        </div>
      );
    case 'heading2':
      return <h2 style={{ fontFamily: pf, fontSize: 27, fontWeight: 800, color: '#111', marginTop: 44, marginBottom: 12, borderBottom: '3px solid #facc15', paddingBottom: 10 }}>{block.body || 'Section Heading'}</h2>;
    case 'heading3':
      return <h3 style={{ fontFamily: pf, fontSize: 20, fontWeight: 700, color: '#1f2937', marginTop: 30, marginBottom: 8 }}>{block.body || 'Sub-heading'}</h3>;
    case 'quote':
      return (
        <blockquote style={{ margin: '28px 0', padding: '15px 22px 15px 18px', borderLeft: '5px solid #facc15', background: '#fffbeb', borderRadius: '0 14px 14px 0', fontFamily: bf, fontSize: 18, fontStyle: 'italic', color: '#374151', lineHeight: 1.7 }}>
          <span style={{ fontSize: 42, lineHeight: 0, color: '#facc15', verticalAlign: '-0.3em', marginRight: 4, fontFamily: 'Georgia' }}>"</span>
          {block.body}
          {block.heading && <footer style={{ marginTop: 10, fontStyle: 'normal', fontSize: 12, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase' }}>— {block.heading}</footer>}
        </blockquote>
      );
    case 'callout': {
      const s = CALLOUT_META[block.calloutVariant || 'info'];
      return (
        <div style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 14, padding: '14px 18px', margin: '18px 0', display: 'flex', gap: 11, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 19 }}>{s.icon}</span>
          <div>
            <p style={{ fontWeight: 800, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: s.border, marginBottom: 4, marginTop: 0 }}>{s.label}</p>
            <p style={{ fontFamily: bf, fontSize: 15, lineHeight: 1.7, color: '#374151', margin: 0 }}>{block.body}</p>
          </div>
        </div>
      );
    }
    case 'highlight':
      return <div style={{ background: block.highlightColor || '#fef9c3', borderRadius: 14, padding: '15px 19px', margin: '18px 0', borderLeft: '4px solid #eab308', fontFamily: bf, fontSize: 17, fontWeight: 500, color: '#713f12', lineHeight: 1.75 }}>{block.body || 'Key takeaway…'}</div>;
    case 'list': {
      const Tag = block.listType === 'numbered' ? 'ol' : 'ul';
      return (
        <div style={{ margin: '18px 0' }}>
          {block.heading && <p style={{ fontFamily: pf, fontSize: 17, fontWeight: 700, color: '#111', marginBottom: 6 }}>{block.heading}</p>}
          <Tag style={{ paddingLeft: 24, margin: 0 }}>
            {(block.items || []).map((item, i) => <li key={i} style={{ fontFamily: bf, fontSize: 16, lineHeight: 1.85, color: '#374151', marginBottom: 5 }}>{item}</li>)}
          </Tag>
        </div>
      );
    }
    case 'table':
      return (
        <div style={{ margin: '22px 0', overflowX: 'auto' }}>
          {block.heading && <p style={{ fontFamily: pf, fontSize: 17, fontWeight: 700, color: '#111', marginBottom: 9 }}>{block.heading}</p>}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
            <thead>
              <tr style={{ background: '#18181b' }}>
                {(block.headers || []).map((h, i) => <th key={i} style={{ padding: '11px 15px', color: '#facc15', fontWeight: 800, textAlign: 'left', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {(block.rows || []).map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  {row.map((cell, ci) => <td key={ci} style={{ padding: '10px 15px', color: '#374151', fontWeight: ci === 0 ? 600 : 400 }}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'code':
      return (
        <div style={{ margin: '18px 0', borderRadius: 13, overflow: 'hidden', border: '1px solid #27272a' }}>
          <div style={{ background: '#18181b', padding: '7px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#71717a', fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{block.language}</span>
            {block.heading && <span style={{ fontSize: 12, color: '#a1a1aa' }}>{block.heading}</span>}
          </div>
          <pre style={{ background: '#09090b', color: '#d4d4d8', margin: 0, padding: '16px 20px', fontFamily: '"JetBrains Mono","Fira Code",monospace', fontSize: 13, lineHeight: 1.7, overflowX: 'auto' }}>
            <code>{block.body || '// your code here'}</code>
          </pre>
        </div>
      );
    case 'divider':
      return (
        <div style={{ margin: '30px 0', display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          <div style={{ width: 7, height: 7, background: '#facc15', borderRadius: '50%' }} />
          <div style={{ width: 5, height: 5, background: '#d4d4d8', borderRadius: '50%' }} />
          <div style={{ width: 7, height: 7, background: '#facc15', borderRadius: '50%' }} />
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
        </div>
      );

    // ── SINGLE IMAGE ──
    case 'image':
      return (
        <figure style={{ margin: '26px 0', textAlign: 'center' }}>
          {block.imageUrl
            ? <img src={block.imageUrl} alt={block.caption || ''} style={{ maxWidth: '100%', borderRadius: 13, boxShadow: '0 4px 18px rgba(0,0,0,0.09)' }} />
            : <div style={{ background: '#f4f4f5', borderRadius: 13, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4d4d8' }}><ImageIcon size={28}/></div>
          }
          {block.caption && <figcaption style={{ marginTop: 7, fontSize: 12, color: '#9ca3af', fontStyle: 'italic', fontFamily: bf }}>{block.caption}</figcaption>}
        </figure>
      );

    // ── IMAGE ROW — the fastenright-style side-by-side product images ──
    case 'image_row': {
      const imgs = block.images || [];
      const cols = block.columns || 2;
      return (
        <div style={{ margin: '26px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 14 }}>
            {imgs.map((img, i) => (
              <figure key={i} style={{ margin: 0, textAlign: 'center' }}>
                {img.url
                  ? <img src={img.url} alt={img.caption || ''} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'contain', borderRadius: 10, background: '#f9fafb', border: '1px solid #ebebeb', padding: 10, boxSizing: 'border-box' }} />
                  : <div style={{ background: '#f4f4f5', borderRadius: 10, aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4d4d8' }}><ImageIcon size={22}/></div>
                }
                {img.caption && <figcaption style={{ marginTop: 6, fontSize: 12, color: '#6b7280', fontFamily: bf, fontStyle: 'italic' }}>{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </div>
      );
    }

    default: return null;
  }
};

// ─── BLOCK EDITOR CARD ────────────────────────────────────────────────────────

const inp = "w-full border border-zinc-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 rounded-xl px-4 py-3 text-sm bg-white outline-none transition-all placeholder-zinc-400";
const txta = inp + " resize-none font-serif text-[15px] leading-relaxed";

const BlockEditor: React.FC<{
  block: Block; index: number;
  onUpdate: (id: string, patch: Partial<Block>) => void;
  onRemove: (id: string) => void;
}> = ({ block, index, onUpdate, onRemove }) => {
  const u = (patch: Partial<Block>) => onUpdate(block.id, patch);
  const meta = PALETTE.find(p => p.type === block.type)!;

  return (
    <div style={{ background: '#fff', border: '1.5px solid #e4e4e7', borderRadius: 20, padding: '22px 22px 18px', position: 'relative' }} className="hover:border-yellow-400 hover:shadow-sm transition-all">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#18181b', color: '#facc15', borderRadius: 99, padding: '3px 10px', fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <span style={{ color: meta.accent }}>{meta.icon}</span> {meta.label}
          </span>
          <span style={{ fontSize: 9, color: '#a1a1aa', fontWeight: 600 }}>#{index + 1}</span>
        </div>
        <button type="button" onClick={() => onRemove(block.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', padding: 3 }} className="hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
      </div>

      {/* TEXT */}
      {block.type === 'text' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input className={inp} placeholder="Optional section heading…" value={block.heading || ''} onChange={e => u({ heading: e.target.value })} />
          <textarea className={txta} rows={5} placeholder="Write your paragraph content here…" value={block.body || ''} onChange={e => u({ body: e.target.value })} />
        </div>
      )}

      {/* H2 / H3 */}
      {(block.type === 'heading2' || block.type === 'heading3') && (
        <input className={`w-full border border-zinc-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 rounded-xl px-4 py-3 outline-none transition-all font-black ${block.type === 'heading2' ? 'text-2xl' : 'text-xl'}`}
          placeholder={block.type === 'heading2' ? 'Section heading…' : 'Sub-section heading…'}
          value={block.body || ''} onChange={e => u({ body: e.target.value })} />
      )}

      {/* QUOTE */}
      {block.type === 'quote' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <textarea className={txta} rows={3} placeholder="Your quote…" value={block.body || ''} onChange={e => u({ body: e.target.value })} />
          <input className={inp} placeholder="Source or attribution (optional)" value={block.heading || ''} onChange={e => u({ heading: e.target.value })} />
        </div>
      )}

      {/* CALLOUT */}
      {block.type === 'callout' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(['info','tip','warning','danger'] as const).map(v => {
              const s = CALLOUT_META[v];
              return <button key={v} type="button" onClick={() => u({ calloutVariant: v })}
                style={{ padding: '5px 12px', borderRadius: 99, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', border: `2px solid ${s.border}`, background: block.calloutVariant === v ? s.bg : '#fff', color: s.border, transition: 'all 0.15s' }}>
                {s.icon} {v}
              </button>;
            })}
          </div>
          <textarea className={txta} rows={3} placeholder="Write your callout message…" value={block.body || ''} onChange={e => u({ body: e.target.value })} />
        </div>
      )}

      {/* HIGHLIGHT */}
      {block.type === 'highlight' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Colour</span>
            {['#fef9c3','#dcfce7','#dbeafe','#fce7f3','#ede9fe','#ffedd5'].map(c => (
              <button key={c} type="button" onClick={() => u({ highlightColor: c })}
                style={{ width: 20, height: 20, borderRadius: 99, background: c, border: block.highlightColor === c ? '3px solid #18181b' : '2px solid #e4e4e7', cursor: 'pointer', transition: 'border 0.15s' }} />
            ))}
          </div>
          <textarea className={txta} rows={3} placeholder="Key takeaway or insight…" value={block.body || ''} onChange={e => u({ body: e.target.value })} />
        </div>
      )}

      {/* LIST */}
      {block.type === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className={inp} style={{ flex: 1 }} placeholder="List title (optional)" value={block.heading || ''} onChange={e => u({ heading: e.target.value })} />
            <div style={{ display: 'flex', border: '1px solid #e4e4e7', borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
              {(['bullet','numbered'] as const).map(t => (
                <button key={t} type="button" onClick={() => u({ listType: t })}
                  style={{ padding: '7px 13px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', background: block.listType === t ? '#18181b' : '#fff', color: block.listType === t ? '#facc15' : '#6b7280', border: 'none', transition: 'all 0.15s' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          {(block.items || []).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#9ca3af', minWidth: 18, textAlign: 'right', fontWeight: 600 }}>{block.listType === 'numbered' ? `${i+1}.` : '•'}</span>
              <input className={inp} style={{ flex: 1 }} value={item} placeholder={`Item ${i+1}`}
                onChange={e => { const ni=[...(block.items||[])]; ni[i]=e.target.value; u({ items: ni }); }} />
              <button type="button" onClick={() => u({ items: (block.items||[]).filter((_,j)=>j!==i) })}
                style={{ color: '#fca5a5', background: 'none', border: 'none', cursor: 'pointer' }}><X size={13}/></button>
            </div>
          ))}
          <button type="button" onClick={() => u({ items: [...(block.items||[]), ''] })}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 800, color: '#0e7490', background: '#ecfeff', border: 'none', borderRadius: 99, padding: '4px 11px', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <Plus size={10}/> Add Item
          </button>
        </div>
      )}

      {/* TABLE */}
      {block.type === 'table' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input className={inp} placeholder="Table title (optional)" value={block.heading||''} onChange={e => u({ heading: e.target.value })} />
          <div style={{ overflowX: 'auto', border: '1px solid #e4e4e7', borderRadius: 10 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {(block.headers||[]).map((h,i) => (
                    <th key={i} style={{ padding: 0, borderRight: '1px solid #e4e4e7' }}>
                      <input style={{ width: '100%', padding: '8px 11px', fontWeight: 700, background: 'transparent', border: 'none', outline: 'none', color: '#374151', boxSizing: 'border-box' }}
                        value={h} placeholder={`Col ${i+1}`}
                        onChange={e => { const nh=[...(block.headers||[])]; nh[i]=e.target.value; u({ headers: nh }); }} />
                    </th>
                  ))}
                  <th style={{ width: 32 }}></th>
                </tr>
              </thead>
              <tbody>
                {(block.rows||[]).map((row, ri) => (
                  <tr key={ri} style={{ borderTop: '1px solid #e4e4e7' }}>
                    {row.map((cell,ci) => (
                      <td key={ci} style={{ padding: 0, borderRight: '1px solid #e4e4e7' }}>
                        <input style={{ width: '100%', padding: '7px 11px', background: 'transparent', border: 'none', outline: 'none', color: '#374151', boxSizing: 'border-box' }}
                          value={cell} onChange={e => { const nr=(block.rows||[]).map(r=>[...r]); nr[ri][ci]=e.target.value; u({ rows: nr }); }} />
                      </td>
                    ))}
                    <td style={{ textAlign: 'center' }}>
                      <button type="button" onClick={() => u({ rows: (block.rows||[]).filter((_,i)=>i!==ri) })}
                        style={{ color: '#fca5a5', background: 'none', border: 'none', cursor: 'pointer' }}><X size={12}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => u({ rows: [...(block.rows||[]), Array((block.headers||[]).length).fill('')] })}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 800, color: '#854d0e', background: '#fef9c3', border: 'none', borderRadius: 99, padding: '4px 11px', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <Plus size={10}/> Add Row
          </button>
        </div>
      )}

      {/* CODE */}
      {block.type === 'code' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className={inp} style={{ flex: '0 0 120px' }} value={block.language||'bash'} onChange={e => u({ language: e.target.value })}>
              {['bash','javascript','typescript','python','html','css','json','sql','php','ruby','go','rust'].map(l=><option key={l}>{l}</option>)}
            </select>
            <input className={inp} style={{ flex: 1 }} placeholder="Snippet title (optional)" value={block.heading||''} onChange={e => u({ heading: e.target.value })} />
          </div>
          <textarea
            style={{ width: '100%', border: '1.5px solid #27272a', borderRadius: 11, padding: '11px 14px', fontFamily: '"JetBrains Mono","Fira Code",monospace', fontSize: 13, lineHeight: 1.7, background: '#09090b', color: '#d4d4d8', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
            rows={6} placeholder="// Paste your code here…" value={block.body||''} onChange={e => u({ body: e.target.value })} />
        </div>
      )}

      {/* SINGLE IMAGE */}
      {block.type === 'image' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <LinkIcon size={13} style={{ color: '#a1a1aa', flexShrink: 0 }} />
            <input className={inp} placeholder="Paste image URL…" value={block.imageUrl||''} onChange={e => u({ imageUrl: e.target.value })} />
          </div>
          <input className={inp} placeholder="Caption (optional)" value={block.caption||''} onChange={e => u({ caption: e.target.value })} />
          {block.imageUrl && <img src={block.imageUrl} alt="" style={{ maxHeight: 160, objectFit: 'cover', borderRadius: 9, border: '1px solid #e4e4e7' }} />}
        </div>
      )}

      {/* IMAGE ROW — matches fastenright 2-up / 3-up product image layout */}
      {block.type === 'image_row' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Column toggle + hint */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Layout</span>
            <div style={{ display: 'flex', border: '1px solid #e4e4e7', borderRadius: 9, overflow: 'hidden' }}>
              {([2,3] as const).map(n => (
                <button key={n} type="button"
                  onClick={() => {
                    const imgs = [...(block.images||[])];
                    while (imgs.length < n) imgs.push({ url: '', caption: '' });
                    u({ columns: n, images: imgs.slice(0, n) });
                  }}
                  style={{ padding: '6px 14px', fontSize: 10, fontWeight: 800, cursor: 'pointer', background: block.columns === n ? '#18181b' : '#fff', color: block.columns === n ? '#facc15' : '#6b7280', border: 'none', transition: 'all 0.15s' }}>
                  {n} cols
                </button>
              ))}
            </div>
            <span style={{ fontSize: 10, color: '#a1a1aa' }}>e.g. side-by-side product images with labels</span>
          </div>

          {/* Image slots */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${block.columns||2}, 1fr)`, gap: 10 }}>
            {(block.images||[]).map((img, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 7, background: '#f9fafb', border: '1px solid #e4e4e7', borderRadius: 13, padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                  <span style={{ width: 18, height: 18, background: '#18181b', color: '#facc15', borderRadius: 99, fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i+1}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Image {i+1}</span>
                </div>
                {img.url
                  ? <img src={img.url} alt="" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'contain', borderRadius: 7, background: '#fff', border: '1px solid #e4e4e7', padding: 4, boxSizing: 'border-box' }} />
                  : <div style={{ background: '#fff', border: '2px dashed #d4d4d8', borderRadius: 7, aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4d4d8' }}><ImageIcon size={20}/></div>
                }
                <input
                  style={{ width: '100%', border: '1px solid #e4e4e7', borderRadius: 7, padding: '6px 9px', fontSize: 11, outline: 'none', background: '#fff', boxSizing: 'border-box', color: '#374151' }}
                  placeholder="Image URL…"
                  value={img.url}
                  onChange={e => { const ni=[...(block.images||[])]; ni[i]={...ni[i],url:e.target.value}; u({ images: ni }); }}
                />
                <input
                  style={{ width: '100%', border: '1px solid #e4e4e7', borderRadius: 7, padding: '6px 9px', fontSize: 11, outline: 'none', background: '#fff', boxSizing: 'border-box', color: '#374151' }}
                  placeholder="Caption under image…"
                  value={img.caption}
                  onChange={e => { const ni=[...(block.images||[])]; ni[i]={...ni[i],caption:e.target.value}; u({ images: ni }); }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DIVIDER */}
      {block.type === 'divider' && (
        <div style={{ textAlign: 'center', color: '#a1a1aa', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '6px 0' }}>
          ── Visual Section Divider ──
        </div>
      )}
    </div>
  );
};

// ─── ADD BLOCK PANEL ──────────────────────────────────────────────────────────

const AddBlockPanel: React.FC<{ onAdd: (t: BlockType) => void }> = ({ onAdd }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px,1fr))', gap: 8 }}>
    {PALETTE.map(bt => (
      <button key={bt.type} type="button" onClick={() => onAdd(bt.type)}
        style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#fff', border: '1.5px dashed #d4d4d8', borderRadius: 11, padding: '11px 13px', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
        className="hover:border-yellow-400 hover:bg-yellow-50">
        <span style={{ color: bt.accent, flexShrink: 0 }}>{bt.icon}</span>
        <div>
          <p style={{ fontSize: 10, fontWeight: 800, color: '#18181b', margin: 0 }}>{bt.label}</p>
          <p style={{ fontSize: 9, color: '#a1a1aa', margin: '2px 0 0', lineHeight: 1.3 }}>{bt.desc}</p>
        </div>
      </button>
    ))}
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const AddBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([makeBlock('heading2'), makeBlock('text')]);
  const [formData, setFormData] = useState({
    title: '', category: 'Technical Guide', excerpt: '',
    author: 'Durable Editorial', image_url: ''
  });

  useEffect(() => {
    if (!isEditing) return;
    (async () => {
      const { data } = await supabase.from('blogs').select('*').eq('id', id).single();
      if (!data) return;
      setFormData(data);
      setImagePreview(data.image_url);
      try {
        const saved = JSON.parse(data.content);
        setBlocks(Array.isArray(saved)
          ? saved.map((s: any) => ({ ...makeBlock(s.type||'text'), ...s, id: s.id||genId() }))
          : [makeBlock('text')]);
      } catch { setBlocks([{ ...makeBlock('text'), body: data.content }]); }
    })();
  }, [id, isEditing]);

  const addBlock    = (type: BlockType) => setBlocks(p => [...p, makeBlock(type)]);
  const removeBlock = (id: string)      => setBlocks(p => p.filter(b => b.id !== id));
  const updateBlock = (id: string, patch: Partial<Block>) =>
    setBlocks(p => p.map(b => b.id === id ? { ...b, ...patch } : b));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      let finalImageUrl = formData.image_url;
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        await supabase.storage.from('blog-images').upload(fileName, imageFile);
        finalImageUrl = supabase.storage.from('blog-images').getPublicUrl(fileName).data.publicUrl;
      }
      const payload = { ...formData, image_url: finalImageUrl, content: JSON.stringify(blocks) };
      const { error } = isEditing
        ? await supabase.from('blogs').update(payload).eq('id', id)
        : await supabase.from('blogs').insert([payload]);
      if (error) throw error;
      navigate('/admin/blogs');
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f4f5', fontFamily: "'DM Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;800&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap" rel="stylesheet"/>

      <form onSubmit={handleSubmit}>
        {/* TOPBAR */}
        <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e4e4e7', padding: '10px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Link to="/admin/blogs" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, fontWeight: 800, color: '#71717a', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <ArrowLeft size={12}/> Back
          </Link>
          <div style={{ display: 'flex', gap: 7 }}>
            <button type="button" onClick={() => setShowPreview(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 15px', borderRadius: 8, fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s', background: showPreview ? '#18181b' : '#f4f4f5', color: showPreview ? '#facc15' : '#71717a', border: '1.5px solid ' + (showPreview ? '#18181b' : '#d4d4d8') }}>
              {showPreview ? <EyeOff size={12}/> : <Eye size={12}/>} {showPreview ? 'Hide Preview' : 'Live Preview'}
            </button>
            <button type="submit" disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 18px', borderRadius: 8, fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', background: '#18181b', color: '#facc15', border: '1.5px solid #18181b', opacity: loading ? 0.7 : 1, transition: 'all 0.15s' }}>
              <Save size={12}/> {loading ? 'Saving…' : isEditing ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr', maxWidth: showPreview ? '100%' : 800, margin: '0 auto', minHeight: 'calc(100vh - 53px)' }}>

          {/* LEFT — EDITOR */}
          <div style={{ padding: '24px 20px 80px', overflowY: 'auto', maxHeight: 'calc(100vh - 53px)', borderRight: showPreview ? '1px solid #e4e4e7' : 'none' }}>

            {/* Article meta */}
            <div style={{ background: '#fff', border: '1.5px solid #e4e4e7', borderRadius: 16, padding: 22, marginBottom: 18 }}>
              <p style={{ fontSize: 9, fontWeight: 800, color: '#a1a1aa', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 13px' }}>Article Details</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                <div>
                  <label style={{ fontSize: 9, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 5 }}>Title *</label>
                  <input required style={{ width: '100%', border: '1.5px solid #e4e4e7', borderRadius: 10, padding: '10px 13px', fontSize: 16, fontWeight: 800, fontFamily: "'Playfair Display',serif", outline: 'none', boxSizing: 'border-box' }}
                    placeholder="e.g. Bolts vs Screws – What's the Difference?"
                    value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
                  <div>
                    <label style={{ fontSize: 9, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 5 }}>Category</label>
                    <select style={{ width: '100%', border: '1.5px solid #e4e4e7', borderRadius: 10, padding: '8px 11px', fontSize: 12, fontWeight: 600, outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                      value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                      {['Technical Guide','How-To','Comparison','News','Tutorial','Opinion','Product Review'].map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 9, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 5 }}>Author</label>
                    <input style={{ width: '100%', border: '1.5px solid #e4e4e7', borderRadius: 10, padding: '8px 11px', fontSize: 12, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                      value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 9, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 5 }}>Excerpt / Meta Description</label>
                  <textarea style={{ width: '100%', border: '1.5px solid #e4e4e7', borderRadius: 10, padding: '8px 11px', fontSize: 12, lineHeight: 1.6, outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                    rows={2} placeholder="Short description for SEO and article cards…"
                    value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} />
                </div>
                {/* Cover */}
                <div>
                  <label style={{ fontSize: 9, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 5 }}>Cover Image</label>
                  <div style={{ position: 'relative', height: 130, background: '#f9fafb', border: '2px dashed #d4d4d8', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }}>
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Cover"/>
                        <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }}
                          style={{ position: 'absolute', top: 7, right: 7, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 99, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <X size={12}/>
                        </button>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <Upload size={20} style={{ color: '#d4d4d8', display: 'block', margin: '0 auto 6px' }}/>
                        <p style={{ fontSize: 9, fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Upload Cover Photo</p>
                        <input type="file" accept="image/*" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                          onChange={e => { if(e.target.files?.[0]){ setImageFile(e.target.files[0]); setImagePreview(URL.createObjectURL(e.target.files[0])); } }}/>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Block list */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 11 }}>
                <Layout size={13} style={{ color: '#facc15' }}/>
                <span style={{ fontSize: 9, fontWeight: 800, color: '#18181b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Content Blocks</span>
                <span style={{ fontSize: 9, color: '#a1a1aa' }}>({blocks.length})</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {blocks.map((block, index) => (
                  <BlockEditor key={block.id} block={block} index={index} onUpdate={updateBlock} onRemove={removeBlock}/>
                ))}
              </div>
            </div>

            {/* Add block */}
            <div style={{ background: '#fff', border: '1.5px solid #e4e4e7', borderRadius: 16, padding: 18 }}>
              <p style={{ fontSize: 9, fontWeight: 800, color: '#a1a1aa', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 11px', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Plus size={10}/> Add a Block
              </p>
              <AddBlockPanel onAdd={addBlock}/>
            </div>
          </div>

          {/* RIGHT — LIVE PREVIEW */}
          {showPreview && (
            <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 53px)', background: '#fff' }}>
              <div style={{ position: 'sticky', top: 0, background: '#fff', borderBottom: '1px solid #f4f4f5', padding: '7px 18px', zIndex: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%' }}/>
                <span style={{ fontSize: 9, fontWeight: 800, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live Preview</span>
                <span style={{ marginLeft: 'auto', fontSize: 9, color: '#d4d4d8' }}>as seen on website</span>
              </div>
              <article style={{ maxWidth: 640, margin: '0 auto', padding: '32px 26px 80px' }}>
                {imagePreview && (
                  <div style={{ marginBottom: 28, borderRadius: 16, overflow: 'hidden', aspectRatio: '16/9' }}>
                    <img src={imagePreview} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{ background: '#facc15', color: '#18181b', fontSize: 9, fontWeight: 800, padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{formData.category||'Category'}</span>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>By {formData.author||'Author'}</span>
                </div>
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 800, lineHeight: 1.2, color: '#0f0f0f', margin: '0 0 12px' }}>
                  {formData.title || <span style={{ color: '#d4d4d8' }}>Title will appear here…</span>}
                </h1>
                {formData.excerpt && (
                  <p style={{ fontSize: 16, color: '#6b7280', fontFamily: "'Georgia',serif", lineHeight: 1.7, margin: '0 0 28px', borderBottom: '1px solid #f4f4f5', paddingBottom: 22 }}>
                    {formData.excerpt}
                  </p>
                )}
                {blocks.map(block => <PreviewBlock key={block.id} block={block}/>)}
              </article>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
