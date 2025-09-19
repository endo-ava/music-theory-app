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

/**
 * コードレイヤー用アコーディオンコンポーネント
 *
 * ダイアトニックコードの表示制御を行うトグルスイッチを含む。
 * Shadcn/uiのAccordionとSwitchを使用してUIを構築。
 */
export const ChordLayerAccordion: React.FC = () => {
  const { isDiatonicChordsVisible, toggleDiatonicChords } = useLayerStore();

  return (
    <Accordion type="single" collapsible defaultValue="chord-layer">
      <AccordionItem value="chord-layer">
        <AccordionTrigger variant="layer">Chord Layers</AccordionTrigger>
        <AccordionContent className="space-y-4">
          {/* ダイアトニックコード表示トグル */}
          <div className="flex items-center justify-between">
            <Label htmlFor="diatonic-chords" variant="layer" className="ml-4 pl-2">
              Diatonic chords
            </Label>
            <Switch
              id="diatonic-chords"
              checked={isDiatonicChordsVisible}
              onCheckedChange={toggleDiatonicChords}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
