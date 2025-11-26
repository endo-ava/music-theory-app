export interface DomainDefinition {
  id: string;
  label: string;
  geometry: {
    type: 'circle' | 'sector';
    innerRadius: number;
    outerRadius: number;
    startAngle?: number; // Degrees, 0 is right (East), counter-clockwise
    endAngle?: number;
  };
  style: {
    baseHue: number; // HSL hue
    gradientId: string;
  };
}

// Base radius unit
const R_BASE = 300;

export const DOMAINS: DomainDefinition[] = [
  {
    id: 'pitch',
    label: 'Pitch Domain',
    geometry: {
      type: 'circle',
      innerRadius: 0,
      outerRadius: R_BASE * 0.8,
    },
    style: {
      baseHue: 200, // Blue
      gradientId: 'domain-pitch',
    },
  },
  {
    id: 'interval',
    label: 'Interval Domain',
    geometry: {
      type: 'circle',
      innerRadius: R_BASE * 0.8,
      outerRadius: R_BASE * 1.5,
    },
    style: {
      baseHue: 120, // Green
      gradientId: 'domain-interval',
    },
  },
  {
    id: 'scale',
    label: 'Scale Domain',
    geometry: {
      type: 'sector',
      innerRadius: R_BASE * 1.5,
      outerRadius: R_BASE * 3.0,
      startAngle: 90,
      endAngle: 270,
    },
    style: {
      baseHue: 80, // Yellow-Green
      gradientId: 'domain-scale',
    },
  },
  {
    id: 'chord-pattern',
    label: 'Chord Pattern Domain',
    geometry: {
      type: 'sector',
      innerRadius: R_BASE * 1.5,
      outerRadius: R_BASE * 3.0,
      startAngle: -90,
      endAngle: 90,
    },
    style: {
      baseHue: 30, // Orange
      gradientId: 'domain-chord-pattern',
    },
  },
  {
    id: 'chord',
    label: 'Chord Domain',
    geometry: {
      type: 'sector',
      innerRadius: R_BASE * 3.0,
      outerRadius: R_BASE * 5.0,
      startAngle: -90,
      endAngle: 90,
    },
    style: {
      baseHue: 0, // Red
      gradientId: 'domain-chord',
    },
  },
  {
    id: 'key',
    label: 'Key Domain',
    geometry: {
      type: 'sector',
      innerRadius: R_BASE * 5.0,
      outerRadius: R_BASE * 7.0,
      startAngle: -60,
      endAngle: 60,
    },
    style: {
      baseHue: 280, // Purple
      gradientId: 'domain-key',
    },
  },
];
