import { PaginationMeta } from "./apiResponse";
import { HttpError } from "./httpError";
import { ListQuery } from "./paginate";
import { Repository } from "./memoryRepository";

/** Operaciones de negocio de una entidad. Los controllers solo hablan con esto. */
export interface CrudService<T extends { id: number }> {
  listar(query: ListQuery): { data: T[]; meta: PaginationMeta };
  obtener(id: number): T;
  crear(data: Omit<T, "id">): T;
  actualizar(id: number, data: Partial<Omit<T, "id">>): T;
  eliminar(id: number): void;
}

/**
 * Service estándar sobre un repositorio: lanza 404 cuando el registro no existe.
 * Para reglas propias (duplicados, estados válidos, relaciones) se extiende:
 *
 *   const base = createCrudService(clientesRepo, "Cliente");
 *   export const clienteService: CrudService<Cliente> = {
 *     ...base,
 *     crear: (data) => {
 *       // validar (ej. DNI duplicado) y recién después crear
 *       return base.crear(data);
 *     },
 *   };
 */
export const createCrudService = <T extends { id: number }>(
  repository: Repository<T>,
  nombre: string
): CrudService<T> => {
  const buscar = (id: number): T => {
    const item = repository.findById(id);
    if (!item) throw HttpError.notFound(`${nombre} no encontrado`);
    return item;
  };

  return {
    listar: (query) => repository.list(query),
    obtener: buscar,
    crear: (data) => repository.create(data),
    actualizar: (id, data) => {
      buscar(id);
      return repository.update(id, data) as T;
    },
    eliminar: (id) => {
      buscar(id);
      repository.remove(id);
    },
  };
};
