import { describe, test, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCurrentKeyData } from '../useCurrentKeyData';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { Key, PitchClass } from '@/domain';

describe('useCurrentKeyData', () => {
  beforeEach(() => {
    // ストアをリセット
    const { setCurrentKey } = useCurrentKeyStore.getState();
    setCurrentKey(Key.major(PitchClass.C));
  });

  describe('正常ケース', () => {
    test('Cメジャーキーで正しいスケール音を返す', () => {
      const { result } = renderHook(() => useCurrentKeyData());

      expect(result.current.scaleNotes.length).toBeGreaterThanOrEqual(7);
      expect(result.current.scaleNotes[0]._pitchClass.sharpName).toBe('C');
    });

    test('ダイアトニックコードが7つ取得できる', () => {
      const { result } = renderHook(() => useCurrentKeyData());
      expect(result.current.diatonicChords).toHaveLength(7);
    });

    test('関連調が正しく計算される（Cメジャー）', () => {
      const { result } = renderHook(() => useCurrentKeyData());

      expect(result.current.relatedKeys).not.toBeNull();
      expect(result.current.relatedKeys?.relative.shortName).toBe('Am'); // Am
      expect(result.current.relatedKeys?.parallel.shortName).toBe('Cm'); // Cm
      expect(result.current.relatedKeys?.dominant.shortName).toBe('G'); // G
      expect(result.current.relatedKeys?.subdominant.shortName).toBe('F'); // F
    });

    test('日本語音度名が取得できる', () => {
      const { result } = renderHook(() => useCurrentKeyData());

      expect(result.current.japaneseScaleDegreeNames).toHaveLength(7);
      expect(result.current.japaneseScaleDegreeNames).toEqual([
        '主音',
        '上主音',
        '中音',
        '下属音',
        '属音',
        '下中音',
        '導音',
      ]);
    });

    test('currentKeyが正しく返される', () => {
      const { result } = renderHook(() => useCurrentKeyData());

      expect(result.current.currentKey).toBeInstanceOf(Key);
      expect(result.current.currentKey.shortName).toBe('C');
      expect((result.current.currentKey as Key).isMajor).toBe(true);
    });
  });

  describe('異なるキーでの動作', () => {
    test('Gメジャーキーで正しいスケール音を返す', () => {
      const { setCurrentKey } = useCurrentKeyStore.getState();
      setCurrentKey(Key.major(PitchClass.G));

      const { result } = renderHook(() => useCurrentKeyData());

      expect(result.current.scaleNotes[0]._pitchClass.sharpName).toBe('G');
      expect(result.current.scaleNotes[6]._pitchClass.sharpName).toBe('F#');
    });

    test('Aマイナーキーで正しいスケール音を返す', () => {
      const { setCurrentKey } = useCurrentKeyStore.getState();
      setCurrentKey(Key.minor(PitchClass.A));

      const { result } = renderHook(() => useCurrentKeyData());

      expect(result.current.scaleNotes[0]._pitchClass.sharpName).toBe('A');
      expect((result.current.currentKey as Key).isMajor).toBe(false);
    });

    test('Aマイナーキーの関連調が正しく計算される', () => {
      const { setCurrentKey } = useCurrentKeyStore.getState();
      setCurrentKey(Key.minor(PitchClass.A));

      const { result } = renderHook(() => useCurrentKeyData());

      expect(result.current.relatedKeys?.relative.shortName).toBe('C'); // C Major
      expect(result.current.relatedKeys?.parallel.shortName).toBe('A'); // A Major
    });
  });

  describe('メモ化の動作', () => {
    test('同じキーで再レンダリングしても同じ参照を返す', () => {
      const { result, rerender } = renderHook(() => useCurrentKeyData());

      const firstScaleNotes = result.current.scaleNotes;
      const firstDiatonicChords = result.current.diatonicChords;
      const firstRelatedKeys = result.current.relatedKeys;

      rerender();

      expect(result.current.scaleNotes).toBe(firstScaleNotes);
      expect(result.current.diatonicChords).toBe(firstDiatonicChords);
      expect(result.current.relatedKeys).toBe(firstRelatedKeys);
    });

    test('キーが変更されたら新しい値を返す', () => {
      const { result, rerender } = renderHook(() => useCurrentKeyData());

      const firstScaleNotes = result.current.scaleNotes;

      // キーを変更
      const { setCurrentKey } = useCurrentKeyStore.getState();
      act(() => {
        setCurrentKey(Key.major(PitchClass.G));
      });

      rerender();

      expect(result.current.scaleNotes).not.toBe(firstScaleNotes);
      expect(result.current.scaleNotes[0]._pitchClass.sharpName).toBe('G');
    });
  });
});
