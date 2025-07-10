'use client';

import { useMemo, useCallback, useRef } from 'react';
import { useHubStore } from '@/stores/hubStore';
import { getHubOptions } from '@/shared/constants/hubs';
import type { HubType } from '@/shared/types';

/**
 * ViewController のビジネスロジックを管理するカスタムフック
 *
 * 設計思想：
 * - ビジネスロジックとUIの分離
 * - パフォーマンス最適化（メモ化）
 * - アクセシビリティ対応（キーボードナビゲーション）
 * - テスタビリティの向上
 */
export const useViewController = () => {
  const { hubType, setHubType } = useHubStore();
  const radioGroupRef = useRef<HTMLDivElement>(null);

  // 静的データのメモ化
  const hubOptions = useMemo(() => getHubOptions(), []);

  // 現在選択されているオプションの詳細取得（効率化）
  const selectedOption = useMemo(
    () => hubOptions.find(option => option.value === hubType),
    [hubOptions, hubType]
  );

  // イベントハンドラーのメモ化
  const handleHubTypeChange = useCallback(
    (newHubType: HubType) => {
      setHubType(newHubType);
    },
    [setHubType]
  );

  // キーボードナビゲーション（アクセシビリティ向上）
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = hubOptions.findIndex(option => option.value === hubType);
      let nextIndex = currentIndex;

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : hubOptions.length - 1;
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          nextIndex = currentIndex < hubOptions.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = hubOptions.length - 1;
          break;
        default:
          return;
      }

      if (nextIndex !== currentIndex && hubOptions[nextIndex]) {
        handleHubTypeChange(hubOptions[nextIndex].value);

        // フォーカス管理
        const radioGroup = radioGroupRef.current;
        if (radioGroup) {
          const buttons = radioGroup.querySelectorAll('button[role="radio"]');
          const targetButton = buttons[nextIndex] as HTMLButtonElement;
          targetButton?.focus();
        }
      }
    },
    [hubOptions, hubType, handleHubTypeChange]
  );

  return {
    hubType,
    hubOptions,
    selectedOption,
    radioGroupRef,
    handleHubTypeChange,
    handleKeyDown,
  };
};
