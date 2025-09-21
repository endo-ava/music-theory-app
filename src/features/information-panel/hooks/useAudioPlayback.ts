import { useCallback } from 'react';
import { AudioEngine } from '@/domain/services/AudioEngine';
import { Chord } from '@/domain/chord';
import { Note, Key } from '@/domain';
import { logAudioError } from '../utils';
import type { AudioPlayHandler } from '../types';
import type { IMusicalContext } from '@/domain/common/IMusicalContext';

/**
 * 音声再生機能を提供するカスタムフック
 *
 * 音楽理論アプリケーションで使用されるすべての音声再生機能を
 * 統一したインターフェースで提供する。AudioEngineを使用した
 * エラーハンドリング付きの再生処理を含む。
 *
 * @returns {Object} 音声再生ハンドラー群
 * @returns {Function} handlePlayChord - コード再生ハンドラー
 * @returns {Function} handlePlayNote - 単音再生ハンドラー
 * @returns {Function} handlePlayScale - スケール再生ハンドラー
 *
 */
export const useAudioPlayback = () => {
  /**
   * コード再生ハンドラー
   *
   * ChordオブジェクトまたはDiatonicChordInfoオブジェクトを受け取り、
   * 適切なコードオブジェクトを抽出してAudioEngineで再生する。
   */
  const handlePlayChord = useCallback(async (chord: Chord) => {
    try {
      await AudioEngine.play(chord);
    } catch (error) {
      logAudioError('コード再生', error);
    }
  }, []);

  /**
   * 単音再生ハンドラー
   *
   * NoteオブジェクトをAudioEngineで再生する。
   *
   */
  const handlePlayNote = useCallback<AudioPlayHandler<Note>>(async (note: Note) => {
    try {
      await AudioEngine.play(note);
    } catch (error) {
      logAudioError('音再生', error);
    }
  }, []);

  /**
   * スケール再生ハンドラー
   *
   * Keyオブジェクトまたは直接スケールオブジェクトを受け取り、
   * 適切なスケールオブジェクトを抽出してAudioEngineで再生する。
   */
  const handlePlayScale = useCallback(async (keyOrScale: Key | Key['scale'] | IMusicalContext) => {
    try {
      const scale = 'scale' in keyOrScale ? keyOrScale.scale : keyOrScale;
      await AudioEngine.play(scale);
    } catch (error) {
      logAudioError('スケール再生', error);
    }
  }, []);

  return {
    handlePlayChord,
    handlePlayNote,
    handlePlayScale,
  };
};
