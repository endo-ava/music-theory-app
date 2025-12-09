import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { AtlasDataset, AtlasNodeData } from '../../../types';

interface UseAtlasFlowProps {
  dataset: AtlasDataset;
}

const ROOT_NODE_ID = 'root-theory';

/**
 * useAtlasFlow Hook
 *
 * Atlas Canvasの表示ロジックを管理するカスタムフック。
 * 階層構造（ノードの展開・折りたたみ）に基づいて、
 * 表示すべきノードとエッジをフィルタリングしてReact Flowの状態に反映します。
 *
 * @param {UseAtlasFlowProps} props
 * @param {AtlasDataset} props.dataset - 全データのセット
 */
export const useAtlasFlow = ({ dataset }: UseAtlasFlowProps) => {
  // 展開されているノードのIDセット
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set([ROOT_NODE_ID]));
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // React Flow State
  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);

  // ノードクリック時のハンドラ（選択 ＋ 展開トグル）
  const handleNodeClick = useCallback((nodeId: string) => {
    // 選択状態の更新
    setSelectedNodeId(nodeId);

    // 展開状態のトグル
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

  // 表示すべき要素の計算（純粋関数的なロジック）
  const { visibleNodes, visibleEdges } = useMemo(() => {
    return computeVisibleElements(dataset, expandedNodeIds, selectedNodeId);
  }, [dataset, expandedNodeIds, selectedNodeId]);

  // データセットと展開状態に基づいて、React Flowの状態を更新
  // Note: ユーザーによるドラッグ等の変更がある場合でも、このEffectにより
  // フィルタリング状態が変わると再計算された位置/状態にリセットされます。
  // 必要に応じて依存関係や更新ロジックを調整してください。
  useEffect(() => {
    setNodes(visibleNodes);
    setEdges(visibleEdges);
  }, [visibleNodes, visibleEdges, setNodes, setEdges]);

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
    handleNodeClick,
    expandedNodeIds,
    selectedNodeId,
  };
};

/**
 * 現在の状態に基づいて表示すべきノードとエッジを計算するヘルパー関数
 *
 * @param dataset 全データセット
 * @param expandedNodeIds 展開済みノードIDのセット
 * @param selectedNodeId 現在選択中のノードID
 * @returns 表示すべきノードとエッジの配列
 */
const computeVisibleElements = (
  dataset: AtlasDataset,
  expandedNodeIds: Set<string>,
  selectedNodeId: string | null
) => {
  const visibleNodes: Node[] = [];
  const visibleEdges: Edge[] = [];
  const visibleNodeIds = new Set<string>();

  // 子ノードを持つノードIDのセットを事前計算
  const nodesWithChildren = new Set<string>();
  dataset.nodes.forEach(node => {
    if (node.parentId) {
      nodesWithChildren.add(node.parentId);
    }
  });

  // 1. ノードのフィルタリング
  dataset.nodes.forEach(node => {
    const hasChildren = nodesWithChildren.has(node.id);

    // ルートノードは常に表示
    if (node.id === ROOT_NODE_ID) {
      visibleNodeIds.add(node.id);
      const isSelected = node.id === selectedNodeId;
      visibleNodes.push(mapAtlasNodeToFlow(node, true, isSelected, hasChildren));
      return;
    }

    // 親が展開されている場合のみ表示
    if (node.parentId && expandedNodeIds.has(node.parentId)) {
      visibleNodeIds.add(node.id);
      const isExpanded = expandedNodeIds.has(node.id);
      const isSelected = node.id === selectedNodeId;
      visibleNodes.push(mapAtlasNodeToFlow(node, isExpanded, isSelected, hasChildren));
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

  return { visibleNodes, visibleEdges };
};

/**
 * AtlasNodeDataをReact FlowのNodeオブジェクトに変換するヘルパー関数
 * @param node Atlasのノードデータ
 * @param isExpanded 展開されているかどうか
 * @param isSelected 選択されているかどうか
 * @param hasChildren 子ノードを持つかどうか
 */
const mapAtlasNodeToFlow = (
  node: AtlasNodeData,
  isExpanded: boolean,
  isSelected: boolean,
  hasChildren: boolean
): Node => {
  return {
    id: node.id,
    type: 'atlasNode',
    position: { x: node.x || 0, y: node.y || 0 },
    selected: isSelected,
    data: {
      label: node.label,
      type: node.type,
      dataType: node.dataType,
      isExpanded,
      hasChildren,
      originalData: node.data,
    },
  };
};
