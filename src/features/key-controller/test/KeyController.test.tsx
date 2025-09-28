import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { KeyController } from '../components/KeyController';
import { PitchClass } from '@/domain/common';
import { Key } from '@/domain/key';

// Mock the store
const mockSetCurrentKey = vi.fn();
const mockCurrentKey = Key.major(PitchClass.C); // C Major

vi.mock('@/stores/currentKeyStore', () => ({
  useCurrentKeyStore: vi.fn(() => ({
    currentKey: mockCurrentKey,
    setCurrentKey: mockSetCurrentKey,
  })),
}));

describe('KeyController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本レンダリング', () => {
    it('正常ケース: コンポーネントが正しくレンダリングされる', () => {
      render(<KeyController />);

      // タイトルが表示される
      expect(screen.getByText('Key')).toBeInTheDocument();
      expect(screen.getByText('Tonic')).toBeInTheDocument();

      // 12個のトニックボタンが表示される
      PitchClass.ALL_PITCH_CLASSES.forEach(pitchClass => {
        expect(
          screen.getByLabelText(`Select ${pitchClass.sharpName} major key`)
        ).toBeInTheDocument();
        expect(screen.getByText(pitchClass.sharpName)).toBeInTheDocument();
      });

      // 現在のキー表示
      expect(screen.getByText(/Current:/)).toBeInTheDocument();
    });

    it('正常ケース: カスタムタイトルが設定される', () => {
      render(<KeyController title="Custom Key" />);
      expect(screen.getByText('Custom Key')).toBeInTheDocument();
    });

    it('正常ケース: className が適用される', () => {
      const { container } = render(<KeyController className="test-class" />);
      expect(container.firstChild).toHaveClass('test-class');
    });
  });

  describe('選択状態の表示', () => {
    it('正常ケース: 現在のキーに対応するボタンが選択状態になる', () => {
      render(<KeyController />);

      const cButton = screen.getByLabelText('Select C major key');
      expect(cButton).toHaveAttribute('aria-pressed', 'true');

      // 他のボタンは選択されていない
      const gButton = screen.getByLabelText('Select G major key');
      expect(gButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('正常ケース: 現在のキー名が表示される', () => {
      render(<KeyController />);
      expect(screen.getByText('C Major')).toBeInTheDocument();
    });
  });

  describe('ボタンクリック動作', () => {
    it('正常ケース: トニックボタンクリックでキーが変更される', () => {
      render(<KeyController />);

      const gButton = screen.getByLabelText('Select G major key');
      fireEvent.click(gButton);

      expect(mockSetCurrentKey).toHaveBeenCalledTimes(1);
      const calledKey = mockSetCurrentKey.mock.calls[0][0];
      expect(calledKey.centerPitch.sharpName).toBe('G');
      expect(calledKey.isMajor).toBe(true);
    });

    it('正常ケース: 全てのトニックボタンが機能する', () => {
      render(<KeyController />);

      PitchClass.ALL_PITCH_CLASSES.forEach(pitchClass => {
        mockSetCurrentKey.mockClear();

        const button = screen.getByLabelText(`Select ${pitchClass.sharpName} major key`);
        fireEvent.click(button);

        expect(mockSetCurrentKey).toHaveBeenCalledTimes(1);
        const calledKey = mockSetCurrentKey.mock.calls[0][0];
        expect(calledKey.centerPitch.sharpName).toBe(pitchClass.sharpName);
        expect(calledKey.isMajor).toBe(true);
      });
    });

    it('正常ケース: 同じボタンを再度クリックしても動作する', () => {
      render(<KeyController />);

      const cButton = screen.getByLabelText('Select C major key');
      fireEvent.click(cButton);
      fireEvent.click(cButton);

      expect(mockSetCurrentKey).toHaveBeenCalledTimes(2);
    });
  });

  describe('アクセシビリティ', () => {
    it('正常ケース: 全てのボタンに適切なaria-labelが設定される', () => {
      render(<KeyController />);

      PitchClass.ALL_PITCH_CLASSES.forEach(pitchClass => {
        const button = screen.getByLabelText(`Select ${pitchClass.sharpName} major key`);
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-pressed');
      });
    });

    it('正常ケース: ボタンにキーボードフォーカスが可能', () => {
      render(<KeyController />);

      const cButton = screen.getByLabelText('Select C major key');
      cButton.focus();
      expect(document.activeElement).toBe(cButton);
    });
  });

  describe('レスポンシブデザイン', () => {
    it('正常ケース: グリッドレイアウトのクラスが適用される', () => {
      render(<KeyController />);

      const buttonContainer = screen.getByLabelText('Select C major key').parentElement;
      expect(buttonContainer).toHaveClass('grid', 'grid-cols-6', 'sm:grid-cols-12');
    });

    it('正常ケース: タイトルがレスポンシブ表示クラスを持つ', () => {
      render(<KeyController />);

      const title = screen.getByText('Key');
      expect(title).toHaveClass('hidden', 'md:block');
    });
  });
});
