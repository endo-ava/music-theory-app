'use client';

import { motion } from 'framer-motion';
import { CircleSegmentProps } from '@/types/circleOfFifths';
import { STYLES } from '@/types/circleOfFifths';
import { generateThreeSegmentPaths, calculateTextPosition, calculateTextRotation } from './utils';

/**
 * 五度圏のピザ型セグメントコンポーネント
 * 
 * 各セグメントは3分割されており、内側から：
 * - マイナーキー
 * - メジャーキー  
 * - 調号
 * が表示されます。
 */
export const CircleSegment = ({
    segment,
    isSelected,
    onClick,
    onMouseEnter,
    onMouseLeave,
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

    return (
        <motion.g
            onMouseEnter={() => onMouseEnter(segment)}
            onMouseLeave={onMouseLeave}
            onClick={() => onClick(segment)}
            style={{ cursor: 'pointer' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* マイナーキーエリア（内側） */}
            <motion.path
                d={paths.minorPath}
                fill={isSelected ? STYLES.CIRCLE_SEGMENT.COLORS.SELECTED : STYLES.CIRCLE_SEGMENT.COLORS.MINOR}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: position * 0.05 }}
            />

            {/* メジャーキーエリア（中間） */}
            <motion.path
                d={paths.majorPath}
                fill={isSelected ? STYLES.CIRCLE_SEGMENT.COLORS.SELECTED : STYLES.CIRCLE_SEGMENT.COLORS.MAJOR}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: position * 0.05 + 0.1 }}
            />

            {/* 調号エリア（外側） */}
            <motion.path
                d={paths.signaturePath}
                fill={isSelected ? STYLES.CIRCLE_SEGMENT.COLORS.SELECTED : STYLES.CIRCLE_SEGMENT.COLORS.SIGNATURE}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: position * 0.05 + 0.2 }}
            />

            {/* マイナーキーテキスト */}
            <motion.text
                x={minorTextPos.x}
                y={minorTextPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={STYLES.CIRCLE_SEGMENT.FONT_SIZE.MINOR}
                fill="white"
                fontWeight="500"
                transform={`rotate(${textRotation} ${minorTextPos.x} ${minorTextPos.y})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: position * 0.05 + 0.3 }}
            >
                {minorKey}
            </motion.text>

            {/* メジャーキーテキスト */}
            <motion.text
                x={majorTextPos.x}
                y={majorTextPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={STYLES.CIRCLE_SEGMENT.FONT_SIZE.MAJOR}
                fill="white"
                fontWeight="600"
                transform={`rotate(${textRotation} ${majorTextPos.x} ${majorTextPos.y})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: position * 0.05 + 0.4 }}
            >
                {majorKey}
            </motion.text>

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
        </motion.g>
    );
}; 