import React from 'react';

export default function CpuIcon({ size = 24, color = "currentColor" }) {
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
      {/* Ana çip gövdesi */}
      <rect x="4" y="4" width="16" height="16" rx="2" />
      
      {/* İç çekirdek */}
      <rect x="9" y="9" width="6" height="6" rx="1" fill={color} opacity="0.3" />
      
      {/* Üst pinler */}
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      
      {/* Alt pinler */}
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      
      {/* Sol pinler */}
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="15" x2="4" y2="15" />
      
      {/* Sağ pinler */}
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="15" x2="23" y2="15" />
    </svg>
  );
}
