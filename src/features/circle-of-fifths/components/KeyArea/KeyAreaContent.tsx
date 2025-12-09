import { motion } from 'motion/react';
import type { Point } from '@/shared/types/graphics';
import type { KeyAreaStates } from '../../hooks/useKeyState';
import type { KeyAreaPresentationInfo } from '../../hooks/useKeyAreaPresentation';

/**
 * KeyAreaContentコンポーネントのProps
 */
interface KeyAreaContentProps {
  /** キー名（表示用） */
  keyName: string;
  /** SVGパス */
  path: string;
  /** テキスト位置 */
  textPosition: Point;
  /** テキスト回転角度 */
  textRotation: number;
  /** キーエリアの状態（選択・ホバー・クラス名） */
  states: KeyAreaStates;
  /** プレゼンテーション情報（ハイライト・色・レイアウト） */
  presentation: KeyAreaPresentationInfo;
}

/**
 * KeyArea統合描画コンポーネント
 *
 * SVGパス、テキスト、リップルエフェクトを一括描画する。
 *
 * 統合により以下を実現:
 * - Props数の大幅削減
 * - 関連する描画ロジックの一箇所集約
 * - コンポーネント階層の簡素化
 *
 * @param props - コンポーネントのプロパティ
 * @returns キーエリア内容のJSX要素
 */
export const KeyAreaContent: React.FC<KeyAreaContentProps> = ({
  keyName,
  path,
  textPosition,
  textRotation,
  states,
  presentation,
}) => {
  const { fillClassName, textClassName } = states;
  const { layout } = presentation;

  return (
    <>
      {/* SVGパス描画 */}
      <motion.path
        className={fillClassName}
        d={path}
        initial={{
          opacity: 1,
          stroke: 'var(--color-border)',
        }}
        animate={{
          opacity: 1,
          stroke: 'var(--color-border)',
          strokeWidth: '1px',
          strokeLinejoin: 'miter',
          strokeLinecap: 'square',
        }}
        style={{
          shapeRendering: 'geometricPrecision',
        }}
      />

      {/* プライマリテキスト（キー名）描画 */}
      <motion.text
        className={`fill-foreground ${textClassName}`}
        x={0}
        y={0}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`translate(${textPosition.x}, ${layout.primaryTextY}) rotate(${textRotation})`}
        initial={{ opacity: 1 }}
        style={{ userSelect: 'none' }}
      >
        {keyName}
      </motion.text>
    </>
  );
};
