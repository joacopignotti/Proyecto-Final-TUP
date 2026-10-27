import { Orden } from "../models/Orden";
import { ordenService } from "../services/ordenService";
import { createCrudController } from "../utils/crudController";

export const ordenController = createCrudController<Orden>(ordenService, {
  nombre: "Orden",
  plural: "Órdenes",
  // Campos obligatorios al crear
  requeridos: ["equipoId"],
  // Filtros exactos habilitados: ?campo=valor
  filtros: ["estado", "tecnicoId", "equipoId"],
  // Valores que se completan solos al crear
  porDefecto: () => ({
    tecnicoId: null,
    estado: "recibido",
    diagnostico: "",
    fallas: "",
    trabajoRealizado: "",
    fechaIngreso: new Date().toISOString(),
    fechaEntrega: null,
    bitacora: [],
  }),
});
