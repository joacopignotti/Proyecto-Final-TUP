/**
 * Error con código HTTP. Se lanza desde services/controllers y el
 * errorHandler lo convierte en una respuesta 4xx/5xx unificada.
 */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }

  static badRequest(message = "Solicitud inválida") {
    return new HttpError(400, message);
  }
  static unauthorized(message = "No autorizado") {
    return new HttpError(401, message);
  }
  static forbidden(message = "Acceso denegado") {
    return new HttpError(403, message);
  }
  static notFound(message = "Recurso no encontrado") {
    return new HttpError(404, message);
  }
}
