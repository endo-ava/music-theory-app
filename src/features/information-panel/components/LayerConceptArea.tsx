'use client';

import { useMemo } from 'react';
import { ClassNameProps } from '@/shared/types';
import { twMerge } from 'tailwind-merge';
import { Key, AudioEngine, Note, type DiatonicChordInfo } from '@/domain';
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
  const buttonClassName = 'hover:bg-selected transition-colors rounded px-2 py-1 w-full';
  // ダイアトニックスケールノート
  const scaleNotes = useMemo(() => currentKey.scale.getNotes(), [currentKey]);
  // ダイアトニックコード
  const diatonicChords = useMemo(() => currentKey.diatonicChords, [currentKey]);
  // 関連調
  const relatedKeys = useMemo(() => currentKey.getRelatedKeys(), [currentKey]);

  // コード再生
  const handlePlayChord = async (chordInfo: DiatonicChordInfo) => {
    try {
      await AudioEngine.play(chordInfo.chord);
    } catch (error) {
      console.error('コード再生に失敗しました:', error);
    }
  };
  // 単音再生
  const handlePlayNote = async (note: Note) => {
    try {
      await AudioEngine.play(note);
    } catch (error) {
      console.error('音再生に失敗しました:', error);
    }
  };
  // スケール再生
  const handlePlayScale = async (key: Key) => {
    try {
      await AudioEngine.play(key.scale);
    } catch (error) {
      console.error('スケール再生に失敗しました:', error);
    }
  };

  return (
    <div
      className={twMerge('bg-card border-foreground space-y-4 rounded-lg border p-4', className)}
      aria-label="Selected Key"
    >
      {/* キー情報ヘッダー */}
      <div className="border-border mb-2 border-b pb-2">
        <div className="text-secondary-foreground -mb-2 text-xs">Selected Key</div>
        <div className="text-center">
          <button
            className="text-foreground hover:bg-selected rounded px-2 py-1 text-lg font-bold transition-colors"
            onClick={() => handlePlayScale(currentKey)}
            aria-label={`Play ${currentKey.keyName} Key`}
          >
            {currentKey.keyName}
          </button>
        </div>
        {/* <h2 className="text-foreground text-lg font-bold">{currentKey.keyName}</h2> */}
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
                  onClick={() => handlePlayChord(chordInfo)}
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
              <TableCell key={index}>
                <button
                  className={buttonClassName}
                  onClick={() => handlePlayNote(note)}
                  aria-label={`Play note ${note.getNameFor(currentKey.keySignature)}`}
                >
                  {note.getNameFor(currentKey.keySignature)}
                </button>
              </TableCell>
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
                onClick={() => handlePlayScale(relatedKeys.relative)}
                aria-label={`Play ${relatedKeys.relative.shortName} key`}
              >
                {relatedKeys.relative.shortName}
              </button>
            </TableCell>
            <TableCell>
              <button
                className={buttonClassName}
                onClick={() => handlePlayScale(relatedKeys.parallel)}
                aria-label={`Play ${relatedKeys.parallel.shortName} key`}
              >
                {relatedKeys.parallel.shortName}
              </button>
            </TableCell>
            <TableCell>
              <button
                className={buttonClassName}
                onClick={() => handlePlayScale(relatedKeys.dominant)}
                aria-label={`Play ${relatedKeys.dominant.shortName} key`}
              >
                {relatedKeys.dominant.shortName}
              </button>
            </TableCell>
            <TableCell>
              <button
                className={buttonClassName}
                onClick={() => handlePlayScale(relatedKeys.subdominant)}
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
