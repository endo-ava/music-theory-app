/**
 * コンポーネント共通のカスタムクラスProp
 */
export interface ClassNameProps {
  /** カスタムクラス名 */
  className?: string;
}

/**
 * Hub の種類（アプリケーション全体で使用）
 */
export type HubType = 'circle-of-fifths' | 'chromatic-circle';

/**
 * Hub情報の詳細データ構造
 */
export interface HubInfo {
  /** 日本語名 */
  nameJa: string;
  /** 英語名 */
  nameEn: string;
  /** 説明文 */
  description: string;
  /** UI表示用短縮名 */
  shortName: string;
}
