'use client';

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLayerStore } from '../../../stores/layerStore';
import { useCircleOfFifthsStore } from '@/stores/circleOfFifthsStore';
import { useCurrentKeyStore } from '../../../stores/currentKeyStore';
import { useChordProgression } from '../hooks/useChordProgression';

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
  const { selectedKey } = useCircleOfFifthsStore();
  const { playFifthProgression, playTritoneSubstitution } = useChordProgression();

  // メジャー/マイナーキーかどうかをチェック（モードではなくキーであること）
  const keyData = currentKey.toJSON();
  const isMajorOrMinorKey = keyData.type === 'key';

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
                onClick={playFifthProgression}
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
                onClick={playTritoneSubstitution}
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
