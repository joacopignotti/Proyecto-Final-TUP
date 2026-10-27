import { PaginationMeta } from "./apiResponse";
import { ListQuery, paginate } from "./paginate";

/**
 * Capa de datos de una entidad. Hoy la implementa un array en memoria (mock);
 * cuando exista la base, se reemplaza por una versión con Sequelize que respete
 * esta misma interfaz y ni los services ni el front cambian.
 */
export interface Repository<T extends { id: number }> {
  list(query: ListQuery): { data: T[]; meta: PaginationMeta };
  findById(id: number): T | undefined;
  create(data: Omit<T, "id">): T;
  update(id: number, data: Partial<Omit<T, "id">>): T | undefined;
  remove(id: number): boolean;
}

/**
 * Repositorio en memoria. Los cambios (alta, modificación, baja) viven mientras
 * el servidor esté levantado y se pierden al reiniciarlo: no hay persistencia.
 * `searchFields` son los campos donde busca el parámetro `q`.
 */
export const createMemoryRepository = <T extends { id: number }>(
  seed: T[],
  searchFields: (keyof T)[]
): Repository<T> => {
  let items: T[] = seed.map((item) => ({ ...item }));

  return {
    list: (query) => paginate(items, query, searchFields),

    findById: (id) => items.find((item) => item.id === id),

    create: (data) => {
      const nextId = items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      const item = { ...data, id: nextId } as T;
      items.push(item);
      return item;
    },

    update: (id, data) => {
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return undefined;
      items[index] = { ...items[index], ...data, id };
      return items[index];
    },

    remove: (id) => {
      const before = items.length;
      items = items.filter((item) => item.id !== id);
      return items.length < before;
    },
  };
};
