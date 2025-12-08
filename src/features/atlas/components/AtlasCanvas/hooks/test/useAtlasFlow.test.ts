import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useAtlasFlow } from '../useAtlasFlow';
import { AtlasDataset } from '../../../../types';

// Mock Data
const mockDataset: AtlasDataset = {
  nodes: [
    {
      id: 'root-theory',
      type: 'foundation',
      dataType: 'pitch',
      label: 'Root',
      data: {},
      tags: [],
    },
    {
      id: 'node-child-1',
      parentId: 'root-theory',
      type: 'pattern',
      dataType: 'scale',
      label: 'Child 1',
      data: {},
      tags: [],
    },
    {
      id: 'node-child-2',
      parentId: 'root-theory',
      type: 'pattern',
      dataType: 'chord',
      label: 'Child 2',
      data: {},
      tags: [],
    },
    {
      id: 'node-grandchild-1',
      parentId: 'node-child-1',
      type: 'instance',
      dataType: 'scale',
      label: 'Grandchild 1',
      data: {},
      tags: [],
    },
  ],
  edges: [
    {
      id: 'edge-1',
      source: 'root-theory',
      target: 'node-child-1',
      type: 'structure',
    },
    {
      id: 'edge-2',
      source: 'node-child-1',
      target: 'node-grandchild-1',
      type: 'constituent',
    },
  ],
};

describe('useAtlasFlow Hook', () => {
  it('初期状態: rootのみ展開され、直下の子ノードが表示される', () => {
    const { result } = renderHook(() => useAtlasFlow({ dataset: mockDataset }));

    // Root is expanded by default.
    // Visible nodes should be: Root + Child 1 + Child 2 (Children of Root)
    // Grandchild 1 should NOT be visible because Child 1 is NOT expanded.

    const nodeIds = result.current.nodes.map(n => n.id);
    expect(nodeIds).toContain('root-theory');
    expect(nodeIds).toContain('node-child-1');
    expect(nodeIds).toContain('node-child-2');
    expect(nodeIds).not.toContain('node-grandchild-1');

    // Total 3 nodes
    expect(nodeIds.length).toBe(3);

    // Edges: Only edge-1 (root -> child-1) should be visible.
    // edge-2 (child-1 -> grandchild-1) should NOT be visible.
    // There is no edge to child-2 in mockDataset, so expected 1 edge.
    const edgeIds = result.current.edges.map(e => e.id);
    expect(edgeIds).toContain('edge-1');
    expect(edgeIds).not.toContain('edge-2');
    expect(edgeIds.length).toBe(1);
  });

  it('インタラクション: ノードクリックで展開/折りたたみが切り替わる', () => {
    const { result } = renderHook(() => useAtlasFlow({ dataset: mockDataset }));

    // Before click: Child 1 is closed. Grandchild 1 is hidden.
    expect(result.current.expandedNodeIds.has('node-child-1')).toBe(false);

    // Click Child 1 to expand
    act(() => {
      result.current.handleNodeClick('node-child-1');
    });

    // After click: Child 1 should be expanded.
    expect(result.current.expandedNodeIds.has('node-child-1')).toBe(true);
    expect(result.current.selectedNodeId).toBe('node-child-1');

    // Grandchild 1 should now be visible
    const nodeIds = result.current.nodes.map(n => n.id);
    expect(nodeIds).toContain('node-grandchild-1');
    const edgeIds = result.current.edges.map(e => e.id);
    expect(edgeIds).toContain('edge-2');

    // Click Child 1 again to collapse
    act(() => {
      result.current.handleNodeClick('node-child-1');
    });

    // After second click: Child 1 should be collapsed.
    expect(result.current.expandedNodeIds.has('node-child-1')).toBe(false);
    expect(result.current.nodes.map(n => n.id)).not.toContain('node-grandchild-1');
  });

  it('インタラクション: ノードクリックで選択状態が更新される', () => {
    const { result } = renderHook(() => useAtlasFlow({ dataset: mockDataset }));

    expect(result.current.selectedNodeId).toBeNull();

    act(() => {
      result.current.handleNodeClick('root-theory');
    });

    expect(result.current.selectedNodeId).toBe('root-theory');

    // Verify changes are reflected in React Flow nodes
    const rootNode = result.current.nodes.find(n => n.id === 'root-theory');
    expect(rootNode?.selected).toBe(true);
  });
});
