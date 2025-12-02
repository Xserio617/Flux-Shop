import React from 'react';

export default function GpuIcon({ size = 24, color = "currentColor" }) {
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
      {/* Ana kart gövdesi */}
      <rect x="1" y="6" width="22" height="12" rx="2" />
      
      {/* Fanlar */}
      <circle cx="7" cy="12" r="4" />
      <circle cx="7" cy="12" r="1.5" fill={color} opacity="0.3" />
      
      <circle cx="17" cy="12" r="4" />
      <circle cx="17" cy="12" r="1.5" fill={color} opacity="0.3" />
      
      {/* Fan kanatları */}
      <path d="M7 8 L7 9.5" />
      <path d="M7 14.5 L7 16" />
      <path d="M4 12 L5.5 12" />
      <path d="M8.5 12 L10 12" />
      
      <path d="M17 8 L17 9.5" />
      <path d="M17 14.5 L17 16" />
      <path d="M14 12 L15.5 12" />
      <path d="M18.5 12 L20 12" />
      
      {/* PCIe bağlantı */}
      <rect x="3" y="18" width="8" height="2" rx="0.5" fill={color} opacity="0.4" />
      
      {/* Güç bağlantısı */}
      <rect x="18" y="3" width="3" height="3" rx="0.5" />
    </svg>
  );
}
