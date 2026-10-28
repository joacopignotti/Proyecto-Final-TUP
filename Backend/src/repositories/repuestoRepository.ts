import { repuestosMock } from "../mocks/repuestos";
import { Repuesto } from "../models/Repuesto";
import { createMemoryRepository } from "../utils/memoryRepository";

/** Hoy: datos mock en memoria. Mañana: la misma interfaz sobre Sequelize. */
export const repuestoRepository = createMemoryRepository<Repuesto>(
  repuestosMock,
  // Campos donde busca el parámetro ?q=
  ["codigo", "nombre"]
);
