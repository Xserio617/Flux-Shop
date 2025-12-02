import React from 'react';

export default function CaseIcon({ size = 24, color = "currentColor" }) {
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
      {/* Kasa ana gövde */}
      <rect x="4" y="1" width="16" height="22" rx="2" />
      
      {/* Ön panel cam */}
      <rect x="6" y="3" width="12" height="10" rx="1" fill={color} opacity="0.1" />
      
      {/* Üst fan ızgarası */}
      <line x1="7" y1="4" x2="17" y2="4" strokeWidth="0.5" opacity="0.5" />
      <line x1="7" y1="5.5" x2="17" y2="5.5" strokeWidth="0.5" opacity="0.5" />
      <line x1="7" y1="7" x2="17" y2="7" strokeWidth="0.5" opacity="0.5" />
      
      {/* I/O portları */}
      <circle cx="8" cy="10" r="1" />
      <circle cx="11" cy="10" r="1" />
      <rect x="13" y="9" width="3" height="2" rx="0.5" />
      
      {/* Güç butonu */}
      <circle cx="12" cy="16" r="2" />
      <circle cx="12" cy="16" r="0.8" fill={color} opacity="0.5" />
      
      {/* Alt havalandırma */}
      <line x1="7" y1="20" x2="17" y2="20" strokeWidth="0.5" opacity="0.5" />
      <line x1="7" y1="21" x2="17" y2="21" strokeWidth="0.5" opacity="0.5" />
      
      {/* RGB şerit */}
      <rect x="5" y="13" width="1" height="5" rx="0.3" fill={color} opacity="0.4" />
    </svg>
  );
}
