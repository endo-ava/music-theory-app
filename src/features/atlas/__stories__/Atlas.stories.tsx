import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AtlasInteractiveLayout } from '@/components/layouts/AtlasLayout/AtlasInteractiveLayout';
import { AtlasDataset } from '@/features/atlas/types';
import { AtlasCanvasDriver } from './AtlasCanvas.driver';
import { ReactFlowProvider } from '@xyflow/react';

const mockDataset: AtlasDataset = {
  nodes: [
    {
      id: 'root-theory',
      type: 'foundation',
      dataType: 'pitch',
      label: 'Music Theory',
      data: {},
      tags: [],
      x: 0,
      y: 0,
    },
    {
      id: 'harmony',
      parentId: 'root-theory',
      type: 'pattern',
      dataType: 'chord',
      label: 'Harmony',
      data: {},
      tags: [],
      x: 100,
      y: 100,
    },
    {
      id: 'melody',
      parentId: 'root-theory',
      type: 'pattern',
      dataType: 'scale',
      label: 'Melody',
      data: {},
      tags: [],
      x: -100,
      y: 100,
    },
    {
      id: 'major-scale',
      parentId: 'melody',
      type: 'pattern',
      dataType: 'scale',
      label: 'Major Scale',
      data: {},
      tags: [],
      x: -150,
      y: 200,
    },
  ],
  edges: [
    {
      id: 'e1',
      source: 'root-theory',
      target: 'harmony',
      type: 'structure',
    },
    {
      id: 'e2',
      source: 'root-theory',
      target: 'melody',
      type: 'structure',
    },
    {
      id: 'e3',
      source: 'melody',
      target: 'major-scale',
      type: 'constituent',
    },
  ],
};

const meta: Meta<typeof AtlasInteractiveLayout> = {
  title: 'Features/Atlas',
  component: AtlasInteractiveLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    Story => (
      <div style={{ height: '100vh', width: '100%' }}>
        <ReactFlowProvider>
          <Story />
        </ReactFlowProvider>
      </div>
    ),
  ],
  args: {
    dataset: mockDataset,
  },
};

export default meta;
type Story = StoryObj<typeof AtlasInteractiveLayout>;

export const Default: Story = {};

export const Interactive: Story = {
  play: async ({ canvasElement }) => {
    const driver = new AtlasCanvasDriver(canvasElement);

    // Initial State: Root, Harmony, Melody are visible.
    // Major Scale is hidden because Melody (parent) is not expanded?
    // Wait, in useAtlasFlow:
    // root is expanded by default.
    // So Harmony and Melody (children of root) ARE visible.
    // Major Scale (child of Melody) is NOT visible initially unless Melody is expanded?
    // Actually expandedNodeIds starts with ONLY 'root-theory'.
    // So only children of 'root-theory' are visible.
    // So 'major-scale' should be HIDDEN.

    // 1. Verify initial nodes
    await driver.expectNodeVisible('Music Theory'); // root
    await driver.expectNodeVisible('Harmony');
    await driver.expectNodeVisible('Melody');
    await driver.expectNodeNotVisible('Major Scale');

    // 2. Click 'Melody' to expand
    await driver.clickNode('Melody');

    // 3. Verify 'Major Scale' appears
    await driver.expectNodeVisible('Major Scale');

    // 4. Click 'Melody' again to collapse
    await driver.clickNode('Melody');

    // 5. Verify 'Major Scale' disappears
    await driver.expectNodeNotVisible('Major Scale');
  },
};

export const SearchInteraction: Story = {
  play: async ({ canvasElement }) => {
    const driver = new AtlasCanvasDriver(canvasElement);
    await driver.typeSearch('Scale');
    // Currently search functionality is just UI, logic might not be implemented yet.
    // Just verifying we can type.
  },
};
