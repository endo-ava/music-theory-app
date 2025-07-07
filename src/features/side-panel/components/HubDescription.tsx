import type { HubType } from '@/shared/types';

/**
 * Hub 説明文のProps
 */
interface HubDescriptionProps {
  /** Hub タイプ */
  hubType: HubType;
  /** Hub ラベル */
  label: string;
  /** Hub 説明文 */
  description: string;
}

/**
 * Hub 説明文表示コンポーネント
 *
 * 設計思想：
 * - 単一責任原則：説明文の表示のみを担当
 * - アクセシビリティ対応（適切なID設定）
 * - 再利用可能で保守しやすい設計
 */
export const HubDescription: React.FC<HubDescriptionProps> = ({ hubType, label, description }) => {
  return (
    <p id={`${hubType}-description`} className="text-text-muted text-sm">
      <span className="font-medium">{label}:</span> {description}
    </p>
  );
};
