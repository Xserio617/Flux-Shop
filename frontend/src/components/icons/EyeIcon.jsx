import React from 'react';

export default function EyeIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2" // Diğer ikonlarla aynı kalınlıkta
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transition: 'stroke 0.3s ease' }}
    >
      {/* Gözün dış çerçevesi */}
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      {/* Göz bebeği */}
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}