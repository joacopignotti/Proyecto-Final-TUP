/** Espejo de Backend/src/models/Repuesto.ts */
export interface Repuesto {
  id: number
  codigo: string
  nombre: string
  /** Costo unitario. */
  costo: number
  stock: number
  activo: boolean
}

export type NuevoRepuesto = Omit<Repuesto, 'id'>
