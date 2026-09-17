import { describe, expect, it } from 'vitest'

import { extractErrorMessage } from './errors'

describe('extractErrorMessage', () => {
  it('extracts the first array error message from a DRF-style response', () => {
    const err = { response: { data: { identifier: ['ข้อมูลเข้าสู่ระบบไม่ถูกต้อง'] } } }
    expect(extractErrorMessage(err)).toBe('ข้อมูลเข้าสู่ระบบไม่ถูกต้อง')
  })

  it('extracts a plain string error message', () => {
    const err = { response: { data: { detail: 'บัญชีนี้ถูกระงับการใช้งาน' } } }
    expect(extractErrorMessage(err)).toBe('บัญชีนี้ถูกระงับการใช้งาน')
  })

  it('returns null when the shape does not match', () => {
    expect(extractErrorMessage(new Error('network error'))).toBeNull()
    expect(extractErrorMessage(null)).toBeNull()
  })
})
