/** Espejo de Backend/src/models/Cliente.ts */
export interface Cliente {
  id: number
  nombre: string
  apellido: string
  dni: string
  telefono: string
  email: string
  activo: boolean
  createdAt: string
}

export type NuevoCliente = Omit<Cliente, 'id' | 'createdAt'>
