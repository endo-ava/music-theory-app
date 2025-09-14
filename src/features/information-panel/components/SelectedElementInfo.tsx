'use client';

import React from 'react';
import { ClassNameProps } from '@/shared/types';
import { twMerge } from 'tailwind-merge';
import { PlayButton } from './shared/PlayButton';
import { ChordDetailsTable } from './ChordDetailsTable';
import { useSelectedChordInfo } from '../hooks/useSelectedChordInfo';
import { useAudioPlayback } from '../hooks/useAudioPlayback';
import { BUTTON_STYLES } from '../utils';

/**
 * 選択要素情報コンポーネント
 *
 * Circle of Fifths上でユーザーが選択したコード/キーの詳細な音楽理論分析結果を表示するコンポーネント。
 * 現在のキーコンテキストにおける選択要素の音楽理論的意味（度数、機能、構成音など）を視覚的に提供し、インタラクティブな学習体験を支援する。
 *
 * 表示状態：
 * - 選択状態：選択されたコードの詳細情報とChordDetailsTableを表示
 * - 非選択状態：「クリックして詳細を表示」のプレースホルダーを表示
 *
 * 表示要素（選択状態）：
 * - コードヘッダー：選択されたコード名（クリック可能な再生ボタン）
 * - 詳細テーブル：構成音、度数名、機能の3列表示
 *
 *
 * @component
 * @param props - SelectedElementInfoコンポーネントのプロパティ
 * @param props.className - 追加のCSSクラス名（オプション）
 *
 * @returns 選択されたコード/キーの詳細情報を表示するコンポーネント
 *
 */
export const SelectedElementInfo: React.FC<ClassNameProps> = ({ className }) => {
  const { selectedChordInfo, hasSelection } = useSelectedChordInfo();
  const { handlePlayChord } = useAudioPlayback();

  const handlePlaySelectedChord = () => {
    if (!selectedChordInfo) return;
    handlePlayChord(selectedChordInfo.chord);
  };

  return (
    <div className={twMerge('bg-card p-4 text-xs', className)} aria-label="Selected Chord">
      {hasSelection && selectedChordInfo ? (
        <>
          {/* 上段：選択コード */}
          <div className="border-border mb-2 flex items-center justify-between">
            <div className="text-secondary-foreground text-xs">Selected Chord</div>
            <div className="text-center">
              <PlayButton
                onClick={handlePlaySelectedChord}
                ariaLabel={`Play ${selectedChordInfo.chord.getNameForCircleOfFifth()} chord`}
                className={BUTTON_STYLES.header}
              >
                {selectedChordInfo.chord.getNameForCircleOfFifth()}
              </PlayButton>
            </div>
            {/* スペーサー */}
            <div className="text-xs text-transparent" aria-hidden="true">
              Selected Chord
            </div>
          </div>

          {/* 下段：テーブル形式での情報表示 */}
          <ChordDetailsTable selectedChordInfo={selectedChordInfo} />
        </>
      ) : (
        // 非選択時のプレースホルダー表示
        <div className="text-muted-foreground py-8 text-center">
          <p>サークル上のエリアをクリックすると、詳細情報が表示されます</p>
        </div>
      )}
    </div>
  );
};
