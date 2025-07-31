/**
 * コード群管理サービス
 *
 * MusicalKey（調）から導かれるコード群を生成・管理する。
 * 音階のスケール度数に基づいてダイアトニックコードを自動生成し、
 * 音楽理論的に正しいコードプログレッションの基盤を提供する。
 */

import { MusicalKey } from '../value-objects/MusicalKey';
import { Chord } from '../entities/Chord';
import { Note } from '../value-objects/Note';

/**
 * スケール度数（1度から7度まで）
 */
export type ScaleDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * ローマ数字表記（度数表記）
 */
export type RomanNumeral = 'I' | 'ii' | 'iii' | 'IV' | 'V' | 'vi' | 'vii°';

/**
 * コード情報を含むオブジェクト
 */
export interface ChordInfo {
  /** スケール度数 */
  degree: ScaleDegree;
  /** ローマ数字表記 */
  romanNumeral: RomanNumeral;
  /** コードオブジェクト */
  chord: Chord;
  /** コード機能（トニック、サブドミナント、ドミナント） */
  function: 'tonic' | 'subdominant' | 'dominant';
}

/**
 * コード群管理サービス
 */
export class ChordCollectionService {
  /**
   * ダイアトニックコード群を生成
   */
  static generateDiatonicChords(musicalKey: MusicalKey): ChordInfo[] {
    const scaleNotes = musicalKey.getNotes();
    const chords: ChordInfo[] = [];

    // メジャーキーとマイナーキーで異なるコードパターンを適用
    if (musicalKey.isMajor) {
      chords.push(...this.generateMajorKeyChords(scaleNotes));
    } else if (musicalKey.isMinor) {
      chords.push(...this.generateMinorKeyChords(scaleNotes));
    }

    return chords;
  }

  /**
   * 特定の度数のコードを取得
   */
  static getChordByDegree(musicalKey: MusicalKey, degree: ScaleDegree): ChordInfo | null {
    const chords = this.generateDiatonicChords(musicalKey);
    return chords.find(chord => chord.degree === degree) || null;
  }

  /**
   * トニック機能のコード群を取得
   */
  static getTonicChords(musicalKey: MusicalKey): ChordInfo[] {
    return this.generateDiatonicChords(musicalKey).filter(chord => chord.function === 'tonic');
  }

  /**
   * サブドミナント機能のコード群を取得
   */
  static getSubdominantChords(musicalKey: MusicalKey): ChordInfo[] {
    return this.generateDiatonicChords(musicalKey).filter(
      chord => chord.function === 'subdominant'
    );
  }

  /**
   * ドミナント機能のコード群を取得
   */
  static getDominantChords(musicalKey: MusicalKey): ChordInfo[] {
    return this.generateDiatonicChords(musicalKey).filter(chord => chord.function === 'dominant');
  }

  /**
   * メジャーキーのダイアトニックコードを生成
   * パターン: I - ii - iii - IV - V - vi - vii°
   */
  private static generateMajorKeyChords(scaleNotes: Note[]): ChordInfo[] {
    return [
      {
        degree: 1,
        romanNumeral: 'I',
        chord: Chord.major(scaleNotes[0]),
        function: 'tonic',
      },
      {
        degree: 2,
        romanNumeral: 'ii',
        chord: Chord.minor(scaleNotes[1]),
        function: 'subdominant',
      },
      {
        degree: 3,
        romanNumeral: 'iii',
        chord: Chord.minor(scaleNotes[2]),
        function: 'tonic',
      },
      {
        degree: 4,
        romanNumeral: 'IV',
        chord: Chord.major(scaleNotes[3]),
        function: 'subdominant',
      },
      {
        degree: 5,
        romanNumeral: 'V',
        chord: Chord.major(scaleNotes[4]),
        function: 'dominant',
      },
      {
        degree: 6,
        romanNumeral: 'vi',
        chord: Chord.minor(scaleNotes[5]),
        function: 'tonic',
      },
      {
        degree: 7,
        romanNumeral: 'vii°',
        chord: Chord.minor(scaleNotes[6]), // 簡略化のため、減和音ではなくマイナーで代用
        function: 'dominant',
      },
    ];
  }

  /**
   * マイナーキーのダイアトニックコードを生成
   * パターン: i - ii° - III - iv - v - VI - VII
   */
  private static generateMinorKeyChords(scaleNotes: Note[]): ChordInfo[] {
    return [
      {
        degree: 1,
        romanNumeral: 'I', // 小文字のiで表記すべきだが、RomanNumeralタイプでは大文字で統一
        chord: Chord.minor(scaleNotes[0]),
        function: 'tonic',
      },
      {
        degree: 2,
        romanNumeral: 'ii',
        chord: Chord.minor(scaleNotes[1]), // 簡略化のため、減和音ではなくマイナーで代用
        function: 'subdominant',
      },
      {
        degree: 3,
        romanNumeral: 'iii',
        chord: Chord.major(scaleNotes[2]),
        function: 'tonic',
      },
      {
        degree: 4,
        romanNumeral: 'IV',
        chord: Chord.minor(scaleNotes[3]),
        function: 'subdominant',
      },
      {
        degree: 5,
        romanNumeral: 'V',
        chord: Chord.minor(scaleNotes[4]), // ナチュラルマイナーでは5度もマイナー
        function: 'dominant',
      },
      {
        degree: 6,
        romanNumeral: 'vi',
        chord: Chord.major(scaleNotes[5]),
        function: 'tonic',
      },
      {
        degree: 7,
        romanNumeral: 'vii°',
        chord: Chord.major(scaleNotes[6]),
        function: 'dominant',
      },
    ];
  }

  /**
   * コードプログレッション提案（将来の拡張用）
   */
  static suggestProgression(
    musicalKey: MusicalKey,
    type: 'basic' | 'jazz' | 'pop' = 'basic'
  ): ChordInfo[] {
    const allChords = this.generateDiatonicChords(musicalKey);

    if (type === 'basic') {
      // 基本的な進行: I - V - vi - IV (メジャー) または i - VII - VI - VII (マイナー)
      if (musicalKey.isMajor) {
        return [
          allChords[0], // I
          allChords[4], // V
          allChords[5], // vi
          allChords[3], // IV
        ];
      } else {
        return [
          allChords[0], // i
          allChords[6], // VII
          allChords[5], // VI
          allChords[6], // VII
        ];
      }
    }

    return allChords;
  }
}
