
import { presupuestoRepository } from "../repositories/presupuestoRepository";
import { ordenRepository } from "../repositories/ordenRepository";
import { repuestoRepository } from "../repositories/repuestoRepository";
import { createCrudService } from "../utils/crudService";
import { HttpError } from "../utils/httpError";
import { Presupuesto } from "../models/Presupuesto";

const base = createCrudService(
  presupuestoRepository,
  "Presupuesto"
);

export const presupuestoService = {
  ...base,

  // CREAR PRESUPUESTO
  crear: (data: Omit<Presupuesto, "id">): Presupuesto => {
    // 1. Validar la orden
    if (!Number.isInteger(data.ordenId) || data.ordenId < 1) {
      throw HttpError.badRequest("La orden debe ser válida");
    }

    const orden = ordenRepository.findById(data.ordenId);

    if (!orden) {
      throw HttpError.notFound("La orden no existe");
    }

    if (orden.estado === "cancelada") {
      throw HttpError.badRequest(
        "No se puede presupuestar una orden cancelada"
      );
    }

    // 2. Evitar presupuestos duplicados por orden
    const existente = presupuestoRepository
      .list({ page: 1, limit: 10000, order: "asc" })
      .data.some((p) => p.ordenId === data.ordenId);

    if (existente) {
      throw new HttpError(
        409,
        "La orden ya tiene un presupuesto"
      );
    }

    // 3. Validar mano de obra
    if (
      typeof data.manoDeObra !== "number" ||
      !Number.isFinite(data.manoDeObra) ||
      data.manoDeObra < 0
    ) {
      throw HttpError.badRequest(
        "La mano de obra debe ser un número no negativo"
      );
    }

    // 4. Validar los ítems
    if (!Array.isArray(data.items)) {
      throw HttpError.badRequest(
        "Los ítems deben ser una lista"
      );
    }

    const usados = new Set<number>();

    const items = data.items.map((item, indice) => {
      if (
        !Number.isInteger(item.repuestoId) ||
        item.repuestoId < 1
      ) {
        throw HttpError.badRequest(
          "El repuesto debe tener un ID válido"
        );
      }

      if (usados.has(item.repuestoId)) {
        throw HttpError.badRequest(
          "No se puede repetir un repuesto"
        );
      }

      usados.add(item.repuestoId);

      if (
        !Number.isInteger(item.cantidad) ||
        item.cantidad < 1
      ) {
        throw HttpError.badRequest(
          "La cantidad debe ser un entero positivo"
        );
      }

      const repuesto = repuestoRepository.findById(
        item.repuestoId
      );

      if (!repuesto) {
        throw HttpError.notFound(
          `El repuesto ${item.repuestoId} no existe`
        );
      }

      if (!repuesto.activo) {
        throw HttpError.badRequest(
          `El repuesto ${repuesto.nombre} está inactivo`
        );
      }

      if (item.cantidad > repuesto.stock) {
        throw HttpError.badRequest(
          `Stock insuficiente para ${repuesto.nombre}`
        );
      }

      return {
        id: indice + 1,
        repuestoId: repuesto.id,
        cantidad: item.cantidad,
        costoUnitario: repuesto.costo,
      };
    });

    // 5. Calcular el total en el backend
    const totalRepuestos = items.reduce(
      (acumulado, item) =>
        acumulado + item.cantidad * item.costoUnitario,
      0
    );

    const total = data.manoDeObra + totalRepuestos;

    // 6. Crear el presupuesto validado
    return base.crear({
      ordenId: data.ordenId,
      manoDeObra: data.manoDeObra,
      items,
      total,
      estado: "pendiente",
      createdAt: new Date().toISOString(),
    });
  },

  // ACTUALIZAR PRESUPUESTO
  actualizar: (
    id: number,
    data: Partial<Omit<Presupuesto, "id">>
  ): Presupuesto => {
    // 1. Obtener presupuesto existente
    const actual = base.obtener(id);

    // 2. Permitir modificar solo mano de obra y estado
    const campos = Object.keys(data);
    const permitidos = ["manoDeObra", "estado"];

    if (campos.some((campo) => !permitidos.includes(campo))) {
      throw HttpError.badRequest(
        "Solo se pueden modificar manoDeObra y estado"
      );
    }

    // 3. Conservar valores actuales si no se envían cambios
    const manoDeObra = data.manoDeObra ?? actual.manoDeObra;
    const estado = data.estado ?? actual.estado;

    // 4. Validar mano de obra
    if (
      typeof manoDeObra !== "number" ||
      !Number.isFinite(manoDeObra) ||
      manoDeObra < 0
    ) {
      throw HttpError.badRequest(
        "La mano de obra debe ser un número no negativo"
      );
    }

    // 5. Validar estado
    if (
      estado !== "pendiente" &&
      estado !== "aprobado" &&
      estado !== "rechazado"
    ) {
      throw HttpError.badRequest(
        "El estado del presupuesto no es válido"
      );
    }

    // 6. Recalcular total automáticamente
    const totalRepuestos = actual.items.reduce(
      (acumulado, item) =>
        acumulado + item.cantidad * item.costoUnitario,
      0
    );

    const total = manoDeObra + totalRepuestos;

    // 7. Guardar cambios
    return base.actualizar(id, {
      manoDeObra,
      estado,
      total,
    });
  },
};
