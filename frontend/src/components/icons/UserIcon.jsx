import React from 'react';

export default function UserIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Gövde (Kavisli alt kısım) */}
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      {/* Kafa (Yuvarlak) */}
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}