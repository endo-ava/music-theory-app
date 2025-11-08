import React from 'react';
import { PitchClass, ScalePattern } from '@/domain/common';
import { ModalContext } from '@/domain/modal-context';
import { Key } from '@/domain/key';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';

/**
 * キー選択モードの型定義
 */
export type KeySelectionMode = 'parallel' | 'relative';

/**
 * useKeyController - キーコントローラーのビジネスロジックを集約
 *
 * 責務:
 * - currentKeyStoreとの連携
 * - Parallel Mode: Root（Tonic）とModeの独立した管理
 * - Relative Mode: 親メジャーキーと相対モードの管理
 * - ModalContextの構築と更新
 *
 * 設計原則（SOLID）:
 * - SRP: UI表示ロジックとビジネスロジックを分離
 * - DIP: ストアに直接依存せず、抽象化されたインターフェースを使用
 */
export const useKeyController = () => {
  const { currentKey, setCurrentKey } = useCurrentKeyStore();

  // === 選択モード管理 ===
  const [selectionMode, setSelectionMode] = React.useState<KeySelectionMode>('parallel');

  // === Relative Mode用の状態 ===
  const [parentMajorKey, setParentMajorKey] = React.useState<Key>(Key.major(PitchClass.C));

  // 現在のTonicとModeを抽出
  const currentTonic = React.useMemo(() => {
    // AbstractMusicalContextのcenterPitchを使用
    return currentKey.centerPitch;
  }, [currentKey]);

  const currentModeIndex = React.useMemo(() => {
    // AbstractMusicalContextのscale.patternを使用
    const pattern = currentKey.scale.pattern;

    // 現在のモードがMAJOR_MODES_BY_BRIGHTNESSの何番目かを検索
    const index = ScalePattern.MAJOR_MODES_BY_BRIGHTNESS.findIndex(mode => mode === pattern);

    // 見つからない場合はIonian(1)をデフォルトとする
    return index >= 0 ? index : 1;
  }, [currentKey]);

  // === Relative Mode用の派生状態 ===
  const relativeModeIndex = React.useMemo(() => {
    // AbstractMusicalContextのscale.patternを使用
    const pattern = currentKey.scale.pattern;

    // 現在のモードがMAJOR_MODES_BY_DEGREEの何番目かを検索
    const index = ScalePattern.MAJOR_MODES_BY_DEGREE.findIndex(mode => mode === pattern);

    // 見つからない場合はIonian(0)をデフォルトとする
    return index >= 0 ? index : 0;
  }, [currentKey]);

  /**
   * Root（Tonic）変更ハンドラー
   * 現在のモードがIonian（メジャー）またはAeolian（マイナー）の場合はKeyインスタンスを生成
   * その他のモードの場合はModalContextインスタンスを生成
   */
  const handleRootChange = React.useCallback(
    (newTonic: PitchClass) => {
      // モードのスケールパターン
      const currentModePattern = currentKey.scale.pattern;

      if (currentModePattern === ScalePattern.Major) {
        setCurrentKey(Key.major(newTonic));
      } else if (currentModePattern === ScalePattern.Aeolian) {
        setCurrentKey(Key.minor(newTonic));
      } else {
        // その他のモード（ModalContext）
        const newContext = new ModalContext(newTonic, currentModePattern);
        setCurrentKey(newContext);
      }
    },
    [currentKey, setCurrentKey]
  );

  /**
   * Mode変更ハンドラー（Parallel Mode用）
   * Major（Ionian）またはAeolian（Natural Minor）の場合はKeyインスタンスを生成
   * その他のモードの場合はModalContextインスタンスを生成
   */
  const handleModeChange = React.useCallback(
    (modeIndex: number) => {
      // 範囲チェック
      if (modeIndex < 0 || modeIndex >= ScalePattern.MAJOR_MODES_BY_BRIGHTNESS.length) {
        console.warn(`Invalid mode index: ${modeIndex}`);
        return;
      }

      // 現在のTonicを維持したまま、Modeのみ変更
      const newModePattern = ScalePattern.MAJOR_MODES_BY_BRIGHTNESS[modeIndex];

      // IonianまたはAeolianの場合はKeyインスタンス生成
      if (newModePattern === ScalePattern.Major) {
        // メジャーキー
        const newKey = Key.major(currentTonic);
        setCurrentKey(newKey);
      } else if (newModePattern === ScalePattern.Aeolian) {
        // マイナーキー（Natural Minor）
        const newKey = Key.minor(currentTonic);
        setCurrentKey(newKey);
      } else {
        // その他のモード（ModalContext）
        const newContext = new ModalContext(currentTonic, newModePattern);
        setCurrentKey(newContext);
      }
    },
    [currentTonic, setCurrentKey]
  );

  /**
   * 親メジャーキー変更ハンドラー（Relative Mode用）
   * 新しい親メジャーキーのIonian（I度）モードに設定
   */
  const handleMajorKeyChange = React.useCallback(
    (newMajorKey: Key) => {
      setParentMajorKey(newMajorKey);
      // 親キーのIonian（Major）モードに設定
      setCurrentKey(newMajorKey);
    },
    [setCurrentKey]
  );

  /**
   * 相対モード変更ハンドラー（Relative Mode用）
   * 親メジャーキーを維持したまま、相対モードのみ変更
   */
  const handleRelativeModeChange = React.useCallback(
    (modeIndex: number) => {
      // 範囲チェック
      if (modeIndex < 0 || modeIndex >= ScalePattern.MAJOR_MODES_BY_DEGREE.length) {
        console.warn(`Invalid relative mode index: ${modeIndex}`);
        return;
      }

      // Key.fromRelativeMode()を使用して新しいコンテキストを生成
      const newContext = Key.fromRelativeMode(parentMajorKey, modeIndex);
      setCurrentKey(newContext);
    },
    [parentMajorKey, setCurrentKey]
  );

  return {
    // 共通
    currentKey,

    // 選択モード
    selectionMode,
    setSelectionMode,

    // Parallel Mode用
    currentTonic,
    currentModeIndex: currentModeIndex >= 0 ? currentModeIndex : 1, // デフォルトはIonian
    handleRootChange,
    handleModeChange,

    // Relative Mode用
    parentMajorKey,
    relativeModeIndex,
    handleMajorKeyChange,
    handleRelativeModeChange,
  };
};
