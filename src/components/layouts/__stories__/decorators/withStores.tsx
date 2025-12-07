import React, { useEffect } from 'react';
import type { Decorator } from '@storybook/react';
import { Key } from '@/domain/key';
import { useCircleOfFifthsStore } from '@/features/circle-of-fifths/stores/circleOfFifthsStore';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';

/**
 * テスト用の標準初期化設定
 */
const TEST_INITIAL_STATE = {
  key: Key.fromCircleOfFifths(0, true),
  resetStores: true, // 各ストーリー実行前にストアをリセット
} as const;

/**
 * Storybookテスト用のストア初期化Decorator（改善版）
 *
 * 各ストーリー実行時にストアを確実にリセット・初期化し、
 * テスト独立性を保証する。レイアウトコンポーネントのテストでは以下の状態が必要：
 * - CircleOfFifths: 選択状態の初期化
 * - CurrentKey: デフォルトキー（C Major）の設定
 *
 * @param Story - Storybookストーリーコンポーネント
 * @param context - Storybookコンテキスト（ストーリー固有の初期化に使用）
 */
export const withStores: Decorator = (Story, context) => {
  useEffect(() => {
    // CurrentKeyStoreの初期化（C Major）
    useCurrentKeyStore.getState().setCurrentKey(TEST_INITIAL_STATE.key);

    // CircleOfFifthsStoreの初期化
    // selectedKeyをC Majorに設定して、確実にInformationPanelにコンテンツを表示
    useCircleOfFifthsStore.setState({
      selectedKey: TEST_INITIAL_STATE.key.toJSON(),
      hoveredKey: null,
      isPlaying: false,
    });

    // デバッグログ（開発時のみ）
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[withStores] Initialized stores for story: ${context?.id || 'unknown'}`);
    }
  }, [context?.id]); // context.idでストーリー固有の初期化を保証

  return <Story />;
};

/**
 * レイアウトテスト用のテストユーティリティ
 *
 * Store初期化やカスタム設定のためのヘルパー関数群
 */
export const LayoutTestUtils = {
  /**
   * 標準テストキー取得
   * @returns デフォルトのテスト用キー（C Major）
   */
  getTestKey: () => TEST_INITIAL_STATE.key,

  /**
   * カスタムキーでストア初期化
   * 特定のストーリーで異なるキーが必要な場合に使用
   * @param key - 設定したいキー
   */
  initializeWithKey: (key: Key) => {
    useCurrentKeyStore.getState().setCurrentKey(key);
    useCircleOfFifthsStore.setState({
      selectedKey: key.toJSON(),
      hoveredKey: null,
      isPlaying: false,
    });
  },

  /**
   * テスト初期状態の取得
   * @returns 標準的なテスト初期状態
   */
  getInitialState: () => ({
    selectedKey: TEST_INITIAL_STATE.key.toJSON(),
    hoveredKey: null,
    isPlaying: false,
  }),
} as const;
