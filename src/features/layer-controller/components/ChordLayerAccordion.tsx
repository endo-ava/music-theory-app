'use client';

import React, { useCallback } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLayerStore } from '../../../stores/layerStore';
import { useCircleOfFifthsStore } from '@/stores/circleOfFifthsStore';
import { useAnimationStore } from '@/stores/animationStore';
import { useAudio } from '@/features/circle-of-fifths/hooks/useAudio';
import { useCurrentKeyStore } from '../../../stores/currentKeyStore';
import { Key } from '@/domain/key';
import type { KeyDTO } from '@/domain/common/IMusicalContext';

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
  const MINOR_KEY_VISUAL_OFFSET = -3;
  const fifthsIndex = isMajor
    ? visualPosition
    : (visualPosition - MINOR_KEY_VISUAL_OFFSET + 12) % 12;

  // ドメインモデルを使用して正確なキー情報を生成
  const key = Key.fromCircleOfFifths(fifthsIndex, isMajor);
  return key.toJSON();
};

/**
 * コードレイヤー用アコーディオンコンポーネント
 *
 * ダイアトニックレイヤーの表示制御と機能和声（T/D/SD）色分けを行う。
 * Shadcn/uiのAccordion、Switchを使用してUIを構築。
 */
export const ChordLayerAccordion: React.FC = () => {
  const {
    isDiatonicVisible,
    toggleDiatonic,
    isDegreeVisible,
    toggleDegree,
    isFunctionalHarmonyVisible,
    toggleFunctionalHarmony,
  } = useLayerStore();
  const { currentKey } = useCurrentKeyStore();
  const { selectedKey, setSelectedKey } = useCircleOfFifthsStore();
  const { startAnimation } = useAnimationStore();
  const { playChordAtPosition } = useAudio();

  // メジャー/マイナーキーかどうかをチェック（モードではなくキーであること）
  const keyData = currentKey.toJSON();
  const isMajorOrMinorKey = keyData.type === 'key';

  // タイミング定数
  const ANIMATION_START_DELAY = 200; // アニメーション開始までの遅延（ms）
  const CHORD_PLAY_DELAY = 800; // 解決先コード再生までの遅延（ms）: 200ms (アニメ開始) + 600ms (シーケンス)

  // 進行の視覚的オフセット定数
  const MINOR_KEY_VISUAL_OFFSET = -3; // マイナーキーは平行調のメジャーキーの位置に表示（例: Am -> C の位置）
  const FIFTH_PROGRESSION_OFFSET = -1; // 五度進行: 反時計回りに1つ（例: C -> F）
  const TRITONE_SUBSTITUTION_OFFSET = 6; // 裏コード: 対角の位置（半周、例: C -> F#）

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

  const handlePlayFifthProgression = useCallback(() => {
    handlePlayProgression('fifth', pos => (pos + FIFTH_PROGRESSION_OFFSET + 12) % 12);
  }, [handlePlayProgression]);

  const handlePlayTritoneSubstitution = useCallback(() => {
    handlePlayProgression('tritone', pos => (pos + TRITONE_SUBSTITUTION_OFFSET) % 12);
  }, [handlePlayProgression]);

  return (
    <div className="space-y-4 pt-2">
      <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
        Chord Layers
      </h3>
      <div className="space-y-3">
        {/* ダイアトニックボーダーハイライト表示トグル */}
        <div className="flex items-center justify-between">
          <Label htmlFor="diatonic" className="text-sm font-normal">
            Diatonic
          </Label>
          <Switch id="diatonic" checked={isDiatonicVisible} onCheckedChange={toggleDiatonic} />
        </div>

        {/* 度数表記表示トグル */}
        <div className="flex items-center justify-between">
          <Label htmlFor="degree" className="text-sm font-normal">
            Degree (Roman numerals)
          </Label>
          <Switch id="degree" checked={isDegreeVisible} onCheckedChange={toggleDegree} />
        </div>

        {/* 機能和声トグル（メジャー/マイナーキーの時のみ表示） */}
        {isMajorOrMinorKey && (
          <div className="animate-in fade-in slide-in-from-top-1 flex items-center justify-between duration-300">
            <Label htmlFor="functional-harmony" className="text-sm font-normal">
              Functional harmony (T/D/SD)
            </Label>
            <Switch
              id="functional-harmony"
              checked={isFunctionalHarmonyVisible}
              onCheckedChange={toggleFunctionalHarmony}
            />
          </div>
        )}

        {/* 進行ボタン（キーが選択されている時のみ表示） */}
        {selectedKey && (
          <div className="animate-in fade-in slide-in-from-top-1 space-y-3 duration-300">
            {/* 五度進行（ドミナントモーション） */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-normal">5th Progression</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayFifthProgression}
                className="h-7 text-xs"
              >
                Play
              </Button>
            </div>

            {/* 裏コード（Tritone Substitution） */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-normal">Tritone Substitution</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayTritoneSubstitution}
                className="h-7 text-xs"
              >
                Play
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
