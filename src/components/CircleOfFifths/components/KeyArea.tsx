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
    isSelected,
    isHovered,
    onClick,
    onMouseEnter,
    onMouseLeave,
}) => {
    // 状態に応じてCSS変数の名前を返す関数
    const getAreaColorClassName = useCallback((): string => {
        if (isSelected) return 'fill-key-area-selected';
        if (isHovered) return 'fill-key-area-hover';
        return isMajor
          ? 'fill-key-area-major'
          : 'fill-key-area-minor';
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
                className={`stroke-border border ${getAreaColorClassName()}`}
                d={path}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: ANIMATION.FADE_DURATION, delay: animationDelay }}
            />

            {/* キーテキスト */}
            <motion.text
                className={`
                    fill-text-primary
                    ${isMajor
                      ? 'text-key-major font-key-major'
                      : 'text-key-minor font-key-minor'
                    }
                  `}
                x={textPosition.x}
                y={textPosition.y}
                textAnchor="middle"
                dominantBaseline="middle"
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