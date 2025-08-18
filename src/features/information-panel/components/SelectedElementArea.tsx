'use client';

import { useMemo } from 'react';
import { ClassNameProps } from '@/shared/types';
import { twMerge } from 'tailwind-merge';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { useCircleOfFifthsStore } from '@/features/circle-of-fifths/store';
import { Chord } from '@/domain/chord';
import { AudioEngine } from '@/domain/services/AudioEngine';
import { Key, KeyDTO, PitchClass } from '../../../domain';

/**
 * 選択されたコード情報の型定義
 */
type SelectedChordInfo = {
  name: string;
  degreeName: string;
  chord: Chord;
  constituentNotes: string[];
  function: string;
  keyContext: string;
};

/**
 * 選択されたキーからコード情報を生成する
 */
const createChordInfo = (selectedKey: KeyDTO | null, currentKey: Key): SelectedChordInfo | null => {
  if (!selectedKey || !currentKey) return null;

  const pitchClass = PitchClass.fromCircleOfFifths(selectedKey.fifthsIndex);
  const chord = Chord.fromKeyDTO(selectedKey, pitchClass.index >= 9 ? 3 : 4);

  const analysis = currentKey.analyzeChord(chord);
  if (!analysis) return null;

  return {
    name: `${chord.getNameFor(currentKey)} (${analysis.romanDegreeName})`,
    degreeName: analysis.romanDegreeName,
    chord: chord,
    constituentNotes: chord.constituentNotes.map(note => note._pitchClass.sharpName),
    function: analysis.function as string,
    keyContext: `in ${currentKey.keyName}`,
  };
};

/**
 * 選択要素エリアコンポーネント
 *
 * ユーザーがCanvas上で具体的に選択した「モノ」が何であるかを詳しく説明する。
 * Canvas上のキーやコードをクリックまたはホバーした時に、アニメーションを伴って情報が描画される。
 *
 * @param props - コンポーネントのプロパティ
 * @returns SelectedElementArea のJSX要素
 */
export const SelectedElementArea: React.FC<ClassNameProps> = ({ className }) => {
  const { currentKey } = useCurrentKeyStore();
  const { selectedKey } = useCircleOfFifthsStore();

  // 選択されたコード情報をメモ化
  const selectedChordInfo = useMemo(
    () => createChordInfo(selectedKey, currentKey),
    [selectedKey, currentKey]
  );

  // コード再生
  const handlePlayChord = async () => {
    if (!selectedChordInfo) return;

    try {
      await AudioEngine.playNotes(selectedChordInfo.chord.toneNotations, false);
    } catch (error) {
      console.error('コード再生に失敗しました:', error);
    }
  };

  return (
    <div
      className={twMerge('bg-card border-foreground rounded-lg border p-4', className)}
      aria-label="Selected Chord"
    >
      <h3 className="text-secondary-foreground text-sm font-semibold">Selected Chord</h3>

      {selectedChordInfo ? (
        // 選択時の詳細情報表示
        <div className="space-y-4">
          {/* 上段：選択コード、構成音 */}
          <div className="border-border border-b pb-3">
            <div className="mb-1 flex items-center">
              <div className="flex-1"></div>
              <div className="flex-1 text-center">
                <h4 className="text-foreground text-lg font-bold">
                  {selectedChordInfo.chord.getNameForCircleOfFifth()}
                </h4>
              </div>
              <div className="flex flex-1 justify-end pr-4">
                <div className="text-xs">
                  <span className="text-secondary-foreground">▶ 構成音:</span>
                  <span className="text-foreground ml-1">
                    {selectedChordInfo.constituentNotes.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 下段：Key解釈: Degree Name, Function */}
          <div className="relative">
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-foreground text-sm">In {currentKey.shortName} Key</span>
              </div>
              <div>
                <span className="text-secondary-foreground pl-2">▶ DegreeName:</span>
                <span className="text-foreground ml-2 text-sm">{selectedChordInfo.degreeName}</span>
              </div>
              <div>
                <span className="text-secondary-foreground pl-2">▶ Function:</span>
                <span className="text-foreground ml-2 text-sm">{selectedChordInfo.function}</span>
              </div>
            </div>

            {/* 音声再生ボタン（右下配置） */}
            <button
              className="bg-muted hover:bg-accent text-muted-foreground absolute right-0 bottom-0 flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors"
              aria-label="Play chord"
              onClick={handlePlayChord}
            >
              <span>🔊</span>
              <span>Play</span>
            </button>
          </div>
        </div>
      ) : (
        // 非選択時のプレースホルダー表示
        <div className="text-muted-foreground py-8 text-center">
          <p className="text-xs">要素を選択してください</p>
          <p className="mt-1 text-xs">サークル上のコードをクリックすると、詳細情報が表示されます</p>
        </div>
      )}
    </div>
  );
};
