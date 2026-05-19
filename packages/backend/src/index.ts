import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

app.get('/api/pixels', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT x, y, color, link, owner FROM pixels').all()
    return c.json(results)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

app.post('/api/pixels', async (c) => {
  try {
    const { x, y, color, link, owner } = await c.req.json()

    if (x < 0 || x >= 1000 || y < 0 || y >= 1000) {
      return c.json({ error: 'Invalid coordinates' }, 400)
    }

    await c.env.DB.prepare(
      'INSERT INTO pixels (x, y, color, link, owner) VALUES (?, ?, ?, ?, ?) ' +
      'ON CONFLICT(x, y) DO UPDATE SET color = EXCLUDED.color, link = EXCLUDED.link, owner = EXCLUDED.owner'
    )
    .bind(x, y, color, link, owner)
    .run()

    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

export default app
