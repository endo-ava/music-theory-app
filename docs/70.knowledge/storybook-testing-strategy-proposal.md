# Testing Strategy Proposal: Page Object Model & Component Drivers

## 1. 背景と目的

現在、本プロジェクトでは **Storybook** を用いたコンポーネント開発とインタラクションテスト（`play` function）を行っています。
今後、アプリケーションの複雑度が増すにつれて、テストコードの「保守性」と「可読性」が課題になることが予想されます。
本ドキュメントでは、これらの課題を解決するためのデザインパターンとして **Page Object Model (POM)** および **Component Driver** パターンの導入を提案します。

## 2. 現状の課題

`CircleOfFifths.stories.tsx` などの既存テストコードを見ると、以下のような特徴があります：

```typescript
// 現状のコード例
play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // DOM要素を直接取得（実装詳細への依存）
  const circleContainer = canvas.getByRole('img', { name: 'Circle of Fifths' });
  // 低レベルなアサーション
  const pathElements = circleContainer.querySelectorAll('path');
  expect(pathElements.length).toBeGreaterThan(0);
};
```

このアプローチには以下の課題があります：

1.  **実装詳細への依存**: DOM構造（`path`タグや`role`）が変わると、テストが壊れやすい。
2.  **重複コード**: 同じ要素を取得するロジックが複数のストーリーに散在する。
3.  **可読性の低下**: 「何をテストしているか（意図）」よりも「どうやって操作するか（詳細）」が目立つ。

## 3. 提案: Component Driver パターン (Storybook向け)

E2Eテストで一般的な **Page Object Model (POM)** の考え方を、コンポーネントレベルに適用したものを **Component Driver** パターンと呼びます。

### 3.1 概要

コンポーネントの操作（クリック、入力）や状態確認（表示チェック）を、専用のクラスまたは関数にカプセル化します。

### 3.2 実装イメージ

**Driverの定義 (`CircleOfFifths.driver.ts`)**:

```typescript
import { Canvas, within, userEvent, expect } from '@storybook/test';

export class CircleOfFifthsDriver {
  private canvas: Canvas;

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement);
  }

  get container() {
    return this.canvas.getByRole('img', { name: 'Circle of Fifths' });
  }

  async clickKey(keyName: string) {
    // 特定のキーエリアをクリックするロジックを隠蔽
    const keyArea = this.canvas.getByLabelText(`Key: ${keyName}`);
    await userEvent.click(keyArea);
  }

  async expectDiatonicChordsVisible() {
    const romanText = this.canvas.queryByText('Ⅰ');
    await expect(romanText).toBeInTheDocument();
  }
}
```

**ストーリーでの利用**:

```typescript
play: async ({ canvasElement }) => {
  const driver = new CircleOfFifthsDriver(canvasElement);

  // 意図が明確なテストコード
  await driver.expectDiatonicChordsVisible();
  await driver.clickKey('C');
};
```

## 4. 提案: Page Object Model (将来のE2E向け)

将来的に **Playwright** などのE2Eテストを導入する場合、POMは必須のパターンとなります。
Component Driverと考え方は同じですが、スコープが「ページ全体」になります。

### 4.1 推奨ディレクトリ構成

```
src/
  components/
    MyComponent/
      MyComponent.tsx
      __stories__/
        MyComponent.stories.tsx
        MyComponent.driver.ts  <-- Component Driver (Storybook用)
  test/
    e2e/
      pages/
        HubPage.ts             <-- Page Object (Playwright用)
```

## 5. 導入のメリット・デメリット

| 項目         | メリット                                               | デメリット                                                             |
| :----------- | :----------------------------------------------------- | :--------------------------------------------------------------------- |
| **保守性**   | UI変更時の修正箇所がDriver/PageObjectに集約される      | 初期実装の手間が増える（クラス作成など）                               |
| **可読性**   | テストコードが自然言語に近くなり、仕様として読みやすい | 抽象化層が増えるため、構造の理解が必要                                 |
| **再利用性** | 複数のテストケースで操作ロジックを共有できる           | シンプルなコンポーネントにはオーバーエンジニアリングになる可能性がある |

## 6. 結論と推奨アクション

### 結論

**「複雑なインタラクションを持つコンポーネント」から段階的に Component Driver パターンを導入することを推奨します。**

### 推奨アクション

1.  **Component Driverの導入**:
    - `CircleOfFifths` や `KeyController` など、ロジックが複雑なコンポーネントのストーリーに対して、試験的にDriverを作成する。
    - 単純な表示だけのコンポーネント（Buttonなど）には導入不要。
2.  **Playwright導入時のPOM採用**:
    - E2Eテスト開始時には、最初からPOM構成を採用する。

この戦略により、テストコードの品質を維持しつつ、過度な抽象化による開発スピード低下を防ぐことができます。
