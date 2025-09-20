import { describe, it, expect } from 'vitest';
import { useCircleOfFifthsStore } from '../circleOfFifthsStore';

describe('Zustandストアの基本動作確認', () => {
  it('ストアが正常に初期化される', () => {
    // セットアップ確認用の最低限のテスト
    const store = useCircleOfFifthsStore.getState();
    expect(store.selectedKey).toBeNull();
    expect(store.hoveredKey).toBeNull();
    expect(store.isPlaying).toBe(false);
  });
});
