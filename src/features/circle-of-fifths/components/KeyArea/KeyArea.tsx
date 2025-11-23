'use client';

import { memo } from 'react';
import { motion } from 'motion/react';
import { ANIMATION } from '../../constants';

import { useKeyAreaBehavior } from '../../hooks/useKeyAreaBehavior';
import { useKeyAreaPresentation } from '../../hooks/useKeyAreaPresentation';
import { KeyAreaContent } from './KeyAreaContent';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';

import type { Point } from '@/shared/types/graphics';
import { CircleSegmentDTO } from '@/domain/services/CircleOfFifths';
import { KeyDTO } from '@/domain';

/**
 * 個別キーエリアコンポーネントのProps
 */
export interface KeyAreaProps {
  /** キー名 */
  keyDTO: KeyDTO;
  /** セグメントの情報 */
  segment: CircleSegmentDTO;
  /** SVGパス */
  path: string;
  /** テキスト位置 */
  textPosition: Point;
  /** テキスト回転角度 */
  textRotation: number;
}

/**
 * 個別のキーエリアコンポーネント
 *
 * メジャーキーまたはマイナーキーの個別エリアを表示し、
 * クリックとホバーイベントを処理します。
 * 軽量化されたorchestratorパターンで統合フックと統合コンポーネントを活用。
 *
 * @param props - コンポーネントのプロパティ
 * @returns キーエリアのJSX要素
 */
export const KeyArea = memo<KeyAreaProps>(
  ({ keyDTO: key, segment, path, textPosition, textRotation }) => {
    // 現在のキー状態を取得（責務分離による一元管理）
    const { currentKey } = useCurrentKeyStore();

    // 行動ロジック（状態管理・イベントハンドリング・リップルエフェクト）
    const { states, handlers, addRipple } = useKeyAreaBehavior({ keyDTO: key, segment });

    // プレゼンテーション情報（ハイライト・レイアウト・色計算）
    const presentation = useKeyAreaPresentation({
      keyDTO: key,
      textPosition,
      currentKey,
    });

    // リップルエフェクトのトリガー
    // Note: Framer Motion の onTap を使用してクリック座標を取得
    // これにより、正確なクリック位置からリップルを開始できる
    const handleTap = () => {
      addRipple(textPosition.x, textPosition.y, presentation.keyAreaColor);
    };

    return (
      <motion.g
        style={{
          cursor: 'pointer',
          userSelect: 'none',
        }}
        whileHover={{ scale: ANIMATION.HOVER_SCALE }}
        whileTap={{ scale: ANIMATION.TAP_SCALE }}
        transition={{ duration: ANIMATION.FADE_DURATION }}
        onTap={handleTap}
        {...handlers}
      >
        <KeyAreaContent
          keyName={key.shortName}
          path={path}
          textPosition={textPosition}
          textRotation={textRotation}
          states={states}
          presentation={presentation}
        />
      </motion.g>
    );
  }
);

// コンポーネントの表示名を設定（デバッグ用）
KeyArea.displayName = 'KeyArea';
