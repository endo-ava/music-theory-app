import type { Meta, StoryObj } from '@storybook/react';
import { CircleOfFifths } from './CircleOfFifths';

const meta: Meta<typeof CircleOfFifths> = {
  title: 'Components/CircleOfFifths',
  component: CircleOfFifths,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
