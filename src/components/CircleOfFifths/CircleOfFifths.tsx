/**
 * 五度圏メインコンポーネント
 * 
 * 五度圏を円形に表示し、各セグメントのホバー時に情報を表示します。
 * 円形を12分割し、各セグメントは3分割されて内側からマイナーキー、メジャーキー、調号を表示します。
 * メジャーキーとマイナーキーは個別にクリック可能です。
 * 
 * @fileoverview 五度圏のメインコンポーネント
 */

'use client';

import { useCallback, useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCircleOfFifthsStore } from '@/store/circleOfFifthsStore';
import KeyInfoDisplay from './components/KeyInfoDisplay';
import { CIRCLE_SEGMENTS, CIRCLE_LAYOUT } from './constants/index';
import { circleVariants } from './animations';
import { CircleOfFifthsProps } from './types';
import { Key } from '@/types/circleOfFifths';
import { CircleSvgCanvas } from './components/CircleSvgCanvas';

/**
 * 五度圏表示コンポーネント
 *
 * 五度圏を円形に表示し、各セグメントのホバー時に情報を表示します。
 * 円形を12分割し、各セグメントは3分割されて内側からマイナーキー、メジャーキー、調号を表示します。
 * メジャーキーとマイナーキーは個別にクリック可能です。
 * 
 * @param props - コンポーネントのプロパティ
 * @returns 五度圏のJSX要素
 */
export const CircleOfFifths: React.FC<CircleOfFifthsProps> = ({
  className,
  style,
}) => {
  const { selectedKey, hoveredKey, setSelectedKey, setHoveredKey } = useCircleOfFifthsStore();
  const [isMounted, setIsMounted] = useState(false);

  // クライアントでの初回レンダリング後にisMountedをtrueにする
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // キークリック時のハンドラー（メモ化）
  const handleKeyClick = useCallback(
    (keyName: string, isMajor: boolean, position: number) => {
      const keyData: Key = {
        name: keyName,
        isMajor,
        position,
      };
      setSelectedKey(keyData);
    },
    [setSelectedKey]
  );

  // キーホバー時のハンドラー（メモ化）
  const handleKeyHover = useCallback(
    (keyName: string, isMajor: boolean, position: number) => {
      const keyData: Key = {
        name: keyName,
        isMajor,
        position,
      };
      setHoveredKey(keyData);
    },
    [setHoveredKey]
  );

  // キーからマウスが離れた時のハンドラー（メモ化）
  const handleKeyLeave = useCallback(() => {
    setHoveredKey(null);
  }, [setHoveredKey]);


  // コンテナスタイルの計算（メモ化）
  const containerStyle = useMemo(() => {
    return {
      position: 'relative' as const,
      width: '80vw',
      height: '80vw',
      maxWidth: '800px',
      maxHeight: '800px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...style,
    };
  }, [style]);

  // マウントされるまでは何も表示しない（またはローディング表示など）
  if (!isMounted) {
    return null;
  }

  return (
    <motion.div
      className={`circle-of-fifths ${className || ''}`.trim()}
      style={containerStyle}
      variants={circleVariants}
      initial="hidden"
      animate="visible"
    >
      {/* SVG円形表示エリアを独立したコンポーネントとして呼び出す */}
      <div className="circle-svg-container" style={{ width: '100%', height: '100%' }}>
        <CircleSvgCanvas
          radius={CIRCLE_LAYOUT.RADIUS}
          innerRadius={CIRCLE_LAYOUT.INNER_RADIUS}
          middleRadius={CIRCLE_LAYOUT.MIDDLE_RADIUS}
          segments={CIRCLE_SEGMENTS}
          selectedKey={selectedKey}
          hoveredKey={hoveredKey}
          onKeyClick={handleKeyClick}
          onKeyHover={handleKeyHover}
          onKeyLeave={handleKeyLeave}
        />
      </div>

      {/* キー情報表示エリア */}
      <KeyInfoDisplay hoveredKey={hoveredKey} />
    </motion.div>
  );
};
