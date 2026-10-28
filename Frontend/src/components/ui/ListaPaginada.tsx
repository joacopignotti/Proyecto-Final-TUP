import type { ReactNode } from 'react'
import { usePaginatedList, type OpcionesLista } from '../../hooks/usePaginatedList'
import type { Listable } from '../../services/crudService'
import type { Columna } from '../../types/tabla'
import { BotonExportar } from './BotonExportar'
import { DataTable } from './DataTable'
import { PageSizeSelect } from './PageSizeSelect'
import { Pagination } from './Pagination'
import { SearchBox } from './SearchBox'

interface Props<T extends { id: number }> extends OpcionesLista {
  service: Listable<T>
  columnas: Columna<T>[]
  /** Nombre de los registros en plural y minúscula: "clientes". */
  etiqueta: string
  placeholderBusqueda?: string
  /** Se llama al hacer clic en una fila (ej. navegar al detalle). */
  onFilaClick?: (fila: T) => void
  /** Si se indica, aparece el botón "Exportar a Excel" con este nombre de archivo. */
  nombreReporte?: string
  /** Botones propios del módulo (ej. "Nuevo cliente"). */
  acciones?: ReactNode
}

/**
 * Listado completo: buscador, cantidad por página, tabla ordenable, paginado y exportación.
 * Cada módulo solo aporta su service y sus columnas.
 */
export function ListaPaginada<T extends { id: number }>({
  service,
  columnas,
  etiqueta,
  placeholderBusqueda,
  onFilaClick,
  nombreReporte,
  acciones,
  ...opciones
}: Props<T>) {
  const lista = usePaginatedList(service, opciones)

  return (
    <section className="lista">
      <div className="lista__barra">
        <SearchBox
          valor={lista.q}
          onBuscar={lista.buscar}
          etiqueta={`Buscar ${etiqueta}`}
          placeholder={placeholderBusqueda}
        />
        <PageSizeSelect valor={lista.limit} onCambiar={lista.cambiarLimite} />
        <div className="lista__acciones">
          {nombreReporte && (
            <BotonExportar
              service={service}
              columnas={columnas}
              nombreArchivo={nombreReporte}
              consulta={lista.consulta}
            />
          )}
          {acciones}
        </div>
      </div>

      {lista.error && (
        <p className="aviso aviso--error" role="alert">
          {lista.error}
        </p>
      )}

      <DataTable
        columnas={columnas}
        filas={lista.items}
        cargando={lista.cargando}
        sortBy={lista.sortBy}
        order={lista.order}
        onOrdenar={lista.ordenarPor}
        onFilaClick={onFilaClick}
        mensajeVacio={`No se encontraron ${etiqueta}.`}
      />

      {lista.meta && <Pagination meta={lista.meta} etiqueta={etiqueta} onPagina={lista.irAPagina} />}
    </section>
  )
}
