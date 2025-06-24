import React, { useState } from 'react';

const gradients = [
  'bg-gradient-to-br from-[#a86e6e] via-[#c9a06a] to-[#18151c]',
  'bg-gradient-to-br from-[#6ea8a8] via-[#6ac9b7] to-[#1c1821]',
  'bg-gradient-to-br from-[#6e7aa8] via-[#6a8fc9] to-[#1c1d21]',
  'bg-gradient-to-br from-[#a86ea0] via-[#c96ab7] to-[#211c1e]',
  'bg-gradient-to-br from-[#a8a76e] via-[#c9c76a] to-[#21211c]',
  'bg-gradient-to-br from-[#6ea87a] via-[#6ac97a] to-[#1c211c]',
  'bg-gradient-to-br from-[#a86e7a] via-[#c96a8f] to-[#211c1d]',
  'bg-gradient-to-br from-[#6e8fa8] via-[#6ab7c9] to-[#1c2121]',
];

const overlays = [
  { id: 'none', label: 'None', svg: (
    <div className="w-full h-full flex items-center justify-center text-gray-400">
      <svg width="32" height="32" viewBox="0 0 32 32"><rect x="4" y="4" width="24" height="24" rx="4" fill="none" stroke="#888" strokeWidth="2"/><line x1="8" y1="8" x2="24" y2="24" stroke="#888" strokeWidth="2"/></svg>
    </div>
  ) },
  { id: 'crosshair', label: 'Crosshair', svg: (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" opacity="0.15"><line x1="8" y1="32" x2="56" y2="32" stroke="#fff" strokeWidth="1"/><line x1="32" y1="8" x2="32" y2="56" stroke="#fff" strokeWidth="1"/><polygon points="52,30 56,32 52,34" fill="#fff"/><polygon points="30,52 32,56 34,52" fill="#fff"/></svg>
  ) },
  { id: 'circle', label: 'Circle', svg: (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" opacity="0.15"><circle cx="32" cy="32" r="20" stroke="#fff" strokeWidth="1"/></svg>
  ) },
  { id: 'venn', label: 'Venn', svg: (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" opacity="0.15"><circle cx="26" cy="32" r="18" stroke="#fff" strokeWidth="1"/><circle cx="38" cy="32" r="18" stroke="#fff" strokeWidth="1"/></svg>
  ) },
  { id: 'grid', label: 'Grid', svg: (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" opacity="0.15"><rect x="12" y="12" width="40" height="40" stroke="#fff" strokeWidth="1"/><line x1="32" y1="12" x2="32" y2="52" stroke="#fff" strokeWidth="0.5"/><line x1="12" y1="32" x2="52" y2="32" stroke="#fff" strokeWidth="0.5"/></svg>
  ) },
  { id: 'dots', label: 'Dots', svg: (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" opacity="0.15">{
      Array.from({length: 6}).map((_, i) => Array.from({length: 6}).map((_, j) => (
        <circle key={i + '-' + j} cx={16 + i * 6} cy={16 + j * 6} r="1" fill="#fff" />
      )))
    }</svg>
  ) },
];

export default function BackgroundPicker({ onSelect, onSelectOverlay, onClose }) {
  const [tab, setTab] = useState('backgrounds');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[#23232b] rounded-xl shadow-2xl p-8 min-w-[380px] min-h-[260px] relative flex flex-col items-center">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
          onClick={onClose}
        >✕</button>
        <div className="flex mb-4 w-full">
          <button
            className={`mr-6 pb-1 text-base ${tab === 'backgrounds' ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
            onClick={() => setTab('backgrounds')}
          >Backgrounds</button>
          <button
            className={`pb-1 text-base ${tab === 'overlays' ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
            onClick={() => setTab('overlays')}
          >Overlays</button>
        </div>
        {tab === 'backgrounds' && (
          <div className="grid grid-cols-4 gap-4">
            {gradients.map((g, i) => (
              <button
                key={i}
                className={`w-20 h-12 rounded-lg border-2 border-transparent hover:border-white transition ${g}`}
                onClick={() => onSelect(g)}
              />
            ))}
          </div>
        )}
        {tab === 'overlays' && (
          <div className="grid grid-cols-4 gap-4">
            {overlays.map((o, i) => (
              <button
                key={o.id}
                className="w-20 h-12 rounded-lg border-2 border-transparent hover:border-white transition bg-black flex items-center justify-center"
                onClick={() => onSelectOverlay(o.id === 'none' ? null : o.id)}
                title={o.label}
              >
                {o.svg}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 