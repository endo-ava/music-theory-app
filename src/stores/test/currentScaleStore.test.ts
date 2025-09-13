import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCurrentKeyStore } from '../currentKeyStore';
import { Key } from '@/domain/key';

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

    expect(result.current.currentKey.centerPitch.sharpName).toBe('C');
    expect(result.current.currentKey.isMajor).toBe(true);
    expect(result.current.currentKey.keyName).toBe('C Major');
  });

  it('音楽キーを設定できる', () => {
    const { result } = renderHook(() => useCurrentKeyStore());
    const newKey = Key.fromCircleOfFifths(1, true); // G Major

    act(() => {
      result.current.setCurrentKey(newKey);
    });

    expect(result.current.currentKey.centerPitch.sharpName).toBe('G');
    expect(result.current.currentKey.isMajor).toBe(true);
    expect(result.current.currentKey.keyName).toBe('G Major');
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

    expect(result.current.currentKey.centerPitch.sharpName).toBe('C');
    expect(result.current.currentKey.isMajor).toBe(true);
  });

  it('メジャーキーとマイナーキーを正しく区別する', () => {
    const { result } = renderHook(() => useCurrentKeyStore());

    // メジャーキー
    act(() => {
      result.current.setCurrentKey(Key.fromCircleOfFifths(6, true)); // F# Major
    });

    expect(result.current.currentKey.isMajor).toBe(true);

    // マイナーキー
    act(() => {
      result.current.setCurrentKey(Key.fromCircleOfFifths(2, false)); // D Minor
    });

    expect(result.current.currentKey.isMajor).toBe(false);
  });
});
