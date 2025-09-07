import { Chord } from '@/domain/chord';
import { Key, KeyDTO } from '@/domain';
import { SelectedChordInfo } from './types';

/**
 * 共通ボタンスタイルクラス
 *
 * information-panel内で使用されるボタンの統一されたスタイル定義。
 * ホバーエフェクト、トランジション、パディングなどの
 * 一貫したデザインを提供する。
 *
 * @constant {Object} BUTTON_STYLES
 * @property {string} primary - 一般的なボタン用スタイル
 * @property {string} header - ヘッダー部分用ボタンスタイル
 */
export const BUTTON_STYLES = {
  primary: 'hover:bg-selected transition-colors rounded px-2 py-1 w-full',
  header: 'text-foreground hover:bg-selected rounded px-2 py-1 text-lg font-bold transition-colors',
} as const;

/**
 * 選択されたキーからコード情報を生成する
 *
 * Circle of Fifths上で選択されたキー情報（KeyDTO）から
 * コードオブジェクトを生成し、現在のキーコンテキストでの
 * 音楽理論分析（度数、機能、構成音など）を実行する。
 *
 * @param {KeyDTO | null} selectedKey - 選択されたキー情報（nullの場合は未選択）
 * @param {Key} currentKey - 現在のキーコンテキスト
 * @returns {SelectedChordInfo | null} 分析結果のコード情報またはnull
 *
 * @example
 * // CメジャーキーコンテキストでGコードを分析
 * const chordInfo = createChordInfo(gKeyDTO, cMajorKey);
 * // 結果: { degreeName: 'V', function: 'Dominant', ... }
 */
export const createChordInfo = (
  selectedKey: KeyDTO | null,
  currentKey: Key
): SelectedChordInfo | null => {
  if (!selectedKey || !currentKey) return null;

  const chord = Chord.fromKeyDTO(selectedKey);

  const analysis = currentKey.analyzeChord(chord);
  if (!analysis) return null;

  return {
    name: `${chord.getNameFor(currentKey)} (${analysis.romanDegreeName})`,
    degreeName: analysis.romanDegreeName,
    chord: chord,
    constituentNotes: chord.constituentNotes.map(note => note.getNameFor(currentKey.keySignature)),
    function: analysis.function || '-',
    keyContext: `in ${currentKey.keyName}`,
  };
};

/**
 * エラーハンドリング付きのコンソールログ出力
 *
 * 音声再生機能で発生したエラーを統一したフォーマットでコンソールに出力する。
 *
 * @param {string} action - 実行中だったアクションの説明（例: 'コード再生'）
 * @param {unknown} error - 発生したエラーオブジェクト
 *
 */
export const logAudioError = (action: string, error: unknown): void => {
  console.error(`${action}に失敗しました:`, error);
};
