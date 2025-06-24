import React from 'react';

const menuOptions = [
  { label: 'Heading', type: 'heading' },
  { label: 'Paragraph', type: 'paragraph' },
  { label: 'Callout', type: 'callout' },
  { label: 'Text card', type: 'textCard' },
  { label: 'Number card', type: 'numberCard' },
  { label: 'Icon card', type: 'iconCard' },
  { label: 'Image', type: 'image' },
  { label: 'Embed / link', type: 'embed' },
  { label: 'Mockup', type: 'mockup' },
  { label: 'Quote', type: 'quote' },
  { label: 'Sticky note', type: 'sticky' },
  { label: 'Add chapter', type: 'addChapter', isStructure: true },
];

export default function ContextMenu({ x, y, onSelect, onClose }) {
  return (
    <div
      className="fixed z-50 bg-[#23232b] rounded-xl shadow-xl border border-[#333] py-2 px-0 min-w-[220px]"
      style={{ top: y, left: x }}
      onClick={e => e.stopPropagation()}
    >
      <div className="px-4 py-2 text-xs text-gray-400">Insert widget</div>
      {menuOptions.filter(opt => !opt.isStructure).map(opt => (
        <button
          key={opt.type}
          className="w-full text-left px-4 py-2 text-white hover:bg-[#353545] transition-colors"
          onClick={() => onSelect(opt.type)}
        >
          {opt.label}
        </button>
      ))}
      <div className="border-t border-[#333] my-2" />
      <div className="px-4 py-2 text-xs text-gray-400">Add structure</div>
      {menuOptions.filter(opt => opt.isStructure).map(opt => (
        <button
          key={opt.type}
          className="w-full text-left px-4 py-2 text-white hover:bg-[#353545] transition-colors"
          onClick={() => onSelect(opt.type)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
} 