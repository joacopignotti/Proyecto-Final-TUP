import type { Rol } from '../types/api'

export interface Modulo {
  path: string
  titulo: string
  descripcion: string
  roles: Rol[]
}

/**
 * Módulos del sistema y qué perfiles los usan (según la propuesta técnica).
 * Es la única fuente para el menú, los accesos rápidos y la protección de rutas:
 * para sumar un módulo, se agrega acá y su pantalla en router/paginasModulos.ts.
 */
export const MODULOS: Modulo[] = [
  {
    path: '/clientes',
    titulo: 'Clientes',
    descripcion: 'Registro rápido y ficha con historial de equipos',
    roles: ['recepcionista', 'administrador'],
  },
  {
    path: '/equipos',
    titulo: 'Equipos',
    descripcion: 'Ficha de ingreso: identificador, condición y observaciones',
    roles: ['recepcionista', 'tecnico', 'administrador'],
  },
  {
    path: '/ordenes',
    titulo: 'Órdenes de trabajo',
    descripcion: 'Tablero por estado, diagnóstico y bitácora',
    roles: ['recepcionista', 'tecnico', 'administrador'],
  },
  {
    path: '/presupuestos',
    titulo: 'Presupuestos y repuestos',
    descripcion: 'Mano de obra, catálogo de repuestos y presupuesto al cliente',
    roles: ['tecnico', 'administrador'],
  },
  {
    path: '/reportes',
    titulo: 'Reportes',
    descripcion: 'Facturación, tiempos de entrega y rendimiento por técnico',
    roles: ['administrador'],
  },
  {
    path: '/usuarios',
    titulo: 'Usuarios',
    descripcion: 'Altas, bajas y asignación de perfiles',
    roles: ['administrador'],
  },
]

export const ROL_LABEL: Record<Rol, string> = {
  administrador: 'Administrador',
  recepcionista: 'Recepción',
  tecnico: 'Técnico',
}
