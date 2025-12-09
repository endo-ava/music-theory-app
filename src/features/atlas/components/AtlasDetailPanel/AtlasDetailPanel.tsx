import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ClassNameProps } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AtlasDataset } from '../../types';

interface AtlasDetailPanelProps extends ClassNameProps {
  isOpen?: boolean;
  onClose?: () => void;
  nodeId?: string | null;
  dataset?: AtlasDataset;
}

/**
 * Atlas Detail Panel
 *
 * 画面右側からスライドインする詳細情報パネル。
 * 選択されたノードの詳細情報、関連リンク、メディア等を表示します。
 * Framer Motionによるアニメーション効果を含みます。
 *
 * @param {AtlasDetailPanelProps} props
 * @param {boolean} [props.isOpen=false] - パネルの表示状態
 * @param {() => void} [props.onClose] - 閉じるボタンが押された時のコールバック
 * @param {string | null} [props.nodeId] - 選択されたノードのID
 * @param {AtlasDataset} [props.dataset] - ノード情報を取得するためのデータセット
 */
export const AtlasDetailPanel: React.FC<AtlasDetailPanelProps> = ({
  className,
  // isOpen, // removed unused destructuring
  onClose,
  nodeId,
  dataset,
}) => {
  // 選択されたノードの情報を取得
  const selectedNode = nodeId && dataset ? dataset.nodes.find(n => n.id === nodeId) : null;

  return (
    <motion.aside
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'border-border bg-panel/80 absolute top-4 right-4 bottom-4 z-20 w-80 overflow-y-auto rounded-lg border p-4 shadow-xl backdrop-blur-md sm:top-6 sm:right-6 sm:bottom-6 sm:w-96',
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{selectedNode?.label ?? 'Details'}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close detail panel"
          className="hover:bg-background/50 h-8 w-8 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-muted-foreground space-y-4 text-sm">
        <div className="bg-muted/30 flex aspect-video w-full items-center justify-center rounded-md">
          <span className="text-xs">Visual Preview</span>
        </div>
        <div>
          <h3 className="text-foreground mb-1 font-medium">Description</h3>
          {selectedNode ? (
            <div className="space-y-2">
              <p>
                <span className="text-muted-foreground/70">Type:</span> {selectedNode.type}
              </p>
              <p>
                <span className="text-muted-foreground/70">Data Type:</span> {selectedNode.dataType}
              </p>
              {selectedNode.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedNode.tags.map(tag => (
                    <span key={tag} className="bg-muted rounded px-2 py-0.5 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p>
              This is a placeholder for the detail content. When a node is selected in the Atlas
              Canvas, detailed information will appear here.
            </p>
          )}
        </div>
        <div>
          <h3 className="text-foreground mb-1 font-medium">Related Concepts</h3>
          <ul className="list-inside list-disc space-y-1">
            <li>Related Item 1</li>
            <li>Related Item 2</li>
          </ul>
        </div>
      </div>
    </motion.aside>
  );
};
