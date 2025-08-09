/**
 * 五度圏音響機能のカスタムフック
 */
import { useCallback } from 'react';
import { Chord } from '@/domain/chord';
import { AudioEngine, Interval, Note, PitchClass, Scale, ScalePattern } from '@/domain';

/**
 * 音を鳴らすためのシンプルなフック
 */
export const useAudio = () => {
  const playChordAtPosition = useCallback(async (position: number, isMajor: boolean) => {
    try {
      const fifthsIndex = isMajor ? position : position + Interval.MinorThird.semitones;
      const pitchClass = PitchClass.fromCircleOfFifths(fifthsIndex);
      const note = new Note(pitchClass, pitchClass.index >= 9 ? 3 : 4);
      const chord = isMajor ? Chord.major(note) : Chord.minor(note);
      await AudioEngine.playNotes(chord.toneNotations, false);
    } catch (error) {
      console.error(
        `Failed to play major chord at position ${position}, isMajor:${isMajor}:`,
        error
      );
    }
  }, []);

  const playScaleAtPosition = useCallback(async (position: number, scalePattern: ScalePattern) => {
    try {
      const fifthsIndex =
        scalePattern.quality === 'major' ? position : position + Interval.MinorThird.semitones;
      const pitchClass = PitchClass.fromCircleOfFifths(fifthsIndex);
      const scale = new Scale(pitchClass, scalePattern, pitchClass.index >= 9 ? 3 : 4);
      await AudioEngine.playNotes(scale.toneNotations, true);
    } catch (error) {
      console.error(`Failed to play minor chord at position ${position}:`, error);
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
