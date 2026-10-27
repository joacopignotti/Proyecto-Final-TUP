import { clientesMock } from "../mocks/clientes";
import { Cliente } from "../models/Cliente";
import { createMemoryRepository } from "../utils/memoryRepository";

/** Hoy: datos mock en memoria. Mañana: la misma interfaz sobre Sequelize. */
export const clienteRepository = createMemoryRepository<Cliente>(
  clientesMock,
  // Campos donde busca el parámetro ?q=
  ["nombre", "apellido", "dni", "telefono", "email"]
);
