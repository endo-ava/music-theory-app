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
import type { ChordDetailsTableProps } from '../types';

/**
 * コード詳細情報表示テーブルコンポーネント
 *
 * Circle of Fifths上で選択されたコードの詳細な音楽理論分析結果を3列のテーブル形式で表示する。
 *
 * 表示項目：
 * - chord tones: コードの構成音（例：C, E, G）
 * - degree name: ローマ数字による度数名（例：I, V7, ii°）
 * - function: 調性における機能（例：Tonic, Dominant, Subdominant）
 *
 * @component
 * @param props - ChordDetailsTableコンポーネントのプロパティ
 * @param props.selectedChordInfo - 選択されたコードの分析結果情報
 * @param props.selectedChordInfo.constituentNotes - コードの構成音名配列
 * @param props.selectedChordInfo.degreeName - ローマ数字による度数名
 * @param props.selectedChordInfo.function - 調性における機能名
 * @param props.className - 追加のCSSクラス名（オプション）
 *
 * @returns 選択されたコードの詳細情報を表示するテーブルコンポーネント
 *
 */
const CENTERED_HEADER = 'text-secondary-foreground flex items-center justify-center';

export const ChordDetailsTable: React.FC<ChordDetailsTableProps> = React.memo(
  ({ selectedChordInfo, className }) => {
    return (
      <Table
        className={twMerge(
          'text-foreground text-center text-xs [&_tr]:grid [&_tr]:grid-cols-3',
          className
        )}
      >
        <TableHeader>
          <TableRow>
            <TableHead className={CENTERED_HEADER}>chord tones</TableHead>
            <TableHead className={CENTERED_HEADER}>degree name</TableHead>
            <TableHead className={CENTERED_HEADER}>function</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="p-2 font-medium">
              {selectedChordInfo.constituentNotes.join(', ')}
            </TableCell>
            <TableCell className="p-2 font-medium">{selectedChordInfo.degreeName}</TableCell>
            <TableCell className="p-2 font-medium">{selectedChordInfo.function}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
);
