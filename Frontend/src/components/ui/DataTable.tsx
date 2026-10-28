import type { Columna } from '../../types/tabla'

interface Props<T extends { id: number }> {
  columnas: Columna<T>[]
  filas: T[]
  cargando?: boolean
  sortBy?: string
  order?: 'asc' | 'desc'
  onOrdenar?: (clave: string) => void
  /** Si se pasa, cada fila es clickeable (por ejemplo, para abrir el detalle). */
  onFilaClick?: (fila: T) => void
  mensajeVacio?: string
}

export function DataTable<T extends { id: number }>({
  columnas,
  filas,
  cargando = false,
  sortBy,
  order,
  onOrdenar,
  onFilaClick,
  mensajeVacio = 'No hay registros para mostrar.',
}: Props<T>) {
  return (
    <div className={cargando ? 'tabla tabla--cargando' : 'tabla'} aria-busy={cargando}>
      <table>
        <thead>
          <tr>
            {columnas.map((col) => {
              const activa = sortBy === col.clave
              const ordenable = Boolean(col.ordenable && onOrdenar)
              return (
                <th
                  key={col.clave}
                  aria-sort={activa ? (order === 'desc' ? 'descending' : 'ascending') : undefined}
                >
                  {ordenable ? (
                    <button type="button" className="tabla__orden" onClick={() => onOrdenar?.(col.clave)}>
                      {col.titulo}
                      <span aria-hidden="true">{activa ? (order === 'desc' ? ' ▼' : ' ▲') : ' ↕'}</span>
                    </button>
                  ) : (
                    col.titulo
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {filas.length === 0 ? (
            <tr>
              <td colSpan={columnas.length} className="tabla__vacia">
                {cargando ? 'Cargando…' : mensajeVacio}
              </td>
            </tr>
          ) : (
            filas.map((fila) => (
              <tr
                key={fila.id}
                className={onFilaClick ? 'tabla__fila--click' : undefined}
                tabIndex={onFilaClick ? 0 : undefined}
                onClick={onFilaClick ? () => onFilaClick(fila) : undefined}
                onKeyDown={
                  onFilaClick
                    ? (e) => {
                        if (e.key === 'Enter') onFilaClick(fila)
                      }
                    : undefined
                }
              >
                {columnas.map((col) => (
                  <td key={col.clave}>
                    {col.render ? col.render(fila) : String((fila as Record<string, unknown>)[col.clave] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
