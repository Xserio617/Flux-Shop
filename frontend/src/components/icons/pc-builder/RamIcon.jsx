import React from 'react';

export default function RamIcon({ size = 24, color = "currentColor" }) {
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
      {/* RAM stick ana gövde */}
      <rect x="2" y="6" width="20" height="12" rx="1" />
      
      {/* Üst soğutucu/heatsink */}
      <path d="M3 6 L3 4 L6 4 L6 6" />
      <path d="M8 6 L8 4 L11 4 L11 6" />
      <path d="M13 6 L13 4 L16 4 L16 6" />
      <path d="M18 6 L18 4 L21 4 L21 6" />
      
      {/* Bellek çipleri */}
      <rect x="4" y="9" width="3" height="4" rx="0.5" fill={color} opacity="0.3" />
      <rect x="8.5" y="9" width="3" height="4" rx="0.5" fill={color} opacity="0.3" />
      <rect x="13" y="9" width="3" height="4" rx="0.5" fill={color} opacity="0.3" />
      <rect x="17.5" y="9" width="3" height="4" rx="0.5" fill={color} opacity="0.3" />
      
      {/* Alt pinler/kontaklar */}
      <line x1="5" y1="18" x2="5" y2="20" />
      <line x1="8" y1="18" x2="8" y2="20" />
      <line x1="11" y1="18" x2="11" y2="20" />
      <line x1="14" y1="18" x2="14" y2="20" />
      <line x1="17" y1="18" x2="17" y2="20" />
      <line x1="20" y1="18" x2="20" y2="20" />
      
      {/* Çentik (notch) */}
      <rect x="11" y="16" width="2" height="2" fill="var(--background-color, white)" stroke="none" />
    </svg>
  );
}
