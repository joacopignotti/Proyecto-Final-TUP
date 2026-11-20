import { Router } from "express";
import { seguimientoController } from "../../controllers/seguimientoController";

const seguimientoRoutes = Router();

seguimientoRoutes.get("/:codigo", seguimientoController.obtenerPorCodigo);

export default seguimientoRoutes; 