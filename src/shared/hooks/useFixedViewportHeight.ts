'use client';

import { useState, useEffect } from 'react';

/**
 * 固定ビューポート高さを取得するカスタムフック
 *
 * スマホのURLバー表示/非表示によるviewport高さの変動を無視し、
 * 初回取得時の高さを固定値として使用する。
 * ボトムシートなどの固定UIコンポーネントで、
 * URLバーの動きによる意図しないアニメーションを防ぐために使用。
 *
 * @returns 初回取得時のビューポート高さ（固定値）
 */
export const useFixedViewportHeight = (): number => {
  const [fixedHeight, setFixedHeight] = useState(0);

  useEffect(() => {
    // SSR対応: クライアントサイドでのみ実行
    // 初回のみ高さを取得し、その後は固定
    if (typeof window !== 'undefined') {
      setFixedHeight(window.innerHeight);
    }
  }, []); // 空の依存配列 = 初回のみ実行

  return fixedHeight;
};
