import { Router } from "express";
import { usuarioController } from "../../controllers/usuarioController";

const usuarioRouter = Router();




usuarioRouter.get("/", usuarioController.listar);
usuarioRouter.patch("/:id/rol", usuarioController.asignarRol);

export default usuarioRouter;