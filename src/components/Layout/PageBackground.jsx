// src/components/Layout/PageBackground.jsx
import React from 'react';

export default function PageBackground({ children, variant = 'gradient' }) {
  return (
    <div className={`min-h-screen relative overflow-hidden ${
      variant === 'gradient' ? 'bg-meari-gradient' : 'bg-meari-radial'
    }`}>
      {/* 배경 장식 웨이브 */}
      <svg
        viewBox="0 0 1200 160"
        className="absolute bottom-0 left-0 w-full h-32 text-white/10"
        preserveAspectRatio="none"
      >
        <path
          d="M0,120 C180,180 380,120 520,140 C680,165 840,160 1200,110 L1200,160 L0,160 Z"
          fill="currentColor"
        />
      </svg>
      
      {/* 상단 장식 웨이브 */}
      <svg
        viewBox="0 0 1200 160"
        className="absolute top-0 left-0 w-full h-32 text-white/5 transform rotate-180"
        preserveAspectRatio="none"
      >
        <path
          d="M0,120 C180,180 380,120 520,140 C680,165 840,160 1200,110 L1200,160 L0,160 Z"
          fill="currentColor"
        />
      </svg>
      
      {children}
    </div>
  );
}