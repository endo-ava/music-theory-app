'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CircleSegmentProps } from '../types';
import { CIRCLE_LAYOUT, ANIMATION } from '../constants/index';
import { generateThreeSegmentPaths, calculateTextPosition, calculateTextRotation } from '../utils';
import { KeyArea } from './KeyArea';

/**
 * 五度圏のセグメントコンポーネント
 * 
 * 各セグメントは3分割されており、内側から：
 * - マイナーキー（クリック可能）
 * - メジャーキー（クリック可能）
 * - 調号（表示のみ）
 * が表示されます。
 * 
 * @param props - コンポーネントのプロパティ
 * @returns セグメントのJSX要素
 */
export const CircleSegment = memo<CircleSegmentProps>(({
    segment,
    selectedKey,
    hoveredKey,
    onKeyClick,
    onKeyHover,
    onKeyLeave,
}) => {
    const { position, minorKey, majorKey, keySignature } = segment;

    // 各セグメントのパスを生成（メモ化）
    const paths = useMemo(() => {
        return generateThreeSegmentPaths(
            position,
            CIRCLE_LAYOUT.INNER_RADIUS,
            CIRCLE_LAYOUT.MIDDLE_RADIUS,
            CIRCLE_LAYOUT.RADIUS
        );
    }, [position]);

    // テキスト位置を計算（メモ化）
    const textPositions = useMemo(() => {
        const minorTextPos = calculateTextPosition(position, CIRCLE_LAYOUT.INNER_RADIUS / 1.2);
        const majorTextPos = calculateTextPosition(
            position,
            (CIRCLE_LAYOUT.INNER_RADIUS + CIRCLE_LAYOUT.MIDDLE_RADIUS) / 2
        );
        const signatureTextPos = calculateTextPosition(
            position,
            (CIRCLE_LAYOUT.MIDDLE_RADIUS + CIRCLE_LAYOUT.RADIUS) / 2
        );

        return { minorTextPos, majorTextPos, signatureTextPos };
    }, [position]);

    // テキストの回転角度を計算（メモ化）
    const textRotation = useMemo(() => {
        return calculateTextRotation();
    }, []);

    // 選択状態とホバー状態を判定（メモ化）
    const keyStates = useMemo(() => {
        const isMinorSelected = selectedKey?.name === minorKey;
        const isMajorSelected = selectedKey?.name === majorKey;
        const isMinorHovered = hoveredKey?.name === minorKey;
        const isMajorHovered = hoveredKey?.name === majorKey;

        return {
            isMinorSelected,
            isMajorSelected,
            isMinorHovered,
            isMajorHovered,
        };
    }, [selectedKey, hoveredKey, minorKey, majorKey]);

    // アニメーション遅延を計算
    const baseDelay = position * ANIMATION.BASE_DELAY;

    return (
        <g>
            {/* マイナーキーエリア（クリック可能） */}
            <KeyArea
                keyName={minorKey}
                isMajor={false}
                position={position}
                path={paths.minorPath}
                textPosition={textPositions.minorTextPos}
                textRotation={textRotation}
                isSelected={keyStates.isMinorSelected}
                isHovered={keyStates.isMinorHovered}
                onClick={onKeyClick}
                onMouseEnter={onKeyHover}
                onMouseLeave={onKeyLeave}
            />

            {/* メジャーキーエリア（クリック可能） */}
            <KeyArea
                keyName={majorKey}
                isMajor={true}
                position={position}
                path={paths.majorPath}
                textPosition={textPositions.majorTextPos}
                textRotation={textRotation}
                isSelected={keyStates.isMajorSelected}
                isHovered={keyStates.isMajorHovered}
                onClick={onKeyClick}
                onMouseEnter={onKeyHover}
                onMouseLeave={onKeyLeave}
            />

            {/* 調号エリア（表示のみ） */}
            <motion.path
                d={paths.signaturePath}
                className={"fill-key-area-signature stroke-border border"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: ANIMATION.FADE_DURATION, delay: baseDelay + 0.2 }}
            />

            {/* 調号テキスト */}
            <motion.text
                className={" fill-text-primary text-key-signature font-key-signature stroke-border border"}
                x={textPositions.signatureTextPos.x}
                y={textPositions.signatureTextPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${textRotation} ${textPositions.signatureTextPos.x} ${textPositions.signatureTextPos.y})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: ANIMATION.FADE_DURATION, delay: baseDelay + 0.5 }}
                style={{ pointerEvents: 'none' }} // テキストのクリックイベントを無効化
            >
                {/* keySignatureの文字列を'\n'で分割して、各行を<tspan>で描画する */}
                {keySignature.split('\n').map((line, index) => (
                    <tspan
                        key={index}
                        x={textPositions.signatureTextPos.x} // 各行のx座標をリセット
                        dy={index === 0 ? 0 : '1.2em'}     // 2行目以降はdyで下にずらす
                    >
                        {line}
                    </tspan>
                ))}
            </motion.text>
        </g>
    );
});

// コンポーネントの表示名を設定（デバッグ用）
CircleSegment.displayName = 'CircleSegment'; 