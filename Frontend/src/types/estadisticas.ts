
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
    finalizadas: number;
  }[];

  presupuestosPorEstado: {
    pendientes: number;
    aprobados: number;
    rechazados: number;
  };

  facturacionAprobada: number;
  tiempoPromedioReparacion: number;
  ordenesEntregadas: number;
}
