/**
 * 五度圏音響機能のカスタムフック
 */
import { useCallback } from 'react';
import { Chord } from '@/domain/chord';
import { AudioEngine } from '@/domain';

/**
 * 音を鳴らすためのシンプルなフック
 */
export const useAudio = () => {
  const playMajorChordAtPosition = useCallback(
    /**
     * @param circleIndex 五度圏インデックス
     */
    async (circleIndex: number) => {
      try {
        const chord = Chord.fromCircleOfFifths(circleIndex);
        await AudioEngine.playChord(chord);
      } catch (error) {
        console.error(`Failed to play major chord at position ${circleIndex}:`, error);
      }
    },
    []
  );

  const playMinorChordAtPosition = useCallback(
    /**
     * @param circleIndex 五度圏インデックス
     */
    async (circleIndex: number) => {
      try {
        const chord = Chord.relativeMinorFromCircleOfFifths(circleIndex);
        await AudioEngine.playChord(chord);
      } catch (error) {
        console.error(`Failed to play minor chord at position ${circleIndex}:`, error);
      }
    },
    []
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
