// src/components/UI/MeariLogo.jsx
import React from 'react';

export default function MeariLogo({ className = "", size = "lg", showIcon = false }) {
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl"
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>      
      {/* MEARI 텍스트만 */}
      <h1 className={`${textSizeClasses[size]} font-bold tracking-[0.2em] text-slate-700 drop-shadow-sm`}>
        MEARI
      </h1>
    </div>
  );
}