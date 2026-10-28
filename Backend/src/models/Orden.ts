export type EstadoOrden =
  | "recibido"
  | "en_diagnostico"
  | "esperando_aprobacion"
  | "en_taller"
  | "finalizado"
  | "entregado"
  | "cancelada";

export const ESTADOS_ORDEN: EstadoOrden[] = [
  "recibido",
  "en_diagnostico",
  "esperando_aprobacion",
  "en_taller",
  "finalizado",
  "entregado",
  "cancelada",
];

export interface BitacoraEntrada {
  id: number;
  usuarioId: number;
  fecha: string;
  descripcion: string;
}

export interface Orden {
  id: number;
  codigo: string; // código único de seguimiento público
  equipoId: number;
  tecnicoId: number | null;
  estado: EstadoOrden;
  diagnostico: string;
  fallas: string;
  trabajoRealizado: string;
  fechaIngreso: string;
  fechaEntrega: string | null;
  bitacora: BitacoraEntrada[];
}
