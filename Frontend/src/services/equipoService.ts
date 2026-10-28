import { createCrudService } from './crudService'
import type { Equipo, NuevoEquipo } from '../types/equipo'

// CRUD estándar sobre /api/v1/equipos. Las llamadas propias de este módulo se
// agregan acá, extendiendo el objeto (ver services/crudService.ts).
export const equipoService = createCrudService<Equipo, NuevoEquipo>('/equipos')
