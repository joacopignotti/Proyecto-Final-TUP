import { Rol, Usuario } from "../models/Usuario";

/** Usuarios de prueba (uno por rol). La contraseña mock es "taller123" para todos. */
export const MOCK_PASSWORD = "taller123";

export const usuariosMock: Usuario[] = [
  { id: 1, nombre: "Ana", apellido: "Admin", email: "admin@taller.com", rol: "administrador", activo: true },
  { id: 2, nombre: "Rocío", apellido: "Recepción", email: "recepcion@taller.com", rol: "recepcionista", activo: true },
  { id: 3, nombre: "Tomás", apellido: "Técnico", email: "tecnico@taller.com", rol: "tecnico", activo: true },
];

export const ROLES: Rol[] = ["administrador", "recepcionista", "tecnico"];
