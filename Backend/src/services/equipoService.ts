import { equipoRepository } from "../repositories/equipoRepository";
import { createCrudService } from "../utils/crudService";

// CRUD estándar. Las reglas propias de Equipos (validaciones, relaciones con otras
// entidades) se agregan acá, extendiendo este service (ver utils/crudService.ts).
export const equipoService = createCrudService(equipoRepository, "Equipo");
