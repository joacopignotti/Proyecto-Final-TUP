import { createCrudService } from './crudService'
import type { Presupuesto, NuevoPresupuesto } from '../types/presupuesto'

// CRUD estándar sobre /api/v1/presupuestos. Las llamadas propias de este módulo se
// agregan acá, extendiendo el objeto (ver services/crudService.ts).
export const presupuestoService = createCrudService<Presupuesto, NuevoPresupuesto>('/presupuestos')
