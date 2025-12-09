import { HubOptionButton } from './HubOptionButton';
import type { HubType } from '@/types';

/**
 * Hub オプション情報
 */
interface HubOption {
  value: HubType;
  label: string;
  description: string;
}

/**
 * Hub ラジオグループのProps
 */
interface HubRadioGroupProps {
  /** Hub オプション配列 */
  hubOptions: HubOption[];
  /** 現在選択されているHub */
  selectedHub: HubType;
  /** Hub変更ハンドラー */
  onHubChange: (hubType: HubType) => void;
  /** キーボードイベントハンドラー */
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  /** Ref for the radio group container (React 19 pattern) */
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Hub ラジオグループコンポーネント
 *
 * 設計思想：
 * - ラジオグループとしての適切なセマンティクス
 * - キーボードナビゲーション完全対応
 * - roving tabindex パターンの実装
 * - アクセシビリティベストプラクティス準拠
 */
export const HubRadioGroup = ({
  hubOptions,
  selectedHub,
  onHubChange,
  onKeyDown,
  ref,
}: HubRadioGroupProps) => {
  return (
    <div
      ref={ref}
      className="flex rounded-lg p-1"
      role="radiogroup"
      aria-label="Hub種類の選択"
      onKeyDown={onKeyDown}
    >
      {hubOptions.map(option => {
        const isSelected = selectedHub === option.value;

        return (
          <HubOptionButton
            key={option.value}
            value={option.value}
            label={option.label}
            isSelected={isSelected}
            onClick={onHubChange}
            describedById={`${option.value}-description`}
            tabIndex={isSelected ? 0 : -1} // roving tabindex パターン
          />
        );
      })}
    </div>
  );
};
