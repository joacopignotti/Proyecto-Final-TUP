export type EstadoPresupuesto = "pendiente" | "aprobado" | "rechazado";

export interface PresupuestoItem {
  id: number;
  repuestoId: number;
  cantidad: number;
  costoUnitario: number;
}

export interface Presupuesto {
  id: number;
  ordenId: number; // uno por orden
  manoDeObra: number;
  items: PresupuestoItem[];
  total: number; // mano de obra + ítems
  estado: EstadoPresupuesto;
  createdAt: string;
}
