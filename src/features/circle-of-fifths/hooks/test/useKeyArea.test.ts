import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyArea, type UseKeyAreaProps } from '../useKeyArea';
import type { Key, CircleSegment } from '@/features/circle-of-fifths/types';
import { useCircleOfFifthsStore } from '../../store';
import { useAudio } from '../useAudio';

// --- 1. モック化するモジュールを宣言 ---
vi.mock('@/features/circle-of-fifths/store');
vi.mock('../useAudio');
// useKeyAreaが内部で使ってる他の依存関係も同様にモック宣言
vi.mock('@/domain', async importOriginal => {
  const original = await importOriginal<typeof import('@/domain')>();
  return {
    ...original, // FifthsIndexなど、モックしないものはそのまま使う
    ChordBuilder: vi.fn(), // 必要なら具体的にモック
    AudioEngine: {
      // 必要なら具体的にモック
      playChord: vi.fn().mockResolvedValue(undefined),
      setVolume: vi.fn(),
      setArpeggioSpeed: vi.fn(),
    },
  };
});

// --- 2. describeブロックの外で、モック用の関数を定義 ---
// これらはテストケース (`it`) の中で検証に使うので、describeの外で定義します。
const mockSetSelectedKey = vi.fn();
const mockSetHoveredKey = vi.fn();
const mockPlayMajorChordAtPosition = vi.fn();
const mockPlayMinorChordAtPosition = vi.fn();

describe('useKeyArea', () => {
  // --- 3. テストで使う定数を準備 ---
  const mockSegment: CircleSegment = {
    position: 0,
    minorKey: '',
    majorKey: '',
    keySignature: '',
  };

  const defaultProps: UseKeyAreaProps = {
    keyName: 'C',
    isMajor: true,
    segment: mockSegment,
  };

  // --- 4. beforeEachでモックの実装を定義＆リセット ---
  beforeEach(() => {
    // 最初にすべてのモックの呼び出し履歴をクリア
    vi.clearAllMocks();

    // as unknownを経由してMockで型アサーションし、mockReturnValueでフックの返り値を設定
    (useCircleOfFifthsStore as unknown as Mock).mockReturnValue({
      selectedKey: null,
      hoveredKey: null,
      setSelectedKey: mockSetSelectedKey,
      setHoveredKey: mockSetHoveredKey,
    });

    (useAudio as unknown as Mock).mockReturnValue({
      playMajorChordAtPosition: mockPlayMajorChordAtPosition,
      playMinorChordAtPosition: mockPlayMinorChordAtPosition,
    });
  });

  // 1. 基本機能の確認
  it('正常ケース: フックが正しい構造を返す', () => {
    const { result } = renderHook(() => useKeyArea(defaultProps));

    expect(result.current).toHaveProperty('states');
    expect(result.current).toHaveProperty('handlers');
    expect(typeof result.current.handlers.handleClick).toBe('function');
    expect(typeof result.current.handlers.handleMouseEnter).toBe('function');
    expect(typeof result.current.handlers.handleMouseLeave).toBe('function');
  });

  // 2. 状態計算の確認
  it('正常ケース: 初期状態で正しいクラス名が適用される', () => {
    const { result } = renderHook(() => useKeyArea(defaultProps));
    expect(result.current.states.fillClassName).toBe('fill-key-area-major');
    expect(result.current.states.textClassName).toBe('text-key-major font-key-major');
  });

  it('正常ケース: 選択状態のキーで正しいクラス名が適用される', () => {
    const selectedKeyData: Key = { name: 'C', isMajor: true, position: 0 };
    (useCircleOfFifthsStore as unknown as Mock).mockReturnValue({
      selectedKey: selectedKeyData, // 選択状態のキーを設定
      hoveredKey: null,
      setSelectedKey: mockSetSelectedKey,
      setHoveredKey: mockSetHoveredKey,
    });

    // 上書きしたモックの状態でフックをレンダリング
    const { result } = renderHook(() => useKeyArea(defaultProps));

    // 検証
    expect(result.current.states.fillClassName).toBe('fill-key-area-selected');
    expect(result.current.states.isSelected).toBe(true);
  });

  // 3. イベントハンドラーの確認
  it('正常ケース: handleClickがsetSelectedKeyとplayMajorChordAtPositionを呼び出す', async () => {
    const { result } = renderHook(() => useKeyArea(defaultProps));
    await act(async () => {
      await result.current.handlers.handleClick();
    });
    expect(mockSetSelectedKey).toHaveBeenCalledWith({ name: 'C', isMajor: true, position: 0 });
    expect(mockPlayMajorChordAtPosition).toHaveBeenCalledWith(0);
    expect(mockPlayMinorChordAtPosition).not.toHaveBeenCalled();
  });

  it('正常ケース: handleClickがマイナーキーでplayMinorChordAtPositionを呼び出す', async () => {
    const minorProps: UseKeyAreaProps = {
      ...defaultProps,
      keyName: 'Am',
      isMajor: false,
      segment: { ...mockSegment, position: 9 },
    };
    const { result } = renderHook(() => useKeyArea(minorProps));
    await act(async () => {
      await result.current.handlers.handleClick();
    });
    expect(mockSetSelectedKey).toHaveBeenCalledWith({ name: 'Am', isMajor: false, position: 9 });
    expect(mockPlayMinorChordAtPosition).toHaveBeenCalledWith(9);
    expect(mockPlayMajorChordAtPosition).not.toHaveBeenCalled();
  });

  it('正常ケース: handleMouseEnterがsetHoveredKeyを呼び出す', () => {
    const { result } = renderHook(() => useKeyArea(defaultProps));
    act(() => {
      result.current.handlers.handleMouseEnter();
    });
    expect(mockSetHoveredKey).toHaveBeenCalledWith({ name: 'C', isMajor: true, position: 0 });
  });

  it('正常ケース: handleMouseLeaveがsetHoveredKey(null)を呼び出す', () => {
    const { result } = renderHook(() => useKeyArea(defaultProps));
    act(() => {
      result.current.handlers.handleMouseLeave();
    });
    expect(mockSetHoveredKey).toHaveBeenCalledWith(null);
  });

  // カバレッジ向上: ホバー状態のクラス名テスト（useKeyArea.ts 34-35行目）
  it('正常ケース: ホバー状態のキーで正しいクラス名が適用される', () => {
    const hoveredKeyData: Key = { name: 'C', isMajor: true, position: 0 };
    (useCircleOfFifthsStore as unknown as Mock).mockReturnValue({
      selectedKey: null, // 選択されていない
      hoveredKey: hoveredKeyData, // ホバー状態のキーを設定
      setSelectedKey: mockSetSelectedKey,
      setHoveredKey: mockSetHoveredKey,
    });

    // 上書きしたモックの状態でフックをレンダリング
    const { result } = renderHook(() => useKeyArea(defaultProps));

    // 検証: ホバー時のクラス名が適用される（34-35行目のカバレッジ）
    expect(result.current.states.fillClassName).toBe('fill-key-area-hover');
    expect(result.current.states.isHovered).toBe(true);
    expect(result.current.states.isSelected).toBe(false);
  });
});
