'use client';

import { useState, useEffect } from 'react';

/**
 * モバイルデバイス判定のためのカスタムフック
 *
 * 768px（md）ブレークポイントを基準にモバイル/デスクトップを判定する。
 * SSR対応でハイドレーション問題を回避し、クライアントサイドで安全に動作する。
 *
 * GlobalHeaderのuseMobileMenuパターンを参考に実装。
 *
 * なぜこのフックが必要か：
 * - 責務分離：デバイス判定ロジックをコンポーネントから切り離す
 * - 再利用性：他のコンポーネントでも同じロジックを使用可能
 * - SSR対応：ハイドレーション不一致を回避
 * - パフォーマンス：不要な再レンダリングを最小化
 *
 * @returns モバイルデバイス判定結果とマウント状態
 */
export const useIsMobile = () => {
  // SSR対応：初期値はfalse、クライアントサイドでのみ判定
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // クライアントサイドでのマウント確認
    setIsClient(true);

    const checkIsMobile = () => {
      // 768px（md）ブレークポイント未満をモバイルとして判定
      setIsMobile(window.innerWidth < 768);
    };

    // 初回チェック
    checkIsMobile();

    // リサイズイベントでの動的判定
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return {
    isMobile: isClient ? isMobile : false,
    isClient,
  };
};
