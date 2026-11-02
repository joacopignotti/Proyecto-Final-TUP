
import { repuestoRepository } from "../repositories/repuestoRepository";
import { createCrudService } from "../utils/crudService";
import { HttpError } from "../utils/httpError";
import type { Repuesto } from "../models/Repuesto";

const base = createCrudService(
  repuestoRepository,
  "Repuesto"
);

type DatosRepuesto = Omit<Repuesto, "id">;

const validarRepuesto = (
  data: DatosRepuesto,
  idActual?: number
): DatosRepuesto => {
  // Validar código.
  if (
    typeof data.codigo !== "string" ||
    !data.codigo.trim()
  ) {
    throw HttpError.badRequest("El código es obligatorio");
  }

  // Validar nombre.
  if (
    typeof data.nombre !== "string" ||
    !data.nombre.trim()
  ) {
    throw HttpError.badRequest("El nombre es obligatorio");
  }

  // Validar costo.
  if (
    typeof data.costo !== "number" ||
    !Number.isFinite(data.costo) ||
    data.costo < 0
  ) {
    throw HttpError.badRequest(
      "El costo debe ser un número no negativo"
    );
  }

  // Validar stock.
  if (
    typeof data.stock !== "number" ||
    !Number.isInteger(data.stock) ||
    data.stock < 0
  ) {
    throw HttpError.badRequest(
      "El stock debe ser un entero no negativo"
    );
  }

  // Validar activo.
  if (typeof data.activo !== "boolean") {
    throw HttpError.badRequest(
      "El campo activo debe ser verdadero o falso"
    );
  }

  // Normalizar código y nombre.
  const codigo = data.codigo.trim().toUpperCase();
  const nombre = data.nombre.trim();

  // Comprobar que no exista otro repuesto con ese código.
  const existente = repuestoRepository
    .list({
      page: 1,
      limit: 10000,
      order: "asc",
    })
    .data.find(
      (repuesto) =>
        repuesto.codigo.trim().toUpperCase() === codigo &&
        repuesto.id !== idActual
    );

  if (existente) {
    throw new HttpError(
      409,
      "Ya existe un repuesto con ese código"
    );
  }

  return {
    ...data,
    codigo,
    nombre,
  };
};

export const repuestoService = {
  ...base,

  crear: (data: DatosRepuesto): Repuesto => {
    const datosValidados = validarRepuesto(data);

    return base.crear(datosValidados);
  },

  actualizar: (
    id: number,
    data: Partial<DatosRepuesto>
  ): Repuesto => {
    const actual = base.obtener(id);

    const datosCompletos: DatosRepuesto = {
      codigo: data.codigo ?? actual.codigo,
      nombre: data.nombre ?? actual.nombre,
      costo: data.costo ?? actual.costo,
      stock: data.stock ?? actual.stock,
      activo: data.activo ?? actual.activo,
    };

    const datosValidados = validarRepuesto(
      datosCompletos,
      id
    );

    return base.actualizar(id, datosValidados);
  },
};
