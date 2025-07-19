import { twMerge } from 'tailwind-merge';
import type { HubType } from '@/shared/types';

/**
 * Hub オプションボタンのProps
 */
interface HubOptionButtonProps {
  /** Hub オプションの値 */
  value: HubType;
  /** ボタンのラベル */
  label: string;
  /** 選択状態 */
  isSelected: boolean;
  /** クリックハンドラー */
  onClick: (value: HubType) => void;
  /** ARIA describedby 属性用のID */
  describedById: string;
  /** タブインデックス（roving tabindex パターン用） */
  tabIndex: number;
}

/**
 * Hub オプション選択ボタンコンポーネント
 *
 * 設計思想：
 * - 単一責任原則：ボタンの表示とインタラクションのみを担当
 * - アクセシビリティ完全対応
 * - 再利用可能な設計
 * - パフォーマンス最適化（propsによる制御）
 */
export const HubOptionButton: React.FC<HubOptionButtonProps> = ({
  value,
  label,
  isSelected,
  onClick,
  describedById,
  tabIndex,
}) => {
  return (
    <button
      onClick={() => onClick(value)}
      className={twMerge(
        // 基本スタイル
        'bg-background-muted border-border text-accent rounded border px-3 py-2 text-sm font-medium transition-all duration-200',
        'focus:ring-text-primary focus:ring-1 focus:ring-offset-0 focus:ring-offset-transparent focus:outline-none',
        // 状態別スタイル（条件を明確に分離）
        isSelected
          ? 'bg-key-area-selected text-text-primary border-border border shadow-sm'
          : 'text-text-secondary hover:bg-key-area-hover hover:text-text-primary'
      )}
      role="radio"
      aria-checked={isSelected}
      aria-describedby={describedById}
      tabIndex={tabIndex}
    >
      {label}
    </button>
  );
};
