import { Presupuesto } from "../models/Presupuesto";
import { presupuestoService } from "../services/presupuestoService";
import { createCrudController } from "../utils/crudController";

export const presupuestoController = createCrudController<Presupuesto>(presupuestoService, {
  nombre: "Presupuesto",
  plural: "Presupuestos",
  // Campos obligatorios al crear
  requeridos: ["ordenId", "manoDeObra"],
  // Filtros exactos habilitados: ?campo=valor
  filtros: ["estado", "ordenId"],
  // Valores que se completan solos al crear
  porDefecto: () => ({
    manoDeObra: 0,
    items: [],
    total: 0,
    estado: "pendiente",
    createdAt: new Date().toISOString(),
  }),
});
