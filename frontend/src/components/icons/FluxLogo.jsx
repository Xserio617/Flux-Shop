import React from 'react';

export default function FluxLogo({ height = "40px" }) {
  return (
    <svg 
        viewBox="0 0 200 50" 
        height={height} 
        // width="auto" YERİNE STYLE KULLANIYORUZ
        style={{ width: 'auto', maxWidth: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M25 5 L10 25 L22 25 L15 45 L35 20 L23 20 Z" fill="#6C63FF" stroke="#6C63FF" strokeWidth="2" strokeLinejoin="round"/>
      <text x="45" y="35" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="32" fill="currentColor" letterSpacing="2">
        FLUX
      </text>
      <rect x="48" y="42" width="85" height="3" fill="#6C63FF" rx="1.5" />
    </svg>
  );
}