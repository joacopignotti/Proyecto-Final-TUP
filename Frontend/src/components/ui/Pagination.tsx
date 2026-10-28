import type { PaginationMeta } from '../../types/api'

interface Props {
  meta: PaginationMeta
  /** Cómo se llaman los registros, para el resumen: "clientes". */
  etiqueta?: string
  onPagina: (pagina: number) => void
}

export function Pagination({ meta, etiqueta = 'registros', onPagina }: Props) {
  const desde = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1
  const hasta = Math.min(meta.page * meta.limit, meta.total)

  return (
    <nav className="paginado" aria-label="Paginado">
      <span>
        {desde}–{hasta} de {meta.total} {etiqueta}
      </span>
      <span className="paginado__botones">
        <button
          type="button"
          className="btn btn--secundario"
          disabled={meta.page <= 1}
          onClick={() => onPagina(meta.page - 1)}
        >
          Anterior
        </button>
        <span className="paginado__pagina">
          Página {meta.page} de {meta.totalPages}
        </span>
        <button
          type="button"
          className="btn btn--secundario"
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPagina(meta.page + 1)}
        >
          Siguiente
        </button>
      </span>
    </nav>
  )
}
