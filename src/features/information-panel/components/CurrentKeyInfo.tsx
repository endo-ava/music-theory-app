'use client';

import React from 'react';
import { ClassNameProps } from '@/shared/types';
import { twMerge } from 'tailwind-merge';
import { PlayButton } from './shared/PlayButton';
import { DiatonicTable } from './DiatonicTable';
import { RelatedKeysTable } from './RelatedKeysTable';
import { useCurrentKeyData } from '../hooks/useCurrentKeyData';
import { useAudioPlayback } from '../hooks/useAudioPlayback';

/**
 * 現在のキー情報エリアコンポーネント
 *
 * アプリケーションで現在設定されているキーに関する包括的な音楽理論情報を表示するメインコンテナコンポーネント。
 * キー名の表示と再生機能、ダイアトニックスケール・コード表、関連調表を統合して提供
 *
 * 主要な表示要素：
 * - キー名ヘッダー：現在のキー名（クリック可能なスケール再生ボタン）
 * - ダイアトニックテーブル：7つのダイアトニックコードと音符（各々再生可能）
 * - 関連調テーブル：平行調、同主調、属調、下属調（各々再生可能）
 *
 *
 * @component
 * @param props - CurrentKeyInfoコンポーネントのプロパティ
 * @param props.className - 追加のCSSクラス名（オプション）
 *
 * @returns 現在のキー情報を包括的に表示するコンポーネント
 *
 */
export const CurrentKeyInfo: React.FC<ClassNameProps> = ({ className }) => {
  const { currentKey, scaleNotes, diatonicChords, relatedKeys } = useCurrentKeyData();
  const { handlePlayChord, handlePlayNote, handlePlayScale } = useAudioPlayback();

  return (
    <div
      className={twMerge(
        'animate-in fade-in slide-in-from-bottom-2 space-y-4 duration-500',
        className
      )}
      aria-label="Selected Key"
    >
      {/* キー情報ヘッダー */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center py-1">
        <span className="text-muted-foreground text-left text-[10px] font-medium tracking-wider uppercase">
          Current Key
        </span>
        <PlayButton
          onClick={() => handlePlayScale(currentKey)}
          ariaLabel={`Play ${currentKey.contextName} Key`}
          variant="header"
        >
          {currentKey.contextName}
        </PlayButton>
        <div /> {/* Spacer for centering */}
      </div>

      {/* ダイアトニックスケール & コード */}
      <DiatonicTable
        currentKey={currentKey}
        diatonicChords={diatonicChords}
        scaleNotes={scaleNotes}
        onPlayChord={handlePlayChord}
        onPlayNote={handlePlayNote}
      />

      {/* 関連調 */}
      {relatedKeys && <RelatedKeysTable relatedKeys={relatedKeys} onPlayScale={handlePlayScale} />}
    </div>
  );
};
