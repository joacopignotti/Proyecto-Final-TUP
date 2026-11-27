import { usuarioRepository } from "../repositories/usuarioRepository";
import { Rol, Usuario } from "../models/Usuario";
import { HttpError } from "../utils/httpError";

const ROLES_VALIDOS: Rol[] = ["administrador", "tecnico"];

export interface CrearUsuarioInput {
  nombre: string;
  apellido: string;
  email: string;
  rol?: Rol;
  activo?: boolean;
}

export interface ActualizarUsuarioInput {
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: Rol;
  activo?: boolean;
}

function validarId(id: number): void {
  if (!Number.isInteger(id) || id < 1) {
    throw HttpError.badRequest("El ID de usuario debe ser válido");
  }
}

function validarRol(rol: Rol): void {
  if (!ROLES_VALIDOS.includes(rol)) {
    throw HttpError.badRequest("El rol debe ser 'administrador' o 'tecnico'");
  }
}

function obtenerTodos(): Usuario[] {
  return usuarioRepository.list({
    page: 1,
    limit: 10000,
    order: "asc",
  }).data;
}

function verificarNoEsUltimoAdmin(usuario: Usuario): void {
  if (usuario.rol !== "administrador" || !usuario.activo) {
    return;
  }

  const adminsActivos = obtenerTodos().filter(
    (u) => u.rol === "administrador" && u.activo
  ).length;

  if (adminsActivos <= 1) {
    throw HttpError.badRequest(
      "Debe existir al menos un administrador activo en el sistema"
    );
  }
}

export const usuarioService = {
  listar: (): Usuario[] => {
    return obtenerTodos();
  },

  obtenerPorId: (id: number): Usuario => {
    validarId(id);
    const usuario = usuarioRepository.findById(id);
    if (!usuario) {
      throw HttpError.notFound("El usuario no existe");
    }
    return usuario;
  },

  crear: (datos: CrearUsuarioInput): Usuario => {
    const nombre = datos.nombre?.trim();
    const apellido = datos.apellido?.trim();
    const email = datos.email?.trim().toLowerCase();
    const rol: Rol = datos.rol ?? "tecnico";

    if (!nombre || !apellido || !email) {
      throw HttpError.badRequest("Nombre, apellido y email son obligatorios");
    }

    validarRol(rol);

    const emailDuplicado = obtenerTodos().some(
      (u) => u.email.toLowerCase() === email
    );
    if (emailDuplicado) {
      throw HttpError.badRequest("Ya existe un usuario con ese email");
    }

    return usuarioRepository.create({
      nombre,
      apellido,
      email,
      rol,
      activo: datos.activo ?? true,
    });
  },

  actualizar: (id: number, cambios: ActualizarUsuarioInput): Usuario => {
    const existente = usuarioService.obtenerPorId(id);

    if (cambios.rol !== undefined) {
      validarRol(cambios.rol);
    }

    const pierdeAdmin =
      (cambios.rol !== undefined && cambios.rol !== "administrador") ||
      cambios.activo === false;

    if (pierdeAdmin) {
      verificarNoEsUltimoAdmin(existente);
    }

    const payload: ActualizarUsuarioInput = {};

    if (cambios.nombre !== undefined) {
      const nombre = cambios.nombre.trim();
      if (!nombre) {
        throw HttpError.badRequest("El nombre no puede estar vacío");
      }
      payload.nombre = nombre;
    }

    if (cambios.apellido !== undefined) {
      const apellido = cambios.apellido.trim();
      if (!apellido) {
        throw HttpError.badRequest("El apellido no puede estar vacío");
      }
      payload.apellido = apellido;
    }

    if (cambios.email !== undefined) {
      const email = cambios.email.trim().toLowerCase();
      if (!email) {
        throw HttpError.badRequest("El email no puede estar vacío");
      }
      const emailDuplicado = obtenerTodos().some(
        (u) => u.id !== id && u.email.toLowerCase() === email
      );
      if (emailDuplicado) {
        throw HttpError.badRequest("Ya existe un usuario con ese email");
      }
      payload.email = email;
    }

    if (cambios.rol !== undefined) {
      payload.rol = cambios.rol;
    }

    if (cambios.activo !== undefined) {
      payload.activo = cambios.activo;
    }

    const actualizado = usuarioRepository.update(id, payload);
    if (!actualizado) {
      throw HttpError.notFound("El usuario no existe");
    }

    return actualizado;
  },

  asignarRol: (id: number, rol: Rol): Usuario => {
    validarId(id);
    validarRol(rol);

    const existente = usuarioRepository.findById(id);
    if (!existente) {
      throw HttpError.notFound("El usuario no existe");
    }

    if (existente.rol === "administrador" && rol !== "administrador") {
      verificarNoEsUltimoAdmin(existente);
    }

    const actualizado = usuarioRepository.update(id, { rol });
    if (!actualizado) {
      throw HttpError.notFound("El usuario no existe");
    }

    return actualizado;
  },

  eliminar: (id: number): Usuario => {
    const existente = usuarioService.obtenerPorId(id);
    verificarNoEsUltimoAdmin(existente);

    const eliminado = usuarioRepository.remove(id);
    if (!eliminado) {
      throw HttpError.notFound("El usuario no existe");
    }

    return existente;
  },
};