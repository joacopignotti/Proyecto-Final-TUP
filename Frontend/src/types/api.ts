/** Espejo de las respuestas del backend (Backend/src/utils/apiResponse.ts). */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T | null
  meta?: PaginationMeta
}

/** Parámetros de los listados: paginado, orden, búsqueda y filtros por campo. */
export interface ListParams {
  page?: number
  limit?: number
  sortBy?: string
  order?: 'asc' | 'desc'
  q?: string
  [filtro: string]: string | number | boolean | undefined
}

export type Rol = 'administrador' | 'recepcionista' | 'tecnico'

export interface Usuario {
  id: number
  nombre: string
  apellido: string
  email: string
  rol: Rol
  activo: boolean
}

export interface LoginResult {
  token: string
  usuario: Usuario
}
