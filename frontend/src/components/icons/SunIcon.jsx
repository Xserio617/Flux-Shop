import React from 'react';

export default function SunIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8" // Ay ikonuyla aynı kalınlık
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Merkezdeki Daire */}
      <circle cx="12" cy="12" r="4" />
      
      {/* Işınlar (Merkezden kopuk ve daha kısa) */}
      <path d="M12 2v2" /> 
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>
  );
}