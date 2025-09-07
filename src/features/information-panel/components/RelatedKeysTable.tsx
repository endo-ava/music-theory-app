import React from 'react';
import { twMerge } from 'tailwind-merge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlayButton } from './shared/PlayButton';
import type { RelatedKeysTableProps } from '../types';

/**
 * 関連調表示テーブルコンポーネント
 *
 * 現在のキーに音楽理論上関連する4つの調（平行調、同主調、属調、下属調）を4列のテーブル形式で表示する。
 * 各調は再生可能なPlayButtonとして実装されており、クリックによりその調のスケールを音声で確認できる。
 *
 * 関連調の種類：
 * - 平行調 (Relative): 同じ調号を持つ対の調（例：CメジャーとAマイナー）
 * - 同主調 (Parallel): 同じ主音を持つ対の調（例：CメジャーとCマイナー）
 * - 属調 (Dominant): 完全5度上の調（例：CメジャーならGメジャー）
 * - 下属調 (Subdominant): 完全5度下の調（例：CメジャーならFメジャー）
 *
 * @component
 * @param props - RelatedKeysTableコンポーネントのプロパティ
 * @param props.relatedKeys - 関連調情報オブジェクト（4つの調を含む）
 * @param props.onPlayScale - スケール再生時のハンドラー関数
 * @param props.className - 追加のCSSクラス名（オプション）
 *
 * @returns 関連調情報を表示するテーブルコンポーネント
 *
 */
export const RelatedKeysTable: React.FC<RelatedKeysTableProps> = React.memo(
  ({ relatedKeys, onPlayScale, className }) => {
    return (
      <Table
        className={twMerge(
          'text-foreground text-center text-xs [&_tr]:grid [&_tr]:grid-cols-4',
          className
        )}
      >
        <TableHeader>
          <TableRow>
            <TableHead className="flex items-center justify-center">
              <div>
                <div>平行調</div>
                <div>(Relative)</div>
              </div>
            </TableHead>
            <TableHead className="flex items-center justify-center">
              <div>
                <div>同主調</div>
                <div>(Parallel)</div>
              </div>
            </TableHead>
            <TableHead className="flex items-center justify-center">
              <div>
                <div>属調</div>
                <div>(Dominant)</div>
              </div>
            </TableHead>
            <TableHead className="flex items-center justify-center">
              <div>
                <div>下属調</div>
                <div>(Subdominant)</div>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* 関連調名行 */}
          <TableRow>
            <TableCell>
              <PlayButton
                onClick={() => onPlayScale(relatedKeys.relative)}
                ariaLabel={`Play ${relatedKeys.relative.shortName} key`}
                className="w-full"
              >
                {relatedKeys.relative.shortName}
              </PlayButton>
            </TableCell>
            <TableCell>
              <PlayButton
                onClick={() => onPlayScale(relatedKeys.parallel)}
                ariaLabel={`Play ${relatedKeys.parallel.shortName} key`}
                className="w-full"
              >
                {relatedKeys.parallel.shortName}
              </PlayButton>
            </TableCell>
            <TableCell>
              <PlayButton
                onClick={() => onPlayScale(relatedKeys.dominant)}
                ariaLabel={`Play ${relatedKeys.dominant.shortName} key`}
                className="w-full"
              >
                {relatedKeys.dominant.shortName}
              </PlayButton>
            </TableCell>
            <TableCell>
              <PlayButton
                onClick={() => onPlayScale(relatedKeys.subdominant)}
                ariaLabel={`Play ${relatedKeys.subdominant.shortName} key`}
                className="w-full"
              >
                {relatedKeys.subdominant.shortName}
              </PlayButton>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
);
