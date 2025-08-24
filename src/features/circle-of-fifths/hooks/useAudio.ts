/**
 * 五度圏音響機能のカスタムフック
 */
import { useCallback } from 'react';
import { AudioEngine, Chord, Interval, Note, PitchClass, Scale, ScalePattern } from '@/domain';

/**
 * 音を鳴らすためのシンプルなフック
 */
export const useAudio = () => {
  const playChordAtPosition = useCallback(async (position: number, isMajor: boolean) => {
    try {
      const fifthsIndex = isMajor ? position : position + Interval.MinorThird.semitones;
      const rootPitchClass = PitchClass.fromCircleOfFifths(fifthsIndex);
      const rootNote = new Note(rootPitchClass);
      const chord = isMajor ? Chord.major(rootNote) : Chord.minor(rootNote);
      await AudioEngine.play(chord);
    } catch (error) {
      console.error(`Failed to play chord at position ${position}, isMajor:${isMajor}:`, error);
    }
  }, []);

  const playScaleAtPosition = useCallback(async (position: number, scalePattern: ScalePattern) => {
    try {
      const fifthsIndex =
        scalePattern.quality === 'major' ? position : position + Interval.MinorThird.semitones;
      const rootPitchClass = PitchClass.fromCircleOfFifths(fifthsIndex);
      const scale = new Scale(rootPitchClass, scalePattern);
      await AudioEngine.play(scale);
    } catch (error) {
      console.error(`Failed to play scale at position ${position}:`, error);
    }
  }, []);

  const setVolume = useCallback((db: number) => {
    AudioEngine.setVolume(db);
  }, []);

  const setArpeggioSpeed = useCallback((ms: number) => {
    AudioEngine.setArpeggioSpeed(ms);
  }, []);

  return {
    playChordAtPosition,
    playScaleAtPosition,
    setVolume,
    setArpeggioSpeed,
  };
};
