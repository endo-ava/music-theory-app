import { Chord } from '@/domain/chord';
import { Key } from '@/domain/key';
import { IAnalysisResult, IMusicalContext, Note } from '@/domain';

/**
 * 選択されたコード情報の型定義
 *
 * Circle of Fifths上で選択されたコードに関する詳細情報を保持する。
 * コード名、度数名、構成音、機能などの分析結果を含む。
 *
 */
export type SelectedChordInfo = {
  degreeName: string;
  chord: Chord;
  constituentNotes: string[];
  function: string;
  keyContext: string;
};

/**
 * 関連調情報の型定義
 * 現在のキーに対する関連調（平行調、同主調、属調、下属調）の情報を保持する。
 */
export type RelatedKeysInfo = {
  relative: Key;
  parallel: Key;
  dominant: Key;
  subdominant: Key;
};

/**
 * 再生可能なオーディオオブジェクトの型定義
 * AudioEngineで再生可能な音楽要素の統合型。
 */
export type PlayableAudio = Chord | Note | Key['scale'];

/**
 * 音声再生ハンドラーの型定義
 * 音楽要素を非同期で再生するためのハンドラー関数の型。
 *
 * @template T 再生対象のオーディオオブジェクトの型
 * @type AudioPlayHandler
 */
export type AudioPlayHandler<T extends PlayableAudio> = (audio: T) => Promise<void>;

/**
 * 再生ボタンコンポーネントのプロパティ型定義
 *
 * 音楽要素の再生機能を持つボタンの共通プロパティを定義する。
 * アクセシビリティとスタイリングの一貫性を保つために使用される。
 *
 */
export interface PlayButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
  className?: string;
  variant: 'header' | 'cell';
}

/**
 * テーブルコンポーネントの共通プロパティ型定義
 */
export interface TableComponentProps {
  className?: string;
}

/**
 * ダイアトニックテーブルのプロパティ型定義
 *
 * ダイアトニックスケールとコードを表示するテーブルコンポーネントのプロパティ。
 * 現在のキー情報、7つのダイアトニックコード、スケール音、及びそれらの再生機能を含む。
 *
 */
export interface DiatonicTableProps extends TableComponentProps {
  currentKey: IMusicalContext;
  diatonicChords: IAnalysisResult[];
  scaleNotes: readonly Note[];
  onPlayChord: (chord: Chord) => Promise<void>;
  onPlayNote: AudioPlayHandler<Note>;
}

/**
 * 関連調テーブルのプロパティ型定義
 *
 * 現在のキーに関連する4つの調（平行調、同主調、属調、下属調）を
 * 表示するテーブルコンポーネントのプロパティ。
 * 各関連調の情報とスケール再生機能を含む。
 *
 */
export interface RelatedKeysTableProps extends TableComponentProps {
  relatedKeys: RelatedKeysInfo;
  onPlayScale: (keyOrScale: Key | Key['scale']) => Promise<void>;
}

/**
 * コード詳細テーブルのプロパティ型定義
 *
 * 選択されたコードの詳細情報（構成音、度数名、機能）を
 * 表示するテーブルコンポーネントのプロパティ。
 * Circle of Fifths上での選択に基づく分析結果を表示する。
 *
 */
export interface ChordDetailsTableProps extends TableComponentProps {
  selectedChordInfo: SelectedChordInfo;
}
