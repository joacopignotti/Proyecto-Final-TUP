import { Presupuesto } from "../models/Presupuesto";

// TODO (dueño de Presupuestos y repuestos): sumar presupuestos en cada estado.
export const presupuestosMock: Presupuesto[] = [
  {
    id: 1,
    ordenId: 1,
    manoDeObra: 15000,
    items: [{ id: 1, repuestoId: 1, cantidad: 1, costoUnitario: 48000 }],
    total: 63000,
    estado: "pendiente",
    createdAt: "2026-10-03T09:00:00.000Z",
  },
];
