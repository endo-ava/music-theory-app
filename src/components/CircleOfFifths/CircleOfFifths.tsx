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

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
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

  // マウントされるまでは何も表示しない（ちらつき防止）
  if (!isMounted) {
    return null;
  }

  return (
    <motion.div
      // twMergeとclsxでクラス名を管理。propsで渡されたclassNameを安全にマージする
      className={twMerge(
        clsx(
          'circle-of-fifths',
          'relative flex items-center justify-center',
          'w-[80vw] h-[80vw] max-w-[800px] max-h-[800px]'
        ),
        className // 外部から渡されたクラスで上書き可能にする
      )}
      style={style} // 外部からのstyleも適用できるように残しておく
      variants={circleVariants}
      initial="hidden"
      animate="visible"
    >
      {/* SVG円形表示エリアを独立したコンポーネントとして呼び出す */}
      <div className="w-full h-full">
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