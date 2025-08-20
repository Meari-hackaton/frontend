// src/components/UI/GlassButton.jsx
import React from 'react';

export default function GlassButton({ 
  children, 
  onClick, 
  className = "",
  variant = "primary",
  size = "md"
}) {
  const baseClasses = "font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-3";
  
  const variantClasses = {
    primary: "bg-white/70 text-meari-600 hover:bg-white/85 shadow-[0_8px_24px_rgba(30,64,175,0.25)] hover:shadow-[0_12px_32px_rgba(30,64,175,0.32)]",
    secondary: "bg-meari-100/50 text-meari-700 hover:bg-meari-100/70 shadow-[0_6px_20px_rgba(30,64,175,0.15)]"
  };
  
  const sizeClasses = {
    sm: "px-6 py-2 text-sm",
    md: "px-8 py-4 text-base",
    lg: "px-10 py-5 text-lg"
  };
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}