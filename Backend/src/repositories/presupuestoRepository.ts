import { presupuestosMock } from "../mocks/presupuestos";
import { Presupuesto } from "../models/Presupuesto";
import { createMemoryRepository } from "../utils/memoryRepository";

/** Hoy: datos mock en memoria. Mañana: la misma interfaz sobre Sequelize. */
export const presupuestoRepository = createMemoryRepository<Presupuesto>(
  presupuestosMock,
  // Campos donde busca el parámetro ?q=
  ["estado"]
);
