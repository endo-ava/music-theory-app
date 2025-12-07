/**
 * AtlasDataGenerator 単体テスト
 *
 * データセット生成ロジックの完全性と整合性を検証する。
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { AtlasDataGenerator } from '../AtlasDataGenerator';
import { AtlasDataset } from '../../types';

describe('Atlasデータ生成ユーティリティ', () => {
  let generator: AtlasDataGenerator;
  let dataset: AtlasDataset;

  beforeEach(() => {
    generator = new AtlasDataGenerator();
    dataset = generator.generate();
  });

  describe('データセット構造の完全性', () => {
    test('正常ケース: データセットがnodesとedgesを持つ', () => {
      expect(dataset).toHaveProperty('nodes');
      expect(dataset).toHaveProperty('edges');
      expect(Array.isArray(dataset.nodes)).toBe(true);
      expect(Array.isArray(dataset.edges)).toBe(true);
    });

    test('正常ケース: すべてのノードが必須フィールドを持つ', () => {
      dataset.nodes.forEach(node => {
        expect(node).toHaveProperty('id');
        expect(node).toHaveProperty('type');
        expect(node).toHaveProperty('dataType');
        expect(node).toHaveProperty('label');
        expect(node).toHaveProperty('x');
        expect(node).toHaveProperty('y');
        expect(node).toHaveProperty('data');
        expect(node).toHaveProperty('tags');

        // 必須フィールドの型チェック
        expect(typeof node.id).toBe('string');
        expect(typeof node.type).toBe('string');
        expect(typeof node.dataType).toBe('string');
        expect(typeof node.label).toBe('string');
        expect(typeof node.x).toBe('number');
        expect(typeof node.y).toBe('number');
        expect(Array.isArray(node.tags)).toBe(true);
      });
    });

    test('正常ケース: すべてのエッジが必須フィールドを持つ', () => {
      dataset.edges.forEach(edge => {
        expect(edge).toHaveProperty('id');
        expect(edge).toHaveProperty('source');
        expect(edge).toHaveProperty('target');
        expect(edge).toHaveProperty('type');

        // 必須フィールドの型チェック
        expect(typeof edge.id).toBe('string');
        expect(typeof edge.source).toBe('string');
        expect(typeof edge.target).toBe('string');
        expect(typeof edge.type).toBe('string');
      });
    });
  });

  describe('ノード・エッジ数の検証', () => {
    test('正常ケース: 正しいノード数が生成される', () => {
      // 期待されるノード数:
      // - Root: 1
      // - Concept: 5 (Pitch, Interval, Scale, Chord, Key)
      // - Foundation: 4 (Degree, Enharmonic, Octave, Function) + 12 (PitchClass) + 12 (Interval)
      // - Pattern: 8 (ScalePattern) + 6 (ChordPattern)
      // - Context: 24 (Key: 12 Major + 12 Minor) + 3 (Function)

      const rootNodes = dataset.nodes.filter(n => n.id === 'root-theory');
      const conceptNodes = dataset.nodes.filter(n => n.id.startsWith('concept-'));
      const foundationNodes = dataset.nodes.filter(n => n.id.startsWith('foundation-'));
      const pitchNodes = dataset.nodes.filter(n => n.id.startsWith('pitch-'));
      const intervalNodes = dataset.nodes.filter(n => n.id.startsWith('interval-'));
      const scalePatternNodes = dataset.nodes.filter(n => n.id.startsWith('pattern-scale-'));
      const chordPatternNodes = dataset.nodes.filter(n => n.id.startsWith('pattern-chord-'));
      const keyNodes = dataset.nodes.filter(n => n.id.startsWith('key-'));
      const functionNodes = dataset.nodes.filter(n => n.id.startsWith('function-'));

      expect(rootNodes.length).toBe(1);
      expect(conceptNodes.length).toBe(5);
      expect(foundationNodes.length).toBe(4);
      expect(pitchNodes.length).toBe(12);
      expect(intervalNodes.length).toBe(12);
      expect(scalePatternNodes.length).toBe(8);
      expect(chordPatternNodes.length).toBe(6);
      expect(keyNodes.length).toBe(24); // 12 Major + 12 Minor
      expect(functionNodes.length).toBe(3);

      // 合計: 1 + 5 + 4 + 12 + 12 + 8 + 6 + 24 + 3 = 75
      expect(dataset.nodes.length).toBe(75);
    });

    test('正常ケース: 正しいエッジ数が生成される', () => {
      // 期待されるエッジ数:
      // - Concept: 5 (Root → Concept)
      // - Foundation: 4 (Concept → Foundation)
      // - PitchClass: 12 (Concept → PitchClass)
      // - Interval: 12 (Concept → Interval)
      // - ScalePattern: 8 (Concept → ScalePattern)
      // - ChordPattern: 6 (Concept → ChordPattern)
      // - Key: 24 (Concept → Key) + 24 (Key → Tonic PitchClass)
      // - Relative Key: 12 (Major ⟷ Minor)

      const conceptEdges = dataset.edges.filter(e => e.source === 'root-theory');
      const foundationEdges = dataset.edges.filter(
        e =>
          e.source.startsWith('concept-') &&
          e.target.startsWith('foundation-') &&
          e.type === 'structure'
      );
      const pitchEdges = dataset.edges.filter(
        e => e.source === 'concept-pitch' && e.target.startsWith('pitch-')
      );
      const intervalEdges = dataset.edges.filter(
        e => e.source === 'concept-interval' && e.target.startsWith('interval-')
      );
      const scalePatternEdges = dataset.edges.filter(
        e => e.source === 'concept-scale' && e.target.startsWith('pattern-scale-')
      );
      const chordPatternEdges = dataset.edges.filter(
        e => e.source === 'concept-chord' && e.target.startsWith('pattern-chord-')
      );
      const keyConceptEdges = dataset.edges.filter(
        e => e.source === 'concept-key' && e.target.startsWith('key-') && e.type === 'structure'
      );
      const keyTonicEdges = dataset.edges.filter(
        e => e.source.startsWith('key-') && e.target.startsWith('pitch-')
      );
      const relativeKeyEdges = dataset.edges.filter(e => e.type === 'relative');

      expect(conceptEdges.length).toBe(5);
      expect(foundationEdges.length).toBe(4);
      expect(pitchEdges.length).toBe(12);
      expect(intervalEdges.length).toBe(12);
      expect(scalePatternEdges.length).toBe(8);
      expect(chordPatternEdges.length).toBe(6);
      expect(keyConceptEdges.length).toBe(24);
      expect(keyTonicEdges.length).toBe(24);
      expect(relativeKeyEdges.length).toBe(12);

      // 合計: 5 + 4 + 12 + 12 + 8 + 6 + 24 + 24 + 12 = 107
      expect(dataset.edges.length).toBe(107);
    });
  });

  describe('ID重複チェック', () => {
    test('正常ケース: すべてのノードIDが一意である', () => {
      const nodeIds = dataset.nodes.map(n => n.id);
      const uniqueIds = new Set(nodeIds);
      expect(uniqueIds.size).toBe(nodeIds.length);
    });

    test('正常ケース: すべてのエッジIDが一意である', () => {
      const edgeIds = dataset.edges.map(e => e.id);
      const uniqueIds = new Set(edgeIds);
      expect(uniqueIds.size).toBe(edgeIds.length);
    });

    test('正常ケース: エッジIDに重複がない（ScalePatternとChordPatternで異なるID）', () => {
      const scalePatternEdges = dataset.edges.filter(e =>
        e.id.startsWith('edge-concept-scale-pattern-')
      );
      const chordPatternEdges = dataset.edges.filter(e =>
        e.id.startsWith('edge-concept-chord-pattern-')
      );

      // ScalePatternエッジが8個
      expect(scalePatternEdges.length).toBe(8);
      // ChordPatternエッジが6個
      expect(chordPatternEdges.length).toBe(6);

      // すべてのエッジIDが一意
      const allPatternEdgeIds = [
        ...scalePatternEdges.map(e => e.id),
        ...chordPatternEdges.map(e => e.id),
      ];
      const uniqueIds = new Set(allPatternEdgeIds);
      expect(uniqueIds.size).toBe(allPatternEdgeIds.length);
    });
  });

  describe('親子関係の整合性', () => {
    test('正常ケース: すべてのエッジのsourceノードが存在する', () => {
      const nodeIds = new Set(dataset.nodes.map(n => n.id));

      dataset.edges.forEach(edge => {
        expect(nodeIds.has(edge.source)).toBe(true);
      });
    });

    test('正常ケース: すべてのエッジのtargetノードが存在する', () => {
      const nodeIds = new Set(dataset.nodes.map(n => n.id));

      dataset.edges.forEach(edge => {
        expect(nodeIds.has(edge.target)).toBe(true);
      });
    });

    test('正常ケース: parentIdが設定されている場合、親ノードが存在する', () => {
      const nodeIds = new Set(dataset.nodes.map(n => n.id));

      dataset.nodes.forEach(node => {
        if (node.parentId) {
          expect(nodeIds.has(node.parentId)).toBe(true);
        }
      });
    });

    test('正常ケース: ルートノード以外のノードはparentIdを持つ', () => {
      dataset.nodes.forEach(node => {
        if (node.id !== 'root-theory') {
          expect(node.parentId).toBeDefined();
          expect(typeof node.parentId).toBe('string');
        }
      });
    });

    test('正常ケース: ルートノードはparentIdを持たない', () => {
      const rootNode = dataset.nodes.find(n => n.id === 'root-theory');
      expect(rootNode).toBeDefined();
      expect(rootNode?.parentId).toBeUndefined();
    });
  });

  describe('ドメインオブジェクトのデータ整合性', () => {
    test('正常ケース: PitchClassノードが正しいPitchClassデータを持つ', () => {
      const pitchNodes = dataset.nodes.filter(n => n.id.startsWith('pitch-'));

      pitchNodes.forEach(node => {
        expect(node.dataType).toBe('pitch');
        expect(node.data).toBeDefined();
        expect(node.data.index).toBeDefined();
        expect(node.data.sharpName).toBeDefined();
        expect(node.data.flatName).toBeDefined();
        expect(typeof node.data.index).toBe('number');
        expect(node.data.index).toBeGreaterThanOrEqual(0);
        expect(node.data.index).toBeLessThan(12);
      });

      // 12個すべてのPitchClassが存在
      expect(pitchNodes.length).toBe(12);
    });

    test('正常ケース: Keyノードが正しいKeyデータを持つ', () => {
      const keyNodes = dataset.nodes.filter(n => n.id.startsWith('key-'));

      keyNodes.forEach(node => {
        expect(node.dataType).toBe('key');
        expect(node.data).toBeDefined();
        expect(node.data.centerPitch).toBeDefined();
        expect(node.data.keySignature).toBeDefined();
        expect(node.data.keySignature).toHaveProperty('fifthsIndex');
        expect(typeof node.data.keySignature.fifthsIndex).toBe('number');
      });

      // 24個のKeyが存在（12 Major + 12 Minor）
      expect(keyNodes.length).toBe(24);
    });

    test('正常ケース: ScalePatternノードが正しいScalePatternデータを持つ', () => {
      const scalePatternNodes = dataset.nodes.filter(n => n.id.startsWith('pattern-scale-'));

      scalePatternNodes.forEach(node => {
        expect(node.dataType).toBe('scale');
        expect(node.data).toBeDefined();
        expect(node.data.intervals).toBeDefined();
        expect(Array.isArray(node.data.intervals)).toBe(true);
        expect(node.data.intervals.length).toBeGreaterThan(0);
      });

      // 8個のScalePatternが存在
      expect(scalePatternNodes.length).toBe(8);
    });

    test('正常ケース: ChordPatternノードが正しいChordPatternデータを持つ', () => {
      const chordPatternNodes = dataset.nodes.filter(n => n.id.startsWith('pattern-chord-'));

      chordPatternNodes.forEach(node => {
        expect(node.dataType).toBe('chord');
        expect(node.data).toBeDefined();
        expect(node.data.intervals).toBeDefined();
        expect(Array.isArray(node.data.intervals)).toBe(true);
        expect(node.data.intervals.length).toBeGreaterThan(0);
      });

      // 6個のChordPatternが存在
      expect(chordPatternNodes.length).toBe(6);
    });
  });

  describe('ノードタイプの正確性', () => {
    test('正常ケース: ルートノードがcontextタイプである', () => {
      const rootNode = dataset.nodes.find(n => n.id === 'root-theory');
      expect(rootNode).toBeDefined();
      expect(rootNode?.type).toBe('context');
    });

    test('正常ケース: Conceptノードがfoundationタイプである', () => {
      const conceptNodes = dataset.nodes.filter(n => n.id.startsWith('concept-'));
      conceptNodes.forEach(node => {
        expect(node.type).toBe('foundation');
      });
    });

    test('正常ケース: PitchClassノードがfoundationタイプである', () => {
      const pitchNodes = dataset.nodes.filter(n => n.id.startsWith('pitch-'));
      pitchNodes.forEach(node => {
        expect(node.type).toBe('foundation');
      });
    });

    test('正常ケース: Patternノードがpatternタイプである', () => {
      const patternNodes = dataset.nodes.filter(
        n => n.id.startsWith('pattern-scale-') || n.id.startsWith('pattern-chord-')
      );
      patternNodes.forEach(node => {
        expect(node.type).toBe('pattern');
      });
    });

    test('正常ケース: Keyノードがcontextタイプである', () => {
      const keyNodes = dataset.nodes.filter(n => n.id.startsWith('key-'));
      keyNodes.forEach(node => {
        expect(node.type).toBe('context');
      });
    });
  });

  describe('座標の妥当性', () => {
    test('正常ケース: すべてのノードが有効な座標を持つ', () => {
      dataset.nodes.forEach(node => {
        expect(node.x).toBeDefined();
        expect(node.y).toBeDefined();
        expect(typeof node.x).toBe('number');
        expect(typeof node.y).toBe('number');
        expect(isFinite(node.x!)).toBe(true);
        expect(isFinite(node.y!)).toBe(true);
      });
    });

    test('境界値ケース: ルートノードが中心座標にある', () => {
      const rootNode = dataset.nodes.find(n => n.id === 'root-theory');
      expect(rootNode).toBeDefined();
      expect(rootNode?.x).toBe(2500);
      expect(rootNode?.y).toBe(2500);
    });
  });

  describe('エッジタイプの正確性', () => {
    test('正常ケース: Root→Conceptエッジがstructureタイプである', () => {
      const edges = dataset.edges.filter(e => e.source === 'root-theory');
      edges.forEach(edge => {
        expect(edge.type).toBe('structure');
      });
    });

    test('正常ケース: Concept→Foundationエッジがstructureタイプである', () => {
      const edges = dataset.edges.filter(
        e => e.source.startsWith('concept-') && e.target.startsWith('foundation-')
      );
      edges.forEach(edge => {
        expect(edge.type).toBe('structure');
      });
    });

    test('正常ケース: Concept→PitchClassエッジがconstituentタイプである', () => {
      const edges = dataset.edges.filter(
        e => e.source === 'concept-pitch' && e.target.startsWith('pitch-')
      );
      edges.forEach(edge => {
        expect(edge.type).toBe('constituent');
      });
    });

    test('正常ケース: 平行調エッジがrelativeタイプである', () => {
      const edges = dataset.edges.filter(e => e.type === 'relative');
      expect(edges.length).toBe(12); // 12組の平行調関係

      edges.forEach(edge => {
        expect(edge.source).toContain('key-major-');
        expect(edge.target).toContain('key-minor-');
      });
    });
  });

  describe('平行調関係の正確性', () => {
    test('正常ケース: 平行調エッジが正しく生成される', () => {
      const relativeEdges = dataset.edges.filter(e => e.type === 'relative');

      // C Major (index 0) ⟷ A Minor (index 9)
      const cToAm = relativeEdges.find(e => e.source === 'key-major-0');
      expect(cToAm).toBeDefined();
      expect(cToAm?.target).toBe('key-minor-9');

      // G Major (index 7) ⟷ E Minor (index 4)
      const gToEm = relativeEdges.find(e => e.source === 'key-major-7');
      expect(gToEm).toBeDefined();
      expect(gToEm?.target).toBe('key-minor-4');
    });
  });

  describe('公開API関数', () => {
    test('正常ケース: generateAtlasDataset関数が正しく動作する', async () => {
      // generateAtlasDatasetはエクスポートされた公開APIなので、
      // 別途テストする必要がある
      const { generateAtlasDataset } = await import('../AtlasDataGenerator');
      const dataset = generateAtlasDataset();

      expect(dataset).toHaveProperty('nodes');
      expect(dataset).toHaveProperty('edges');
      expect(dataset.nodes.length).toBeGreaterThan(0);
      expect(dataset.edges.length).toBeGreaterThan(0);
    });
  });
});
