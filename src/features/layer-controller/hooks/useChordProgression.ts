import { useCallback } from 'react';
import { useCircleOfFifthsStore } from '@/stores/circleOfFifthsStore';
import { useAnimationStore } from '@/stores/animationStore';
import { useAudio } from '@/features/circle-of-fifths/hooks/useAudio';
import { Key } from '@/domain/key';
import type { KeyDTO } from '@/domain/common/IMusicalContext';

// タイミング定数
const ANIMATION_START_DELAY = 200; // アニメーション開始までの遅延（ms）
const CHORD_PLAY_DELAY = 800; // 解決先コード再生までの遅延（ms）: 200ms (アニメ開始) + 600ms (シーケンス)

// 進行の視覚的オフセット定数
const MINOR_KEY_VISUAL_OFFSET = -3; // マイナーキーは平行調のメジャーキーの位置に表示（例: Am -> C の位置）
const FIFTH_PROGRESSION_OFFSET = -1; // 五度進行: 反時計回りに1つ（例: C -> F）
const TRITONE_SUBSTITUTION_OFFSET = 6; // 裏コード: 対角の位置（半周、例: C -> F#）

/**
 * 視覚的位置（0-11）からKeyDTOを生成
 *
 * 五度圏の視覚的な位置は、メジャーキーの場合はfifthsIndexと直接対応します。
 * マイナーキーの場合は、視覚的には平行調のメジャーキーの位置に表示されるため、
 * +3の調整を行ってfifthsIndexを復元します。
 *
 * @param visualPosition - 円上の視覚的位置（0-11）
 * @param isMajor - メジャーキーかマイナーキーか
 * @returns 対応するKeyDTO
 */
const createKeyDTOFromVisualPosition = (visualPosition: number, isMajor: boolean): KeyDTO => {
  // マイナーキーの視覚的オフセットを逆変換
  const fifthsIndex = isMajor
    ? visualPosition
    : (visualPosition - MINOR_KEY_VISUAL_OFFSET + 12) % 12;

  // ドメインモデルを使用して正確なキー情報を生成
  const key = Key.fromCircleOfFifths(fifthsIndex, isMajor);
  return key.toJSON();
};

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
   * @param targetOffsetCalculator - ターゲット位置を計算する関数
   */
  const handlePlayProgression = useCallback(
    async (
      type: 'fifth' | 'tritone',
      targetOffsetCalculator: (visualPosition: number) => number
    ) => {
      if (!selectedKey) return;

      const keyIndex = selectedKey.fifthsIndex;
      const isMajor = selectedKey.isMajor;
      // マイナーキーの場合は、表示上の位置（平行調のメジャーキーの位置）に変換する
      const visualPosition = isMajor ? keyIndex : (keyIndex + MINOR_KEY_VISUAL_OFFSET + 12) % 12;
      const targetVisualPosition = targetOffsetCalculator(visualPosition);

      // 1. 起点のコードを再生（即時）
      playChordAtPosition(visualPosition, isMajor);

      // 2. アニメーションを開始（少し遅延）
      setTimeout(() => {
        startAnimation({
          type,
          from: visualPosition,
          to: targetVisualPosition,
          isMajor,
          duration: 2000,
        });
      }, ANIMATION_START_DELAY);

      // 3. 解決先のコードを再生し、選択状態を更新（さらに遅延）
      setTimeout(async () => {
        await playChordAtPosition(targetVisualPosition, isMajor);

        // 解決先のコードを選択状態にする
        const targetKeyDTO = createKeyDTOFromVisualPosition(targetVisualPosition, isMajor);
        setSelectedKey(targetKeyDTO);
      }, CHORD_PLAY_DELAY);
    },
    [selectedKey, startAnimation, playChordAtPosition, setSelectedKey]
  );

  // 公開API関数
  const playFifthProgression = useCallback(() => {
    handlePlayProgression('fifth', pos => (pos + FIFTH_PROGRESSION_OFFSET + 12) % 12);
  }, [handlePlayProgression]);

  const playTritoneSubstitution = useCallback(() => {
    handlePlayProgression('tritone', pos => (pos + TRITONE_SUBSTITUTION_OFFSET) % 12);
  }, [handlePlayProgression]);

  return {
    playFifthProgression,
    playTritoneSubstitution,
  };
};
