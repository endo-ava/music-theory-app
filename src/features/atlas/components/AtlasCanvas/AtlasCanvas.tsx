import React from 'react';
import { ReactFlow, Background, Controls, MiniMap, NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ClassNameProps } from '@/types';
import { cn } from '@/lib/utils';
import { useAtlasFlow } from './hooks/useAtlasFlow';
import { AtlasNode } from './components/AtlasNode';
import { AtlasDataset } from '../../types';

// Custom Node Types Registration
const nodeTypes: NodeTypes = {
  atlasNode: AtlasNode,
};

interface AtlasCanvasProps extends ClassNameProps {
  onClick?: () => void;
  onBackgroundClick?: () => void;
  dataset: AtlasDataset;
}

/**
 * Atlas Canvas (Presentation Component)
 *
 * React Flowを使用してAtlasのネットワーク図を描画するコンポーネントです。
 * Server Componentから受け取ったデータセットを描画し、
 * ノードクリックや背景クリックのイベントを親コンポーネントに通知します。
 *
 * @param {AtlasCanvasProps} props
 * @param {AtlasDataset} props.dataset - 表示するノードとエッジのデータセット
 * @param {() => void} [props.onClick] - ノードがクリックされた時のコールバック
 * @param {() => void} [props.onBackgroundClick] - キャンバス背景がクリックされた時のコールバック
 */
export const AtlasCanvas: React.FC<AtlasCanvasProps> = ({
  className,
  onClick,
  onBackgroundClick,
  dataset,
}) => {
  // Use Custom Hook for Logic

  // Use Custom Hook for Logic
  const { nodes, edges, onNodesChange, onEdgesChange, handleNodeClick } = useAtlasFlow({ dataset });

  return (
    <div className={cn('bg-background relative h-full w-full', className)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => {
          handleNodeClick(node.id);
          onClick?.();
        }}
        onPaneClick={onBackgroundClick}
        fitView
        minZoom={0.1}
        maxZoom={4}
        defaultEdgeOptions={{
          type: 'default',
          animated: true,
          style: { stroke: '#ffffff50', strokeWidth: 1 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#333" gap={50} size={1} />
        <Controls className="bg-background border-border fill-foreground" />
        <MiniMap
          nodeStrokeColor="#ffffff"
          nodeColor="#555"
          maskColor="rgba(0, 0, 0, 0.7)"
          className="bg-background border-border border"
        />
      </ReactFlow>
    </div>
  );
};
