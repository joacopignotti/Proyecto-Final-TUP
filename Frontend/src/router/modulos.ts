import type { Rol } from '../types/api'

export interface Modulo {
  path: string
  titulo: string
  descripcion: string
  roles: Rol[]
}

export const MODULOS: Modulo[] = [
  {
    path: '/clientes',
    titulo: 'Clientes',
    descripcion: 'Registro y consulta de clientes',
    roles: ['administrador'],
  },
  {
    path: '/equipos',
    titulo: 'Equipos',
    descripcion: 'Registro y consulta de equipos',
    roles: ['tecnico', 'administrador'],
  },
  {
    path: '/ordenes',
    titulo: 'Órdenes de trabajo',
    descripcion: 'Diagnósticos, reparaciones y bitácora',
    roles: ['tecnico', 'administrador'],
  },
  {
    path: '/presupuestos',
    titulo: 'Presupuestos y repuestos',
    descripcion: 'Presupuestos, mano de obra e inventario',
    roles: ['tecnico', 'administrador'],
  },
  {
    path: '/reportes',
    titulo: 'Reportes',
    descripcion: 'Facturación, tiempos y rendimiento',
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
  tecnico: 'Técnico',
}
