/**
 * Atlas Data Generator
 *
 * Atlas 画面で表示するノードとエッジのデータセットを生成する。
 * 設計書 `docs/00.project/screenDesigns/0004-1.atlas-node-design.md` に基づく。
 */

import { PitchClass, ScalePattern, ChordPattern } from '@/domain/common';
import { Key } from '@/domain/key';
import { AtlasDataset, AtlasNodeData, AtlasEdge, AtlasEdgeType } from '../types';
import { AtlasNodeBuilder } from './AtlasNodeBuilder';
import { CoordinateSystem, CoordinateConstants } from '../utils/CoordinateSystem';

const { R, SECTOR } = CoordinateConstants;

/**
 * Atlas データセット生成クラス
 *
 * @example
 * const generator = new AtlasDataGenerator();
 * const dataset = generator.generate();
 */
export class AtlasDataGenerator {
  private nodes: AtlasNodeData[] = [];
  private edges: AtlasEdge[] = [];

  /**
   * データセットを生成
   */
  generate(): AtlasDataset {
    this.nodes = [];
    this.edges = [];

    // ノード生成
    this.generateRootNode();
    this.generateConceptNodes();
    this.generateFoundationNodes();
    this.generatePitchClassNodes();
    this.generateIntervalNodes();
    this.generateScalePatternNodes();
    this.generateChordPatternNodes();
    this.generateKeyNodes();
    this.generateFunctionNodes();

    // TODO: Instance ノードの生成は別途実装
    // this.generateScaleInstanceNodes();
    // this.generateChordInstanceNodes();

    // エッジ生成
    this.generateConceptEdges();
    this.generateFoundationEdges();
    this.generatePitchClassEdges();
    this.generateIntervalEdges();
    this.generatePatternEdges();
    this.generateKeyEdges();
    this.generateRelativeKeyEdges();

    // TODO: Instance/Function 関連のエッジは別途実装
    // this.generateInstanceEdges();
    // this.generateFunctionEdges();

    return {
      nodes: this.nodes,
      edges: this.edges,
    };
  }

  // ========================================
  // ノード生成メソッド
  // ========================================

  /**
   * ルートノードを生成
   */
  private generateRootNode(): void {
    const center = CoordinateSystem.getCenter();

    const rootNode = AtlasNodeBuilder.foundation('root-theory')
      .dataType('function')
      .label('Music Theory')
      .coordinate(center)
      .data({ description: 'The root of all musical concepts' })
      .tags(['root', 'theory'])
      .build();

    this.nodes.push(rootNode);
  }

  /**
   * 概念ハブノードを生成
   */
  private generateConceptNodes(): void {
    const concepts = [
      { id: 'concept-pitch', label: 'Pitch', angle: 90 },
      { id: 'concept-interval', label: 'Interval', angle: 210 },
      { id: 'concept-scale', label: 'Scale', angle: 150 },
      { id: 'concept-chord', label: 'Chord', angle: 330 },
      { id: 'concept-key', label: 'Key', angle: 30 },
    ];

    concepts.forEach(concept => {
      const pos = CoordinateSystem.polarToCartesian(R.FOUNDATION_INNER, concept.angle);

      const node = AtlasNodeBuilder.foundation(concept.id)
        .dataType('function')
        .label(concept.label)
        .coordinate(pos)
        .parent('root-theory')
        .data({ description: `${concept.label} concepts` })
        .tags(['concept', concept.label.toLowerCase()])
        .build();

      this.nodes.push(node);
    });
  }

  /**
   * 基底理論ノードを生成
   */
  private generateFoundationNodes(): void {
    // 親Conceptノードの近くに配置するための半径（親の1.6倍）
    const foundationRadius = R.FOUNDATION_INNER * 1.6; // 600

    const foundations = [
      {
        id: 'foundation-degree',
        label: 'Degree',
        parentId: 'concept-scale', // Scale内での位置を表す概念
        angle: 145, // concept-scale (150°) の近く
        description: 'ディグリーネーム概念（I, II, III...）',
      },
      {
        id: 'foundation-enharmonic',
        label: 'Enharmonic',
        parentId: 'concept-pitch', // Pitch間の関係性
        angle: 95, // concept-pitch (90°) の近く
        description: '異名同音の概念（C♯ = D♭）',
      },
      {
        id: 'foundation-octave',
        label: 'Octave',
        parentId: 'concept-interval', // 完全8度＝音程の一種
        angle: 205, // concept-interval (210°) の近く
        description: 'オクターブ（完全8度）',
      },
      {
        id: 'foundation-function',
        label: 'Function',
        parentId: 'concept-key', // 調性の文脈での機能
        angle: 25, // concept-key (30°) の近く
        description: '機能和声の概念（T, D, S）',
      },
    ];

    foundations.forEach(foundation => {
      const pos = CoordinateSystem.polarToCartesian(foundationRadius, foundation.angle);

      const node = AtlasNodeBuilder.foundation(foundation.id)
        .dataType('function')
        .label(foundation.label)
        .coordinate(pos)
        .parent(foundation.parentId)
        .data({ description: foundation.description })
        .tags(['foundation', foundation.label.toLowerCase()])
        .build();

      this.nodes.push(node);
    });
  }

  /**
   * PitchClass ノードを生成（12音）
   * クロマチック順でPitch Domainセクター内に配置
   */
  private generatePitchClassNodes(): void {
    PitchClass.ALL_PITCH_CLASSES.forEach((pc, index) => {
      const pos = CoordinateSystem.getSectorPosition(
        SECTOR.PITCH.start,
        SECTOR.PITCH.end,
        index,
        PitchClass.ALL_PITCH_CLASSES.length,
        R.PATTERN_INNER
      );

      const node = AtlasNodeBuilder.foundation(`pitch-${pc.index}`)
        .dataType('pitch')
        .label(pc.sharpName)
        .coordinate(pos)
        .parent('concept-pitch')
        .data(pc)
        .tags(['pitch', pc.sharpName, pc.flatName])
        .build();

      this.nodes.push(node);
    });
  }

  /**
   * Interval ノードを生成（主要音程）
   */
  private generateIntervalNodes(): void {
    const intervals = [
      { id: 'interval-m2', label: 'Minor 2nd', semitones: 1 },
      { id: 'interval-M2', label: 'Major 2nd', semitones: 2 },
      { id: 'interval-m3', label: 'Minor 3rd', semitones: 3 },
      { id: 'interval-M3', label: 'Major 3rd', semitones: 4 },
      { id: 'interval-P4', label: 'Perfect 4th', semitones: 5 },
      { id: 'interval-TT', label: 'Tritone', semitones: 6 },
      { id: 'interval-P5', label: 'Perfect 5th', semitones: 7 },
      { id: 'interval-m6', label: 'Minor 6th', semitones: 8 },
      { id: 'interval-M6', label: 'Major 6th', semitones: 9 },
      { id: 'interval-m7', label: 'Minor 7th', semitones: 10 },
      { id: 'interval-M7', label: 'Major 7th', semitones: 11 },
      { id: 'interval-P8', label: 'Octave', semitones: 12 },
    ];

    intervals.forEach((interval, index) => {
      const pos = CoordinateSystem.getSectorPosition(
        SECTOR.INTERVAL.start,
        SECTOR.INTERVAL.end,
        index,
        intervals.length,
        R.PATTERN_INNER
      );

      const node = AtlasNodeBuilder.foundation(interval.id)
        .dataType('interval')
        .label(interval.label)
        .coordinate(pos)
        .parent('concept-interval')
        .data({ semitones: interval.semitones, label: interval.label })
        .tags(['interval', interval.label.toLowerCase()])
        .build();

      this.nodes.push(node);
    });
  }

  /**
   * ScalePattern ノードを生成
   */
  private generateScalePatternNodes(): void {
    const scalePatterns = [
      { pattern: ScalePattern.Major, label: 'Major Scale' },
      { pattern: ScalePattern.Aeolian, label: 'Natural Minor' },
      { pattern: ScalePattern.Dorian, label: 'Dorian Mode' },
      { pattern: ScalePattern.Phrygian, label: 'Phrygian Mode' },
      { pattern: ScalePattern.Lydian, label: 'Lydian Mode' },
      { pattern: ScalePattern.Mixolydian, label: 'Mixolydian Mode' },
      { pattern: ScalePattern.Locrian, label: 'Locrian Mode' },
      { pattern: ScalePattern.HarmonicMinor, label: 'Harmonic Minor' },
    ];

    scalePatterns.forEach((sp, index) => {
      const pos = CoordinateSystem.getSectorPosition(
        SECTOR.SCALE.start,
        SECTOR.SCALE.end,
        index,
        scalePatterns.length,
        R.PATTERN_MID
      );

      const id = `pattern-scale-${sp.label.replace(/\s+/g, '-').toLowerCase()}`;

      const node = AtlasNodeBuilder.pattern(id)
        .dataType('scale')
        .label(sp.label)
        .coordinate(pos)
        .parent('concept-scale')
        .data(sp.pattern)
        .tags(['pattern', 'scale', sp.label])
        .build();

      this.nodes.push(node);
    });
  }

  /**
   * ChordPattern ノードを生成
   * Chord Domainセクター内に配置
   */
  private generateChordPatternNodes(): void {
    const chordPatterns = [
      { pattern: ChordPattern.MajorTriad, label: 'Major Triad' },
      { pattern: ChordPattern.MinorTriad, label: 'Minor Triad' },
      { pattern: ChordPattern.DiminishedTriad, label: 'Diminished' },
      { pattern: ChordPattern.MajorSeventh, label: 'Major 7th' },
      { pattern: ChordPattern.DominantSeventh, label: 'Dominant 7th' },
      { pattern: ChordPattern.MinorSeventh, label: 'Minor 7th' },
    ];

    chordPatterns.forEach((cp, index) => {
      const pos = CoordinateSystem.getSectorPosition(
        SECTOR.CHORD.start,
        SECTOR.CHORD.end,
        index,
        chordPatterns.length,
        R.PATTERN_MID
      );

      const id = `pattern-chord-${cp.label.replace(/\s+/g, '-').toLowerCase()}`;

      const node = AtlasNodeBuilder.pattern(id)
        .dataType('chord')
        .label(cp.label)
        .coordinate(pos)
        .parent('concept-chord')
        .data(cp.pattern)
        .tags(['pattern', 'chord', cp.label])
        .build();

      this.nodes.push(node);
    });
  }

  /**
   * Key ノードを生成（24キー）
   * Key Domainセクター内にクロマチック順で配置
   */
  private generateKeyNodes(): void {
    // Major Keys
    PitchClass.ALL_PITCH_CLASSES.forEach((pc, index) => {
      const pos = CoordinateSystem.getSectorPosition(
        SECTOR.KEY.start,
        SECTOR.KEY.end,
        index,
        PitchClass.ALL_PITCH_CLASSES.length,
        R.KEY_MAJOR
      );
      const majorKey = Key.major(pc);

      const node = AtlasNodeBuilder.context(`key-major-${pc.index}`)
        .dataType('key')
        .label(`${pc.getNameFor(majorKey.keySignature)} Major`)
        .coordinate(pos)
        .parent('concept-key')
        .data(majorKey)
        .tags(['key', 'major', pc.sharpName])
        .build();

      this.nodes.push(node);
    });

    // Minor Keys
    PitchClass.ALL_PITCH_CLASSES.forEach((pc, index) => {
      const pos = CoordinateSystem.getSectorPosition(
        SECTOR.KEY.start,
        SECTOR.KEY.end,
        index,
        PitchClass.ALL_PITCH_CLASSES.length,
        R.KEY_MINOR
      );
      const minorKey = Key.minor(pc);

      const node = AtlasNodeBuilder.context(`key-minor-${pc.index}`)
        .dataType('key')
        .label(`${pc.getNameFor(minorKey.keySignature)} Minor`)
        .coordinate(pos)
        .parent('concept-key')
        .data(minorKey)
        .tags(['key', 'minor', pc.sharpName])
        .build();

      this.nodes.push(node);
    });
  }

  /**
   * Function ノードを生成（機能和声）
   * Key Domainセクター内に配置
   */
  private generateFunctionNodes(): void {
    const functions = [
      { id: 'function-tonic', label: 'Tonic (I)', angle: 20, description: 'トニック機能' },
      {
        id: 'function-dominant',
        label: 'Dominant (V)',
        angle: 35,
        description: 'ドミナント機能',
      },
      {
        id: 'function-subdominant',
        label: 'Subdominant (IV)',
        angle: 50,
        description: 'サブドミナント機能',
      },
    ];

    functions.forEach(func => {
      const pos = CoordinateSystem.polarToCartesian(R.KEY_CONTEXT, func.angle);

      const node = AtlasNodeBuilder.context(func.id)
        .dataType('function')
        .label(func.label)
        .coordinate(pos)
        .parent('concept-key')
        .data({ description: func.description })
        .tags(['function', func.label.toLowerCase()])
        .build();

      this.nodes.push(node);
    });
  }

  // ========================================
  // エッジ生成メソッド
  // ========================================

  /**
   * エッジを追加（ヘルパーメソッド）
   */
  private addEdge(id: string, source: string, target: string, type: AtlasEdgeType): void {
    this.edges.push({ id, source, target, type });
  }

  /**
   * 概念階層エッジを生成
   */
  private generateConceptEdges(): void {
    // Root → Concept
    this.addEdge('edge-root-pitch', 'root-theory', 'concept-pitch', 'structure');
    this.addEdge('edge-root-interval', 'root-theory', 'concept-interval', 'structure');
    this.addEdge('edge-root-scale', 'root-theory', 'concept-scale', 'structure');
    this.addEdge('edge-root-chord', 'root-theory', 'concept-chord', 'structure');
    this.addEdge('edge-root-key', 'root-theory', 'concept-key', 'structure');
  }

  /**
   * 基底概念エッジを生成
   */
  private generateFoundationEdges(): void {
    // Concept → Foundation (音楽理論的に適切な親子関係)
    this.addEdge('edge-scale-degree', 'concept-scale', 'foundation-degree', 'structure');
    this.addEdge('edge-pitch-enharmonic', 'concept-pitch', 'foundation-enharmonic', 'structure');
    this.addEdge('edge-interval-octave', 'concept-interval', 'foundation-octave', 'structure');
    this.addEdge('edge-key-function', 'concept-key', 'foundation-function', 'structure');
  }

  /**
   * PitchClass エッジを生成
   */
  private generatePitchClassEdges(): void {
    PitchClass.ALL_PITCH_CLASSES.forEach(pc => {
      this.addEdge(
        `edge-concept-pitch-${pc.index}`,
        'concept-pitch',
        `pitch-${pc.index}`,
        'constituent'
      );
    });
  }

  /**
   * Interval エッジを生成
   */
  private generateIntervalEdges(): void {
    const intervals = ['m2', 'M2', 'm3', 'M3', 'P4', 'TT', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8'];

    intervals.forEach(interval => {
      this.addEdge(
        `edge-concept-interval-${interval}`,
        'concept-interval',
        `interval-${interval}`,
        'constituent'
      );
    });
  }

  /**
   * Pattern エッジを生成
   */
  private generatePatternEdges(): void {
    // ScalePattern
    const scalePatternLabels = [
      'major-scale',
      'natural-minor',
      'dorian-mode',
      'phrygian-mode',
      'lydian-mode',
      'mixolydian-mode',
      'locrian-mode',
      'harmonic-minor',
    ];

    scalePatternLabels.forEach((label, index) => {
      this.addEdge(
        `edge-concept-scale-${index}`,
        'concept-scale',
        `pattern-scale-${label}`,
        'structure'
      );
    });

    // ChordPattern
    const chordPatternLabels = [
      'major-triad',
      'minor-triad',
      'diminished',
      'major-7th',
      'dominant-7th',
      'minor-7th',
    ];

    chordPatternLabels.forEach((label, index) => {
      this.addEdge(
        `edge-concept-chord-${index}`,
        'concept-chord',
        `pattern-chord-${label}`,
        'structure'
      );
    });
  }

  /**
   * Key エッジを生成
   */
  private generateKeyEdges(): void {
    // Concept → Key
    PitchClass.ALL_PITCH_CLASSES.forEach(pc => {
      const majorKeyId = `key-major-${pc.index}`;
      const minorKeyId = `key-minor-${pc.index}`;

      this.addEdge(`edge-concept-key-${majorKeyId}`, 'concept-key', majorKeyId, 'structure');
      this.addEdge(`edge-concept-key-${minorKeyId}`, 'concept-key', minorKeyId, 'structure');

      // Key → Tonic PitchClass
      this.addEdge(`edge-${majorKeyId}-tonic`, majorKeyId, `pitch-${pc.index}`, 'constituent');
      this.addEdge(`edge-${minorKeyId}-tonic`, minorKeyId, `pitch-${pc.index}`, 'constituent');
    });
  }

  /**
   * 平行調エッジを生成
   */
  private generateRelativeKeyEdges(): void {
    // C Major (index 0) ⟷ A Minor (index 9)
    PitchClass.ALL_PITCH_CLASSES.forEach(pc => {
      const relativeMinorIndex = (pc.index + 9) % 12;

      this.addEdge(
        `edge-relative-${pc.index}`,
        `key-major-${pc.index}`,
        `key-minor-${relativeMinorIndex}`,
        'relative'
      );
    });
  }
}

/**
 * データセット生成の公開API（後方互換性のため）
 */
export const generateAtlasDataset = (): AtlasDataset => {
  const generator = new AtlasDataGenerator();
  return generator.generate();
};
