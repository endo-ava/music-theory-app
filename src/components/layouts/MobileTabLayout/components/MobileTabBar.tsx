import React from 'react';
import { Settings2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileTabBarProps {
  /** 現在アクティブなタブ */
  activeTab: 'controller' | 'information';
  /** タブ変更時のコールバック関数 */
  onTabChange: (tab: 'controller' | 'information') => void;
  /** 追加のCSSクラス */
  className?: string;
}

/**
 * モバイル用タブバーコンポーネント
 *
 * ControllerとInformationパネルを切り替えるための下部ナビゲーションバー。
 *
 * @param props - コンポーネントのプロパティ
 * @returns モバイル用タブバーのJSX要素
 */
export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-card flex h-16 items-center justify-around border-t border-white/10',
        className
      )}
      role="tablist"
      aria-label="Mobile Navigation"
    >
      <button
        onClick={() => onTabChange('controller')}
        className={cn(
          'flex flex-col items-center justify-center gap-1 p-2 transition-colors',
          activeTab === 'controller'
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
        )}
        role="tab"
        aria-selected={activeTab === 'controller'}
        aria-controls="tabpanel-controller"
        id="tab-controller"
        tabIndex={activeTab === 'controller' ? 0 : -1}
      >
        <Settings2 className="h-6 w-6" />
        <span className="text-xs font-medium">Controller</span>
      </button>
      <button
        onClick={() => onTabChange('information')}
        className={cn(
          'flex flex-col items-center justify-center gap-1 p-2 transition-colors',
          activeTab === 'information'
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
        )}
        role="tab"
        aria-selected={activeTab === 'information'}
        aria-controls="tabpanel-information"
        id="tab-information"
        tabIndex={activeTab === 'information' ? 0 : -1}
      >
        <Info className="h-6 w-6" />
        <span className="text-xs font-medium">Information</span>
      </button>
    </div>
  );
};
