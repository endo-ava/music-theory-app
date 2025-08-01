/**
 * Key集約
 *
 * 調性を表現する集約。音楽全体の「文脈」や「重力場」を定義する。
 * 和声機能（トニック、ドミナント等）を管理し、場面に応じて使うScalePatternを判断する司令塔。
 *
 * 設計思想：
 * - 街全体の都市計画のように、音楽の調性システム全体を統括
 * - 単なる音の集合ではなく、機能的な関係性と文脈を管理
 * - 和声進行、モード切り替え、転調などの高度な音楽操作を支援
 */

import { PitchClass } from '../common/PitchClass';
import { ScalePattern } from '../common/ScalePattern';
import { Scale } from '../scale/Scale';

/**
 * 和声機能の種類
 */
export type HarmonicFunction = 'tonic' | 'subdominant' | 'dominant';

/**
 * 度数の種類（1-7度）
 */
export type ScaleDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * 調性の集約
 *
 * 主音（tonic）と主要なスケールパターンを持ち、
 * 調性の文脈における和声機能や音楽的関係性を管理する。
 */
export class Key {
  constructor(
    private readonly _tonic: PitchClass,
    private readonly _primaryPattern: ScalePattern
  ) {
    this.validateKey();
  }

  /**
   * 主音（トニック）を取得
   */
  get tonic(): PitchClass {
    return this._tonic;
  }

  /**
   * 主要スケールパターンを取得
   */
  get primaryPattern(): ScalePattern {
    return this._primaryPattern;
  }

  /**
   * 主要スケールを取得
   */
  get primaryScale(): Scale {
    return new Scale(this._tonic, this._primaryPattern);
  }

  /**
   * メジャーキーかどうか判定
   */
  get isMajor(): boolean {
    return this._primaryPattern.type === 'Major';
  }

  /**
   * マイナーキーかどうか判定
   */
  get isMinor(): boolean {
    return this._primaryPattern.type === 'Minor';
  }

  /**
   * 調の表示名を取得
   */
  getDisplayName(): string {
    const rootName = this._tonic.name;
    if (this.isMajor) {
      return `${rootName} Major`;
    } else if (this.isMinor) {
      return `${rootName} Minor`;
    } else {
      return `${rootName} ${this._primaryPattern.getShortName()}`;
    }
  }

  /**
   * 短縮表示名を取得
   */
  getShortName(): string {
    const rootName = this._tonic.name;
    if (this.isMajor) {
      return rootName; // C Major → "C"
    } else if (this.isMinor) {
      return `${rootName}m`; // C Minor → "Cm"
    } else {
      return `${rootName}${this._primaryPattern.getShortName()}`;
    }
  }

  /**
   * 指定した度数の音高クラスを取得
   */
  getPitchClassAtDegree(degree: ScaleDegree): PitchClass {
    return this.primaryScale.getPitchClassAtDegree(degree);
  }

  /**
   * 調の全音高クラスを取得
   */
  getPitchClasses(): PitchClass[] {
    return this.primaryScale.getPitchClasses();
  }

  /**
   * 指定した度数の和声機能を取得
   */
  getHarmonicFunctionAtDegree(degree: ScaleDegree): HarmonicFunction {
    if (this.isMajor) {
      // メジャーキーの和声機能
      const majorFunctions: Record<ScaleDegree, HarmonicFunction> = {
        1: 'tonic', // I
        2: 'subdominant', // ii
        3: 'tonic', // iii
        4: 'subdominant', // IV
        5: 'dominant', // V
        6: 'tonic', // vi
        7: 'dominant', // vii°
      };
      return majorFunctions[degree];
    } else {
      // マイナーキーの和声機能
      const minorFunctions: Record<ScaleDegree, HarmonicFunction> = {
        1: 'tonic', // i
        2: 'subdominant', // ii°
        3: 'tonic', // III
        4: 'subdominant', // iv
        5: 'dominant', // v
        6: 'tonic', // VI
        7: 'dominant', // VII
      };
      return minorFunctions[degree];
    }
  }

  /**
   * トニック機能の度数一覧を取得
   */
  getTonicDegrees(): ScaleDegree[] {
    if (this.isMajor) {
      return [1, 3, 6]; // I, iii, vi
    } else {
      return [1, 3, 6]; // i, III, VI
    }
  }

  /**
   * サブドミナント機能の度数一覧を取得
   */
  getSubdominantDegrees(): ScaleDegree[] {
    if (this.isMajor) {
      return [2, 4]; // ii, IV
    } else {
      return [2, 4]; // ii°, iv
    }
  }

  /**
   * ドミナント機能の度数一覧を取得
   */
  getDominantDegrees(): ScaleDegree[] {
    if (this.isMajor) {
      return [5, 7]; // V, vii°
    } else {
      return [5, 7]; // v, VII
    }
  }

  /**
   * 相対調（Major ↔ Minor）を取得
   */
  getRelativeKey(): Key {
    if (this.isMajor) {
      // メジャーキーの相対マイナー（短6度）
      const relativeMinorTonic = this._tonic.transpose(9); // 長6度 = 9セミトーン
      return Key.minor(relativeMinorTonic);
    } else {
      // マイナーキーの相対メジャー（短3度）
      const relativeMajorTonic = this._tonic.transpose(3); // 短3度 = 3セミトーン
      return Key.major(relativeMajorTonic);
    }
  }

  /**
   * 平行調（同じトニック、異なるモード）を取得
   */
  getParallelKey(): Key {
    if (this.isMajor) {
      return Key.minor(this._tonic);
    } else {
      return Key.major(this._tonic);
    }
  }

  /**
   * 指定したモードでの調を取得
   */
  getModalKey(pattern: ScalePattern): Key {
    return new Key(this._tonic, pattern);
  }

  /**
   * 調を移調
   */
  transpose(semitones: number): Key {
    const newTonic = this._tonic.transpose(semitones);
    return new Key(newTonic, this._primaryPattern);
  }

  /**
   * 指定したPitchClassがこの調に含まれるかチェック
   */
  contains(pitchClass: PitchClass): boolean {
    return this.primaryScale.contains(pitchClass);
  }

  /**
   * 等価性判定
   */
  equals(other: Key): boolean {
    return this._tonic.equals(other._tonic) && this._primaryPattern.equals(other._primaryPattern);
  }

  /**
   * 文字列表現
   */
  toString(): string {
    return this.getDisplayName();
  }

  /**
   * JSONシリアライゼーション用
   */
  toJSON(): {
    tonic: { name: import('../common/PitchClass').PitchClassName };
    primaryPattern: {
      name: string;
      type: import('../common/ScalePattern').ScalePatternType;
      intervals: number[];
    };
  } {
    return {
      tonic: this._tonic.toJSON(),
      primaryPattern: this._primaryPattern.toJSON(),
    };
  }

  /**
   * メジャーキーを作成
   */
  static major(tonic: PitchClass): Key {
    return new Key(tonic, ScalePattern.Major);
  }

  /**
   * マイナーキーを作成
   */
  static minor(tonic: PitchClass): Key {
    return new Key(tonic, ScalePattern.Minor);
  }

  /**
   * C Majorキーを作成
   */
  static cMajor(): Key {
    return Key.major(new PitchClass('C'));
  }

  /**
   * A Minorキーを作成
   */
  static aMinor(): Key {
    return Key.minor(new PitchClass('A'));
  }

  /**
   * キー名文字列から調を作成
   */
  static fromKeyName(keyName: string): Key {
    // 有効なキー名の一覧
    const validMajorKeys: string[] = [
      'C',
      'G',
      'D',
      'A',
      'E',
      'B',
      'F#',
      'C#',
      'G#',
      'D#',
      'A#',
      'F',
    ];
    const validMinorKeys: string[] = [
      'Am',
      'Em',
      'Bm',
      'F#m',
      'C#m',
      'G#m',
      'D#m',
      'A#m',
      'Fm',
      'Cm',
      'Gm',
      'Dm',
    ];

    // マイナーキーは末尾に'm'が付く
    if (keyName.endsWith('m')) {
      if (!validMinorKeys.includes(keyName)) {
        throw new Error(`Invalid minor key name: ${keyName}`);
      }
      // 末尾の'm'を除去してルート音名を取得
      const rootName = keyName.slice(0, -1) as import('../common/PitchClass').PitchClassName;
      const tonic = new PitchClass(rootName);
      return Key.minor(tonic);
    } else {
      if (!validMajorKeys.includes(keyName)) {
        throw new Error(`Invalid major key name: ${keyName}`);
      }
      const tonic = new PitchClass(keyName as import('../common/PitchClass').PitchClassName);
      return Key.major(tonic);
    }
  }

  /**
   * デフォルトキー（C Major）を取得
   */
  static getDefault(): Key {
    return Key.cMajor();
  }

  /**
   * JSONから復元
   */
  static fromJSON(json: {
    tonic: { name: import('../common/PitchClass').PitchClassName };
    primaryPattern: {
      name: string;
      type: import('../common/ScalePattern').ScalePatternType;
      intervals: number[];
    };
  }): Key {
    const tonic = PitchClass.fromJSON(json.tonic);
    const pattern = ScalePattern.fromJSON(json.primaryPattern);
    return new Key(tonic, pattern);
  }

  /**
   * 調の妥当性検証
   */
  private validateKey(): void {
    if (!this._tonic) {
      throw new Error('Key must have a tonic PitchClass');
    }
    if (!this._primaryPattern) {
      throw new Error('Key must have a primary ScalePattern');
    }
  }
}
