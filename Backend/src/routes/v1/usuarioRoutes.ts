import { Router } from "express";
import { usuarioController } from "../../controllers/usuarioController";

const usuarioRouter = Router();

usuarioRouter.get("/", usuarioController.listar);
usuarioRouter.post("/", usuarioController.crear);
usuarioRouter.patch("/:id/rol", usuarioController.asignarRol);
usuarioRouter.get("/:id", usuarioController.obtenerPorId);
usuarioRouter.patch("/:id", usuarioController.actualizar);
usuarioRouter.delete("/:id", usuarioController.eliminar);

export default usuarioRouter;