/**
 * 五度圏音響機能のカスタムフック
 */

import { useCallback } from 'react';
import { AudioEngine, ChordBuilder, Position } from '@/domain';

/**
 * 音を鳴らすためのシンプルなフック
 */
export const useAudio = () => {
  const chordBuilder = new ChordBuilder();

  const playMajorChordAtPosition = useCallback(
    async (position: Position) => {
      try {
        const chord = chordBuilder.buildMajorTriadFromPosition(position);
        await AudioEngine.playChord(chord);
      } catch (error) {
        console.error('Failed to play chord:', error);
      }
    },
    [chordBuilder]
  );

  const playMinorChordAtPosition = useCallback(
    async (position: Position) => {
      try {
        const chord = chordBuilder.buildMinorTriadFromPosition(position);
        await AudioEngine.playChord(chord);
      } catch (error) {
        console.error('Failed to play chord:', error);
      }
    },
    [chordBuilder]
  );

  const setVolume = useCallback((db: number) => {
    AudioEngine.setVolume(db);
  }, []);

  const setArpeggioSpeed = useCallback((ms: number) => {
    AudioEngine.setArpeggioSpeed(ms);
  }, []);

  return {
    playMajorChordAtPosition,
    playMinorChordAtPosition,
    setVolume,
    setArpeggioSpeed,
  };
};
