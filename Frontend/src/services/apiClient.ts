import type { ApiResponse } from '../types/api'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

/** Clave de localStorage donde se guarda el token de la sesión (lo escribe AuthProvider). */
export const TOKEN_KEY = 'taller.token'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

type QueryValue = string | number | boolean | undefined | null

/** Arma "?page=1&q=ana" ignorando valores vacíos. */
export function buildQuery(query?: Record<string, QueryValue>): string {
  const params = new URLSearchParams()
  for (const [clave, valor] of Object.entries(query ?? {})) {
    if (valor !== undefined && valor !== null && valor !== '') params.set(clave, String(valor))
  }
  const texto = params.toString()
  return texto ? `?${texto}` : ''
}

const leerToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

/**
 * Cliente único para hablar con la API. Devuelve el body completo
 * ({ success, message, data, meta }) o lanza ApiError con el mensaje del backend.
 * Agrega el token de la sesión (si hay) y los parámetros de `query` a la URL.
 */
export async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; query?: Record<string, QueryValue> } = {},
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {}
  if (options.body) headers['Content-Type'] = 'application/json'
  const token = leerToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}${buildQuery(options.query)}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor')
  }

  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null
  if (!res.ok || !json?.success) {
    throw new ApiError(res.status, json?.message ?? 'Error inesperado')
  }
  return json
}
