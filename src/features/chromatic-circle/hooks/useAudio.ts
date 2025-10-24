/**
 * クロマチックサークル音響機能のカスタムフック
 *
 * クロマチックサークルのセグメントから単音を再生する機能を提供します。
 */
import { useCallback } from 'react';
import { AudioEngine, Note, PitchClass } from '@/domain';
import type { ChromaticSegmentDTO } from '@/domain/services/ChromaticCircle';

/**
 * クロマチックサークルの音響再生フック
 *
 * @returns ピッチクラス再生関数
 */
export const useAudio = () => {
  /**
   * ピッチクラスの単音を再生
   *
   * セグメントのpositionからPitchClassを取得し、
   * オクターブ4でNoteを生成してAudioEngineで再生します。
   *
   * @param segment クロマチックセグメントDTO
   */
  const playPitchClass = useCallback(async (segment: ChromaticSegmentDTO) => {
    try {
      // position（0-11）から PitchClass を取得
      const pitchClass = PitchClass.fromChromaticIndex(segment.position);
      // デフォルトオクターブ4でNoteを生成
      const note = new Note(pitchClass, 4);
      // AudioEngine.playで再生
      await AudioEngine.play(note);
    } catch (error) {
      console.error(`Failed to play pitch class at position ${segment.position}:`, error);
    }
  }, []);

  return {
    playPitchClass,
  };
};
