import { usuariosMock } from "../mocks/usuarios";
import { Usuario } from "../models/Usuario";
import { createMemoryRepository } from "../utils/memoryRepository";

/** Hoy: datos mock en memoria. Mañana: la misma interfaz sobre Sequelize. */
export const usuarioRepository = createMemoryRepository<Usuario>(
  usuariosMock,
  ["nombre", "apellido", "email", "rol"]
);