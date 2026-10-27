/** Espejo de Backend/src/models/Presupuesto.ts */
export type EstadoPresupuesto = 'pendiente' | 'aprobado' | 'rechazado'

export interface PresupuestoItem {
  id: number
  repuestoId: number
  cantidad: number
  costoUnitario: number
}

export interface Presupuesto {
  id: number
  /** Uno por orden. */
  ordenId: number
  manoDeObra: number
  items: PresupuestoItem[]
  /** Mano de obra + ítems. */
  total: number
  estado: EstadoPresupuesto
  createdAt: string
}

export type NuevoPresupuesto = Pick<Presupuesto, 'ordenId'> & Partial<Omit<Presupuesto, 'id' | 'ordenId'>>
