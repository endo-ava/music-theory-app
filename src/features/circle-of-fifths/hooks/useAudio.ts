/**
 * 五度圏音響機能のカスタムフック
 */

import { useCallback, useMemo } from 'react';
import { AudioEngine, ChordBuilder, FifthsIndex } from '@/domain';

/**
 * 音を鳴らすためのシンプルなフック
 */
export const useAudio = () => {
  const chordBuilder = useMemo(() => new ChordBuilder(), []);

  const playMajorChordAtPosition = useCallback(
    async (fifthsIndex: FifthsIndex) => {
      try {
        const chord = chordBuilder.buildMajorTriadFromPosition(fifthsIndex);
        await AudioEngine.playChord(chord);
      } catch (error) {
        console.error('Failed to play chord:', error);
      }
    },
    [chordBuilder]
  );

  const playMinorChordAtPosition = useCallback(
    async (fifthsIndex: FifthsIndex) => {
      try {
        const chord = chordBuilder.buildMinorTriadFromPosition(fifthsIndex);
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
