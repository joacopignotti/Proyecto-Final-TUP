import { repuestoRepository } from "../repositories/repuestoRepository";
import { createCrudService } from "../utils/crudService";

// CRUD estándar. Las reglas propias de Repuestos (validaciones, relaciones con otras
// entidades) se agregan acá, extendiendo este service (ver utils/crudService.ts).
export const repuestoService = createCrudService(repuestoRepository, "Repuesto");
