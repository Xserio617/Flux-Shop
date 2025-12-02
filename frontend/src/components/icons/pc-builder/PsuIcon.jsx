import React from 'react';

export default function PsuIcon({ size = 24, color = "currentColor" }) {
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
      {/* PSU ana gövde */}
      <rect x="2" y="4" width="20" height="16" rx="2" />
      
      {/* Fan ızgarası */}
      <circle cx="9" cy="12" r="5" />
      <circle cx="9" cy="12" r="2" fill={color} opacity="0.2" />
      
      {/* Fan kanatları */}
      <path d="M9 7 L9 9" />
      <path d="M9 15 L9 17" />
      <path d="M4 12 L6 12" />
      <path d="M12 12 L14 12" />
      <path d="M6 9 L7.5 10.5" />
      <path d="M10.5 13.5 L12 15" />
      <path d="M6 15 L7.5 13.5" />
      <path d="M10.5 10.5 L12 9" />
      
      {/* Güç anahtarı */}
      <circle cx="18" cy="8" r="1.5" />
      <line x1="18" y1="7" x2="18" y2="8.5" />
      
      {/* Kablo çıkışları */}
      <rect x="16" y="12" width="4" height="2" rx="0.5" fill={color} opacity="0.3" />
      <rect x="16" y="15" width="4" height="2" rx="0.5" fill={color} opacity="0.3" />
      
      {/* Yıldırım simgesi */}
      <path d="M17 5 L19 5 L18 7 L20 7 L17 11 L18 8 L16 8 Z" fill={color} stroke="none" opacity="0.6" />
    </svg>
  );
}
