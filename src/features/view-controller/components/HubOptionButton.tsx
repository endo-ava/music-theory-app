import { twMerge } from 'tailwind-merge';
import type { HubType } from '@/types';
import { useMusicColorAccent } from '@/hooks/useMusicColorStyles';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';

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
const FOCUS_STYLES =
  'focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:outline-none';

export const HubOptionButton: React.FC<HubOptionButtonProps> = ({
  value,
  label,
  isSelected,
  onClick,
  describedById,
  tabIndex,
}) => {
  const { currentKey } = useCurrentKeyStore();
  useMusicColorAccent(currentKey);
  return (
    <button
      onClick={() => onClick(value)}
      className={twMerge(
        // 基本スタイル
        'bg-muted flex-1 rounded-md px-3 py-2 text-xs font-medium transition-all duration-200',
        FOCUS_STYLES,
        // 状態別スタイル（条件を明確に分離）
        isSelected
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'text-muted-foreground hover:text-foreground'
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
