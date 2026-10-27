import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, TOKEN_KEY, buildQuery, request } from './apiClient'

describe('buildQuery', () => {
  it('arma la query y omite valores vacíos', () => {
    expect(buildQuery({ page: 2, q: 'ana', sortBy: undefined, estado: '', activo: false })).toBe(
      '?page=2&q=ana&activo=false',
    )
  })

  it('devuelve texto vacío si no hay parámetros', () => {
    expect(buildQuery()).toBe('')
    expect(buildQuery({ q: '' })).toBe('')
  })
})

describe('request', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    localStorage.clear()
  })

  afterEach(() => {
    fetchMock.mockReset()
    vi.unstubAllGlobals()
  })

  const respuesta = (status: number, body: unknown) => ({ ok: status < 400, status, json: async () => body })

  it('agrega los parámetros a la URL y el token de la sesión', async () => {
    localStorage.setItem(TOKEN_KEY, 'mock-token-1')
    fetchMock.mockResolvedValue(respuesta(200, { success: true, message: 'OK', data: [] }))

    await request('/clientes', { query: { page: 1, limit: 10 } })

    const [url, opciones] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/v1/clientes?page=1&limit=10')
    expect(opciones.headers.Authorization).toBe('Bearer mock-token-1')
  })

  it('lanza ApiError con el mensaje del backend', async () => {
    fetchMock.mockResolvedValue(respuesta(404, { success: false, message: 'Cliente no encontrado', data: null }))

    await expect(request('/clientes/99')).rejects.toMatchObject({
      status: 404,
      message: 'Cliente no encontrado',
    })
    await expect(request('/clientes/99')).rejects.toBeInstanceOf(ApiError)
  })

  it('informa cuando no hay conexión', async () => {
    fetchMock.mockRejectedValue(new TypeError('fail'))
    await expect(request('/health')).rejects.toMatchObject({ status: 0 })
  })
})
