'use client';

import { useEffect } from 'react';
import { useHubStore } from '@/stores/hubStore';

/**
 * HubType表示制御コンポーネント
 *
 * Zustandストアの状態変化を監視し、DOMのdata-hub-type属性を動的に更新する。
 * CSSセレクター（.hub-container[data-hub-type]）による表示切り替えを実現。
 *
 * 設計思想：
 * - サーバーコンポーネント（Canvas）とクライアントコンポーネント（この部分）の分離
 * - 副作用（DOM操作）を専用コンポーネントに集約
 * - レンダリングには影響せず、純粋にCSS制御のみを担当
 */
export const HubTypeController: React.FC = () => {
  const { hubType } = useHubStore();

  useEffect(() => {
    const container = document.querySelector('.hub-container');
    if (container) {
      container.setAttribute('data-hub-type', hubType);
    }
  }, [hubType]);

  // レンダリングしない（純粋なDOM操作コンポーネント）
  return null;
};
