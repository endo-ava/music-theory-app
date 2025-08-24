'use client';

import { useMemo } from 'react';
import { ClassNameProps } from '@/shared/types';
import { twMerge } from 'tailwind-merge';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { useCircleOfFifthsStore } from '@/features/circle-of-fifths/store';
import { Chord } from '@/domain/chord';
import { AudioEngine } from '@/domain/services/AudioEngine';
import { Key, KeyDTO } from '../../../domain';

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

  const chord = Chord.fromKeyDTO(selectedKey);

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
      await AudioEngine.play(selectedChordInfo.chord);
    } catch (error) {
      console.error('コード再生に失敗しました:', error);
    }
  };

  return (
    <div
      className={twMerge(
        'bg-card border-foreground text-secondary-foreground rounded-lg border p-4 text-xs',
        className
      )}
      aria-label="Selected Chord"
    >
      {selectedChordInfo ? (
        <>
          {/* 上段：選択コード、構成音 */}
          <div className="border-border mb-2 border-b pb-2">
            {/* Top row - Left */}
            <div className="-mb-2">Selected Chord</div>
            {/* Center row */}
            <div className="-mb-2 text-center">
              <button
                className="text-foreground hover:bg-accent rounded px-2 py-1 text-lg font-bold transition-colors"
                onClick={handlePlayChord}
                aria-label={`Play ${selectedChordInfo.chord.getNameForCircleOfFifth()} chord`}
              >
                {selectedChordInfo.chord.getNameForCircleOfFifth()}
              </button>
            </div>
            {/* Bottom row - Right */}
            <div className="text-right">
              <div className="inline-block w-36 text-left">
                <span>構成音:</span>
                <span className="text-foreground ml-2">
                  {selectedChordInfo.constituentNotes.join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* 下段：Key解釈: Degree Name, Function */}
          <div>
            {/* Top row - Left */}
            <div className="-mb-2">
              <span>
                [In <span className="text-foreground font-bold">{currentKey.shortName}</span> Key]
              </span>
            </div>
            {/* Bottom row - Right */}
            <div className="text-right">
              <div className="inline-block w-36 text-left">
                <div>
                  <span>DegreeName:</span>
                  <span className="text-foreground ml-2 text-sm">
                    {selectedChordInfo.degreeName}
                  </span>
                </div>
                <div>
                  <span>Function:</span>
                  <span className="text-foreground ml-2 text-sm">{selectedChordInfo.function}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // 非選択時のプレースホルダー表示
        <div className="text-muted-foreground py-8 text-center">
          <p>要素を選択してください</p>
          <p className="mt-1">サークル上のエリアをクリックすると、詳細情報が表示されます</p>
        </div>
      )}
    </div>
  );
};
