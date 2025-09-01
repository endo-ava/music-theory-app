import { create } from 'zustand';

/**
 * レイアウト設定の型定義
 */
export interface LayoutState {
  /** パネルリセット機能の表示状態 */
  showResetButton: boolean;

  /** パネルリセット機能の表示/非表示を切り替え */
  setShowResetButton: (show: boolean) => void;

  /** パネルレイアウトをデフォルトにリセット */
  resetPanelLayout: () => void;
}

/**
 * レイアウト設定用Zustandストア
 *
 * 3分割レイアウトのUI状態や動作設定を管理
 * パネルサイズ自体は react-resizable-panels が localStorageで管理
 */
export const useLayoutStore = create<LayoutState>((set, _get) => ({
  // リセットボタンの初期表示状態
  showResetButton: false,

  // リセットボタンの表示/非表示切り替え
  setShowResetButton: (show: boolean) => set({ showResetButton: show }),

  // パネルレイアウトをデフォルトにリセット
  resetPanelLayout: () => {
    // react-resizable-panels のlocalStorageデータをクリア
    const storageKey = 'react-resizable-panels:layout:three-column-layout';
    localStorage.removeItem(storageKey);

    // ページリロードでデフォルトレイアウトを復元
    // より良い方法があれば後で改善
    window.location.reload();
  },
}));
