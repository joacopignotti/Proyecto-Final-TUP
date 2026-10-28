import { Cliente } from "../models/Cliente";
import { clienteService } from "../services/clienteService";
import { createCrudController } from "../utils/crudController";

export const clienteController = createCrudController<Cliente>(clienteService, {
  nombre: "Cliente",
  plural: "Clientes",
  // Campos obligatorios al crear
  requeridos: ["nombre", "apellido", "dni"],
  // Filtros exactos habilitados: ?campo=valor
  filtros: ["activo"],
  // Valores que se completan solos al crear
  porDefecto: () => ({ activo: true, createdAt: new Date().toISOString() }),
});
