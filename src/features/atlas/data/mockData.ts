import { PitchClass, ScalePattern, ChordPattern } from '@/domain/common';
import { Key } from '@/domain/key';
import { AtlasDataset, AtlasNodeData, AtlasEdge } from '../types';

// Coordinate Constants (Must match domainConfig.ts)
const WORLD_SIZE = 5000;
const CENTER = WORLD_SIZE / 2;
const R_BASE = 300;

/**
 * Helper to calculate Cartesian coordinates from Polar
 * @param radius Radius from center
 * @param angleDegrees Angle in degrees (0 is East, counter-clockwise)
 */
const polarToCartesian = (radius: number, angleDegrees: number) => {
  const angleRadians = (angleDegrees * Math.PI) / 180;
  const x = CENTER + radius * Math.cos(angleRadians);
  const y = CENTER - radius * Math.sin(angleRadians); // SVG y is down, so minus for standard math angle

  // Round to 4 decimal places to avoid hydration mismatches
  return {
    x: Math.round(x * 10000) / 10000,
    y: Math.round(y * 10000) / 10000,
  };
};

/**
 * Circle of Fifths Angle Calculation
 * C=0 (Top/90deg), G=1 (30deg right), ...
 */
const getCircleOfFifthsAngle = (index: number) => {
  return 90 - index * 30;
};

/**
 * Atlas用のモックデータセットを生成する
 */
export const generateAtlasDataset = (): AtlasDataset => {
  const nodes: AtlasNodeData[] = [];
  const edges: AtlasEdge[] = [];

  // ==========================================
  // 0. Root & Concept Nodes
  // ==========================================

  // Root Node (Theory)
  const rootId = 'root-theory';
  nodes.push({
    id: rootId,
    type: 'foundation',
    dataType: 'function', // Using 'function' as a placeholder for generic concept
    label: 'Music Theory',
    x: CENTER,
    y: CENTER,
    data: { description: 'The root of all musical concepts' },
    tags: ['root', 'theory'],
  });

  // Concept Nodes (Children of Root)
  const concepts = [
    { id: 'concept-pitch', label: 'Pitch', angle: 90, color: 'blue' },
    { id: 'concept-scale', label: 'Scale', angle: 210, color: 'green' }, // Bottom Left
    { id: 'concept-chord', label: 'Chord', angle: 330, color: 'orange' }, // Bottom Right
    // Key is often related to Pitch, but let's put it as a separate concept for now or link it to Pitch
    { id: 'concept-key', label: 'Key', angle: 150, color: 'purple' },
  ];

  const conceptRadius = R_BASE * 0.8;

  concepts.forEach(concept => {
    const pos = polarToCartesian(conceptRadius, concept.angle);
    nodes.push({
      id: concept.id,
      type: 'foundation',
      dataType: 'function', // Placeholder
      label: concept.label,
      x: pos.x,
      y: pos.y,
      parentId: rootId,
      data: { description: `${concept.label} concepts` },
      tags: ['concept', concept.label.toLowerCase()],
    });

    edges.push({
      id: `edge-${rootId}-${concept.id}`,
      source: rootId,
      target: concept.id,
      type: 'structure',
    });
  });

  // ==========================================
  // 1. Foundation Nodes (Pitch Class)
  // ==========================================

  // PitchClass Nodes (12音)
  // Parent: concept-pitch
  // Layout: Circle of Fifths at R = R_BASE * 1.5 (Relative to center)
  PitchClass.ALL_PITCH_CLASSES.forEach(pc => {
    const angle = getCircleOfFifthsAngle(pc.index);
    const pos = polarToCartesian(R_BASE * 1.8, angle);

    nodes.push({
      id: `pitch-${pc.index}`,
      type: 'foundation',
      dataType: 'pitch',
      label: pc.sharpName,
      x: pos.x,
      y: pos.y,
      parentId: 'concept-pitch',
      data: pc,
      tags: ['pitch', pc.sharpName, pc.flatName],
    });

    // Edge from Concept
    edges.push({
      id: `edge-concept-pitch-${pc.index}`,
      source: 'concept-pitch',
      target: `pitch-${pc.index}`,
      type: 'constituent',
    });
  });

  // ==========================================
  // 2. Pattern Nodes (ScalePattern, ChordPattern)
  // ==========================================

  // ScalePattern Nodes
  // Parent: concept-scale
  const scalePatterns = [
    { pattern: ScalePattern.Major, label: 'Major Scale' },
    { pattern: ScalePattern.Aeolian, label: 'Natural Minor' },
    { pattern: ScalePattern.Dorian, label: 'Dorian' },
    { pattern: ScalePattern.Phrygian, label: 'Phrygian' },
    { pattern: ScalePattern.Lydian, label: 'Lydian' },
    { pattern: ScalePattern.Mixolydian, label: 'Mixolydian' },
    { pattern: ScalePattern.Locrian, label: 'Locrian' },
  ];

  const scaleSectorStart = 120;
  const scaleSectorEnd = 240;
  const scaleRadius = R_BASE * 2.5;
  const scaleStep = (scaleSectorEnd - scaleSectorStart) / (scalePatterns.length + 1);

  scalePatterns.forEach((sp, i) => {
    const angle = scaleSectorStart + scaleStep * (i + 1);
    const pos = polarToCartesian(scaleRadius, angle);

    nodes.push({
      id: `pattern-scale-${sp.label.replace(/\s+/g, '-').toLowerCase()}`,
      type: 'pattern',
      dataType: 'scale',
      label: sp.label,
      x: pos.x,
      y: pos.y,
      parentId: 'concept-scale',
      data: sp.pattern,
      tags: ['pattern', 'scale', sp.label],
    });

    edges.push({
      id: `edge-concept-scale-${i}`,
      source: 'concept-scale',
      target: `pattern-scale-${sp.label.replace(/\s+/g, '-').toLowerCase()}`,
      type: 'structure',
    });
  });

  // ChordPattern Nodes
  // Parent: concept-chord
  const chordPatterns = [
    { pattern: ChordPattern.MajorTriad, label: 'Major Triad' },
    { pattern: ChordPattern.MinorTriad, label: 'Minor Triad' },
    { pattern: ChordPattern.DominantSeventh, label: 'Dominant 7th' },
    { pattern: ChordPattern.MajorSeventh, label: 'Major 7th' },
    { pattern: ChordPattern.MinorSeventh, label: 'Minor 7th' },
    { pattern: ChordPattern.DiminishedTriad, label: 'Diminished' },
  ];

  const chordSectorStart = 300;
  const chordSectorEnd = 420; // 300 to 60 degrees
  const chordRadius = R_BASE * 2.5;
  const chordStep = (chordSectorEnd - chordSectorStart) / (chordPatterns.length + 1);

  chordPatterns.forEach((cp, i) => {
    const angle = chordSectorStart + chordStep * (i + 1);
    const pos = polarToCartesian(chordRadius, angle);

    nodes.push({
      id: `pattern-chord-${cp.label.replace(/\s+/g, '-').toLowerCase()}`,
      type: 'pattern',
      dataType: 'chord',
      label: cp.label,
      x: pos.x,
      y: pos.y,
      parentId: 'concept-chord',
      data: cp.pattern,
      tags: ['pattern', 'chord', cp.label],
    });

    edges.push({
      id: `edge-concept-chord-${i}`,
      source: 'concept-chord',
      target: `pattern-chord-${cp.label.replace(/\s+/g, '-').toLowerCase()}`,
      type: 'structure',
    });
  });

  // ==========================================
  // 3. Context Nodes (Key)
  // ==========================================

  // Keys
  // Parent: concept-key
  PitchClass.ALL_PITCH_CLASSES.forEach(pc => {
    const angle = getCircleOfFifthsAngle(pc.index);

    // Major Key
    const majorKey = Key.major(pc);
    const majorKeyId = `key-major-${pc.index}`;
    const majorPos = polarToCartesian(R_BASE * 3.5, angle);

    nodes.push({
      id: majorKeyId,
      type: 'context',
      dataType: 'key',
      label: `${pc.getNameFor(majorKey.keySignature)} Major`,
      x: majorPos.x,
      y: majorPos.y,
      parentId: 'concept-key',
      data: majorKey,
      tags: ['key', 'major', pc.sharpName],
    });

    edges.push({
      id: `edge-concept-key-${majorKeyId}`,
      source: 'concept-key',
      target: majorKeyId,
      type: 'structure',
    });

    // Link Key to Pitch (Cross-hierarchy edge)
    edges.push({
      id: `edge-${majorKeyId}-tonic`,
      source: majorKeyId,
      target: `pitch-${pc.index}`,
      type: 'constituent',
    });

    // Minor Key
    const minorKey = Key.minor(pc);
    const minorKeyId = `key-minor-${pc.index}`;
    const minorPos = polarToCartesian(R_BASE * 3.8, angle); // Slightly further out

    nodes.push({
      id: minorKeyId,
      type: 'context',
      dataType: 'key',
      label: `${pc.getNameFor(minorKey.keySignature)} Minor`,
      x: minorPos.x,
      y: minorPos.y,
      parentId: 'concept-key',
      data: minorKey,
      tags: ['key', 'minor', pc.sharpName],
    });

    edges.push({
      id: `edge-concept-key-${minorKeyId}`,
      source: 'concept-key',
      target: minorKeyId,
      type: 'structure',
    });

    // Link Minor Key to Pitch (Cross-hierarchy edge)
    edges.push({
      id: `edge-${minorKeyId}-tonic`,
      source: minorKeyId,
      target: `pitch-${pc.index}`,
      type: 'constituent',
    });
  });

  return { nodes, edges };
};
