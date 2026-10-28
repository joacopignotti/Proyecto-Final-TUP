import { useState } from 'react'
import type { Listable } from '../../services/crudService'
import { descargarXlsx } from '../../services/exportService'
import type { ListParams } from '../../types/api'
import type { Columna } from '../../types/tabla'

interface Props<T> {
  service: Listable<T>
  columnas: Columna<T>[]
  /** Nombre del archivo sin extensión: "reporte-clientes". */
  nombreArchivo: string
  /** Búsqueda y filtros vigentes: el reporte trae lo mismo que se está viendo. */
  consulta?: ListParams
}

/** Exporta a Excel (.xlsx) todos los registros que coinciden con la búsqueda actual (hasta 100). */
export function BotonExportar<T>({ service, columnas, nombreArchivo, consulta }: Props<T>) {
  const [exportando, setExportando] = useState(false)
  const [error, setError] = useState('')

  const exportar = async () => {
    setExportando(true)
    setError('')
    try {
      const { items } = await service.listar({ ...consulta, page: 1, limit: 100 })
      await descargarXlsx(nombreArchivo, columnas, items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo generar el reporte')
    } finally {
      setExportando(false)
    }
  }

  return (
    <>
      <button type="button" className="btn btn--secundario" disabled={exportando} onClick={exportar}>
        {exportando ? 'Generando…' : 'Exportar a Excel'}
      </button>
      {error && (
        <span className="aviso aviso--error" role="alert">
          {error}
        </span>
      )}
    </>
  )
}
