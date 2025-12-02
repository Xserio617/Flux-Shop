import React from 'react';

export default function SsdIcon({ size = 24, color = "currentColor" }) {
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
      {/* M.2 SSD ana gövde */}
      <rect x="2" y="8" width="20" height="8" rx="1" />
      
      {/* Depolama çipleri */}
      <rect x="4" y="10" width="4" height="4" rx="0.5" fill={color} opacity="0.3" />
      <rect x="10" y="10" width="4" height="4" rx="0.5" fill={color} opacity="0.3" />
      <rect x="16" y="10" width="4" height="4" rx="0.5" fill={color} opacity="0.3" />
      
      {/* Bağlantı konektörü */}
      <rect x="2" y="14" width="3" height="2" rx="0.3" fill={color} opacity="0.5" />
      
      {/* Vida deliği */}
      <circle cx="20" cy="12" r="1" />
      
      {/* Etiket */}
      <rect x="5" y="5" width="6" height="3" rx="0.5" />
      <text x="6" y="7.5" fontSize="2" fill={color} stroke="none" fontWeight="bold">SSD</text>
    </svg>
  );
}
