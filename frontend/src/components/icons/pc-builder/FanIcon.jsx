import React from 'react';

export default function FanIcon({ size = 24, color = "currentColor" }) {
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
      {/* Dış çerçeve */}
      <rect x="2" y="2" width="20" height="20" rx="2" />
      
      {/* Fan dairesi */}
      <circle cx="12" cy="12" r="8" />
      
      {/* Merkez */}
      <circle cx="12" cy="12" r="2" fill={color} opacity="0.4" />
      
      {/* Fan kanatları (3 kanatlı) */}
      <path d="M12 4 Q15 8 12 10" fill={color} opacity="0.3" />
      <path d="M12 10 Q8 8 12 4" />
      
      <path d="M19 15 Q15 15 12 12" />
      <path d="M12 12 Q15 10 19 15" fill={color} opacity="0.3" />
      
      <path d="M5 15 Q9 15 12 12" />
      <path d="M12 12 Q9 10 5 15" fill={color} opacity="0.3" />
      
      {/* Köşe vidaları */}
      <circle cx="4.5" cy="4.5" r="1" fill={color} opacity="0.5" />
      <circle cx="19.5" cy="4.5" r="1" fill={color} opacity="0.5" />
      <circle cx="4.5" cy="19.5" r="1" fill={color} opacity="0.5" />
      <circle cx="19.5" cy="19.5" r="1" fill={color} opacity="0.5" />
    </svg>
  );
}
