import React from 'react';
import { twMerge } from 'tailwind-merge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlayButton } from './shared/PlayButton';
import type { DiatonicTableProps } from '../types';
import { Key } from '../../../domain/key';

/**
 * ダイアトニックコード・スケール表示テーブルコンポーネント
 *
 * 現在のキーにおけるダイアトニックコード（I, ii, iii, IV, V, vi, vii°）と
 * ダイアトニックスケールの音符を7列のテーブル形式で表示する。
 * 各コードと音符は再生可能なPlayButtonとして実装されており、クリックによる音声フィードバックを提供する。
 *
 * テーブル構成：
 * - 1行目: ローマ数字度数（I, ii, iii, IV, V, vi, vii°）
 * - 2行目: コード名（クリック可能な再生ボタン）
 * - 3行目: 日本語音度名（ド、レ、ミ、ファ、ソ、ラ、シ）
 * - 4行目: 音名（クリック可能な再生ボタン）
 *
 * @component
 * @param props - DiatonicTableコンポーネントのプロパティ
 * @param props.currentKey - 現在のキーオブジェクト（音名表示とコード分析に使用）
 * @param props.diatonicChords - ダイアトニックコード情報の配列（7つのコード）
 * @param props.scaleNotes - ダイアトニックスケールの音符配列（7つの音符）
 * @param props.onPlayChord - コード再生時のハンドラー関数
 * @param props.onPlayNote - 単音再生時のハンドラー関数
 * @param props.className - 追加のCSSクラス名（オプション）
 *
 * @returns ダイアトニック情報を表示するテーブルコンポーネント
 *
 */
const CENTERED_CONTENT = 'flex items-center justify-center';
const CENTERED_HEADER_COL = 'flex flex-col items-center justify-center';

export const DiatonicTable: React.FC<DiatonicTableProps> = React.memo(
  ({ currentKey, diatonicChords, scaleNotes, onPlayChord, onPlayNote, className }) => {
    return (
      <Table
        className={twMerge(
          'text-foreground text-center text-xs [&_tr]:grid [&_tr]:grid-cols-8',
          className
        )}
      >
        <TableHeader>
          {/* ローマ数字度数行 */}
          <TableRow>
            <TableHead className={twMerge(CENTERED_HEADER_COL, 'text-[10px]')}>
              <span>Roman</span>
              <span>Numerals</span>
            </TableHead>
            {diatonicChords.map((chordInfo, index) => (
              <TableCell key={index} className={CENTERED_CONTENT}>
                {chordInfo.perfectDegreeName}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* コード名行 */}
          <TableRow>
            <TableHead className={CENTERED_CONTENT}>Chord</TableHead>
            {diatonicChords.map((chordInfo, index) => (
              <TableCell key={index}>
                <PlayButton
                  onClick={() => onPlayChord(chordInfo.chord)}
                  ariaLabel={`Play chord ${chordInfo.chord.getNameFor(currentKey)}`}
                  variant="cell"
                >
                  {chordInfo.chord.getNameFor(currentKey)}
                </PlayButton>
              </TableCell>
            ))}
          </TableRow>
          {/* 音名行 */}
          <TableRow>
            <TableHead className={CENTERED_CONTENT}>Note</TableHead>
            {scaleNotes.slice(0, 7).map((note, index) => (
              <TableCell key={index}>
                <PlayButton
                  onClick={() => onPlayNote(note)}
                  ariaLabel={`Play note ${note.getNameFor(currentKey.keySignature)}`}
                  variant="cell"
                >
                  {note.getNameFor(currentKey.keySignature)}
                </PlayButton>
              </TableCell>
            ))}
          </TableRow>
          {/* 日本語音度名行 (Keyインスタンスのみ表示) */}
          {currentKey instanceof Key && (
            <TableRow>
              <TableHead className={twMerge(CENTERED_HEADER_COL, 'text-[10px]')}>
                <span>Scale</span>
                <span>Degree</span>
              </TableHead>
              {currentKey.japaneseScaleDegreeNames.map((degreeName, index) => (
                <TableCell key={index} className="flex items-center justify-center text-[10px]">
                  {degreeName}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  }
);
