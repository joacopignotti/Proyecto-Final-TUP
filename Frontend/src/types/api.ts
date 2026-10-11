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
