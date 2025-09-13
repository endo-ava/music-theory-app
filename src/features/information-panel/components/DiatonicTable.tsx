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
export const DiatonicTable: React.FC<DiatonicTableProps> = React.memo(
  ({ currentKey, diatonicChords, scaleNotes, onPlayChord, onPlayNote, className }) => {
    return (
      <Table
        className={twMerge(
          'text-foreground text-center text-xs [&_tr]:grid [&_tr]:grid-cols-7',
          className
        )}
      >
        <TableHeader>
          {/* ローマ数字度数行 */}
          <TableRow>
            {diatonicChords.map((chordInfo, index) => (
              <TableHead key={index} className="flex items-center justify-center">
                {chordInfo.romanDegreeName}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* コード名行 */}
          <TableRow>
            {diatonicChords.map((chordInfo, index) => (
              <TableCell key={index}>
                <PlayButton
                  onClick={() => onPlayChord(chordInfo.chord)}
                  ariaLabel={`Play chord ${chordInfo.chord.getNameFor(currentKey)}`}
                  className="w-full"
                >
                  {chordInfo.chord.getNameFor(currentKey)}
                </PlayButton>
              </TableCell>
            ))}
          </TableRow>
          {/* 日本語音度名行 */}
          <TableRow>
            {currentKey.japaneseScaleDegreeNames.map((degreeName, index) => (
              <TableCell key={index}>{degreeName}</TableCell>
            ))}
          </TableRow>
          {/* 音名行 */}
          <TableRow>
            {scaleNotes.slice(0, 7).map((note, index) => (
              <TableCell key={index}>
                <PlayButton
                  onClick={() => onPlayNote(note)}
                  ariaLabel={`Play note ${note.getNameFor(currentKey.keySignature)}`}
                  className="w-full"
                >
                  {note.getNameFor(currentKey.keySignature)}
                </PlayButton>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    );
  }
);
