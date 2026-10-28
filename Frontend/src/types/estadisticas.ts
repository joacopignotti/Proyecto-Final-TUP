export interface EstadisticasDashboard {
  totalOrdenes: number;
  totalEquipos: number;
  ordenesSinAsignar: number;
  ordenesPorEstado: {
    estado: string;
    cantidad: number;
  }[];
  ordenesPorTecnico: {
    tecnicoId: number;
    tecnicoNombre: string;
    cantidad: number;
  }[];
}
