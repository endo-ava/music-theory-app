'use client';

import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ClassNameProps } from '@/shared/types';
import { cn } from '@/lib/utils';
import { generateLibraryDataset } from '../../data/mockData';
import { useAtlasFlow } from './hooks/useAtlasFlow';
import { AtlasNode } from './components/AtlasNode';

// Custom Node Types Registration
const nodeTypes: NodeTypes = {
  atlasNode: AtlasNode,
};

export const AtlasCanvas: React.FC<ClassNameProps> = ({ className }) => {
  // Generate Data (Memoized)
  const dataset = useMemo(() => generateLibraryDataset(), []);

  // Use Custom Hook for Logic
  const { nodes, edges, onNodesChange, onEdgesChange, toggleNode } = useAtlasFlow({ dataset });

  return (
    <div className={cn('bg-background relative h-full w-full', className)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => toggleNode(node.id)}
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
