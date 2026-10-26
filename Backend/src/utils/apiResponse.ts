import { Response } from "express";

/**
 * Formato único de respuesta de la API. El front siempre recibe esta forma,
 * hoy con datos mock y mañana con datos reales de la base.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: PaginationMeta;
}

export const ok = <T>(res: Response, data: T, message = "OK"): void => {
  const body: ApiResponse<T> = { success: true, message, data };
  res.status(200).json(body);
};

export const created = <T>(res: Response, data: T, message = "Creado"): void => {
  const body: ApiResponse<T> = { success: true, message, data };
  res.status(201).json(body);
};

export const okPaginated = <T>(
  res: Response,
  data: T[],
  meta: PaginationMeta,
  message = "OK"
): void => {
  const body: ApiResponse<T[]> = { success: true, message, data, meta };
  res.status(200).json(body);
};

export const fail = (res: Response, status: number, message: string): void => {
  const body: ApiResponse<null> = { success: false, message, data: null };
  res.status(status).json(body);
};
