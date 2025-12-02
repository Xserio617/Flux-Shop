import React from 'react';

export default function MotherboardIcon({ size = 24, color = "currentColor" }) {
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
      {/* Ana kart */}
      <rect x="2" y="2" width="20" height="20" rx="1" />
      
      {/* CPU soketi */}
      <rect x="5" y="5" width="6" height="6" rx="0.5" />
      <rect x="6.5" y="6.5" width="3" height="3" fill={color} opacity="0.3" />
      
      {/* RAM slotları */}
      <rect x="14" y="4" width="2" height="8" rx="0.5" fill={color} opacity="0.2" />
      <rect x="17" y="4" width="2" height="8" rx="0.5" fill={color} opacity="0.2" />
      
      {/* PCIe slotları */}
      <rect x="4" y="14" width="10" height="2" rx="0.5" fill={color} opacity="0.2" />
      <rect x="4" y="18" width="10" height="2" rx="0.5" fill={color} opacity="0.2" />
      
      {/* Chipset */}
      <rect x="16" y="15" width="4" height="4" rx="0.5" />
      
      {/* Devre yolları */}
      <path d="M11 8 L13 8" strokeWidth="0.5" opacity="0.5" />
      <path d="M8 11 L8 13" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}
