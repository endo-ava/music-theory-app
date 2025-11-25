import { describe, it, expect } from 'vitest';
import { generateLibraryDataset } from './mockData';

describe('generateLibraryDataset', () => {
  it('should generate a valid library dataset', () => {
    const dataset = generateLibraryDataset();

    // 1. Basic Structure Check
    expect(dataset).toHaveProperty('nodes');
    expect(dataset).toHaveProperty('edges');
    expect(dataset.nodes.length).toBeGreaterThan(0);
    expect(dataset.edges.length).toBeGreaterThan(0);

    // 2. Foundation Nodes Check
    const pitchNodes = dataset.nodes.filter(n => n.dataType === 'pitch');
    expect(pitchNodes.length).toBe(12); // Should have 12 pitch classes

    // 3. Pattern Nodes Check
    const scalePatternNodes = dataset.nodes.filter(
      n => n.type === 'pattern' && n.dataType === 'scale'
    );
    expect(scalePatternNodes.length).toBeGreaterThanOrEqual(3); // Major, Minor, Dorian...

    const chordPatternNodes = dataset.nodes.filter(
      n => n.type === 'pattern' && n.dataType === 'chord'
    );
    expect(chordPatternNodes.length).toBeGreaterThanOrEqual(5); // Triads, 7ths...

    // 4. Context Nodes Check
    const keyNodes = dataset.nodes.filter(n => n.dataType === 'key');
    expect(keyNodes.length).toBe(24); // 12 Major + 12 Minor

    // 5. Instance Nodes Check
    const scaleInstanceNodes = dataset.nodes.filter(
      n => n.type === 'instance' && n.dataType === 'scale'
    );
    expect(scaleInstanceNodes.length).toBeGreaterThanOrEqual(12); // At least 12 Major scales

    // 6. Edge Connections Check
    // Check if every Key node has a connection to a Tonic Pitch
    keyNodes.forEach(keyNode => {
      const tonicEdge = dataset.edges.find(
        e => e.source === keyNode.id && e.target.startsWith('pitch-') && e.type === 'constituent'
      );
      expect(tonicEdge).toBeDefined();
    });

    // Check if Scale Instances are connected to Scale Patterns
    scaleInstanceNodes.forEach(scaleNode => {
      const patternEdge = dataset.edges.find(
        e =>
          e.source === scaleNode.id &&
          e.target.startsWith('pattern-scale-') &&
          e.type === 'structure'
      );
      expect(patternEdge).toBeDefined();
    });

    // 7. ID Uniqueness
    const nodeIds = dataset.nodes.map(n => n.id);
    const uniqueNodeIds = new Set(nodeIds);
    expect(nodeIds.length).toBe(uniqueNodeIds.size);
  });
});
