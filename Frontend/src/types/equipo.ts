/** Espejo de Backend/src/models/Equipo.ts */
export interface Equipo {
  id: number
  clienteId: number
  tipo: string
  marca: string
  modelo: string
  /** Serie, IMEI, patente… */
  identificador: string
  /** Estado físico al ingreso. */
  condicion: string
  observaciones: string
  createdAt: string
}

export type NuevoEquipo = Omit<Equipo, 'id' | 'createdAt'>
