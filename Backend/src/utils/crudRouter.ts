import { Router } from "express";
import { CrudController } from "./crudController";

/**
 * Router con el CRUD estándar de una entidad:
 * GET /, GET /:id, POST /, PUT|PATCH /:id, DELETE /:id.
 * Para rutas propias, agregarlas sobre el router devuelto (antes de exportarlo).
 */
export const createCrudRouter = (controller: CrudController): Router => {
  const router = Router();

  router.get("/", controller.listar);
  router.post("/", controller.crear);
  router.get("/:id", controller.obtener);
  router.put("/:id", controller.actualizar);
  router.patch("/:id", controller.actualizar);
  router.delete("/:id", controller.eliminar);

  return router;
};
