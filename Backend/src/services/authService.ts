import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { MOCK_PASSWORD, usuariosMock } from "../mocks/usuarios";
import type { Rol, Usuario } from "../models/Usuario";
import { usuarioRepository } from "../repositories/usuarioRepository";
import { HttpError } from "../utils/httpError";

export interface LoginResult {
  token: string;
  usuario: Usuario;
}

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

const obtenerTodosLosUsuarios = (): Usuario[] =>
  usuarioRepository.list({ page: 1, limit: 10000, order: "asc" }).data;

export const login = (email: string, password: string): LoginResult => {
  const emailNormalizado = normalizarEmail(email);
  const usuario = obtenerTodosLosUsuarios().find(
    (u) => normalizarEmail(u.email) === emailNormalizado
  );

  if (!usuario) {
    throw HttpError.unauthorized("Email o contraseña incorrectos");
  }

  const hash = passwordHashes.get(usuario.id);
  const esUsuarioSeedMock = usuariosMock.some(
    (u) => u.id === usuario.id && normalizarEmail(u.email) === emailNormalizado
  );

  const passwordValida = hash
    ? verificarPassword(password, hash)
    : esUsuarioSeedMock && password === MOCK_PASSWORD;

  if (!passwordValida) {
    throw HttpError.unauthorized("Email o contraseña incorrectos");
  }

  if (!usuario.activo) {
    throw HttpError.forbidden("El usuario está dado de baja");
  }

  return {
    token: `mock-token-${usuario.id}`,
    usuario,
  };
};

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

  const emailDuplicado = obtenerTodosLosUsuarios().some(
    (u) => normalizarEmail(u.email) === email
  );

  if (emailDuplicado) {
    throw new HttpError(409, "Ya existe un usuario con ese email");
  }

  const creado = usuarioRepository.create({
    nombre,
    apellido,
    email,
    rol: "tecnico",
    activo: true,
  });

  passwordHashes.set(creado.id, generarHash(data.password));

  return creado;
};

export const recuperarPassword = (_email: string): void => {
  return;
};