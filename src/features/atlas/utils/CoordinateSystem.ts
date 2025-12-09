/**
 * Atlas 座標系ユーティリティクラス
 *
 * Atlas Canvas 上の座標計算を担当する。
 * 極座標からデカルト座標への変換、五度圏配置、セクター配置などの
 * 座標計算ロジックを提供する。
 */

import { polarToCartesian as polarToCartesianBase, degreesToRadians } from '@/utils/geometry';

/**
 * 2次元座標
 */
export interface Coordinate {
  x: number;
  y: number;
}

/**
 * 座標系定数
 */
export class CoordinateConstants {
  /** ワールドサイズ（Canvas全体のサイズ） */
  static readonly WORLD_SIZE = 5000;

  /** 中心座標 */
  static readonly CENTER = CoordinateConstants.WORLD_SIZE / 2; // 2500

  /** レイヤー半径定義 */
  static readonly R = {
    // 基底概念層（0-10%）- 同じ親の子を近くに配置
    FOUNDATION_CENTER: 0, // 0% - 中心点
    FOUNDATION_INNER: CoordinateConstants.CENTER * 0.1, // 5% - R250
    FOUNDATION_OUTER: CoordinateConstants.CENTER * 0.16, // 8% - R400

    // 抽象構造層（12-30%）
    PATTERN_INNER: CoordinateConstants.CENTER * 0.24, // 12% - R600
    PATTERN_MID: CoordinateConstants.CENTER * 0.4, // 20% - R1000
    PATTERN_OUTER: CoordinateConstants.CENTER * 0.6, // 30% - R1500

    // 具体インスタンス層（24-36%）
    INSTANCE_INNER: CoordinateConstants.CENTER * 0.48, // 24% - R1200
    INSTANCE_MID: CoordinateConstants.CENTER * 0.6, // 30% - R1500
    INSTANCE_OUTER: CoordinateConstants.CENTER * 0.72, // 36% - R1800

    // Key/Function 特殊領域（28-34%）
    KEY_CONTEXT: CoordinateConstants.CENTER * 0.56, // 28% - R1400
    KEY_MAJOR: CoordinateConstants.CENTER * 0.64, // 32% - R1600
    KEY_MINOR: CoordinateConstants.CENTER * 0.68, // 34% - R1700
  } as const;

  /** Domain セクター定義（角度範囲）
   * 各Conceptノードの周辺（±30°）に子ノードを配置
   */
  static readonly SECTOR = {
    // 全方位
    ALL: { start: 0, end: 360 },

    // Pitch Domain（上部）concept-pitch = 90°の周辺
    PITCH: { start: 60, end: 120 },

    // Scale Domain（左上）concept-scale = 150°の周辺
    SCALE: { start: 120, end: 180 },

    // Interval Domain（左下）concept-interval = 210°の周辺
    INTERVAL: { start: 180, end: 240 },

    // Chord Domain（右下）concept-chord = 300°の周辺
    CHORD: { start: 270, end: 330 },

    // Key Domain（右上）concept-key = 30°の周辺
    KEY: { start: 0, end: 60 },
  } as const;
}

/**
 * 座標系計算クラス
 */
export class CoordinateSystem {
  /**
   * 極座標からデカルト座標への変換
   *
   * shared/utils/geometry.tsのpolarToCartesian関数をベースに、
   * Atlas特有の処理（中心座標オフセット、SVG y軸反転、丸め処理）を追加。
   *
   * @param radius 中心からの半径
   * @param angleDegrees 角度（度）、0度=東、反時計回り
   * @returns デカルト座標 (x, y)
   */
  static polarToCartesian(radius: number, angleDegrees: number): Coordinate {
    const angleRadians = degreesToRadians(angleDegrees);
    const point = polarToCartesianBase(radius, angleRadians);

    // 中心座標のオフセットを追加
    const x = CoordinateConstants.CENTER + point.x;
    // SVG y軸は下向きなので反転
    const y = CoordinateConstants.CENTER - point.y;

    // 浮動小数点誤差を避けるため、小数点以下4桁に丸める
    return {
      x: Math.round(x * 10000) / 10000,
      y: Math.round(y * 10000) / 10000,
    };
  }

  /**
   * セクター内で均等配置する角度を計算
   *
   * 指定されたセクター（角度範囲）内で、複数の要素を
   * 均等に配置するための角度を計算する。
   *
   * @param sectorStart セクター開始角度（度）
   * @param sectorEnd セクター終了角度（度）
   * @param index 要素のインデックス（0始まり）
   * @param total 要素の総数
   * @returns 角度（度）
   *
   * @example
   * // 120度から240度の範囲に3つの要素を配置
   * getSectorAngle(120, 240, 0, 3) // → 150度
   * getSectorAngle(120, 240, 1, 3) // → 180度
   * getSectorAngle(120, 240, 2, 3) // → 210度
   */
  static getSectorAngle(
    sectorStart: number,
    sectorEnd: number,
    index: number,
    total: number
  ): number {
    // セクター範囲を計算（360度をまたぐ場合に対応）
    const sectorRange =
      sectorEnd > sectorStart ? sectorEnd - sectorStart : 360 - sectorStart + sectorEnd;

    // 両端に余白を持たせるため、total + 1 で割る
    const step = sectorRange / (total + 1);

    let angle = sectorStart + step * (index + 1);

    // 360度を超えた場合は巻き戻す
    if (angle >= 360) angle -= 360;

    return angle;
  }

  /**
   * セクター配置の座標を取得
   *
   * @param sectorStart セクター開始角度（度）
   * @param sectorEnd セクター終了角度（度）
   * @param index 要素のインデックス（0始まり）
   * @param total 要素の総数
   * @param radius 中心からの半径
   * @returns デカルト座標 (x, y)
   */
  static getSectorPosition(
    sectorStart: number,
    sectorEnd: number,
    index: number,
    total: number,
    radius: number
  ): Coordinate {
    const angle = this.getSectorAngle(sectorStart, sectorEnd, index, total);
    return this.polarToCartesian(radius, angle);
  }

  /**
   * 中心座標を取得
   */
  static getCenter(): Coordinate {
    return {
      x: CoordinateConstants.CENTER,
      y: CoordinateConstants.CENTER,
    };
  }
}
