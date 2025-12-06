import { useCallback } from 'react';
import { useCircleOfFifthsStore } from '@/stores/circleOfFifthsStore';
import { useAnimationStore } from '@/stores/animationStore';
import { useAudio } from '@/features/circle-of-fifths/hooks/useAudio';
import { Key } from '@/domain/key';
import { Interval } from '@/domain/common';

// タイミング定数
const ANIMATION_START_DELAY = 200; // アニメーション開始までの遅延（ms）
const CHORD_PLAY_DELAY = 800; // 解決先コード再生までの遅延（ms）: 200ms (アニメ開始) + 600ms (シーケンス)

/**
 * useChordProgressionの戻り値の型
 */
export interface UseChordProgressionResult {
  /**
   * 五度進行（ドミナントモーション）を再生する
   * 選択中のコードから反時計回りに1つ進んだコードへの進行
   */
  playFifthProgression: () => void;

  /**
   * 裏コード（Tritone Substitution）を再生する
   * 選択中のコードから対角位置（半周離れた）コードへの進行
   */
  playTritoneSubstitution: () => void;
}

/**
 * コード進行の再生とアニメーション表示を管理するカスタムフック
 *
 * 五度進行（ドミナントモーション）と裏コード（Tritone Substitution）の
 * 視覚的アニメーションと音声再生を統合的に制御します。
 *
 * 処理シーケンス:
 * 1. T+0ms: 起点のコードを再生
 * 2. T+200ms: アニメーション開始
 * 3. T+800ms: 解決先のコードを再生し、選択状態を更新
 *
 * @returns 五度進行と裏コード進行を実行する関数
 */
export const useChordProgression = (): UseChordProgressionResult => {
  // Storeフック
  const { selectedKey, setSelectedKey } = useCircleOfFifthsStore();
  const { startAnimation } = useAnimationStore();
  const { playChordAtPosition } = useAudio();

  /**
   * コード進行の再生とアニメーション表示を行う共通ロジック
   *
   * @param type - アニメーションの種類（'fifth' または 'tritone'）
   * @param targetKeyCalculator - 現在のキーからターゲットキーを計算する関数
   */
  const handlePlayProgression = useCallback(
    async (type: 'fifth' | 'tritone', targetKeyCalculator: (currentKey: Key) => Key) => {
      if (!selectedKey) return;

      // 1. ドメインオブジェクトの生成
      const currentKey = Key.fromCircleOfFifths(selectedKey.fifthsIndex, selectedKey.isMajor);

      // 2. 視覚的位置の計算
      // メジャーキーの場合はそのまま、マイナーキーの場合は平行調メジャーの位置を使用
      // (例: Am -> Cの位置 = 0)
      const visualPosition = currentKey.getRelativeMajorTonic().fifthsIndex;

      // 3. ターゲットキーの計算（ドメインロジック）
      const targetKey = targetKeyCalculator(currentKey);
      const targetVisualPosition = targetKey.getRelativeMajorTonic().fifthsIndex;

      // 4. 起点のコードを再生（即時）
      playChordAtPosition(visualPosition, selectedKey.isMajor);

      // 5. アニメーションを開始（少し遅延）
      setTimeout(() => {
        startAnimation({
          type,
          from: visualPosition,
          to: targetVisualPosition,
          isMajor: selectedKey.isMajor,
          duration: 2000,
        });
      }, ANIMATION_START_DELAY);

      // 6. 解決先のコードを再生し、選択状態を更新（さらに遅延）
      setTimeout(async () => {
        await playChordAtPosition(targetVisualPosition, targetKey.isMajor);

        // 解決先のコードを選択状態にする
        setSelectedKey(targetKey.toJSON());
      }, CHORD_PLAY_DELAY);
    },
    [selectedKey, startAnimation, playChordAtPosition, setSelectedKey]
  );

  // 公開API関数
  const playFifthProgression = useCallback(() => {
    // 五度進行: Subdominant方向へ進む (反時計回り)
    // Note: ドメインモデル上の「SubdominantKey」は反時計回りの隣接キーを指す
    handlePlayProgression('fifth', key => key.getSubdominantKey());
  }, [handlePlayProgression]);

  const playTritoneSubstitution = useCallback(() => {
    // 裏コード: 増四度（減五度）上へ
    handlePlayProgression('tritone', key => {
      // Tritone離れた同じ品質のキー
      const targetCenter = key.centerPitch.transposeBy(Interval.Tritone);
      return key.isMajor ? Key.major(targetCenter) : Key.minor(targetCenter);
    });
  }, [handlePlayProgression]);

  return {
    playFifthProgression,
    playTritoneSubstitution,
  };
};
