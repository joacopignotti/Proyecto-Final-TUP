import { createCrudService } from './crudService'
import type { Orden, NuevaOrden } from '../types/orden'

// CRUD estándar sobre /api/v1/ordenes. Las llamadas propias de este módulo se
// agregan acá, extendiendo el objeto (ver services/crudService.ts).
export const ordenService = createCrudService<Orden, NuevaOrden>('/ordenes')
