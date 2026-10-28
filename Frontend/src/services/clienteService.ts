import { createCrudService } from './crudService'
import type { Cliente, NuevoCliente } from '../types/cliente'

// CRUD estándar sobre /api/v1/clientes. Las llamadas propias de este módulo se
// agregan acá, extendiendo el objeto (ver services/crudService.ts).
export const clienteService = createCrudService<Cliente, NuevoCliente>('/clientes')
