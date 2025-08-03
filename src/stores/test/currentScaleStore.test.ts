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

    expect(result.current.currentKey.tonic.name).toBe('C');
    expect(result.current.currentKey.isMajor).toBe(true);
    expect(result.current.currentKey.keyName).toBe('C Major');
  });

  it('音楽キーを設定できる', () => {
    const { result } = renderHook(() => useCurrentKeyStore());
    const newKey = Key.fromCircleOfFifths(1, false); // G Major

    act(() => {
      result.current.setCurrentKey(newKey);
    });

    expect(result.current.currentKey.tonic.name).toBe('G');
    expect(result.current.currentKey.isMajor).toBe(true);
    expect(result.current.currentKey.keyName).toBe('G Major');
  });

  it('キー名文字列から音楽キーを設定できる', () => {
    const { result } = renderHook(() => useCurrentKeyStore());

    act(() => {
      result.current.setCurrentKeyFromKeyName('A Minor');
    });

    expect(result.current.currentKey.tonic.name).toBe('A');
    expect(result.current.currentKey.isMajor).toBe(false);
    expect(result.current.currentKey.keyName).toBe('A Aeolian (Natural Minor)');
  });

  it('無効なキー名を設定しようとしても変更されない', () => {
    const { result } = renderHook(() => useCurrentKeyStore());
    const originalKey = result.current.currentKey;

    act(() => {
      result.current.setCurrentKeyFromKeyName('InvalidKey');
    });

    expect(result.current.currentKey).toBe(originalKey);
  });

  it('デフォルトにリセットできる', () => {
    const { result } = renderHook(() => useCurrentKeyStore());

    // まず別の音楽キーに設定
    act(() => {
      result.current.setCurrentKey(Key.fromCircleOfFifths(1, true)); // E Minor (G major's relative minor)
    });

    expect(result.current.currentKey.tonic.name).toBe('E');

    // デフォルトにリセット
    act(() => {
      result.current.resetToDefault();
    });

    expect(result.current.currentKey.tonic.name).toBe('C');
    expect(result.current.currentKey.isMajor).toBe(true);
  });

  it('メジャーキーとマイナーキーを正しく区別する', () => {
    const { result } = renderHook(() => useCurrentKeyStore());

    // メジャーキー
    act(() => {
      result.current.setCurrentKey(Key.fromCircleOfFifths(6, false)); // F# Major
    });

    expect(result.current.currentKey.isMajor).toBe(true);

    // マイナーキー
    act(() => {
      result.current.setCurrentKey(Key.fromCircleOfFifths(2, true)); // D Minor
    });

    expect(result.current.currentKey.isMajor).toBe(false);
  });
});
