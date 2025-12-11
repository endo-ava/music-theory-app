import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { AtlasNodeType, AtlasDataType } from '../../../types';

// Node Data Interface
interface AtlasNodeReactFlowData extends Record<string, unknown> {
  label: string;
  type: AtlasNodeType;
  dataType: AtlasDataType;
  isExpanded: boolean;
  hasChildren: boolean;
}

// Custom Node Type
type AtlasNodeComponentType = Node<AtlasNodeReactFlowData, 'atlasNode'>;

/**
 * ノードの種類とデータタイプに基づいて色クラスを取得する
 * @param type ノードの種類（foundation, pattern, instance, context）
 * @param dataType データの種類（scale, chord, function, etc）
 * @returns Tailwind CSSのクラス名文字列
 */
const getNodeColor = (type: AtlasNodeType, dataType: AtlasDataType) => {
  switch (type) {
    case 'foundation':
      if (dataType === 'function')
        return 'bg-white border-white shadow-[0_0_15px_rgba(255,255,255,0.6)]'; // Concept/Root
      return 'bg-blue-500 border-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]';
    case 'pattern':
      return dataType === 'scale'
        ? 'bg-green-500 border-green-300 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
        : 'bg-orange-500 border-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.5)]';
    case 'instance':
      return 'bg-red-500 border-red-300';
    case 'context':
      return 'bg-purple-500 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]';
    default:
      return 'bg-gray-500 border-gray-300';
  }
};

/**
 * ノードの種類とデータタイプに基づいてサイズクラスを取得する
 * @param type ノードの種類
 * @param dataType データの種類
 * @returns Tailwind CSSのクラス名文字列
 */
const getNodeSize = (type: AtlasNodeType, dataType: AtlasDataType) => {
  if (dataType === 'function') return 'w-16 h-16 text-sm'; // Concept/Root
  switch (type) {
    case 'foundation':
      return 'w-8 h-8 text-xs';
    case 'context':
      return 'w-12 h-12 text-xs';
    case 'pattern':
      return 'w-10 h-10 text-xs';
    case 'instance':
      return 'w-4 h-4 text-[8px]'; // Tiny
    default:
      return 'w-6 h-6';
  }
};

/**
 * Atlas Node Component
 *
 * Atlas Canvas上で描画されるカスタムノードコンポーネント。
 * React Flowのカスタムノードとして登録され、データの種類に応じた視覚表現（色、サイズ）を提供します。
 *
 * @param {NodeProps<AtlasNodeComponentType>} props React Flowから渡されるProps
 */
export const AtlasNode = memo(({ data, selected }: NodeProps<AtlasNodeComponentType>) => {
  const { label, type, dataType, isExpanded, hasChildren } = data;
  const colorClass = getNodeColor(type, dataType);
  const sizeClass = getNodeSize(type, dataType);

  // 展開可能なノードかどうか
  const isExpandable = hasChildren;
  // ツールチップのIDを生成（instance型のノードのみ）
  const tooltipId = type === 'instance' ? `tooltip-${label}` : undefined;

  /**
   * キーボード操作のハンドラー
   * EnterキーまたはSpaceキーが押された時にノードクリックをシミュレート
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      // ノードクリックイベントを親に伝播させるため、クリックイベントを発火
      event.currentTarget.click();
    }
  };

  return (
    <div
      data-testid={`atlas-node-${label}`}
      className="relative flex items-center justify-center"
      role="button"
      aria-label={`${type} node: ${label}`}
      aria-expanded={isExpandable ? isExpanded : undefined}
      aria-selected={selected}
      aria-describedby={selected && tooltipId ? tooltipId : undefined}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Handles for connections (Hidden but necessary for edges) */}
      <Handle type="target" position={Position.Top} className="opacity-0" aria-hidden="true" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" aria-hidden="true" />

      {/* Node Visual */}
      <div
        className={cn(
          'flex items-center justify-center rounded-full border-2 transition-all duration-300',
          colorClass,
          sizeClass,
          selected && 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-black',
          isExpanded && 'ring-1 ring-white/50'
        )}
      >
        {/* Label (Center for large nodes, hidden/tooltip for small) */}
        {type !== 'instance' && (
          <span className="px-1 text-center font-bold text-black select-none">{label}</span>
        )}
      </div>

      {/* Label for small nodes (Outside) */}
      {type === 'instance' && selected && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute top-full mt-1 rounded bg-black/80 px-2 py-1 text-xs whitespace-nowrap text-white"
        >
          {label}
        </div>
      )}

      {/* Expand Indicator - Only show if node has children and is not expanded */}
      {hasChildren && !isExpanded && (
        <div
          className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black shadow-sm"
          aria-hidden="true"
        >
          +
        </div>
      )}
    </div>
  );
});

AtlasNode.displayName = 'AtlasNode';
