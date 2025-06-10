/**
 * 五度圏コンポーネントのユーティリティ関数
 * 
 * このファイルには、五度圏コンポーネントで使用される
 * すべてのユーティリティ関数が含まれています。
 */

import { Key, Point, SegmentPaths, CircleOfFifthsError } from '@/types/circleOfFifths';
import {
    SEGMENT_COUNT,
    ANGLE_OFFSET,
    ANGLE_PER_SEGMENT,
    CIRCLE_LAYOUT,
    KEYS,
    isValidPosition,
    isValidKey,
} from '../constants/index';

// ============================================================================
// 角度計算ユーティリティ
// ============================================================================

/**
 * 指定された位置の角度を計算
 * @param position 0-11の位置
 * @returns 角度（ラジアン）
 * @throws {CircleOfFifthsError} 位置が無効な場合
 */
export const calculateAngle = (position: number): number => {
    if (!isValidPosition(position)) {
        throw new CircleOfFifthsError(`Invalid position: ${position}`, 'INVALID_POSITION');
    }

    const angleInDegrees = position * ANGLE_PER_SEGMENT + ANGLE_OFFSET;
    return (angleInDegrees * Math.PI) / 180;
};

/**
 * 角度を正規化（0-2πの範囲に）
 * @param angle 正規化する角度（ラジアン）
 * @returns 正規化された角度（ラジアン）
 */
export const normalizeAngle = (angle: number): number => {
    let normalized = angle % (2 * Math.PI);
    if (normalized < 0) {
        normalized += 2 * Math.PI;
    }
    return normalized;
};

// ============================================================================
// 座標計算ユーティリティ
// ============================================================================

/**
 * 極座標から直交座標に変換
 * @param radius 半径
 * @param angle 角度（ラジアン）
 * @returns 直交座標
 */
export const polarToCartesian = (radius: number, angle: number): Point => {
    return {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
    };
};

/**
 * テキストの位置を計算
 * @param position 0-11の位置
 * @param radius 半径
 * @returns テキストの座標
 * @throws {CircleOfFifthsError} 位置が無効な場合
 */
export const calculateTextPosition = (position: number, radius: number): Point => {
    if (!isValidPosition(position)) {
        throw new CircleOfFifthsError(`Invalid position: ${position}`, 'INVALID_POSITION');
    }

    if (radius < 0) {
        throw new CircleOfFifthsError(`Invalid radius: ${radius}`, 'INVALID_RADIUS');
    }

    const angle = calculateAngle(position) + (Math.PI / SEGMENT_COUNT); // セグメントの中心
    return polarToCartesian(radius, angle);
};

/**
 * テキストの回転角度を計算
 * @returns 回転角度（度）- 常に0度（垂直）を返す
 */
export const calculateTextRotation = (): number => {
    // テキストを常に垂直に表示
    return 0;
};

// ============================================================================
// SVGパス生成ユーティリティ
// ============================================================================

/**
 * 円弧のSVGパスを生成
 * @param centerX 中心X座標
 * @param centerY 中心Y座標
 * @param radius 半径
 * @param startAngle 開始角度（ラジアン）
 * @param endAngle 終了角度（ラジアン）
 * @returns SVGパス文字列
 */
export const generateArcPath = (
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    endAngle: number
): string => {
    const start = polarToCartesian(radius, startAngle);
    const end = polarToCartesian(radius, endAngle);

    const angleDiff = normalizeAngle(endAngle - startAngle);
    const largeArcFlag = angleDiff > Math.PI ? 1 : 0;

    return [
        `M ${centerX + start.x} ${centerY + start.y}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${centerX + end.x} ${centerY + end.y}`,
    ].join(' ');
};

/**
 * ピザ型ブロックのパスを生成
 * @param position 0-11の位置
 * @param innerRadius 内側の半径
 * @param outerRadius 外側の半径
 * @returns SVGパス文字列
 * @throws {CircleOfFifthsError} パラメータが無効な場合
 */
export const generatePizzaSlicePath = (
    position: number,
    innerRadius: number,
    outerRadius: number
): string => {
    if (!isValidPosition(position)) {
        throw new CircleOfFifthsError(`Invalid position: ${position}`, 'INVALID_POSITION');
    }

    if (innerRadius < 0 || outerRadius < 0 || innerRadius >= outerRadius) {
        throw new CircleOfFifthsError(
            `Invalid radii: inner=${innerRadius}, outer=${outerRadius}`,
            'INVALID_RADII'
        );
    }

    const startAngle = calculateAngle(position);
    const endAngle = calculateAngle((position + 1) % SEGMENT_COUNT);

    // 内側の円弧の開始点と終了点
    const innerStart = polarToCartesian(innerRadius, startAngle);
    const innerEnd = polarToCartesian(innerRadius, endAngle);

    // 外側の円弧の開始点と終了点
    const outerStart = polarToCartesian(outerRadius, startAngle);
    const outerEnd = polarToCartesian(outerRadius, endAngle);

    // 角度差を計算
    const angleDiff = normalizeAngle(endAngle - startAngle);
    const largeArcFlag = angleDiff > Math.PI ? 1 : 0;

    return [
        `M ${innerStart.x} ${innerStart.y}`,
        `L ${outerStart.x} ${outerStart.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerEnd.x} ${innerEnd.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
        'Z',
    ].join(' ');
};

/**
 * 3分割されたピザ型ブロックの各セグメントのパスを生成
 * @param position 0-11の位置
 * @param innerRadius 内側の半径（マイナーキーエリア）
 * @param middleRadius 中間の半径（メジャーキーエリア）
 * @param outerRadius 外側の半径（調号エリア）
 * @returns 各セグメントのパス文字列のオブジェクト
 * @throws {CircleOfFifthsError} パラメータが無効な場合
 */
export const generateThreeSegmentPaths = (
    position: number,
    innerRadius: number,
    middleRadius: number,
    outerRadius: number
): SegmentPaths => {
    if (!isValidPosition(position)) {
        throw new CircleOfFifthsError(`Invalid position: ${position}`, 'INVALID_POSITION');
    }

    if (innerRadius < 0 || middleRadius < 0 || outerRadius < 0) {
        throw new CircleOfFifthsError(
            `Invalid radii: inner=${innerRadius}, middle=${middleRadius}, outer=${outerRadius}`,
            'INVALID_RADII'
        );
    }

    if (innerRadius >= middleRadius || middleRadius >= outerRadius) {
        throw new CircleOfFifthsError(
            `Radii must be in ascending order: inner < middle < outer`,
            'INVALID_RADII_ORDER'
        );
    }

    const startAngle = calculateAngle(position);
    const endAngle = calculateAngle((position + 1) % SEGMENT_COUNT);
    const angleDiff = normalizeAngle(endAngle - startAngle);
    const largeArcFlag = angleDiff > Math.PI ? 1 : 0;

    // マイナーキーエリア（内側）- 中心点から始まる扇形
    const minorStart = polarToCartesian(innerRadius, startAngle);
    const minorEnd = polarToCartesian(innerRadius, endAngle);

    const minorPath = [
        'M 0 0', // 中心点から開始
        `L ${minorStart.x} ${minorStart.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${minorEnd.x} ${minorEnd.y}`,
        'Z',
    ].join(' ');

    // メジャーキーエリア（中間）
    const majorPath = generatePizzaSlicePath(position, innerRadius, middleRadius);

    // 調号エリア（外側）
    const signaturePath = generatePizzaSlicePath(position, middleRadius, outerRadius);

    return {
        minorPath,
        majorPath,
        signaturePath,
    };
};

// ============================================================================
// キー情報ユーティリティ
// ============================================================================

/**
 * キーの位置を計算（レガシー関数 - 後方互換性のため）
 * @param key キー情報
 * @returns キーの位置（x, y座標）
 * @throws {CircleOfFifthsError} キーが無効な場合
 * @deprecated 新しいコンポーネントでは使用しない
 */
export const calculateKeyPosition = (key: Key): Point => {
    if (!isValidKey(key)) {
        throw new CircleOfFifthsError(`Invalid key: ${JSON.stringify(key)}`, 'INVALID_KEY');
    }

    const radius = key.isMajor ? CIRCLE_LAYOUT.RADIUS : CIRCLE_LAYOUT.INNER_RADIUS;
    const angle = calculateAngle(key.position);

    return polarToCartesian(radius, angle);
};

/**
 * キーの詳細情報を取得
 * @param key キー情報
 * @returns キーの詳細情報
 * @throws {CircleOfFifthsError} キーが無効な場合
 */
export const getKeyInfo = (key: Key) => {
    if (!isValidKey(key)) {
        throw new CircleOfFifthsError(`Invalid key: ${JSON.stringify(key)}`, 'INVALID_KEY');
    }

    const relativeKey = KEYS.find(
        k => k.isMajor !== key.isMajor && k.position === key.position
    )?.name;

    return {
        name: key.name,
        type: key.isMajor ? 'メジャー' : 'マイナー',
        relativeKey,
        position: key.position + 1,
        scale: key.isMajor ? '長調' : '短調',
    };
};

// ============================================================================
// パフォーマンス最適化ユーティリティ
// ============================================================================

/**
 * 角度計算のキャッシュ（パフォーマンス向上のため）
 */
const angleCache = new Map<number, number>();

/**
 * キャッシュ付き角度計算
 * @param position 0-11の位置
 * @returns 角度（ラジアン）
 */
export const calculateAngleCached = (position: number): number => {
    if (angleCache.has(position)) {
        return angleCache.get(position)!;
    }

    const angle = calculateAngle(position);
    angleCache.set(position, angle);
    return angle;
};

/**
 * キャッシュをクリア
 */
export const clearAngleCache = (): void => {
    angleCache.clear();
}; 