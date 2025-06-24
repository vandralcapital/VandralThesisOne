import React, { useState } from 'react';

const positions = [
  { value: 'center', label: 'Center' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
];

export default function OverlaySettingsModal({ settings, onSave, onClose }) {
  const [size, setSize] = useState(settings.size || 1);
  const [color, setColor] = useState(settings.color || '#fff');
  const [opacity, setOpacity] = useState(settings.opacity || 0.15);
  const [position, setPosition] = useState(settings.position || 'center');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[#23232b] rounded-xl shadow-2xl p-8 min-w-[340px] min-h-[220px] relative flex flex-col items-center">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
          onClick={onClose}
        >✕</button>
        <h3 className="text-white text-lg font-semibold mb-4">Customize Overlay</h3>
        <div className="w-full space-y-4">
          <div>
            <label className="text-gray-300 text-sm">Size</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.01"
              value={size}
              onChange={e => setSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-gray-300 text-sm">Color</label>
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-8 h-8 p-0 border-0 bg-transparent"
            />
          </div>
          <div>
            <label className="text-gray-300 text-sm">Opacity</label>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.01"
              value={opacity}
              onChange={e => setOpacity(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-gray-300 text-sm">Position</label>
            <select
              value={position}
              onChange={e => setPosition(e.target.value)}
              className="w-full bg-[#18151c] text-white rounded p-2"
            >
              {positions.map(pos => (
                <option key={pos.value} value={pos.value}>{pos.label}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => onSave({ size, color, opacity, position })}
        >
          Save
        </button>
      </div>
    </div>
  );
} 