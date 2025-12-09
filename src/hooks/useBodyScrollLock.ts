'use client';

import { useEffect } from 'react';

/**
 * ボディのスクロールをロック/アンロックするカスタムフック
 *
 * モーダルやオーバーレイ表示時に背景のスクロールを無効化する。
 * アンマウント時やlocked状態がfalseになった時に自動的に元の状態に復元する。
 *
 * @param locked - スクロールをロックするかどうか
 */
export const useBodyScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (!locked) return;

    const body = document.body;

    // 現在の状態を保存
    const originalOverflow = body.style.overflow;
    const originalPosition = body.style.position;
    const originalTop = body.style.top;
    const originalWidth = body.style.width;
    const scrollY = window.scrollY;

    // スクロールをロック
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    // クリーンアップ関数
    return () => {
      // 元の状態に復元
      body.style.overflow = originalOverflow;
      body.style.position = originalPosition;
      body.style.top = originalTop;
      body.style.width = originalWidth;

      // スクロール位置を復元
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
};
