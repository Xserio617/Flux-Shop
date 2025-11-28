import React from 'react';

export default function HeartToggleIcon({ filled = false, size = 22 }) {
  // Doluysa vurgu rengini (pembe), boşsa "yok" (transparent) kullan.
  const fillColor = filled ? "var(--accent-color)" : "none";
  
  // Doluysa kenarlık da vurgu rengi olsun, boşsa temanın metin rengi (siyah/beyaz) olsun.
  const strokeColor = filled ? "var(--accent-color)" : "currentColor";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      // Renkleri yukarıdaki mantığa göre dinamik olarak veriyoruz
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      // Renk değişirken yumuşak bir geçiş olsun
      style={{ transition: 'all 0.3s ease' }}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}