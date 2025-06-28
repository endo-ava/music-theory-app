import { describe, it, expect } from 'vitest'
import { calculateAngle } from './index'

describe('utils関数の基本動作確認', () => {
  it('calculateAngle関数が正常に動作する', () => {
    // セットアップ確認用の最低限のテスト
    const angle = calculateAngle(0)
    expect(typeof angle).toBe('number')
    expect(angle).toBeDefined()
  })
})