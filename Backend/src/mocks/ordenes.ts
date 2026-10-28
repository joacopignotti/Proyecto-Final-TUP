import { Orden } from "../models/Orden";

// TODO (dueño de Órdenes): sumar órdenes en cada estado.
export const ordenesMock: Orden[] = [
  {
    id: 1,
    codigo: "OT-2026-0001",
    equipoId: 1,
    tecnicoId: 3,
    estado: "en_diagnostico",
    diagnostico: "",
    fallas: "Pantalla rota",
    trabajoRealizado: "",
    fechaIngreso: "2026-10-02T11:30:00.000Z",
    fechaEntrega: null,
    bitacora: [
      { id: 1, usuarioId: 2, fecha: "2026-10-02T11:30:00.000Z", descripcion: "Equipo recibido en recepción" },
    ],
  },
];
