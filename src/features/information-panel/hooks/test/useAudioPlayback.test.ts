import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudioPlayback } from '../useAudioPlayback';
import { AudioEngine } from '@/domain/services/AudioEngine';
import { Chord, Key, Note, PitchClass } from '@/domain';
import { ChordPattern } from '@/domain/common';

// AudioEngine.playをモック化
vi.mock('@/domain/services/AudioEngine', () => ({
  AudioEngine: {
    play: vi.fn(),
  },
}));

describe('useAudioPlayback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // console.errorをモック化してエラーログをキャプチャ
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('handlePlayChord', () => {
    test('正常ケース: Chordオブジェクトを正しく再生する', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      const chord = Chord.from(new Note(PitchClass.C, 4), ChordPattern.MajorTriad);

      await act(async () => {
        await result.current.handlePlayChord(chord);
      });

      expect(AudioEngine.play).toHaveBeenCalledTimes(1);
      expect(AudioEngine.play).toHaveBeenCalledWith(chord);
    });

    test('正常ケース: 異なるコードを再生できる', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      const gChord = Chord.from(new Note(PitchClass.G, 4), ChordPattern.DominantSeventh);

      await act(async () => {
        await result.current.handlePlayChord(gChord);
      });

      expect(AudioEngine.play).toHaveBeenCalledWith(gChord);
    });

    test('異常ケース: AudioEngineエラー時に適切なエラーログが出力される', async () => {
      const { result } = renderHook(() => useAudioPlayback());
      const testError = new Error('Audio playback failed');

      vi.mocked(AudioEngine.play).mockRejectedValueOnce(testError);

      const chord = Chord.from(new Note(PitchClass.C, 4), ChordPattern.MajorTriad);

      await act(async () => {
        await result.current.handlePlayChord(chord);
      });

      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('コード再生'), testError);
    });
  });

  describe('handlePlayNote', () => {
    test('正常ケース: Noteオブジェクトを正しく再生する', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      const note = new Note(PitchClass.C, 4);

      await act(async () => {
        await result.current.handlePlayNote(note);
      });

      expect(AudioEngine.play).toHaveBeenCalledTimes(1);
      expect(AudioEngine.play).toHaveBeenCalledWith(note);
    });

    test('正常ケース: 異なる音を再生できる', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      const note = new Note(PitchClass.G, 5);

      await act(async () => {
        await result.current.handlePlayNote(note);
      });

      expect(AudioEngine.play).toHaveBeenCalledWith(note);
    });

    test('異常ケース: AudioEngineエラー時に適切なエラーログが出力される', async () => {
      const { result } = renderHook(() => useAudioPlayback());
      const testError = new Error('Note playback failed');

      vi.mocked(AudioEngine.play).mockRejectedValueOnce(testError);

      const note = new Note(PitchClass.A, 4);

      await act(async () => {
        await result.current.handlePlayNote(note);
      });

      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('音再生'), testError);
    });
  });

  describe('handlePlayScale', () => {
    test('正常ケース: Keyオブジェクトからスケールを再生する', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      const key = Key.major(PitchClass.C);

      await act(async () => {
        await result.current.handlePlayScale(key);
      });

      expect(AudioEngine.play).toHaveBeenCalledTimes(1);
      expect(AudioEngine.play).toHaveBeenCalledWith(key.scale);
    });

    test('正常ケース: Scaleオブジェクトを直接再生する', async () => {
      const { result } = renderHook(() => useAudioPlayback());

      const key = Key.major(PitchClass.G);
      const scale = key.scale;

      await act(async () => {
        await result.current.handlePlayScale(scale);
      });

      expect(AudioEngine.play).toHaveBeenCalledWith(scale);
    });

    test('異常ケース: AudioEngineエラー時に適切なエラーログが出力される', async () => {
      const { result } = renderHook(() => useAudioPlayback());
      const testError = new Error('Scale playback failed');

      vi.mocked(AudioEngine.play).mockRejectedValueOnce(testError);

      const key = Key.minor(PitchClass.A);

      await act(async () => {
        await result.current.handlePlayScale(key);
      });

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('スケール再生'),
        testError
      );
    });
  });

  describe('ハンドラーの安定性', () => {
    test('ハンドラーは再レンダリングでも同じ参照を保つ', () => {
      const { result, rerender } = renderHook(() => useAudioPlayback());

      const firstHandlePlayChord = result.current.handlePlayChord;
      const firstHandlePlayNote = result.current.handlePlayNote;
      const firstHandlePlayScale = result.current.handlePlayScale;

      rerender();

      expect(result.current.handlePlayChord).toBe(firstHandlePlayChord);
      expect(result.current.handlePlayNote).toBe(firstHandlePlayNote);
      expect(result.current.handlePlayScale).toBe(firstHandlePlayScale);
    });
  });
});
