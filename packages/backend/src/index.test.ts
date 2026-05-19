import { describe, it, expect, vi } from 'vitest'
import app from './index'

describe('Million Pixel Billboard API', () => {
  it('should return empty list of pixels when DB is empty', async () => {
    const mockDb = {
      prepare: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue({ results: [] })
    }
    const res = await app.request('/api/pixels', {}, { DB: mockDb as any })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
  })

  it('should allow posting a pixel', async () => {
    const mockDb = {
      prepare: vi.fn().mockReturnThis(),
      bind: vi.fn().mockReturnThis(),
      run: vi.fn().mockResolvedValue({ success: true })
    }
    const res = await app.request(
      '/api/pixels',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x: 10, y: 20, color: '#FF0000', link: 'https://example.com', owner: 'test' })
      },
      { DB: mockDb as any }
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO pixels'))
    expect(mockDb.bind).toHaveBeenCalledWith(10, 20, '#FF0000', 'https://example.com', 'test')
  })

  it('should return error for invalid coordinates', async () => {
     const res = await app.request(
      '/api/pixels',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x: 1000, y: 20, color: '#FF0000' })
      },
      { DB: {} as any }
    )
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Invalid coordinates' })
  })
})
