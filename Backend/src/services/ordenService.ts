import { Orden } from "../models/Orden";
import { ordenRepository } from "../repositories/ordenRepository";
import { createCrudService, CrudService } from "../utils/crudService";

const base = createCrudService(ordenRepository, "Orden");

/** Genera el próximo código de seguimiento: OT-2026-0002. */
const siguienteCodigo = (): string => {
  const { data } = ordenRepository.list({ page: 1, limit: Number.MAX_SAFE_INTEGER, order: "asc" });
  const ultimo = data.reduce((max, orden) => Math.max(max, Number(orden.codigo.split("-")[2]) || 0), 0);
  return `OT-${new Date().getFullYear()}-${String(ultimo + 1).padStart(4, "0")}`;
};

// Ejemplo de service con regla propia: el código de seguimiento lo asigna el sistema.
// El resto del CRUD es el estándar (ver utils/crudService.ts).
export const ordenService: CrudService<Orden> = {
  ...base,
  crear: (data) => base.crear({ ...data, codigo: siguienteCodigo() }),
};
