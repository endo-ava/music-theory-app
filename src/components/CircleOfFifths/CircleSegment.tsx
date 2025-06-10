'use client';

import { motion } from 'framer-motion';
import { CircleSegmentProps } from '@/types/circleOfFifths';
import { STYLES } from '@/types/circleOfFifths';
import { generateThreeSegmentPaths, calculateTextPosition, calculateTextRotation } from './utils';
import { KeyArea } from './KeyArea';

/**
 * 五度圏のピザ型セグメントコンポーネント
 * 
 * 各セグメントは3分割されており、内側から：
 * - マイナーキー（クリック可能）
 * - メジャーキー（クリック可能）
 * - 調号（表示のみ）
 * が表示されます。
 */
export const CircleSegment = ({
    segment,
    selectedKey,
    hoveredKey,
    onKeyClick,
    onKeyHover,
    onKeyLeave,
}: CircleSegmentProps) => {
    const { position, minorKey, majorKey, keySignature } = segment;

    // 各セグメントのパスを生成
    const paths = generateThreeSegmentPaths(
        position,
        STYLES.CIRCLE_SEGMENT.INNER_RADIUS,
        STYLES.CIRCLE_SEGMENT.MIDDLE_RADIUS,
        STYLES.CIRCLE_SEGMENT.RADIUS
    );

    // テキスト位置を計算
    const minorTextPos = calculateTextPosition(position, STYLES.CIRCLE_SEGMENT.INNER_RADIUS / 2);
    const majorTextPos = calculateTextPosition(position, (STYLES.CIRCLE_SEGMENT.INNER_RADIUS + STYLES.CIRCLE_SEGMENT.MIDDLE_RADIUS) / 2);
    const signatureTextPos = calculateTextPosition(position, (STYLES.CIRCLE_SEGMENT.MIDDLE_RADIUS + STYLES.CIRCLE_SEGMENT.RADIUS) / 2);

    // テキストの回転角度を計算
    const textRotation = calculateTextRotation(position);

    // 選択状態とホバー状態を判定
    const isMinorSelected = selectedKey?.name === minorKey;
    const isMajorSelected = selectedKey?.name === majorKey;
    const isMinorHovered = hoveredKey?.name === minorKey;
    const isMajorHovered = hoveredKey?.name === majorKey;

    return (
        <g>
            {/* マイナーキーエリア（クリック可能） */}
            <KeyArea
                keyName={minorKey}
                isMajor={false}
                position={position}
                path={paths.minorPath}
                textPosition={minorTextPos}
                textRotation={textRotation}
                fontSize={STYLES.CIRCLE_SEGMENT.FONT_SIZE.MINOR}
                isSelected={isMinorSelected}
                isHovered={isMinorHovered}
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
                textPosition={majorTextPos}
                textRotation={textRotation}
                fontSize={STYLES.CIRCLE_SEGMENT.FONT_SIZE.MAJOR}
                isSelected={isMajorSelected}
                isHovered={isMajorHovered}
                onClick={onKeyClick}
                onMouseEnter={onKeyHover}
                onMouseLeave={onKeyLeave}
            />

            {/* 調号エリア（表示のみ） */}
            <motion.path
                d={paths.signaturePath}
                fill={STYLES.CIRCLE_SEGMENT.COLORS.SIGNATURE}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: position * 0.05 + 0.2 }}
            />

            {/* 調号テキスト */}
            <motion.text
                x={signatureTextPos.x}
                y={signatureTextPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={STYLES.CIRCLE_SEGMENT.FONT_SIZE.SIGNATURE}
                fill="white"
                fontWeight="400"
                transform={`rotate(${textRotation} ${signatureTextPos.x} ${signatureTextPos.y})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: position * 0.05 + 0.5 }}
            >
                {keySignature}
            </motion.text>
        </g>
    );
}; 