import React from 'react';

export default function CoolerIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Heatsink tabanı */}
      <rect x="4" y="18" width="16" height="4" rx="1" />
      
      {/* Heatsink kanatları */}
      <rect x="5" y="8" width="2" height="10" rx="0.3" fill={color} opacity="0.2" />
      <rect x="8" y="8" width="2" height="10" rx="0.3" fill={color} opacity="0.2" />
      <rect x="11" y="8" width="2" height="10" rx="0.3" fill={color} opacity="0.2" />
      <rect x="14" y="8" width="2" height="10" rx="0.3" fill={color} opacity="0.2" />
      <rect x="17" y="8" width="2" height="10" rx="0.3" fill={color} opacity="0.2" />
      
      {/* Fan */}
      <circle cx="12" cy="8" r="6" />
      <circle cx="12" cy="8" r="2" fill={color} opacity="0.3" />
      
      {/* Fan kanatları */}
      <path d="M12 2 L12 4.5" />
      <path d="M12 11.5 L12 14" />
      <path d="M6 8 L8.5 8" />
      <path d="M15.5 8 L18 8" />
      <path d="M8 4 L9.8 5.8" />
      <path d="M14.2 10.2 L16 12" />
      <path d="M8 12 L9.8 10.2" />
      <path d="M14.2 5.8 L16 4" />
      
      {/* Isı boruları */}
      <path d="M7 18 L7 22" strokeWidth="2" opacity="0.6" />
      <path d="M12 18 L12 22" strokeWidth="2" opacity="0.6" />
      <path d="M17 18 L17 22" strokeWidth="2" opacity="0.6" />
    </svg>
  );
}
