import { useCallback, useMemo } from 'react';
import { useCircleOfFifthsStore } from '@/features/circle-of-fifths/store';
import { Key, CircleSegment as CircleSegmentType } from '@/features/circle-of-fifths/types';
import { useAudio } from './useAudio';
import { useLongPress } from './useLongPress';
import { useCurrentMusicalKeyStore } from '@/stores/currentMusicalKeyStore';
import { MusicalKey } from '@/domain/music/value-objects';
import { MusicTheoryConverter } from '@/domain';
import { FifthsIndex } from '@/domain';

/**
 * useKeyAreaフックが必要とするプロパティの型定義
 * @interface UseKeyAreaProps
 */
export interface UseKeyAreaProps {
  /** キーの名前（例: "C", "F#", "Bb"など） */
  keyName: string;
  /** メジャーキーかどうか（true: メジャー、false: マイナー） */
  isMajor: boolean;
  /** 五度圏上のセグメント情報（位置やスタイル情報を含む） */
  segment: CircleSegmentType;
}

/**
 * KeyAreaコンポーネントのロジックを集約したカスタムフック。
 * 五度圏上のキーエリアの状態管理、イベントハンドリング、派生状態の計算を担当する。
 *
 * @param props - フックの設定オプション
 * @param props.keyName - キーの名前（C, F#, Bbなど）
 * @param props.isMajor - メジャーキーかどうか（true: メジャー、false: マイナー）
 * @param props.segment - 五度圏上のセグメント情報（位置、スタイル等）
 *
 * @returns フックの戻り値
 * @returns returns.states - UIの表示状態
 * @returns returns.states.isSelected - このキーが選択されているかどうか
 * @returns returns.states.isHovered - このキーがホバーされているかどうか
 * @returns returns.states.fillClassName - キーエリアの背景色クラス名
 * @returns returns.states.textClassName - キーテキストのスタイルクラス名
 * @returns returns.handlers - イベントハンドラー群
 * @returns returns.handlers.handleClick - クリック時の処理（キー選択＋音響再生）
 * @returns returns.handlers.handleMouseEnter - マウスエンター時の処理（ホバー状態設定）
 * @returns returns.handlers.handleMouseLeave - マウスリーブ時の処理（ホバー状態解除）
 *
 */
export const useKeyArea = ({ keyName, isMajor, segment }: UseKeyAreaProps) => {
  const { position } = segment;
  const { selectedKey, hoveredKey, setSelectedKey, setHoveredKey } = useCircleOfFifthsStore();
  const { setCurrentMusicalKey } = useCurrentMusicalKeyStore();
  const { playMajorChordAtPosition, playMinorChordAtPosition } = useAudio();

  // 派生状態（選択、ホバー）をまとめて計算し、メモ化
  const states = useMemo(() => {
    const isSelected = selectedKey?.name === keyName && selectedKey?.isMajor === isMajor;
    const isHovered = hoveredKey?.name === keyName && hoveredKey?.isMajor === isMajor;

    let fillClassName = isMajor ? 'fill-key-area-major' : 'fill-key-area-minor';
    if (isSelected) {
      fillClassName = 'fill-key-area-selected';
    } else if (isHovered) {
      fillClassName = 'fill-key-area-hover';
    }

    const textClassName = isMajor
      ? 'text-key-major font-key-major'
      : 'text-key-minor font-key-minor';

    return {
      isSelected,
      isHovered,
      fillClassName,
      textClassName,
    };
  }, [selectedKey, hoveredKey, keyName, isMajor]);

  // propsからkeyDataをメモ化
  const keyData = useMemo<Key>(
    () => ({ name: keyName, isMajor, position }),
    [keyName, isMajor, position]
  );

  // 通常のクリック時の処理（キー選択＋音響再生）
  const handleClick = useCallback(() => {
    setSelectedKey(keyData);
    // 音響再生: メジャーキーならメジャートライアド、マイナーキーならマイナートライアドを再生
    const playChordFunction = isMajor ? playMajorChordAtPosition : playMinorChordAtPosition;
    playChordFunction(position as FifthsIndex);
  }, [
    keyData,
    isMajor,
    position,
    setSelectedKey,
    playMajorChordAtPosition,
    playMinorChordAtPosition,
  ]);

  // ロングプレス開始時の処理（視覚フィードバック）
  const handleLongPressStart = useCallback(() => {
    // 視覚フィードバックは削除
  }, []);

  // ロングプレス完了時の処理（現在の音楽キー設定 + 選択状態切り替え）
  const handleLongPress = useCallback(() => {
    // 1. 現在の音楽キー設定（五度圏インデックスから直接キー名を取得）
    let keyName: string;
    if (isMajor) {
      const baseNoteName = MusicTheoryConverter.fifthsToNoteName(position as FifthsIndex);
      keyName = baseNoteName;
    } else {
      // マイナーキーの場合は相対マイナーキー名を使用
      const relativeMinorNoteName = MusicTheoryConverter.fifthsToRelativeMinorNoteName(
        position as FifthsIndex
      );
      keyName = `${relativeMinorNoteName}m`;
    }

    const musicalKey = MusicalKey.fromKeyName(
      keyName as Parameters<typeof MusicalKey.fromKeyName>[0]
    );
    setCurrentMusicalKey(musicalKey);

    // 2. 選択状態の切り替え（通常のクリックと同様）
    setSelectedKey(keyData);

    // 3. 音響再生
    const playChordFunction = isMajor ? playMajorChordAtPosition : playMinorChordAtPosition;
    playChordFunction(position as FifthsIndex);

    // 4. 触覚フィードバック（モバイルデバイスのみ）
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [
    isMajor,
    position,
    setCurrentMusicalKey,
    keyData,
    setSelectedKey,
    playMajorChordAtPosition,
    playMinorChordAtPosition,
  ]);

  // 通常のクリック時の処理
  const handleClickWithReset = useCallback(() => {
    handleClick();
  }, [handleClick]);

  // マウスエンター時の処理（Reactイベントハンドラー形式）
  const handleMouseEnter = useCallback(
    (_event: React.MouseEvent) => {
      setHoveredKey(keyData);
    },
    [setHoveredKey, keyData]
  );

  // マウスリーブ時の処理（Reactイベントハンドラー形式）
  const handleMouseLeave = useCallback(
    (_event: React.MouseEvent) => {
      setHoveredKey(null);
    },
    [setHoveredKey]
  );

  // ロングプレス機能の統合
  const longPressHandlers = useLongPress({
    onLongPressStart: handleLongPressStart,
    onLongPress: handleLongPress,
    onClick: handleClickWithReset,
    delay: 500, // 500ms でロングプレス判定
  });

  // マウスリーブハンドラーを統合（ホバー解除 + ロングプレスキャンセル）
  const combinedMouseLeave = useCallback(
    (event: React.MouseEvent) => {
      handleMouseLeave(event);
      longPressHandlers.onMouseLeave?.();
    },
    [handleMouseLeave, longPressHandlers.onMouseLeave]
  );

  return {
    states,
    handlers: {
      // React DOM イベント用（motion.gで使用）
      onMouseEnter: handleMouseEnter,
      onMouseLeave: combinedMouseLeave,
      // ロングプレス対応のハンドラー（onMouseLeaveを除く）
      onMouseDown: longPressHandlers.onMouseDown,
      onMouseUp: longPressHandlers.onMouseUp,
      onMouseMove: longPressHandlers.onMouseMove,
      onTouchStart: longPressHandlers.onTouchStart,
      onTouchEnd: longPressHandlers.onTouchEnd,
      onTouchMove: longPressHandlers.onTouchMove,
    },
  };
};
