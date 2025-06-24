import React from 'react';

/**
 * A responsive, editable cover slide component for a presentation.
 *
 * @param {object} props - The component props.
 * @param {string} [props.backgroundColor="#000000"] - The background color of the slide.
 */
export default function CoverSlide({ backgroundColor = "#000000" }) {
  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center p-8 text-center" 
      style={{ backgroundColor }}
    >
      <h1 
        className="text-white text-4xl md:text-6xl font-bold"
        contentEditable="true"
        suppressContentEditableWarning={true}
        data-block-type="title"
      >
        Neymar Jr.: Beyond the Skills
      </h1>
      <p 
        className="text-gray-300 text-lg md:text-xl mt-4 max-w-3xl"
        contentEditable="true"
        suppressContentEditableWarning={true}
        data-block-type="subtitle"
      >
        A look at the career, impact, and controversies surrounding football's biggest star.
      </p>
    </div>
  );
} 