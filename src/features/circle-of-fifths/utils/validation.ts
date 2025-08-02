import { CircleOfFifthsService } from '@/domain/services/CircleOfFifths';

/**
 * 位置が有効かどうかをチェック
 * @param position チェックする位置
 * @returns 有効な位置かどうか
 */
export const isValidPosition = (position: number): boolean => {
  return (
    Number.isInteger(position) &&
    position >= 0 &&
    position < CircleOfFifthsService.getSegmentCount()
  );
};
