import type { Meta, StoryObj } from '@storybook/react';
import { CircleOfFifths } from '../components/CircleOfFifths';

const meta: Meta<typeof CircleOfFifths> = {
  title: 'Components/CircleOfFifths',
  component: CircleOfFifths,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'app-bg',
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="p-8 min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
};
