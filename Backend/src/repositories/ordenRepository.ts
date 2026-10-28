import { ordenesMock } from "../mocks/ordenes";
import { Orden } from "../models/Orden";
import { createMemoryRepository } from "../utils/memoryRepository";

/** Hoy: datos mock en memoria. Mañana: la misma interfaz sobre Sequelize. */
export const ordenRepository = createMemoryRepository<Orden>(
  ordenesMock,
  // Campos donde busca el parámetro ?q=
  ["codigo", "estado", "diagnostico", "fallas"]
);
