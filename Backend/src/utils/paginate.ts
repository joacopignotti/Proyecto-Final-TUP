import { Request } from "express";
import { PaginationMeta } from "./apiResponse";

export interface ListQuery {
  page: number;
  limit: number;
  sortBy?: string;
  order: "asc" | "desc";
  q?: string;
  /** Filtros exactos por campo, ej. ?estado=recibido (solo los permitidos por la entidad). */
  filters?: Record<string, string>;
}

const MAX_LIMIT = 100;

const asString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;

/**
 * Lee ?page=1&limit=10&sortBy=id&order=desc&q=texto de la URL.
 * `filterFields` son los campos que la entidad permite filtrar con igualdad
 * exacta (ej. ["estado", "tecnicoId"] habilita ?estado=recibido).
 */
export const parseListQuery = (req: Request, filterFields: string[] = []): ListQuery => {
  const page = Math.max(1, parseInt(asString(req.query.page) ?? "1", 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(asString(req.query.limit) ?? "10", 10) || 10)
  );
  const order = asString(req.query.order)?.toLowerCase() === "desc" ? "desc" : "asc";

  const filters: Record<string, string> = {};
  for (const field of filterFields) {
    const value = asString(req.query[field]);
    if (value !== undefined) filters[field] = value;
  }

  return { page, limit, order, sortBy: asString(req.query.sortBy), q: asString(req.query.q), filters };
};

/**
 * Ordena, filtra y pagina un array en memoria (para los mocks).
 * `searchFields` son los campos donde se busca el texto `q`.
 */
export const paginate = <T extends object>(
  items: T[],
  query: ListQuery,
  searchFields: (keyof T)[] = []
): { data: T[]; meta: PaginationMeta } => {
  let result = [...items];

  for (const [field, value] of Object.entries(query.filters ?? {})) {
    result = result.filter((item) => String((item as Record<string, unknown>)[field]) === value);
  }

  if (query.q && searchFields.length > 0) {
    const needle = query.q.toLowerCase();
    result = result.filter((item) =>
      searchFields.some((field) => String(item[field] ?? "").toLowerCase().includes(needle))
    );
  }

  if (query.sortBy) {
    const key = query.sortBy as keyof T;
    const dir = query.order === "desc" ? -1 : 1;
    result.sort((a, b) => {
      const va = a[key];
      const vb = b[key];
      if (va === vb) return 0;
      return (va > vb ? 1 : -1) * dir;
    });
  }

  const total = result.length;
  const start = (query.page - 1) * query.limit;

  return {
    data: result.slice(start, start + query.limit),
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
};
