import React from 'react';

function getTransform(size, position) {
  let t = `scale(${size})`;
  switch (position) {
    case 'top-left': t += ' translate(-25%,-25%)'; break;
    case 'top-right': t += ' translate(25%,-25%)'; break;
    case 'bottom-left': t += ' translate(-25%,25%)'; break;
    case 'bottom-right': t += ' translate(25%,25%)'; break;
    case 'left': t += ' translate(-25%,0)'; break;
    case 'right': t += ' translate(25%,0)'; break;
    case 'top': t += ' translate(0,-25%)'; break;
    case 'bottom': t += ' translate(0,25%)'; break;
    default: break; // center
  }
  return t;
}

export default function OverlaySVG({ id, size = 1, color = '#fff', opacity = 0.15, position = 'center', className = '', ...props }) {
  const style = { transform: getTransform(size, position) };
  switch (id) {
    case 'crosshair':
      // Centered, large crosshair with arrowheads
      return (
        <svg viewBox="0 0 64 64" className={className} style={style} fill="none" opacity={opacity} {...props}>
          {/* Horizontal line */}
          <line x1="8" y1="32" x2="56" y2="32" stroke={color} strokeWidth="1" />
          {/* Vertical line */}
          <line x1="32" y1="8" x2="32" y2="56" stroke={color} strokeWidth="1" />
          {/* Right arrowhead */}
          <polygon points="52,30 56,32 52,34" fill={color} />
          {/* Down arrowhead */}
          <polygon points="30,52 32,56 34,52" fill={color} />
        </svg>
      );
    case 'circle':
      // Large, centered circle
      return (
        <svg viewBox="0 0 64 64" className={className} style={style} fill="none" opacity={opacity} {...props}>
          <circle cx="32" cy="32" r="20" stroke={color} strokeWidth="1" />
        </svg>
      );
    case 'venn':
      // Two large intersecting circles (Venn diagram)
      return (
        <svg viewBox="0 0 64 64" className={className} style={style} fill="none" opacity={opacity} {...props}>
          <circle cx="26" cy="32" r="18" stroke={color} strokeWidth="1" />
          <circle cx="38" cy="32" r="18" stroke={color} strokeWidth="1" />
        </svg>
      );
    case 'grid':
      // Large, centered grid
      return (
        <svg viewBox="0 0 64 64" className={className} style={style} fill="none" opacity={opacity} {...props}>
          <rect x="12" y="12" width="40" height="40" stroke={color} strokeWidth="1" />
          <line x1="32" y1="12" x2="32" y2="52" stroke={color} strokeWidth="0.5" />
          <line x1="12" y1="32" x2="52" y2="32" stroke={color} strokeWidth="0.5" />
        </svg>
      );
    case 'dots':
      // Centered 6x6 grid of dots
      const gridSize = 6;
      const spacing = 6;
      const start = 32 - ((gridSize - 1) * spacing) / 2;
      return (
        <svg viewBox="0 0 64 64" className={className} style={style} fill="none" opacity={opacity} {...props}>
          {Array.from({ length: gridSize }).map((_, i) =>
            Array.from({ length: gridSize }).map((_, j) => (
              <circle key={i + '-' + j} cx={start + i * spacing} cy={start + j * spacing} r="1" fill={color} />
            ))
          )}
        </svg>
      );
    default:
      return null;
  }
} 