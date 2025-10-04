import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCurrentKeyStore } from '../currentKeyStore';
import { Key } from '@/domain/key';
import { ModalContext } from '@/domain/modal-context';
import { PitchClass, ScalePattern } from '@/domain';

describe('currentKeyStore', () => {
  beforeEach(() => {
    // テスト前にストアをリセット
    const { result } = renderHook(() => useCurrentKeyStore());
    act(() => {
      result.current.resetToDefault();
    });
  });

  it('初期状態はC Majorキーである', () => {
    const { result } = renderHook(() => useCurrentKeyStore());
    const currentKey = result.current.currentKey as Key;

    expect(currentKey.centerPitch.sharpName).toBe('C');
    expect(currentKey.isMajor).toBe(true);
    expect(currentKey.contextName).toBe('C Major');
  });

  it('音楽キーを設定できる', () => {
    const { result } = renderHook(() => useCurrentKeyStore());
    const newKey = Key.fromCircleOfFifths(1, true); // G Major

    act(() => {
      result.current.setCurrentKey(newKey);
    });

    const currentKey = result.current.currentKey as Key;
    expect(currentKey.centerPitch.sharpName).toBe('G');
    expect(currentKey.isMajor).toBe(true);
    expect(result.current.currentKey.contextName).toBe('G Major');
  });

  // setCurrentKeyFromKeyNameメソッドは現在コメントアウトされているためテストをスキップ

  // setCurrentKeyFromKeyNameメソッドのテストもスキップ

  it('デフォルトにリセットできる', () => {
    const { result } = renderHook(() => useCurrentKeyStore());

    // まず別の音楽キーに設定
    act(() => {
      result.current.setCurrentKey(Key.fromCircleOfFifths(4, false)); // E Minor
    });

    expect(result.current.currentKey.centerPitch.sharpName).toBe('E');

    // デフォルトにリセット
    act(() => {
      result.current.resetToDefault();
    });

    const currentKey = result.current.currentKey as Key;
    expect(currentKey.centerPitch.sharpName).toBe('C');
    expect(currentKey.isMajor).toBe(true);
  });

  it('メジャーキーとマイナーキーを正しく区別する', () => {
    const { result } = renderHook(() => useCurrentKeyStore());

    // メジャーキー
    act(() => {
      result.current.setCurrentKey(Key.fromCircleOfFifths(6, true)); // F# Major
    });

    const majorKey = result.current.currentKey as Key;
    expect(majorKey.isMajor).toBe(true);

    // マイナーキー
    act(() => {
      result.current.setCurrentKey(Key.fromCircleOfFifths(2, false)); // D Minor
    });

    const minorKey = result.current.currentKey as Key;
    expect(minorKey.isMajor).toBe(false);
  });

  describe('IMusicalContext型拡張（ModalContext対応）', () => {
    it('ModalContext型をsetCurrentKeyで設定できる', () => {
      const { result } = renderHook(() => useCurrentKeyStore());
      const dDorian = new ModalContext(PitchClass.D, ScalePattern.Dorian);

      act(() => {
        result.current.setCurrentKey(dDorian);
      });

      expect(result.current.currentKey).toBe(dDorian);
      expect(result.current.currentKey.centerPitch).toBe(PitchClass.D);
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Dorian);
    });

    it('ModalContextの状態でgetRelativeMajorTonicが正しく動作', () => {
      const { result } = renderHook(() => useCurrentKeyStore());
      const ePhrygian = new ModalContext(PitchClass.E, ScalePattern.Phrygian);

      act(() => {
        result.current.setCurrentKey(ePhrygian);
      });

      const relativeMajor = result.current.currentKey.getRelativeMajorTonic();
      expect(relativeMajor).toBe(PitchClass.C);
    });

    it('Key型とModalContext型を切り替えて設定できる', () => {
      const { result } = renderHook(() => useCurrentKeyStore());

      // 最初にKey型を設定
      const cMajor = Key.fromCircleOfFifths(0, true);
      act(() => {
        result.current.setCurrentKey(cMajor);
      });
      expect(result.current.currentKey).toBe(cMajor);

      // 次にModalContext型を設定
      const fLydian = new ModalContext(PitchClass.F, ScalePattern.Lydian);
      act(() => {
        result.current.setCurrentKey(fLydian);
      });
      expect(result.current.currentKey).toBe(fLydian);

      // 再びKey型を設定
      const gMajor = Key.fromCircleOfFifths(1, true);
      act(() => {
        result.current.setCurrentKey(gMajor);
      });
      expect(result.current.currentKey).toBe(gMajor);
    });

    it('resetToDefaultでC Major Key（IMusicalContext）にリセットされる', () => {
      const { result } = renderHook(() => useCurrentKeyStore());

      // ModalContextを設定
      const bLocrian = new ModalContext(PitchClass.B, ScalePattern.Locrian);
      act(() => {
        result.current.setCurrentKey(bLocrian);
      });

      expect(result.current.currentKey).toBe(bLocrian);

      // リセット
      act(() => {
        result.current.resetToDefault();
      });

      // C Major Keyに戻る
      const defaultKey = result.current.currentKey as Key;
      expect(defaultKey.centerPitch).toBe(PitchClass.C);
      expect(defaultKey.isMajor).toBe(true);
      expect(defaultKey.contextName).toBe('C Major');
    });
  });
});
