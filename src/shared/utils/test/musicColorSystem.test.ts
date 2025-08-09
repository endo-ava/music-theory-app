import { describe, test, expect } from 'vitest';
import { generateMusicColorTheme } from '../musicColorSystem';

describe('musicColorSystem generateMusicColorTheme', () => {
  test('正常ケース: 全84色のCSS変数を正確なHSL値で生成する', () => {
    const result = generateMusicColorTheme();

    // 期待される84色のCSS変数（五度圏順 × モード階層順）
    const expectedColors = [
      // C (Hue: 0°)
      '  --color-key-c-lydian: hsl(0, 85%, 70%);', // 最も明るい
      '  --color-key-c-ionian: hsl(0, 85%, 63%);', // C Major
      '  --color-key-c-mixolydian: hsl(0, 85%, 56%);',
      '  --color-key-c-dorian: hsl(0, 85%, 49%);',
      '  --color-key-c-aeolian: hsl(0, 85%, 42%);', // C Minor
      '  --color-key-c-phrygian: hsl(0, 85%, 35%);',
      '  --color-key-c-locrian: hsl(0, 85%, 28%);', // 最も暗い

      // G (Hue: 30°)
      '  --color-key-g-lydian: hsl(30, 85%, 70%);',
      '  --color-key-g-ionian: hsl(30, 85%, 63%);', // G Major
      '  --color-key-g-mixolydian: hsl(30, 85%, 56%);',
      '  --color-key-g-dorian: hsl(30, 85%, 49%);',
      '  --color-key-g-aeolian: hsl(30, 85%, 42%);', // G Minor
      '  --color-key-g-phrygian: hsl(30, 85%, 35%);',
      '  --color-key-g-locrian: hsl(30, 85%, 28%);',

      // D (Hue: 60°)
      '  --color-key-d-lydian: hsl(60, 85%, 70%);',
      '  --color-key-d-ionian: hsl(60, 85%, 63%);', // D Major
      '  --color-key-d-mixolydian: hsl(60, 85%, 56%);',
      '  --color-key-d-dorian: hsl(60, 85%, 49%);',
      '  --color-key-d-aeolian: hsl(60, 85%, 42%);', // D Minor
      '  --color-key-d-phrygian: hsl(60, 85%, 35%);',
      '  --color-key-d-locrian: hsl(60, 85%, 28%);',

      // A (Hue: 90°)
      '  --color-key-a-lydian: hsl(90, 85%, 70%);',
      '  --color-key-a-ionian: hsl(90, 85%, 63%);', // A Major
      '  --color-key-a-mixolydian: hsl(90, 85%, 56%);',
      '  --color-key-a-dorian: hsl(90, 85%, 49%);',
      '  --color-key-a-aeolian: hsl(90, 85%, 42%);', // A Minor
      '  --color-key-a-phrygian: hsl(90, 85%, 35%);',
      '  --color-key-a-locrian: hsl(90, 85%, 28%);',

      // E (Hue: 120°)
      '  --color-key-e-lydian: hsl(120, 85%, 70%);',
      '  --color-key-e-ionian: hsl(120, 85%, 63%);', // E Major
      '  --color-key-e-mixolydian: hsl(120, 85%, 56%);',
      '  --color-key-e-dorian: hsl(120, 85%, 49%);',
      '  --color-key-e-aeolian: hsl(120, 85%, 42%);', // E Minor
      '  --color-key-e-phrygian: hsl(120, 85%, 35%);',
      '  --color-key-e-locrian: hsl(120, 85%, 28%);',

      // B (Hue: 150°)
      '  --color-key-b-lydian: hsl(150, 85%, 70%);',
      '  --color-key-b-ionian: hsl(150, 85%, 63%);', // B Major
      '  --color-key-b-mixolydian: hsl(150, 85%, 56%);',
      '  --color-key-b-dorian: hsl(150, 85%, 49%);',
      '  --color-key-b-aeolian: hsl(150, 85%, 42%);', // B Minor
      '  --color-key-b-phrygian: hsl(150, 85%, 35%);',
      '  --color-key-b-locrian: hsl(150, 85%, 28%);',

      // F# / Gb (Hue: 180°)
      '  --color-key-fsharp-lydian: hsl(180, 85%, 70%);',
      '  --color-key-fsharp-ionian: hsl(180, 85%, 63%);', // F# Major
      '  --color-key-fsharp-mixolydian: hsl(180, 85%, 56%);',
      '  --color-key-fsharp-dorian: hsl(180, 85%, 49%);',
      '  --color-key-fsharp-aeolian: hsl(180, 85%, 42%);', // F# Minor
      '  --color-key-fsharp-phrygian: hsl(180, 85%, 35%);',
      '  --color-key-fsharp-locrian: hsl(180, 85%, 28%);',

      // C# / Db (Hue: 210°)
      '  --color-key-csharp-lydian: hsl(210, 85%, 70%);',
      '  --color-key-csharp-ionian: hsl(210, 85%, 63%);', // C# Major
      '  --color-key-csharp-mixolydian: hsl(210, 85%, 56%);',
      '  --color-key-csharp-dorian: hsl(210, 85%, 49%);',
      '  --color-key-csharp-aeolian: hsl(210, 85%, 42%);', // C# Minor
      '  --color-key-csharp-phrygian: hsl(210, 85%, 35%);',
      '  --color-key-csharp-locrian: hsl(210, 85%, 28%);',

      // G# / Ab (Hue: 240°)
      '  --color-key-gsharp-lydian: hsl(240, 85%, 70%);',
      '  --color-key-gsharp-ionian: hsl(240, 85%, 63%);', // G# Major
      '  --color-key-gsharp-mixolydian: hsl(240, 85%, 56%);',
      '  --color-key-gsharp-dorian: hsl(240, 85%, 49%);',
      '  --color-key-gsharp-aeolian: hsl(240, 85%, 42%);', // G# Minor
      '  --color-key-gsharp-phrygian: hsl(240, 85%, 35%);',
      '  --color-key-gsharp-locrian: hsl(240, 85%, 28%);',

      // D# / Eb (Hue: 270°)
      '  --color-key-dsharp-lydian: hsl(270, 85%, 70%);',
      '  --color-key-dsharp-ionian: hsl(270, 85%, 63%);', // D# Major
      '  --color-key-dsharp-mixolydian: hsl(270, 85%, 56%);',
      '  --color-key-dsharp-dorian: hsl(270, 85%, 49%);',
      '  --color-key-dsharp-aeolian: hsl(270, 85%, 42%);', // D# Minor
      '  --color-key-dsharp-phrygian: hsl(270, 85%, 35%);',
      '  --color-key-dsharp-locrian: hsl(270, 85%, 28%);',

      // A# / Bb (Hue: 300°)
      '  --color-key-asharp-lydian: hsl(300, 85%, 70%);',
      '  --color-key-asharp-ionian: hsl(300, 85%, 63%);', // A# Major
      '  --color-key-asharp-mixolydian: hsl(300, 85%, 56%);',
      '  --color-key-asharp-dorian: hsl(300, 85%, 49%);',
      '  --color-key-asharp-aeolian: hsl(300, 85%, 42%);', // A# Minor
      '  --color-key-asharp-phrygian: hsl(300, 85%, 35%);',
      '  --color-key-asharp-locrian: hsl(300, 85%, 28%);',

      // F (Hue: 330°)
      '  --color-key-f-lydian: hsl(330, 85%, 70%);',
      '  --color-key-f-ionian: hsl(330, 85%, 63%);', // F Major
      '  --color-key-f-mixolydian: hsl(330, 85%, 56%);',
      '  --color-key-f-dorian: hsl(330, 85%, 49%);',
      '  --color-key-f-aeolian: hsl(330, 85%, 42%);', // F Minor
      '  --color-key-f-phrygian: hsl(330, 85%, 35%);',
      '  --color-key-f-locrian: hsl(330, 85%, 28%);',
    ];

    // 期待値をコメント付きで組み立て
    const expectedTheme = `/* 12音×7モード色相システム */
${expectedColors.join('\n')}`;

    // 生成された結果と期待値を比較
    expect(result).toBe(expectedTheme);
  });

  test('正常ケース: 84個のCSS変数が生成される', () => {
    const result = generateMusicColorTheme();

    // CSS変数の行数をカウント（コメント行除く）
    const colorLines = result.split('\n').filter(line => line.includes('--color-key'));
    expect(colorLines).toHaveLength(84);
  });

  test('正常ケース: 正確なHSL形式でカラー値が出力される', () => {
    const result = generateMusicColorTheme();

    // HSL形式の正規表現パターン
    const hslPattern = /hsl\(\d+, 85%, \d+%\)/g;
    const hslMatches = result.match(hslPattern);

    // 84個のHSL値が存在することを確認
    expect(hslMatches).toHaveLength(84);
  });

  test('正常ケース: 五度圏順の色相進行（30°刻み）が正確に生成される', () => {
    const result = generateMusicColorTheme();

    // 特定の色相値が正しいことを確認
    expect(result).toContain('hsl(0, 85%'); // C = 0°
    expect(result).toContain('hsl(30, 85%'); // G = 30°
    expect(result).toContain('hsl(60, 85%'); // D = 60°
    expect(result).toContain('hsl(90, 85%'); // A = 90°
    expect(result).toContain('hsl(120, 85%'); // E = 120°
    expect(result).toContain('hsl(150, 85%'); // B = 150°
    expect(result).toContain('hsl(180, 85%'); // F# = 180°
    expect(result).toContain('hsl(210, 85%'); // C# = 210°
    expect(result).toContain('hsl(240, 85%'); // G# = 240°
    expect(result).toContain('hsl(270, 85%'); // D# = 270°
    expect(result).toContain('hsl(300, 85%'); // A# = 300°
    expect(result).toContain('hsl(330, 85%'); // F = 330°
  });

  test('正常ケース: モード階層の明度進行（70%→28%）が正確に生成される', () => {
    const result = generateMusicColorTheme();

    // モードごとの明度階層を確認
    expect(result).toContain('70%'); // Lydian（最も明るい）
    expect(result).toContain('63%'); // Ionian（メジャー）
    expect(result).toContain('56%'); // Mixolydian
    expect(result).toContain('49%'); // Dorian
    expect(result).toContain('42%'); // Aeolian（マイナー）
    expect(result).toContain('35%'); // Phrygian
    expect(result).toContain('28%'); // Locrian（最も暗い）
  });
});
