import { equiposMock } from "../mocks/equipos";
import { Equipo } from "../models/Equipo";
import { createMemoryRepository } from "../utils/memoryRepository";

/** Hoy: datos mock en memoria. Mañana: la misma interfaz sobre Sequelize. */
export const equipoRepository = createMemoryRepository<Equipo>(
  equiposMock,
  // Campos donde busca el parámetro ?q=
  ["tipo", "marca", "modelo", "identificador"]
);
