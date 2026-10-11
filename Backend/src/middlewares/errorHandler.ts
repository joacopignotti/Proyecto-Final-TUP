import { NextFunction, Request, Response } from "express";
import { fail } from "../utils/apiResponse";
import { HttpError } from "../utils/httpError";
import { isProduction } from "../config/env";

/** 404 para cualquier ruta /api que no exista. */
export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(HttpError.notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

/** Último middleware: convierte cualquier error en una respuesta unificada. */
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof HttpError) {
    fail(res, err.status, err.message);
    return;
  }

  // Errores 4xx de librerías (por ejemplo, un JSON mal formado en el body)
  if (typeof err === "object" && err !== null && "status" in err) {
    const status = Number((err as { status: unknown }).status);
    if (status >= 400 && status < 500) {
      const type = (err as { type?: unknown }).type;
      fail(res, status, type === "entity.parse.failed" ? "El JSON enviado no es válido" : "Solicitud inválida");
      return;
    }
  }

  console.error(err);
  const message = !isProduction && err instanceof Error ? err.message : "Error interno del servidor";
  fail(res, 500, message);
};
