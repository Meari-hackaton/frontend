import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';
import meariService from '../services/meariService';

export default function MidiPlayer({ autoPlay = false, className = "" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const synthRef = useRef(null);
  const midiDataRef = useRef(null);
  const partRef = useRef(null);

  // 신스 초기화
  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.1,
        decay: 0.3,
        sustain: 0.4,
        release: 1.5
      }
    }).toDestination();
    
    // 볼륨 조절
    synthRef.current.volume.value = -10;

    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
      if (partRef.current) {
        partRef.current.dispose();
      }
    };
  }, []);

  // MIDI 파일 로드
  const loadMidi = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // MIDI 파일 URL 가져오기
      const midiUrl = await meariService.getMidiMusic();
      
      // MIDI 파일 로드 및 파싱
      const response = await fetch(midiUrl);
      const arrayBuffer = await response.arrayBuffer();
      const midi = new Midi(arrayBuffer);
      
      midiDataRef.current = midi;
      
      // Tone.js Part 생성
      if (partRef.current) {
        partRef.current.dispose();
      }
      
      // 첫 번째 트랙의 노트들 가져오기
      const notes = midi.tracks[0]?.notes || [];
      
      partRef.current = new Tone.Part((time, note) => {
        synthRef.current.triggerAttackRelease(
          note.name,
          note.duration,
          time,
          note.velocity
        );
      }, notes.map(note => [note.time, note]));
      
      partRef.current.loop = true;
      partRef.current.loopEnd = midi.duration;
      
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('MIDI 로드 실패:', err);
      setError('음악을 불러오는데 실패했습니다.');
      setIsLoading(false);
      return false;
    }
  };

  // 재생/일시정지 토글
  const togglePlay = async () => {
    if (isLoading) return;
    
    if (!midiDataRef.current && !isPlaying) {
      const loaded = await loadMidi();
      if (!loaded) return;
    }
    
    if (isPlaying) {
      await Tone.Transport.stop();
      partRef.current?.stop();
      setIsPlaying(false);
    } else {
      await Tone.start();
      partRef.current?.start(0);
      await Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  // 새로운 음악 생성
  const generateNewMusic = async () => {
    if (isPlaying) {
      await togglePlay();
    }
    await loadMidi();
  };

  // 자동 재생
  useEffect(() => {
    if (autoPlay) {
      loadMidi().then(loaded => {
        if (loaded) {
          togglePlay();
        }
      });
    }
  }, [autoPlay]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={togglePlay}
        disabled={isLoading}
        className={`p-2 rounded-full transition-all ${
          isPlaying 
            ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20' 
            : 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isPlaying ? '일시정지' : '힐링 음악 재생'}
      >
        {isLoading ? (
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      
      <button
        onClick={generateNewMusic}
        disabled={isLoading}
        className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        title="새 음악 생성"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
      
      {isPlaying && (
        <div className="flex items-center gap-1 ml-2">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="w-0.5 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
            <div className="w-0.5 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            <div className="w-0.5 h-5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
            <div className="w-0.5 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
          </div>
        </div>
      )}
      
      {error && (
        <span className="text-red-500 text-xs">{error}</span>
      )}
    </div>
  );
}