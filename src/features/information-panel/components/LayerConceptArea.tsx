'use client';

import { useMemo } from 'react';
import { ClassNameProps } from '@/shared/types';
import { twMerge } from 'tailwind-merge';
import { Key } from '@/domain';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';

/**
 * レイヤー概念エリアコンポーネント
 *
 * 現在アクティブになっているレイヤーが何であるかを簡潔に提示する。
 * レイヤー・コントローラーで何らかのレイヤー（トグルスイッチ）をONにした際に表示が更新される。
 *
 * @param props - コンポーネントのプロパティ
 * @returns LayerConceptArea のJSX要素
 */
export const LayerConceptArea: React.FC<ClassNameProps> = ({ className }) => {
  // 現在のキー
  const { currentKey } = useCurrentKeyStore();
  // 共通ボタンスタイル
  const buttonClassName = 'hover:bg-accent transition-colors rounded px-2 py-1 w-full';
  // ダイアトニックスケールノート
  const scaleNotes = useMemo(() => currentKey.scale.getNotes(), [currentKey]);
  // ダイアトニックコード
  const diatonicChords = useMemo(() => currentKey.diatonicChords, [currentKey]);
  // 関連調
  const relatedKeys = useMemo(() => currentKey.getRelatedKeys(), [currentKey]);

  return (
    <div
      className={twMerge('bg-card border-foreground space-y-6 rounded-lg border p-4', className)}
      aria-label="レイヤー概念エリア"
    >
      {/* キー情報ヘッダー */}
      <div className="border-border border-b pb-2 text-center">
        <h2 className="text-foreground text-lg font-bold">{currentKey.keyName}</h2>
      </div>

      {/* ダイアトニックスケール & コード */}
      <Table className="text-foreground text-center text-xs">
        <TableHeader>
          {/* ローマ数字度数行 */}
          <TableRow>
            {diatonicChords.map((chordInfo, index) => (
              <TableCell key={index}>{chordInfo.romanDegreeName}</TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* コード名行 */}
          <TableRow>
            {diatonicChords.map((chordInfo, index) => (
              <TableCell key={index}>
                <button
                  className={buttonClassName}
                  aria-label={`Play chord ${chordInfo.chord.getNameFor(currentKey)}`}
                >
                  {chordInfo.chord.getNameFor(currentKey)}
                </button>
              </TableCell>
            ))}
          </TableRow>
          {/* 日本語音度名行 */}
          <TableRow>
            {Key.getJapaneseScaleDegreeNames().map((degreeName, index) => (
              <TableCell key={index}>{degreeName}</TableCell>
            ))}
          </TableRow>
          {/* 音名行 */}
          <TableRow>
            {scaleNotes.slice(0, 7).map((note, index) => (
              <TableHead key={index}>
                <button
                  className={buttonClassName}
                  aria-label={`Play note ${note._pitchClass.getNameFor(currentKey.keySignature)}`}
                >
                  {note._pitchClass.getNameFor(currentKey.keySignature)}
                </button>
              </TableHead>
            ))}
          </TableRow>
        </TableBody>
      </Table>

      {/* 関連調 */}
      <Table className="text-foreground text-center text-xs">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">
              <div>平行調</div>
              <div>(Relative)</div>
            </TableHead>
            <TableHead className="text-center">
              <div>同主調</div>
              <div>(Parallel)</div>
            </TableHead>
            <TableHead className="text-center">
              <div>属調</div>
              <div>(Dominant)</div>
            </TableHead>
            <TableHead className="text-center">
              <div>下属調</div>
              <div>(Subdominant)</div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* 関連調名行 */}
          <TableRow>
            <TableCell>
              <button
                className={buttonClassName}
                aria-label={`Play ${relatedKeys.relative.shortName} key`}
              >
                {relatedKeys.relative.shortName}
              </button>
            </TableCell>
            <TableCell>
              <button
                className={buttonClassName}
                aria-label={`Play ${relatedKeys.parallel.shortName} key`}
              >
                {relatedKeys.parallel.shortName}
              </button>
            </TableCell>
            <TableCell>
              <button
                className={buttonClassName}
                aria-label={`Play ${relatedKeys.dominant.shortName} key`}
              >
                {relatedKeys.dominant.shortName}
              </button>
            </TableCell>
            <TableCell>
              <button
                className={buttonClassName}
                aria-label={`Play ${relatedKeys.subdominant.shortName} key`}
              >
                {relatedKeys.subdominant.shortName}
              </button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
