'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLayerStore } from '../../../stores/layerStore';
import { useCurrentKeyStore } from '../../../stores/currentKeyStore';

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

  // メジャー/マイナーキーかどうかをチェック（モードではなくキーであること）
  const keyData = currentKey.toJSON();
  const isMajorOrMinorKey = keyData.type === 'key';

  return (
    <Accordion type="single" collapsible defaultValue="chord-layer">
      <AccordionItem value="chord-layer">
        <AccordionTrigger variant="layer">Chord Layers</AccordionTrigger>
        <AccordionContent className="space-y-4">
          {/* ダイアトニックボーダーハイライト表示トグル */}
          <div className="flex items-center justify-between">
            <Label htmlFor="diatonic" variant="layer" className="ml-4 pl-2">
              Diatonic
            </Label>
            <Switch id="diatonic" checked={isDiatonicVisible} onCheckedChange={toggleDiatonic} />
          </div>

          {/* 度数表記表示トグル */}
          <div className="flex items-center justify-between">
            <Label htmlFor="degree" variant="layer" className="ml-4 pl-2">
              Degree (Roman numerals)
            </Label>
            <Switch id="degree" checked={isDegreeVisible} onCheckedChange={toggleDegree} />
          </div>

          {/* 機能和声トグル（メジャー/マイナーキーの時のみ表示） */}
          {isMajorOrMinorKey && (
            <div className="flex items-center justify-between">
              <Label htmlFor="functional-harmony" variant="layer" className="ml-4 pl-2">
                Functional harmony (T/D/SD)
              </Label>
              <Switch
                id="functional-harmony"
                checked={isFunctionalHarmonyVisible}
                onCheckedChange={toggleFunctionalHarmony}
              />
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
