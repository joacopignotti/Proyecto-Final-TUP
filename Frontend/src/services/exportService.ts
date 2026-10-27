import writeXlsxFile from 'write-excel-file/universal'
import type { Columna } from '../types/tabla'

type Celda = string | number | boolean | null

const valorCelda = <T>(columna: Columna<T>, fila: T): Celda => {
  if (columna.exportar) return columna.exportar(fila)
  const valor = (fila as Record<string, unknown>)[columna.clave]
  if (valor === undefined || valor === null) return null
  if (typeof valor === 'string' || typeof valor === 'number' || typeof valor === 'boolean') return valor
  return JSON.stringify(valor)
}

/** Descarga un .xlsx con una fila por registro y una columna por `Columna`. */
export async function descargarXlsx<T>(
  nombreArchivo: string,
  columnas: Columna<T>[],
  filas: T[],
): Promise<void> {
  const encabezado = columnas.map((c) => ({ value: c.titulo, fontWeight: 'bold' as const }))
  const datos = filas.map((fila) => columnas.map((c) => valorCelda(c, fila)))
  const blob = await writeXlsxFile([encabezado, ...datos]).toBlob()

  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombreArchivo.endsWith('.xlsx') ? nombreArchivo : `${nombreArchivo}.xlsx`
  enlace.click()
  URL.revokeObjectURL(url)
}
