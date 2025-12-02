import React from 'react';

export default function PCBuilderIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Monitör */}
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      
      {/* Monitör Ekran İçi (Parçalar) */}
      <rect x="5" y="6" width="4" height="3" rx="0.5" fill={color} opacity="0.3"></rect>
      <rect x="10" y="6" width="4" height="3" rx="0.5" fill={color} opacity="0.3"></rect>
      <rect x="15" y="6" width="4" height="3" rx="0.5" fill={color} opacity="0.3"></rect>
      <rect x="5" y="10" width="6" height="4" rx="0.5" fill={color} opacity="0.3"></rect>
      <rect x="12" y="10" width="7" height="4" rx="0.5" fill={color} opacity="0.3"></rect>
      
      {/* Monitör Standı */}
      <path d="M12 17v3"></path>
      <path d="M8 20h8"></path>
      
      {/* Artı İşareti (Ekleme/Toplama Simgesi) */}
      <circle cx="19" cy="5" r="3" fill={color} stroke="none"></circle>
      <path d="M19 3.5v3" stroke="white" strokeWidth="1.5"></path>
      <path d="M17.5 5h3" stroke="white" strokeWidth="1.5"></path>
    </svg>
  );
}
