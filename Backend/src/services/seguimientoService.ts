import { ordenRepository } from "../repositories/ordenRepository";
import { equipoRepository } from "../repositories/equipoRepository";
import { presupuestoRepository } from "../repositories/presupuestoRepository";
import { repuestoRepository } from "../repositories/repuestoRepository";
import { EstadoOrden } from "../models/Orden";
import { HttpError } from "../utils/httpError";

export interface BitacoraPublicaDTO {
  id: number;
  fecha: string;
  descripcion: string;
}

export interface EquipoPublicoDTO {
  tipo: string;
  marca: string;
  modelo: string;
  condicion: string;
}

export interface PresupuestoPublicoDTO {
  id: number;
  estado: "pendiente" | "aprobado" | "rechazado";
  manoDeObra: number;
  total: number;
  items: Array<{
    repuesto: string;
    cantidad: number;
    costoUnitario: number;
  }>;
}

export interface SeguimientoPublicoDTO {
  codigo: string;
  estado: EstadoOrden;
  equipo: EquipoPublicoDTO;
  fallas: string;
  diagnostico: string;
  trabajoRealizado: string;
  fechaIngreso: string;
  fechaEntrega: string | null;
  bitacora: BitacoraPublicaDTO[];
  presupuesto: PresupuestoPublicoDTO | null;
}

const CODIGO_REGEX = /^[A-Za-z0-9-]{4,32}$/;

export const seguimientoService = {
  obtenerPorCodigo: (codigoRaw: string): SeguimientoPublicoDTO => {
    const codigo = codigoRaw.trim();

    if (!codigo || !CODIGO_REGEX.test(codigo)) {
      throw HttpError.badRequest("El código de seguimiento no es válido");
    }

    const orden = ordenRepository
      .list({ page: 1, limit: 10000, order: "asc" })
      .data.find((o) => o.codigo.toLowerCase() === codigo.toLowerCase());

    if (!orden) {
      throw HttpError.notFound("No se encontró una orden con ese código");
    }

    const equipo = equipoRepository.findById(orden.equipoId);
    const equipoDTO: EquipoPublicoDTO = equipo
      ? {
          tipo: equipo.tipo,
          marca: equipo.marca,
          modelo: equipo.modelo,
          condicion: equipo.condicion,
        }
      : {
          tipo: "Equipo",
          marca: "",
          modelo: "",
          condicion: "",
        };

    const presupuesto =
      presupuestoRepository
        .list({ page: 1, limit: 10000, order: "asc" })
        .data.find((p) => p.ordenId === orden.id) ?? null;

    const presupuestoDTO: PresupuestoPublicoDTO | null = presupuesto
      ? {
          id: presupuesto.id,
          estado: presupuesto.estado,
          manoDeObra: presupuesto.manoDeObra,
          total: presupuesto.total,
          items: presupuesto.items.map((item) => {
            const repuesto = repuestoRepository.findById(item.repuestoId);
            return {
              repuesto: repuesto?.nombre ?? `Repuesto #${item.repuestoId}`,
              cantidad: item.cantidad,
              costoUnitario: item.costoUnitario,
            };
          }),
        }
      : null;

    const bitacoraPublica: BitacoraPublicaDTO[] = orden.bitacora.map((entrada) => ({
      id: entrada.id,
      fecha: entrada.fecha,
      descripcion: entrada.descripcion,
    }));

    return {
      codigo: orden.codigo,
      estado: orden.estado,
      equipo: equipoDTO,
      fallas: orden.fallas,
      diagnostico: orden.diagnostico,
      trabajoRealizado: orden.trabajoRealizado,
      fechaIngreso: orden.fechaIngreso,
      fechaEntrega: orden.fechaEntrega,
      bitacora: bitacoraPublica,
      presupuesto: presupuestoDTO,
    };
  },
};