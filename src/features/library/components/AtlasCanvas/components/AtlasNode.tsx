import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { LibraryNodeType, LibraryDataType } from '../../../types';

// Node Data Interface
interface AtlasNodeData extends Record<string, unknown> {
  label: string;
  type: LibraryNodeType;
  dataType: LibraryDataType;
  isExpanded: boolean;
}

// Custom Node Type
type AtlasNodeType = Node<AtlasNodeData, 'atlasNode'>;

const getNodeColor = (type: LibraryNodeType, dataType: LibraryDataType) => {
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

const getNodeSize = (type: LibraryNodeType, dataType: LibraryDataType) => {
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

export const AtlasNode = memo(({ data, selected }: NodeProps<AtlasNodeType>) => {
  const { label, type, dataType, isExpanded } = data;
  const colorClass = getNodeColor(type, dataType);
  const sizeClass = getNodeSize(type, dataType);

  return (
    <div className="relative flex items-center justify-center">
      {/* Handles for connections (Hidden but necessary for edges) */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />

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
          <span className="pointer-events-none px-1 text-center font-bold text-black select-none">
            {label}
          </span>
        )}
      </div>

      {/* Label for small nodes (Outside) */}
      {type === 'instance' && selected && (
        <div className="absolute top-full mt-1 rounded bg-black/80 px-2 py-1 text-xs whitespace-nowrap text-white">
          {label}
        </div>
      )}

      {/* Expand Indicator */}
      {/* If we knew it had children, we could show a plus. 
          For now, we assume Concept/Pattern nodes might have children. */}
      {(type === 'foundation' || type === 'pattern' || type === 'context') && !isExpanded && (
        <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black shadow-sm">
          +
        </div>
      )}
    </div>
  );
});

AtlasNode.displayName = 'AtlasNode';
