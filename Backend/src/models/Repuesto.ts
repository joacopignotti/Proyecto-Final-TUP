export interface Repuesto {
  id: number;
  codigo: string;
  nombre: string;
  costo: number; // costo unitario
  stock: number;
  activo: boolean;
}
