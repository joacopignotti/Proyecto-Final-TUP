import type { ComponentType } from 'react'
import ClientesRoutes from '../pages/clientes/ClientesRoutes'
import EquiposRoutes from '../pages/equipos/EquiposRoutes'
import OrdenesRoutes from '../pages/ordenes/OrdenesRoutes'
import PresupuestosRoutes from '../pages/presupuestos/PresupuestosRoutes'

/**
 * Pantalla de cada módulo, por path de MODULOS. Cada una resuelve sus propias
 * subrutas (lista, nuevo, :id). Los módulos que no están acá muestran EnConstruccion.
 */
export const PAGINAS_MODULO: Record<string, ComponentType> = {
  '/clientes': ClientesRoutes,
  '/equipos': EquiposRoutes,
  '/ordenes': OrdenesRoutes,
  '/presupuestos': PresupuestosRoutes,
}
