import { clienteRepository } from "../repositories/clienteRepository";
import { createCrudService } from "../utils/crudService";

// CRUD estándar. Las reglas propias de Clientes (validaciones, relaciones con otras
// entidades) se agregan acá, extendiendo este service (ver utils/crudService.ts).
export const clienteService = createCrudService(clienteRepository, "Cliente");
