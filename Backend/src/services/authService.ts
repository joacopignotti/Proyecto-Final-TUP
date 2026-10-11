import { MOCK_PASSWORD, ROLES, usuariosMock } from "../mocks/usuarios";
import { Rol, Usuario } from "../models/Usuario";
import { HttpError } from "../utils/httpError";

export interface LoginResult {
  token: string;
  usuario: Usuario;
}

// MOCK: no hay base de datos. Más adelante esto consulta la tabla de usuarios
// y compara la contraseña cifrada (bcrypt) en lugar de MOCK_PASSWORD.
export const login = (email: string, password: string): LoginResult => {
  const usuario = usuariosMock.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!usuario || password !== MOCK_PASSWORD) {
    throw HttpError.unauthorized("Email o contraseña incorrectos");
  }
  if (!usuario.activo) {
    throw HttpError.forbidden("El usuario está dado de baja");
  }

  return { token: `mock-token-${usuario.id}`, usuario };
};

// MOCK: simula el alta sin guardar nada.
export const register = (data: {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol?: Rol;
}): Usuario => {
  if (usuariosMock.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    throw new HttpError(409, "Ya existe un usuario con ese email");
  }

  return {
    id: usuariosMock.length + 1,
    nombre: data.nombre,
    apellido: data.apellido,
    email: data.email,
    rol: data.rol && ROLES.includes(data.rol) ? data.rol : "recepcionista",
    activo: true,
  };
};

// MOCK: no envía ningún mail. Responde igual exista o no el email
// (así no se revela qué cuentas están registradas).
export const recuperarPassword = (_email: string): void => {
  return;
};
