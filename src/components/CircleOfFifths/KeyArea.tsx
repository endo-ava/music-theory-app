'use client';

import { motion } from 'framer-motion';
import { KeyAreaProps } from '@/types/circleOfFifths';
import { STYLES } from '@/types/circleOfFifths';

/**
 * 個別のキーエリアコンポーネント
 * 
 * メジャーキーまたはマイナーキーの個別エリアを表示し、
 * クリックとホバーイベントを処理します。
 */
export const KeyArea = ({
    keyName,
    isMajor,
    position,
    path,
    textPosition,
    textRotation,
    fontSize,
    isSelected,
    isHovered,
    onClick,
    onMouseEnter,
    onMouseLeave,
}: KeyAreaProps) => {
    // エリアの色を決定
    const getAreaColor = () => {
        if (isSelected) return STYLES.CIRCLE_SEGMENT.COLORS.SELECTED;
        if (isHovered) return STYLES.CIRCLE_SEGMENT.COLORS.HOVER;
        return isMajor ? STYLES.CIRCLE_SEGMENT.COLORS.MAJOR : STYLES.CIRCLE_SEGMENT.COLORS.MINOR;
    };

    return (
        <motion.g
            onMouseEnter={() => onMouseEnter(keyName, isMajor, position)}
            onMouseLeave={onMouseLeave}
            onClick={() => onClick(keyName, isMajor, position)}
            style={{ cursor: 'pointer' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* キーエリアのパス */}
            <motion.path
                d={path}
                fill={getAreaColor()}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: position * 0.05 + (isMajor ? 0.1 : 0) }}
            />

            {/* キーテキスト */}
            <motion.text
                x={textPosition.x}
                y={textPosition.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={fontSize}
                fill="white"
                fontWeight={isMajor ? "600" : "500"}
                transform={`rotate(${textRotation} ${textPosition.x} ${textPosition.y})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: position * 0.05 + (isMajor ? 0.4 : 0.3) }}
            >
                {keyName}
            </motion.text>
        </motion.g>
    );
}; 