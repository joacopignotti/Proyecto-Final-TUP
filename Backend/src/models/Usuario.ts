export type Rol = "administrador" | "recepcionista" | "tecnico";

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
  activo: boolean;
}
