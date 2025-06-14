/**
 * 個別キーエリアコンポーネント
 * 
 * メジャーキーまたはマイナーキーの個別エリアを表示し、
 * クリックとホバーイベントを処理します。
 * 
 * @fileoverview 五度圏の各キーエリアを表現するコンポーネント
 */

'use client';

import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { KeyAreaProps } from '../types';
import { ANIMATION } from '../constants/index';

/**
 * 個別のキーエリアコンポーネント
 * 
 * メジャーキーまたはマイナーキーの個別エリアを表示し、
 * クリックとホバーイベントを処理します。
 * 
 * @param props - コンポーネントのプロパティ
 * @returns キーエリアのJSX要素
 */
export const KeyArea = memo<KeyAreaProps>(({
    keyName,
    isMajor,
    position,
    path,
    textPosition,
    textRotation,
    fontSize,
    fontWeight,
    isSelected,
    isHovered,
    onClick,
    onMouseEnter,
    onMouseLeave,
}) => {
    // エリアの色を決定する関数
    const getAreaColor = useCallback((): string => {
        if (isSelected) return 'rgba(255, 255, 255, 0.3)';
        if (isHovered) return 'rgba(255, 255, 255, 0.25)';
        return isMajor ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)';
    }, [isSelected, isHovered, isMajor]);

    // イベントハンドラー
    const handleClick = useCallback(() => {
        onClick(keyName, isMajor, position);
    }, [onClick, keyName, isMajor, position]);

    const handleMouseEnter = useCallback(() => {
        onMouseEnter(keyName, isMajor, position);
    }, [onMouseEnter, keyName, isMajor, position]);

    const handleMouseLeave = useCallback(() => {
        onMouseLeave();
    }, [onMouseLeave]);

    // アニメーション設定
    const animationDelay = position * ANIMATION.BASE_DELAY + (isMajor ? 0.1 : 0);
    const textAnimationDelay = animationDelay + 0.3;

    return (
        <motion.g
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
            whileHover={{ scale: ANIMATION.HOVER_SCALE }}
            whileTap={{ scale: ANIMATION.TAP_SCALE }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: ANIMATION.FADE_DURATION, delay: animationDelay }}
        >
            {/* キーエリアのパス */}
            <motion.path
                d={path}
                fill={getAreaColor()}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: ANIMATION.FADE_DURATION, delay: animationDelay }}
            />

            {/* キーテキスト */}
            <motion.text
                x={textPosition.x}
                y={textPosition.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={fontSize === 'text-key-minor' ? '0.8rem' : '1rem'}
                fill="white"
                fontWeight={fontWeight === 'font-key-minor' ? '50' : '80'}
                transform={`rotate(${textRotation} ${textPosition.x} ${textPosition.y})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: ANIMATION.FADE_DURATION, delay: textAnimationDelay }}
                style={{ pointerEvents: 'none' }} // テキストのクリックイベントを無効化
            >
                {keyName}
            </motion.text>
        </motion.g>
    );
});

// コンポーネントの表示名を設定（デバッグ用）
KeyArea.displayName = 'KeyArea'; 