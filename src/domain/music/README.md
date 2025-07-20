# Music ドメイン層

音楽理論アプリケーションの中核となるドメイン層です。音楽理論の知識とビジネスルールを型安全に表現し、音響機能との統合を提供します。

## 📋 目次

- [概要](#概要)
- [アーキテクチャ](#アーキテクチャ)
- [12音表現システム](#12音表現システム)
- [主要コンポーネント](#主要コンポーネント)
- [音響システム](#音響システム)
- [使用例](#使用例)
- [設計思想](#設計思想)
- [トラブルシューティング](#トラブルシューティング)

## 概要

この音楽ドメイン層は、以下の音楽理論概念を型安全に管理します：

- **12音の表現**: 五度圏、半音階、音名、セミトーン数
- **和音理論**: メジャー・マイナートライアド
- **音程**: トライアド構築に必要な基本音程
- **音響**: リアルなピアノサンプルによる音響再生

### DDD における位置づけ

```
Application Layer    ← 音楽理論UIコンポーネント (features/circle-of-fifths)
     ↑
Domain Layer        ← 音楽理論ビジネスロジック (このドメイン)
     ↑
Infrastructure      ← Tone.js音響ライブラリ
```

## アーキテクチャ

```
src/domain/music/
├── entities/           # ドメインエンティティ - 識別子を持つオブジェクト
│   └── Chord.ts       # 和音: ルート音+和音タイプ+構成音
├── value-objects/      # 値オブジェクト - 不変で等価性を持つ
│   ├── ChromaticIndex.ts  # 半音階インデックス (C=0, C#=1, D=2...)
│   ├── Interval.ts    # 音程 (unison, major3rd, minor3rd, perfect5th)
│   ├── KeyName.ts     # キー名 (C, G, Am, Em...)
│   └── Note.ts        # 音符 (音名+オクターブ)
├── services/          # ドメインサービス - 複数オブジェクトにまたがるロジック
│   ├── AudioEngine.ts # 音響エンジン (Tone.js + Salamander Piano)
│   └── ChordBuilder.ts # 和音構築 (FifthsIndex → Chord)
├── utils/             # ユーティリティ - 純粋関数の集合
│   └── MusicTheoryConverter.ts # 12音表現の相互変換
└── types/             # 型定義
    └── FifthsIndex.ts # 五度圏インデックス (C=0, G=1, D=2...)
```

### レイヤー間の依存関係

```
Services ────→ Entities ────→ Value Objects ────→ Types
    ↓              ↓              ↓              ↓
AudioEngine    Chord         Note           FifthsIndex
ChordBuilder                 Interval
               ↓             ChromaticIndex
               Utils ────→   KeyName
               MusicTheoryConverter
```

## 12音表現システム

音楽理論では12音を複数の方法で表現します。このドメインでは4つの表現方法を統一管理しています。

### 1. FifthsIndex (五度圏インデックス)

五度ずつ上行する順序での位置。五度圏図の配置順。

```typescript
type FifthsIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

// 0=C, 1=G, 2=D, 3=A, 4=E, 5=B, 6=F#, 7=C#, 8=G#, 9=D#, 10=A#, 11=F
```

### 2. ChromaticIndex (半音階インデックス)

半音ずつ上行する順序での位置。鍵盤の並び順。

```typescript
type ChromaticIndexValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

// 0=C, 1=C#, 2=D, 3=D#, 4=E, 5=F, 6=F#, 7=G, 8=G#, 9=A, 10=A#, 11=B
```

### 3. NoteName (音名)

音楽的な音名の文字列表現。

```typescript
type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
```

### 4. Semitones (セミトーン数)

音程を表すセミトーン数。

```typescript
type Semitones = number; // 0=unison, 3=minor3rd, 4=major3rd, 7=perfect5th
```

### 相互変換

`MusicTheoryConverter` で全組み合わせの変換が可能：

```typescript
// 五度圏 → 音名
MusicTheoryConverter.fifthsToNoteName(0); // → 'C'
MusicTheoryConverter.fifthsToNoteName(1); // → 'G'

// 音名 → 半音階
MusicTheoryConverter.noteNameToChromatic('C#'); // → 1
MusicTheoryConverter.noteNameToChromatic('G'); // → 7

// 音名の移調
MusicTheoryConverter.transposeNoteName('C', 4); // → 'E' (4セミトーン上)
```

## 主要コンポーネント

### entities/Chord.ts

和音を表現するドメインエンティティ。ルート音、和音タイプ、構成音を管理。

```typescript
// 基本的な使用例
const rootNote = new Note('C', 4);
const chord = Chord.major(rootNote); // Cメジャートライアド

console.log(chord.name); // "C"
console.log(chord.toneNotations); // ["C4", "E4", "G4"]
console.log(chord.notes.length); // 3
```

**主要メソッド:**

- `static major(root: Note): Chord` - メジャートライアド作成
- `static minor(root: Note): Chord` - マイナートライアド作成
- `get name(): string` - 和音名取得
- `get toneNotations(): string[]` - Tone.js用表記

### value-objects/Note.ts

音符（音名+オクターブ）を表現する値オブジェクト。

```typescript
const note = new Note('C#', 4);
console.log(note.toneNotation); // "C#4"
console.log(note.noteName); // "C#"
console.log(note.octave); // 4
```

### value-objects/Interval.ts

トライアド構築に必要な音程を表現。YAGNI原則により4種類のみ実装。

```typescript
const majorThird = Interval.majorThird();
console.log(majorThird.semitones); // 4

const perfectFifth = Interval.perfectFifth();
console.log(perfectFifth.semitones); // 7
```

### value-objects/ChromaticIndex.ts

半音階インデックスと他表現の相互変換を提供。

```typescript
const chromatic = ChromaticIndex.fromNoteName('G');
console.log(chromatic.value); // 7
console.log(chromatic.toFifthsIndex()); // 1
console.log(chromatic.toSemitones()); // 7
```

### services/ChordBuilder.ts

五度圏インデックスから和音を構築するドメインサービス。

```typescript
const builder = new ChordBuilder();

// 五度圏位置1（G）からメジャートライアド
const gMajor = builder.buildMajorTriadFromPosition(1); // G, B, D

// 五度圏位置1（G）からマイナートライアド
const gMinor = builder.buildMinorTriadFromPosition(1); // G, Bb, D
```

### services/AudioEngine.ts

リアルなピアノサンプルによる音響再生。YAGNI原則でシンプル化。

```typescript
// 設定
AudioEngine.setVolume(-5); // 音量調整
AudioEngine.setArpeggioSpeed(150); // アルペジオ速度

// 和音再生
await AudioEngine.playChord(chord); // アルペジオで再生
```

**設定オプション:**

- `volume`: 音量 (dB, デフォルト: -10)
- `arpeggioDelay`: アルペジオ間隔 (ms, デフォルト: 100)
- `release`: ノート長さ (秒, デフォルト: 1.5)

### utils/MusicTheoryConverter.ts

12音の4つの表現方法を相互変換。音楽理論的な変換ロジックを一元管理。

```typescript
// 五度圏 ↔ 音名
MusicTheoryConverter.fifthsToNoteName(1); // 'G'
MusicTheoryConverter.noteNameToFifths('G'); // 1

// 半音階 ↔ 音名
MusicTheoryConverter.chromaticToNoteName(7); // 'G'
MusicTheoryConverter.noteNameToChromatic('G'); // 7

// ユーティリティ
MusicTheoryConverter.getAllNoteNames(); // 全音名配列
MusicTheoryConverter.getFifthsOrderNoteNames(); // 五度圏順音名
MusicTheoryConverter.transposeNoteName('C', 7); // 'G' (C + 7セミトーン)
```

## 音響システム

### Tone.js + Salamander Grand Piano

リアルなピアノ音源による高品質な音響再生を実現。

```typescript
// 音響の初期化（初回アクセス時に自動実行）
await AudioEngine.playChord(chord);
```

### ピッチシフト技術

4つのサンプル音源で2オクターブ範囲をカバー：

- C3, C4, C5, C6 の4サンプル
- ±3-6セミトーンの範囲で高品質ピッチシフト
- 音質劣化を最小限に抑制

### ブラウザ互換性

- **自動再生ポリシー**: ユーザー操作後に初期化
- **非同期読み込み**: サンプル読み込み中のエラーハンドリング
- **メモリ効率**: 必要時のみサンプラー初期化

## 使用例

### 基本的な和音作成・再生

```typescript
import { ChordBuilder, AudioEngine } from '@/domain/music';

const builder = new ChordBuilder();

// 五度圏位置0（C）からCメジャートライアド作成
const cMajor = builder.buildMajorTriadFromPosition(0);
console.log(cMajor.name); // "C"

// 音響再生
await AudioEngine.playChord(cMajor);
```

### 12音の変換

```typescript
import { MusicTheoryConverter } from '@/domain/music';

// 五度圏1番目（G）の情報を取得
const fifthsIndex = 1;
const noteName = MusicTheoryConverter.fifthsToNoteName(fifthsIndex); // 'G'
const chromatic = MusicTheoryConverter.fifthsToChromatic(fifthsIndex); // 7
const semitones = MusicTheoryConverter.fifthsToSemitones(fifthsIndex); // 7

console.log(`五度圏${fifthsIndex}: ${noteName} (半音階${chromatic}, ${semitones}セミトーン)`);
// "五度圏1: G (半音階7, 7セミトーン)"
```

### カスタム和音作成

```typescript
import { Note, Chord } from '@/domain/music';

// 手動で和音作成
const root = new Note('F#', 3);
const fSharpMajor = Chord.major(root);

console.log(fSharpMajor.name); // "F#"
console.log(fSharpMajor.toneNotations); // ["F#3", "A#3", "C#4"]
```

### React フックでの使用

```typescript
// features/circle-of-fifths/hooks/useAudio.ts での実装例
import { useCallback } from 'react';
import { AudioEngine, ChordBuilder, FifthsIndex } from '@/domain';

export const useAudio = () => {
  const chordBuilder = new ChordBuilder();

  const playMajorChordAtPosition = useCallback(
    async (fifthsIndex: FifthsIndex) => {
      try {
        const chord = chordBuilder.buildMajorTriadFromPosition(fifthsIndex);
        await AudioEngine.playChord(chord);
      } catch (error) {
        console.error('Failed to play chord:', error);
      }
    },
    [chordBuilder]
  );

  return { playMajorChordAtPosition };
};
```

## 設計思想

### 1. YAGNI原則の適用

「今必要のない機能は実装しない」原則に従い、シンプルで保守しやすいコードを維持：

- **Chord**: major/minorのみ（7thコードは将来実装）
- **Interval**: トライアド必須の4音程のみ
- **AudioEngine**: 設定可能だが複雑な状態管理は排除

### 2. 音楽理論的正確性

正確な音楽理論に基づく実装：

- 五度圏の正確な音配置
- 半音階と五度圏の正確な対応関係
- トライアドの正確な音程関係（1-3-5度）

### 3. 型安全性の確保

TypeScriptの型システムを活用した堅牢性：

```typescript
// コンパイル時に間違いを検出
type FifthsIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
type NoteName = 'C' | 'C#' | 'D' | ... // 有効な音名のみ
```

### 4. 将来拡張性

現在はシンプルだが、将来の拡張を考慮した設計：

- `ChordType` enumで7thコード追加に対応
- `IntervalType`で新しい音程追加に対応
- `ChromaticIndex`でクロマチックサークル実装に対応

### 5. 単一責任原則

各クラスが明確な責任を持つ：

- `Note`: 音符の表現のみ
- `Chord`: 和音の管理のみ
- `AudioEngine`: 音響再生のみ
- `MusicTheoryConverter`: 変換処理のみ

## トラブルシューティング

### 音響関連

**問題**: 音が鳴らない

```typescript
// 解決策: ブラウザの自動再生ポリシーを確認
// ユーザー操作（クリック等）後に実行する必要あり
document.addEventListener('click', async () => {
  await AudioEngine.playChord(chord);
});
```

**問題**: 音の読み込みが遅い

```typescript
// 解決策: 事前に初期化
await AudioEngine.ensureSampler(); // 内部メソッド（通常は自動）
```

### 型エラー

**問題**: FifthsIndex型エラー

```typescript
// ❌ 間違い
const position = 12; // 範囲外
const chord = builder.buildMajorTriadFromPosition(position);

// ✅ 正しい
const position: FifthsIndex = 0; // 0-11のみ有効
const chord = builder.buildMajorTriadFromPosition(position);
```

**問題**: NoteName型エラー

```typescript
// ❌ 間違い
const note = new Note('H', 4); // ドイツ音名は未対応

// ✅ 正しい
const note = new Note('B', 4); // 英語音名を使用
```

### パフォーマンス

**問題**: 和音変換が遅い

```typescript
// ❌ 毎回新しいbuilderを作成
const builder1 = new ChordBuilder();
const builder2 = new ChordBuilder();

// ✅ 1つのbuilderを再利用
const builder = new ChordBuilder();
const chord1 = builder.buildMajorTriadFromPosition(0);
const chord2 = builder.buildMajorTriadFromPosition(1);
```

### デバッグ

**便利なデバッグ方法:**

```typescript
// 12音の対応表を出力
for (let i = 0; i < 12; i++) {
  const fifthsIndex = i as FifthsIndex;
  const noteName = MusicTheoryConverter.fifthsToNoteName(fifthsIndex);
  const chromatic = MusicTheoryConverter.fifthsToChromatic(fifthsIndex);
  console.log(`五度圏${i}: ${noteName} (半音階${chromatic})`);
}

// 和音の構成音を確認
const chord = builder.buildMajorTriadFromPosition(0);
console.log('和音名:', chord.name);
console.log(
  '構成音:',
  chord.notes.map(n => n.toneNotation)
);
```

---

## 📚 関連ドキュメント

- [音楽理論の技術解説](../../docs/knowledge/technical-solutions/tonejs-sampler-and-pitch-shifting.md)
- [Circle of Fifths コンポーネント設計](../features/circle-of-fifths/README.md)
- [開発規約](../../docs/03.developmentAgreement.md)

---

_このドキュメントは音楽ドメイン層の完全なガイドです。不明な点があれば、各ファイルのJSDocコメントも参照してください。_
