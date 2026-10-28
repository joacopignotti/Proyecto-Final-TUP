import { Request, Response } from "express";
import { created, ok, okPaginated } from "./apiResponse";
import { CrudService } from "./crudService";
import { HttpError } from "./httpError";
import { parseListQuery } from "./paginate";

export interface CrudControllerOptions<T> {
  /** Nombre en singular, para los mensajes: "Cliente". */
  nombre: string;
  /** Nombre en plural, para los mensajes: "Clientes". */
  plural: string;
  /** Campos obligatorios al crear (si faltan, 400). */
  requeridos?: (keyof T)[];
  /** Campos que se pueden filtrar por igualdad exacta (?estado=recibido). */
  filtros?: string[];
  /** Valores que se completan solos al crear (fechas, estado inicial, activo…). */
  porDefecto?: () => Partial<Omit<T, "id">>;
}

const leerId = (req: Request): number => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) throw HttpError.badRequest("El id debe ser un número positivo");
  return id;
};

const leerBody = (req: Request): Record<string, unknown> => {
  const body: unknown = req.body;
  if (typeof body !== "object" || body === null || Array.isArray(body) || Object.keys(body).length === 0) {
    throw HttpError.badRequest("El cuerpo de la solicitud está vacío");
  }
  // El id lo asigna el servidor: nunca se toma del body.
  const datos = { ...(body as Record<string, unknown>) };
  delete datos.id;
  return datos;
};

/** Handlers estándar (listar, obtener, crear, actualizar, eliminar) sobre un service. */
export const createCrudController = <T extends { id: number }>(
  service: CrudService<T>,
  options: CrudControllerOptions<T>
) => {
  const { nombre, plural, requeridos = [], filtros = [], porDefecto } = options;

  return {
    listar: (req: Request, res: Response): void => {
      const { data, meta } = service.listar(parseListQuery(req, filtros));
      okPaginated(res, data, meta, plural);
    },

    obtener: (req: Request, res: Response): void => {
      ok(res, service.obtener(leerId(req)), nombre);
    },

    crear: (req: Request, res: Response): void => {
      const datos = { ...porDefecto?.(), ...leerBody(req) } as Record<string, unknown>;
      const faltantes = requeridos.filter((campo) => {
        const valor = datos[campo as string];
        return valor === undefined || valor === null || valor === "";
      });
      if (faltantes.length > 0) {
        throw HttpError.badRequest(`Faltan campos obligatorios: ${faltantes.join(", ")}`);
      }
      created(res, service.crear(datos as Omit<T, "id">), `Registro de ${nombre.toLowerCase()} creado (mock)`);
    },

    actualizar: (req: Request, res: Response): void => {
      const actualizado = service.actualizar(leerId(req), leerBody(req) as Partial<Omit<T, "id">>);
      ok(res, actualizado, `Registro de ${nombre.toLowerCase()} actualizado (mock)`);
    },

    eliminar: (req: Request, res: Response): void => {
      service.eliminar(leerId(req));
      ok(res, null, `Registro de ${nombre.toLowerCase()} eliminado (mock)`);
    },
  };
};

export type CrudController = ReturnType<typeof createCrudController>;
