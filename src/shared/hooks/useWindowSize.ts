'use client';

import { useState, useEffect } from 'react';

/**
 * ウィンドウサイズを取得・監視するカスタムフック
 *
 * SSR対応でクライアントサイドでのみwindowオブジェクトにアクセスし、
 * リサイズイベントに追従してサイズを更新する。
 *
 * @returns ウィンドウの幅と高さを含むオブジェクト
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // SSR対応: クライアントサイドでのみ実行
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 初期値を設定
    handleResize();

    // リサイズイベントリスナーを登録
    window.addEventListener('resize', handleResize);

    // クリーンアップ
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
