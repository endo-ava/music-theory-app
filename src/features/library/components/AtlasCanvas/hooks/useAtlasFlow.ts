import { useState, useEffect, useCallback } from 'react';
import {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { LibraryDataset, LibraryNode } from '../../../types';

interface UseAtlasFlowProps {
  dataset: LibraryDataset;
}

export const useAtlasFlow = ({ dataset }: UseAtlasFlowProps) => {
  // 展開されているノードのIDセット
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set(['root-theory']));

  // React Flow State
  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);

  // ノードの展開/折りたたみ切り替え
  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodeIds(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  // データセットと展開状態に基づいて、表示すべきノードとエッジを計算
  useEffect(() => {
    const visibleNodes: Node[] = [];
    const visibleEdges: Edge[] = [];
    const visibleNodeIds = new Set<string>();

    // 1. ノードのフィルタリング
    dataset.nodes.forEach(node => {
      // ルートノードは常に表示
      if (node.id === 'root-theory') {
        visibleNodeIds.add(node.id);
        visibleNodes.push(mapLibraryNodeToFlow(node, true)); // Root is always expanded effectively
        return;
      }

      // 親が展開されている場合のみ表示
      if (node.parentId && expandedNodeIds.has(node.parentId)) {
        visibleNodeIds.add(node.id);
        const isExpanded = expandedNodeIds.has(node.id);
        visibleNodes.push(mapLibraryNodeToFlow(node, isExpanded));
      }
    });

    // 2. エッジのフィルタリング
    dataset.edges.forEach(edge => {
      // 両端のノードが表示されている場合のみエッジを表示
      if (visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)) {
        visibleEdges.push({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: 'default', // Custom edge type can be used here
          animated: edge.type === 'structure', // Example: Structure edges are animated
          style: { stroke: '#ffffff50' },
        });
      }
    });

    setNodes(visibleNodes);
    setEdges(visibleEdges);
  }, [dataset, expandedNodeIds, setNodes, setEdges]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes(nds => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges(eds => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    toggleNode,
    expandedNodeIds,
  };
};

// Helper: LibraryNode -> React Flow Node conversion
const mapLibraryNodeToFlow = (node: LibraryNode, isExpanded: boolean): Node => {
  return {
    id: node.id,
    type: 'atlasNode', // Custom node type
    position: { x: node.x || 0, y: node.y || 0 },
    data: {
      label: node.label,
      type: node.type,
      dataType: node.dataType,
      isExpanded,
      originalData: node.data,
    },
  };
};
