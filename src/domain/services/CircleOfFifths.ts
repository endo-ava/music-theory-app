import { Interval } from '../common';
import { Key, KeyDTO } from '../key';

/**
 * 五度圏のセグメント情報を表現するデータ構造
 */
export interface CircleSegmentData {
  position: number;
  majorKey: Key;
  minorKey: Key;
  keySignature: string; // 調号
}

/**
 * UIに渡すための、シリアライズ可能なセグメント情報
 */
export interface CircleSegmentDTO {
  position: number;
  majorKey: KeyDTO;
  minorKey: KeyDTO;
  keySignature: string;
}

/**
 * 五度圏に関する情報を提供するドメインサービス
 */
export class CircleOfFifthsService {
  private static segments: readonly CircleSegmentData[];

  /**
   * 五度圏のセグメント数を返す (SEGMENT_COUNTの代替)
   */
  static getSegmentCount(): number {
    return 12;
  }

  /**
   * 12個すべての五度圏セグメント情報を生成して返す (CIRCLE_SEGMENTSの代替)
   */
  static getSegments(): readonly CircleSegmentData[] {
    if (this.segments) {
      return this.segments;
    }

    const generatedSegments: CircleSegmentData[] = [];
    for (let i = 0; i < this.getSegmentCount(); i++) {
      generatedSegments.push({
        position: i,
        majorKey: Key.fromCircleOfFifths(i, true),
        minorKey: Key.fromCircleOfFifths(i + Interval.MinorThird.semitones, false),
        keySignature: this.generateKeySignature(i),
      });
    }

    this.segments = Object.freeze(generatedSegments);
    return this.segments;
  }

  /**
   * すべてのメジャー/マイナーキー(計24個)の配列を返す (KEYSの代替)
   */
  static getAllKeys(): readonly Key[] {
    const segments = this.getSegments();
    const allKeys = segments.flatMap(segment => [segment.majorKey, segment.minorKey]);
    return allKeys;
  }

  /**
   * 五度圏の位置から調号の文字列表現を生成するヘルパーメソッド
   */
  private static generateKeySignature(position: number): string {
    if (position === 0) return '';
    if (position < 6) return `♯${position}`;
    if (position === 6) return `♯♭${position}`;

    // F(11), B♭(10), E♭(9), A♭(8), D♭(7)
    // 12 - positionで♭の数が計算できる
    const flatCount = 12 - position;
    return `♭${flatCount}`;
  }

  /**
   * UI（クライアントコンポーネント）に渡すための、シリアライズ可能な12個の五度圏セグメント情報を生成して返す
   */
  static getSegmentDTOs(): readonly CircleSegmentDTO[] {
    // 1. まず、リッチなドメインオブジェクトを生成する
    const segments = this.getSegments();

    // 2. 次に、それらをプレーンなDTOに変換する
    const dtos = segments.map(segment => ({
      position: segment.position,
      majorKey: segment.majorKey.toJSON(),
      minorKey: segment.minorKey.toJSON(),
      keySignature: segment.keySignature,
    }));

    return dtos;
  }
}
