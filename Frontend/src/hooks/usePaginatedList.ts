import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Listable } from '../services/crudService'
import type { ListParams, PaginationMeta } from '../types/api'

type Orden = 'asc' | 'desc'

export interface OpcionesLista {
  limiteInicial?: number
  ordenInicial?: { sortBy: string; order: Orden }
  /** Filtros exactos por campo (ej. { estado: 'recibido' }). Al cambiar, vuelve a la página 1. */
  filtros?: Record<string, string | number | boolean | undefined>
}

interface Resultado<T> {
  clave: string
  items: T[]
  meta: PaginationMeta | null
  error: string
}

/**
 * Estado de un listado paginado: página, cantidad por página, búsqueda, orden y filtros.
 * Pide los datos al service cada vez que algo cambia. `service` debe ser estable
 * (un módulo como clienteService, no un objeto creado en cada render).
 */
export function usePaginatedList<T>(service: Listable<T>, opciones: OpcionesLista = {}) {
  const { limiteInicial = 10, ordenInicial } = opciones
  const filtrosKey = JSON.stringify(opciones.filtros ?? {})

  const [pagina, setPagina] = useState({ numero: 1, filtrosKey })
  const [limit, setLimit] = useState(limiteInicial)
  const [q, setQ] = useState('')
  const [orden, setOrden] = useState<{ sortBy?: string; order: Orden }>(ordenInicial ?? { order: 'asc' })
  const [recarga, setRecarga] = useState(0)
  const [resultado, setResultado] = useState<Resultado<T>>({ clave: '', items: [], meta: null, error: '' })

  // Si cambian los filtros, se vuelve a la primera página.
  if (pagina.filtrosKey !== filtrosKey) setPagina({ numero: 1, filtrosKey })

  const consulta = useMemo<ListParams>(
    () => ({
      ...(JSON.parse(filtrosKey) as ListParams),
      page: pagina.numero,
      limit,
      q: q || undefined,
      sortBy: orden.sortBy,
      order: orden.order,
    }),
    [filtrosKey, pagina.numero, limit, q, orden],
  )

  const clave = JSON.stringify([consulta, recarga])

  useEffect(() => {
    let vigente = true
    service
      .listar(consulta)
      .then((res) => {
        if (vigente) setResultado({ clave, items: res.items, meta: res.meta, error: '' })
      })
      .catch((err: unknown) => {
        if (vigente) {
          const error = err instanceof Error ? err.message : 'No se pudo cargar el listado'
          setResultado({ clave, items: [], meta: null, error })
        }
      })
    return () => {
      vigente = false
    }
  }, [service, consulta, clave])

  const irAPagina = useCallback((numero: number) => setPagina((p) => ({ ...p, numero })), [])

  const cambiarLimite = useCallback((nuevo: number) => {
    setLimit(nuevo)
    setPagina((p) => ({ ...p, numero: 1 }))
  }, [])

  const buscar = useCallback((texto: string) => {
    setQ(texto.trim())
    setPagina((p) => ({ ...p, numero: 1 }))
  }, [])

  /** Primer clic: orden ascendente por el campo; siguiente clic: descendente. */
  const ordenarPor = useCallback((campo: string) => {
    setOrden((actual) =>
      actual.sortBy === campo ? { sortBy: campo, order: actual.order === 'asc' ? 'desc' : 'asc' } : { sortBy: campo, order: 'asc' },
    )
    setPagina((p) => ({ ...p, numero: 1 }))
  }, [])

  const recargar = useCallback(() => setRecarga((n) => n + 1), [])

  return {
    items: resultado.items,
    meta: resultado.meta,
    error: resultado.error,
    cargando: resultado.clave !== clave,
    /** Parámetros con los que se pidió el listado (sirve para exportar lo mismo que se ve). */
    consulta,
    page: pagina.numero,
    limit,
    q,
    sortBy: orden.sortBy,
    order: orden.order,
    irAPagina,
    cambiarLimite,
    buscar,
    ordenarPor,
    recargar,
  }
}
