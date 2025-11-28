import React from 'react';

export default function MoonIcon({ size = 24, color = "currentColor" }) {
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
      {/* 1. Önce Ay'ı çiziyoruz (Alta kalacak) */}
      <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      
      {/* 2. Sonra Yıldızları çiziyoruz (Üste çıkacak) */}
      
      {/* Yıldız 1 (Üstte, büyük) */}
      <path d="M20 3L21 5L23 6L21 7L20 9L19 7L17 6L19 5Z" />
      
   
    </svg>
  );
}