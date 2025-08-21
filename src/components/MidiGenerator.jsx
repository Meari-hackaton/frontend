import React, { useState } from 'react';
import MidiService from '../services/midiService';

const MidiGenerator = ({ className = '', variant = 'default' }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateMidi = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      await MidiService.generateAndDownload();
    } catch (err) {
      console.error('음악 생성 실패:', err);
      setError('음악 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 작은 버튼 스타일
  if (variant === 'small') {
    return (
      <button
        onClick={handleGenerateMidi}
        disabled={isGenerating}
        className={`
          px-3 py-1.5 text-sm rounded-lg transition-all
          ${isGenerating 
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }
          ${className}
        `}
        title="나만의 힐링 음악 만들기"
      >
        {isGenerating ? '생성 중...' : '🎵 음악'}
      </button>
    );
  }

  // 기본 버튼 스타일
  return (
    <div className={className}>
      <button
        onClick={handleGenerateMidi}
        disabled={isGenerating}
        className={`
          w-full px-6 py-4 rounded-2xl font-medium transition-all
          flex items-center justify-center gap-3
          ${isGenerating 
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg transform hover:-translate-y-0.5'
          }
        `}
      >
        <span className="text-2xl">{isGenerating ? '🎼' : '🎵'}</span>
        <span>
          {isGenerating ? '음악을 만들고 있어요...' : '나만의 힐링 음악 만들기'}
        </span>
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
      )}
      
      {isGenerating && (
        <p className="mt-2 text-sm text-gray-500 text-center">
          AI가 당신을 위한 특별한 멜로디를 작곡 중입니다
        </p>
      )}
    </div>
  );
};

export default MidiGenerator;