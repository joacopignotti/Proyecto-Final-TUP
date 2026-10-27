import { createCrudService } from './crudService'
import type { Repuesto, NuevoRepuesto } from '../types/repuesto'

// CRUD estándar sobre /api/v1/repuestos. Las llamadas propias de este módulo se
// agregan acá, extendiendo el objeto (ver services/crudService.ts).
export const repuestoService = createCrudService<Repuesto, NuevoRepuesto>('/repuestos')
