import { presupuestoRepository } from "../repositories/presupuestoRepository";
import { createCrudService } from "../utils/crudService";

// CRUD estándar. Las reglas propias de Presupuestos (validaciones, relaciones con otras
// entidades) se agregan acá, extendiendo este service (ver utils/crudService.ts).
export const presupuestoService = createCrudService(presupuestoRepository, "Presupuesto");
