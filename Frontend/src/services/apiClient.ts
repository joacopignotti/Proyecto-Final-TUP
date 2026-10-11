import type { ApiResponse } from '../types/api'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/**
 * Cliente único para hablar con la API. Devuelve el body completo
 * ({ success, message, data, meta }) o lanza ApiError con el mensaje del backend.
 */
export async function request<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<ApiResponse<T>> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
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
