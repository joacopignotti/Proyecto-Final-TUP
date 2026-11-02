
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { MOCK_PASSWORD, ROLES, usuariosMock } from "../mocks/usuarios";
import type { Rol, Usuario } from "../models/Usuario";
import { HttpError } from "../utils/httpError";

export interface LoginResult {
  token: string;
  usuario: Usuario;
}

// Usuarios nuevos registrados durante la ejecución.
const usuariosRegistrados: Usuario[] = [];

// Hashes de contraseñas de los usuarios nuevos.
// Nunca guardamos la contraseña original.
const passwordHashes = new Map<number, string>();

const normalizarEmail = (email: string): string =>
  email.trim().toLowerCase();

const generarHash = (password: string): string => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
};

const verificarPassword = (
  password: string,
  hashGuardado: string
): boolean => {
  const [salt, hashHex] = hashGuardado.split(":");

  if (!salt || !hashHex) return false;

  const hashIngresado = scryptSync(password, salt, 64);
  const hashOriginal = Buffer.from(hashHex, "hex");

  if (hashIngresado.length !== hashOriginal.length) {
    return false;
  }

  return timingSafeEqual(hashIngresado, hashOriginal);
};

// LOGIN
export const login = (
  email: string,
  password: string
): LoginResult => {
  const emailNormalizado = normalizarEmail(email);

  // Buscar primero entre los usuarios registrados.
  const usuarioNuevo = usuariosRegistrados.find(
    (u) => normalizarEmail(u.email) === emailNormalizado
  );

  if (usuarioNuevo) {
    const hash = passwordHashes.get(usuarioNuevo.id);

    if (!hash || !verificarPassword(password, hash)) {
      throw HttpError.unauthorized(
        "Email o contraseña incorrectos"
      );
    }

    if (!usuarioNuevo.activo) {
      throw HttpError.forbidden(
        "El usuario está dado de baja"
      );
    }

    return {
      token: `mock-token-${usuarioNuevo.id}`,
      usuario: usuarioNuevo,
    };
  }

  // Mantener compatibilidad con los usuarios originales.
  const usuarioMock = usuariosMock.find(
    (u) => normalizarEmail(u.email) === emailNormalizado
  );

  if (!usuarioMock || password !== MOCK_PASSWORD) {
    throw HttpError.unauthorized(
      "Email o contraseña incorrectos"
    );
  }

  if (!usuarioMock.activo) {
    throw HttpError.forbidden(
      "El usuario está dado de baja"
    );
  }

  return {
    token: `mock-token-${usuarioMock.id}`,
    usuario: usuarioMock,
  };
};

// REGISTRO
export const register = (data: {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol?: Rol;
}): Usuario => {
  const nombre = data.nombre.trim();
  const apellido = data.apellido.trim();
  const email = normalizarEmail(data.email);

  if (!nombre || !apellido || !email || !data.password) {
    throw HttpError.badRequest(
      "Nombre, apellido, email y contraseña son obligatorios"
    );
  }

  if (data.password.length < 8) {
    throw HttpError.badRequest(
      "La contraseña debe tener al menos 8 caracteres"
    );
  }

  const emailDuplicado = [
    ...usuariosMock,
    ...usuariosRegistrados,
  ].some((u) => normalizarEmail(u.email) === email);

  if (emailDuplicado) {
    throw new HttpError(
      409,
      "Ya existe un usuario con ese email"
    );
  }

  // Generar un ID que no coincida con los usuarios existentes.
  const todos = [...usuariosMock, ...usuariosRegistrados];

  const id = todos.reduce(
    (maximo, usuario) => Math.max(maximo, usuario.id),
    0
  ) + 1;

  const usuario: Usuario = {
    id,
    nombre,
    apellido,
    email,
    rol: "recepcionista",
    activo: true,
  };

  // Guardar el hash antes de registrar el usuario.
  const hash = generarHash(data.password);

  passwordHashes.set(id, hash);
  usuariosRegistrados.push(usuario);

  return usuario;
};

// RECUPERAR CONTRASEÑA (MOCK)
export const recuperarPassword = (_email: string): void => {
  // En este prototipo no enviamos correos.
  return;
};
