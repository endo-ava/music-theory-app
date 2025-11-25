import { PitchClass, ScalePattern, ChordPattern } from '@/domain/common';
import { Scale } from '@/domain/scale';
import { Key } from '@/domain/key';
import { LibraryDataset, LibraryNode, LibraryEdge } from '../types';

/**
 * Library用のモックデータセットを生成する
 */
export const generateLibraryDataset = (): LibraryDataset => {
  const nodes: LibraryNode[] = [];
  const edges: LibraryEdge[] = [];

  // ==========================================
  // 1. Foundation Nodes (Pitch, Interval)
  // ==========================================

  // PitchClass Nodes (12音)
  PitchClass.ALL_PITCH_CLASSES.forEach(pc => {
    nodes.push({
      id: `pitch-${pc.index}`,
      type: 'foundation',
      dataType: 'pitch',
      label: pc.sharpName, // デフォルト表記
      data: pc,
      tags: ['pitch', pc.sharpName, pc.flatName],
    });
  });

  // ==========================================
  // 2. Pattern Nodes (ScalePattern, ChordPattern)
  // ==========================================

  // ScalePattern Nodes
  const scalePatterns = [
    { pattern: ScalePattern.Major, label: 'Major Scale' },
    { pattern: ScalePattern.Aeolian, label: 'Natural Minor Scale' },
    { pattern: ScalePattern.Dorian, label: 'Dorian Mode' },
    // 必要に応じて追加
  ];

  scalePatterns.forEach(sp => {
    nodes.push({
      id: `pattern-scale-${sp.label.replace(/\s+/g, '-').toLowerCase()}`,
      type: 'pattern',
      dataType: 'scale',
      label: sp.label,
      data: sp.pattern,
      tags: ['pattern', 'scale', sp.label],
    });
  });

  // ChordPattern Nodes
  const chordPatterns = [
    { pattern: ChordPattern.MajorTriad, label: 'Major Triad' },
    { pattern: ChordPattern.MinorTriad, label: 'Minor Triad' },
    { pattern: ChordPattern.DominantSeventh, label: 'Dominant 7th' },
    { pattern: ChordPattern.MajorSeventh, label: 'Major 7th' },
    { pattern: ChordPattern.MinorSeventh, label: 'Minor 7th' },
  ];

  chordPatterns.forEach(cp => {
    nodes.push({
      id: `pattern-chord-${cp.label.replace(/\s+/g, '-').toLowerCase()}`,
      type: 'pattern',
      dataType: 'chord',
      label: cp.label,
      data: cp.pattern,
      tags: ['pattern', 'chord', cp.label],
    });
  });

  // ==========================================
  // 3. Context Nodes (Key) & Instance Nodes (Scale, Chord)
  // ==========================================

  // 24 Keys (Major & Minor)
  PitchClass.ALL_PITCH_CLASSES.forEach(pc => {
    // --- Major Key ---
    const majorKey = Key.major(pc);
    const majorKeyId = `key-major-${pc.index}`;

    nodes.push({
      id: majorKeyId,
      type: 'context',
      dataType: 'key',
      label: `${pc.getNameFor(majorKey.keySignature)} Major Key`,
      data: majorKey,
      tags: ['key', 'major', pc.sharpName],
    });

    // Edge: Key -> Tonic Pitch
    edges.push({
      id: `edge-${majorKeyId}-tonic`,
      source: majorKeyId,
      target: `pitch-${pc.index}`,
      type: 'constituent',
    });

    // --- Minor Key ---
    const minorKey = Key.minor(pc);
    const minorKeyId = `key-minor-${pc.index}`;

    nodes.push({
      id: minorKeyId,
      type: 'context',
      dataType: 'key',
      label: `${pc.getNameFor(minorKey.keySignature)} Minor Key`,
      data: minorKey,
      tags: ['key', 'minor', pc.sharpName],
    });

    // Edge: Key -> Tonic Pitch
    edges.push({
      id: `edge-${minorKeyId}-tonic`,
      source: minorKeyId,
      target: `pitch-${pc.index}`,
      type: 'constituent',
    });

    // ==========================================
    // 4. Instance Nodes (Scale Instance)
    // ==========================================

    // Major Scale Instance for this Key
    // Note: Scale Instance is technically independent of Key, but often associated
    const majorScale = new Scale(pc, ScalePattern.Major);
    const majorScaleId = `instance-scale-major-${pc.index}`;

    nodes.push({
      id: majorScaleId,
      type: 'instance',
      dataType: 'scale',
      label: `${pc.getNameFor(majorKey.keySignature)} Major Scale`,
      data: majorScale,
      tags: ['instance', 'scale', 'major'],
    });

    // Edge: Scale Instance -> Scale Pattern
    edges.push({
      id: `edge-${majorScaleId}-pattern`,
      source: majorScaleId,
      target: `pattern-scale-major-scale`,
      type: 'structure',
    });

    // Edge: Key -> Scale Instance (Key uses this scale)
    edges.push({
      id: `edge-${majorKeyId}-scale`,
      source: majorKeyId,
      target: majorScaleId,
      type: 'constituent',
    });
  });

  return { nodes, edges };
};
