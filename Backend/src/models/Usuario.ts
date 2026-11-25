export type Rol = "administrador" | "tecnico";

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
  activo: boolean;
}