import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createCrudService } from './crudService'

interface Item {
  id: number
  nombre: string
}

describe('createCrudService', () => {
  const fetchMock = vi.fn()
  const servicio = createCrudService<Item, Omit<Item, 'id'>>('/items')

  beforeEach(() => vi.stubGlobal('fetch', fetchMock))
  afterEach(() => {
    fetchMock.mockReset()
    vi.unstubAllGlobals()
  })

  const responder = (body: unknown, status = 200) =>
    fetchMock.mockResolvedValue({ ok: status < 400, status, json: async () => body })

  it('listar devuelve items y meta con los parámetros en la URL', async () => {
    const meta = { page: 2, limit: 5, total: 7, totalPages: 2 }
    responder({ success: true, message: 'Items', data: [{ id: 6, nombre: 'F' }], meta })

    const res = await servicio.listar({ page: 2, limit: 5, q: 'f', sortBy: 'id', order: 'desc' })

    expect(fetchMock.mock.calls[0][0]).toBe('/api/v1/items?page=2&limit=5&q=f&sortBy=id&order=desc')
    expect(res.items).toEqual([{ id: 6, nombre: 'F' }])
    expect(res.meta).toEqual(meta)
  })

  it('obtener, crear, actualizar y eliminar usan el método y la ruta correctos', async () => {
    responder({ success: true, message: 'OK', data: { id: 1, nombre: 'A' } })
    await servicio.obtener(1)
    await servicio.crear({ nombre: 'A' })
    await servicio.actualizar(1, { nombre: 'B' })
    await servicio.eliminar(1)

    const llamadas = fetchMock.mock.calls.map(([url, op]) => [op.method, url, op.body])
    expect(llamadas).toEqual([
      ['GET', '/api/v1/items/1', undefined],
      ['POST', '/api/v1/items', JSON.stringify({ nombre: 'A' })],
      ['PATCH', '/api/v1/items/1', JSON.stringify({ nombre: 'B' })],
      ['DELETE', '/api/v1/items/1', undefined],
    ])
  })
})
