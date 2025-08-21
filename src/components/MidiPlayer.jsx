import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';
import MidiService from '../services/midiService';
import MusicIcon from './MusicIcon';

const MidiPlayer = ({ autoPlay = false, onReady, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [midiData, setMidiData] = useState(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const synthRef = useRef(null);
  const partRef = useRef(null);

  // 초기화 및 자동 재생
  useEffect(() => {
    // 자동 재생은 사용자 상호작용 후에만 가능
    if (autoPlay && userInteracted) {
      loadAndPlayMidi();
    }
    
    return () => {
      stopMusic();
      if (synthRef.current) {
        synthRef.current.dispose();
      }
    };
  }, [autoPlay, userInteracted]);

  const loadAndPlayMidi = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('MIDI 생성 요청 시작...');
      // MIDI 파일 생성 및 로드
      const midiBlob = await MidiService.generateMidi();
      console.log('MIDI Blob 받음:', midiBlob.size, 'bytes');
      
      // Blob을 ArrayBuffer로 변환
      const arrayBuffer = await midiBlob.arrayBuffer();
      
      // MIDI 파일 파싱
      const midi = new Midi(arrayBuffer);
      console.log('MIDI 파싱 완료:', {
        tracks: midi.tracks.length,
        duration: midi.duration,
        name: midi.name
      });
      
      // 실제 MIDI 재생
      await playParsedMidi(midi);
      
      setMidiData(midiBlob);
      if (onReady) onReady(midiBlob);
      
    } catch (err) {
      console.error('MIDI 로드 실패:', err);
      setError('음악을 불러올 수 없습니다.');
      // 에러시 기본 멜로디 재생
      await playDefaultMelody();
    } finally {
      setIsLoading(false);
    }
  };

  // 파싱된 MIDI 파일 재생
  const playParsedMidi = async (midi) => {
    await Tone.start();
    
    // 신스 생성
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 0.8
      }
    }).toDestination();
    
    synthRef.current.volume.value = -10;
    
    // 첫 번째 트랙의 노트들을 가져옴
    const notes = [];
    midi.tracks.forEach(track => {
      track.notes.forEach(note => {
        notes.push({
          time: note.time,
          note: note.name,
          duration: note.duration,
          velocity: note.velocity
        });
      });
    });
    
    console.log(`총 ${notes.length}개의 노트를 재생합니다.`);
    
    if (notes.length === 0) {
      console.warn('MIDI 파일에 노트가 없습니다. 기본 멜로디를 재생합니다.');
      await playSimulatedMelody();
      return;
    }
    
    // 노트들을 Part로 변환하여 재생
    partRef.current = new Tone.Part((time, note) => {
      synthRef.current.triggerAttackRelease(
        note.note, 
        note.duration, 
        time, 
        note.velocity
      );
    }, notes);
    
    partRef.current.loop = true;
    partRef.current.loopEnd = midi.duration || '4m';
    partRef.current.start(0);
    
    Tone.Transport.start();
    setIsPlaying(true);
  };
  
  // 시뮬레이션된 힐링 멜로디 재생 (백업용)
  const playSimulatedMelody = async () => {
    await Tone.start();
    
    // 부드러운 신스 생성
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.5,
        decay: 0.2,
        sustain: 0.8,
        release: 1.5
      }
    }).toDestination();
    
    // 볼륨 조절
    synthRef.current.volume.value = -12;
    
    // 힐링 음악 패턴 (C major pentatonic)
    const notes = [
      { time: 0, note: 'C4', duration: '2n' },
      { time: 0.5, note: 'E4', duration: '4n' },
      { time: 1, note: 'G4', duration: '2n' },
      { time: 1.5, note: 'A4', duration: '4n' },
      { time: 2, note: 'G4', duration: '2n' },
      { time: 2.5, note: 'E4', duration: '4n' },
      { time: 3, note: 'C4', duration: '1n' },
      { time: 4, note: 'D4', duration: '2n' },
      { time: 4.5, note: 'E4', duration: '4n' },
      { time: 5, note: 'G4', duration: '2n' },
      { time: 5.5, note: 'E4', duration: '4n' },
      { time: 6, note: 'C4', duration: '1n' },
    ];
    
    // Part 생성 (반복 재생)
    partRef.current = new Tone.Part((time, note) => {
      synthRef.current.triggerAttackRelease(note.note, note.duration, time);
    }, notes);
    
    partRef.current.loop = true;
    partRef.current.loopEnd = '8m';
    partRef.current.start(0);
    
    Tone.Transport.bpm.value = 72; // 느린 템포
    Tone.Transport.start();
    setIsPlaying(true);
  };

  // 기본 멜로디 (오류시 재생)
  const playDefaultMelody = async () => {
    await Tone.start();
    
    synthRef.current = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.2,
        decay: 0.1,
        sustain: 0.5,
        release: 0.8
      }
    }).toDestination();
    
    synthRef.current.volume.value = -15;
    
    // 간단한 3음 멜로디
    const melody = ['C4', 'E4', 'G4', 'E4'];
    let index = 0;
    
    const loop = new Tone.Loop((time) => {
      synthRef.current.triggerAttackRelease(melody[index % melody.length], '4n', time);
      index++;
    }, '4n');
    
    loop.start(0);
    Tone.Transport.start();
    setIsPlaying(true);
  };

  const togglePlayback = async () => {
    // 첫 클릭시 사용자 상호작용 표시
    if (!userInteracted) {
      setUserInteracted(true);
      // Tone.js 초기화 (사용자 제스처 필요)
      await Tone.start();
      console.log('오디오 컨텍스트 시작됨');
    }
    
    if (isPlaying) {
      stopMusic();
    } else {
      loadAndPlayMidi();
    }
  };

  const stopMusic = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    if (partRef.current) {
      partRef.current.stop();
      partRef.current.dispose();
      partRef.current = null;
    }
    setIsPlaying(false);
  };

  const downloadMidi = () => {
    if (midiData) {
      MidiService.downloadBlob(midiData, `meari-healing-${Date.now()}.mid`);
    }
  };

  // autoPlay가 true이지만 아직 사용자 상호작용이 없는 경우 특별한 UI 표시
  if (autoPlay && !userInteracted && !isPlaying) {
    return (
      <button
        onClick={togglePlayback}
        className={`
          group relative flex items-center gap-3 
          px-5 py-3 rounded-full
          bg-white/80 backdrop-blur-sm
          border border-blue-200/50
          shadow-[0_8px_24px_rgba(30,64,175,0.12)]
          hover:shadow-[0_12px_32px_rgba(30,64,175,0.18)]
          transition-all duration-300
          ${className}
        `}
      >
        <div className="relative">
          <MusicIcon className="w-6 h-6 text-blue-600" />
          <div className="absolute -inset-1 bg-blue-400/20 rounded-full animate-ping" />
        </div>
        <span className="text-sm font-medium text-slate-700">
          힐링 음악 듣기
        </span>
        <span className="text-xs text-slate-500">
          (클릭)
        </span>
      </button>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* 재생/정지 버튼 */}
      <button
        onClick={togglePlayback}
        disabled={isLoading}
        className={`
          group flex items-center gap-3
          px-4 py-2.5 rounded-full
          bg-white/90 backdrop-blur-sm
          border transition-all duration-300
          ${isLoading 
            ? 'border-gray-200 cursor-not-allowed'
            : isPlaying
            ? 'border-red-200/50 shadow-[0_4px_16px_rgba(239,68,68,0.15)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.2)]'
            : 'border-blue-200/50 shadow-[0_4px_16px_rgba(30,64,175,0.12)] hover:shadow-[0_6px_20px_rgba(30,64,175,0.18)]'
          }
        `}
        title={isPlaying ? '음악 정지' : '힐링 음악 재생'}
      >
        <MusicIcon 
          className={`w-5 h-5 transition-colors ${
            isLoading ? 'text-gray-400' : isPlaying ? 'text-red-500' : 'text-blue-600'
          }`}
          isPlaying={isPlaying}
        />
        <span className={`text-sm font-medium ${
          isLoading ? 'text-gray-500' : isPlaying ? 'text-red-700' : 'text-slate-700'
        }`}>
          {isLoading ? '로딩 중...' : isPlaying ? '정지' : '재생'}
        </span>
      </button>

      {/* 다운로드 버튼 */}
      {midiData && !isLoading && (
        <button
          onClick={downloadMidi}
          className="
            p-2.5 rounded-full
            bg-white/80 backdrop-blur-sm
            border border-slate-200/50
            shadow-[0_2px_8px_rgba(0,0,0,0.08)]
            hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]
            transition-all duration-300
          "
          title="MIDI 파일 다운로드"
        >
          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
          </svg>
        </button>
      )}

      {/* 재생 중 인디케이터 */}
      {isPlaying && !isLoading && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200/50">
          <div className="flex gap-0.5">
            {[1,2,3].map(i => (
              <div
                key={i}
                className="w-0.5 bg-green-500 rounded-full animate-pulse"
                style={{ 
                  height: `${4 + i * 2}px`,
                  animationDelay: `${i * 100}ms` 
                }}
              />
            ))}
          </div>
          <span className="text-xs text-green-700 font-medium">재생 중</span>
        </div>
      )}

      {error && (
        <span className="text-xs text-red-500 px-2">{error}</span>
      )}
    </div>
  );
};

export default MidiPlayer;