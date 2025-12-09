import { getCircleOfFifthsData } from '../utils/circleOfFifthsData';
import { ClassNameProps } from '@/types';
import { CircleOfFifthsClient } from './CircleOfFifthsClient';
import { RotationControls } from './RotationControls';
import { twMerge } from 'tailwind-merge';

/**
 * 五度圏表示コンポーネント（Server Component）
 *
 * 五度圏を円形に表示し、各セグメントのホバー時に情報を表示します。
 * 円形を12分割し、各セグメントは3分割されて内側からマイナーキー、メジャーキー、調号を表示します。
 * メジャーキーとマイナーキーは個別にクリック可能です。
 *
 * Note: サーバーコンポーネントとして静的データを取得し、
 * クライアントコンポーネント（CircleOfFifthsClient）に委譲します。
 *
 * @param props - コンポーネントのプロパティ
 * @returns 五度圏のJSX要素
 */
export const CircleOfFifths: React.FC<ClassNameProps> = ({ className }) => {
  // サークルセグメント描画情報を取得（静的データ）
  const { viewBox, segments } = getCircleOfFifthsData();

  return (
    <div className={twMerge('relative', className)}>
      <RotationControls />
      <CircleOfFifthsClient viewBox={viewBox} segments={segments} />
    </div>
  );
};
