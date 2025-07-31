import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCurrentMusicalKeyStore } from '../currentMusicalKeyStore';
import { MusicalKey } from '@/domain/music/value-objects';

describe('currentMusicalKeyStore', () => {
  beforeEach(() => {
    // テスト前にストアをリセット
    const { result } = renderHook(() => useCurrentMusicalKeyStore());
    act(() => {
      result.current.resetToDefault();
    });
  });

  it('初期状態はC Majorキーである', () => {
    const { result } = renderHook(() => useCurrentMusicalKeyStore());

    expect(result.current.currentMusicalKey.root.noteName).toBe('C');
    expect(result.current.currentMusicalKey.isMajor).toBe(true);
    expect(result.current.currentMusicalKey.getDisplayName()).toBe('C Major');
  });

  it('音楽キーを設定できる', () => {
    const { result } = renderHook(() => useCurrentMusicalKeyStore());
    const newMusicalKey = MusicalKey.fromKeyName('G');

    act(() => {
      result.current.setCurrentMusicalKey(newMusicalKey);
    });

    expect(result.current.currentMusicalKey.root.noteName).toBe('G');
    expect(result.current.currentMusicalKey.isMajor).toBe(true);
    expect(result.current.currentMusicalKey.getDisplayName()).toBe('G Major');
  });

  it('キー名文字列から音楽キーを設定できる', () => {
    const { result } = renderHook(() => useCurrentMusicalKeyStore());

    act(() => {
      result.current.setCurrentMusicalKeyFromKeyName('Am');
    });

    expect(result.current.currentMusicalKey.root.noteName).toBe('A');
    expect(result.current.currentMusicalKey.isMinor).toBe(true);
    expect(result.current.currentMusicalKey.getDisplayName()).toBe('A Minor');
  });

  it('無効なキー名を設定しようとしても変更されない', () => {
    const { result } = renderHook(() => useCurrentMusicalKeyStore());
    const originalMusicalKey = result.current.currentMusicalKey;

    act(() => {
      result.current.setCurrentMusicalKeyFromKeyName('InvalidKey');
    });

    expect(result.current.currentMusicalKey).toBe(originalMusicalKey);
  });

  it('デフォルトにリセットできる', () => {
    const { result } = renderHook(() => useCurrentMusicalKeyStore());

    // まず別の音楽キーに設定
    act(() => {
      result.current.setCurrentMusicalKey(MusicalKey.fromKeyName('Em'));
    });

    expect(result.current.currentMusicalKey.root.noteName).toBe('E');

    // デフォルトにリセット
    act(() => {
      result.current.resetToDefault();
    });

    expect(result.current.currentMusicalKey.root.noteName).toBe('C');
    expect(result.current.currentMusicalKey.isMajor).toBe(true);
  });

  it('メジャーキーとマイナーキーを正しく区別する', () => {
    const { result } = renderHook(() => useCurrentMusicalKeyStore());

    // メジャーキー
    act(() => {
      result.current.setCurrentMusicalKey(MusicalKey.fromKeyName('F#'));
    });

    expect(result.current.currentMusicalKey.isMajor).toBe(true);
    expect(result.current.currentMusicalKey.isMinor).toBe(false);

    // マイナーキー
    act(() => {
      result.current.setCurrentMusicalKey(MusicalKey.fromKeyName('Dm'));
    });

    expect(result.current.currentMusicalKey.isMajor).toBe(false);
    expect(result.current.currentMusicalKey.isMinor).toBe(true);
  });
});
