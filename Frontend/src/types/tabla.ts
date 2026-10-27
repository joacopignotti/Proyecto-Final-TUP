import type { ReactNode } from 'react'

/** Columna de un listado. La usan DataTable (pantalla) y el reporte exportable. */
export interface Columna<T> {
  /** Campo de la API. También es el valor de `sortBy` si la columna es ordenable. */
  clave: string
  titulo: string
  /** Cómo se muestra en la tabla. Si falta, se muestra `fila[clave]`. */
  render?: (fila: T) => ReactNode
  /** Valor que se escribe en el reporte. Si falta, se usa `fila[clave]`. */
  exportar?: (fila: T) => string | number | boolean | null
  ordenable?: boolean
}
