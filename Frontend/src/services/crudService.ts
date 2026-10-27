import type { ListParams, PaginationMeta } from '../types/api'
import { request } from './apiClient'

export interface ListResult<T> {
  items: T[]
  meta: PaginationMeta
}

/** Lo mínimo que necesita un listado (hook, tabla y reporte). */
export interface Listable<T> {
  listar: (params?: ListParams) => Promise<ListResult<T>>
}

export interface CrudService<T extends { id: number }, TInput = Omit<T, 'id'>> extends Listable<T> {
  obtener: (id: number | string) => Promise<T>
  crear: (datos: TInput) => Promise<T>
  actualizar: (id: number | string, datos: Partial<TInput>) => Promise<T>
  eliminar: (id: number | string) => Promise<void>
}

const SIN_RESULTADOS: PaginationMeta = { page: 1, limit: 10, total: 0, totalPages: 1 }

/**
 * Service estándar de una entidad sobre /api/v1/<recurso>. Las pantallas lo usan
 * en lugar de llamar a fetch, y se puede extender con llamadas propias:
 *
 *   export const clienteService = createCrudService<Cliente, NuevoCliente>('/clientes')
 */
export function createCrudService<T extends { id: number }, TInput = Omit<T, 'id'>>(
  recurso: string,
): CrudService<T, TInput> {
  return {
    listar: async (params = {}) => {
      const res = await request<T[]>(recurso, { query: params })
      return { items: res.data ?? [], meta: res.meta ?? SIN_RESULTADOS }
    },
    obtener: async (id) => (await request<T>(`${recurso}/${id}`)).data!,
    crear: async (datos) => (await request<T>(recurso, { method: 'POST', body: datos })).data!,
    actualizar: async (id, datos) =>
      (await request<T>(`${recurso}/${id}`, { method: 'PATCH', body: datos })).data!,
    eliminar: async (id) => {
      await request<null>(`${recurso}/${id}`, { method: 'DELETE' })
    },
  }
}
