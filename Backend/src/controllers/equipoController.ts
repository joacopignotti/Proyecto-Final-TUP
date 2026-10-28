import { Equipo } from "../models/Equipo";
import { equipoService } from "../services/equipoService";
import { createCrudController } from "../utils/crudController";

export const equipoController = createCrudController<Equipo>(equipoService, {
  nombre: "Equipo",
  plural: "Equipos",
  // Campos obligatorios al crear
  requeridos: ["clienteId", "tipo", "marca", "modelo"],
  // Filtros exactos habilitados: ?campo=valor
  filtros: ["clienteId", "tipo"],
  // Valores que se completan solos al crear
  porDefecto: () => ({ observaciones: "", createdAt: new Date().toISOString() }),
});
