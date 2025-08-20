// src/components/Icons/PaperPlaneIcon.jsx
import React from 'react';

export default function PaperPlaneIcon({ className = "w-8 h-8" }) {
  return (
    <svg
      className={`${className} text-white/30 animate-plane-fly`}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M60 6 26 38l6 20 8-14 20-38Z" />
      <path d="M60 6 4 26l20 6" />
    </svg>
  );
}