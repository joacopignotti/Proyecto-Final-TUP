import { Repuesto } from "../models/Repuesto";
import { repuestoService } from "../services/repuestoService";
import { createCrudController } from "../utils/crudController";

export const repuestoController = createCrudController<Repuesto>(repuestoService, {
  nombre: "Repuesto",
  plural: "Repuestos",
  // Campos obligatorios al crear
  requeridos: ["codigo", "nombre", "costo"],
  // Filtros exactos habilitados: ?campo=valor
  filtros: ["activo"],
  // Valores que se completan solos al crear
  porDefecto: () => ({ stock: 0, activo: true }),
});
