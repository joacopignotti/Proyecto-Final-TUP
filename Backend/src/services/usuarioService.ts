import { usuarioRepository } from "../repositories/usuarioRepository";
import { Rol, Usuario } from "../models/Usuario";
import { HttpError } from "../utils/httpError";

const ROLES_VALIDOS: Rol[] = ["administrador", "tecnico"];

export const usuarioService = {
  listar: (): Usuario[] => {
    return usuarioRepository.list({ page: 1, limit: 10000, order: "asc" }).data;
  },

  asignarRol: (id: number, rol: Rol): Usuario => {
    if (!Number.isInteger(id) || id < 1) {
      throw HttpError.badRequest("El ID de usuario debe ser válido");
    }

    if (!ROLES_VALIDOS.includes(rol)) {
      throw HttpError.badRequest("El rol debe ser 'administrador' o 'tecnico'");
    }

    const existente = usuarioRepository.findById(id);
    if (!existente) {
      throw HttpError.notFound("El usuario no existe");
    }

    if (existente.rol === "administrador" && rol !== "administrador") {
      const todos = usuarioRepository.list({
        page: 1,
        limit: 10000,
        order: "asc",
      }).data;

      const cantidadAdmins = todos.filter(
        (u) => u.rol === "administrador" && u.activo
      ).length;

      if (cantidadAdmins <= 1) {
        throw HttpError.badRequest(
          "Debe existir al menos un administrador activo en el sistema"
        );
      }
    }

    const actualizado = usuarioRepository.update(id, { rol });
    if (!actualizado) {
      throw HttpError.notFound("El usuario no existe");
    }

    return actualizado;
  },
};