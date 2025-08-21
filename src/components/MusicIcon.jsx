import React from 'react';

const MusicIcon = ({ className = '', isPlaying = false }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 24 24"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 음표 아이콘 */}
        <path
          d="M9 18V5l12-2v13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="6"
          cy="18"
          r="3"
          stroke="currentColor"
          strokeWidth="2"
          fill={isPlaying ? 'currentColor' : 'none'}
        />
        <circle
          cx="18"
          cy="16"
          r="3"
          stroke="currentColor"
          strokeWidth="2"
          fill={isPlaying ? 'currentColor' : 'none'}
        />
      </svg>
      
      {/* 재생 중 애니메이션 */}
      {isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-0.5">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="w-0.5 bg-current rounded-full animate-pulse opacity-50"
                style={{
                  height: `${i * 3}px`,
                  animationDelay: `${i * 100}ms`
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicIcon;