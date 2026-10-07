import { Router } from "express";
import { obtenerPruebaController } from "../controllers/pruebaController";

const router = Router();

router.get("/prueba", obtenerPruebaController);

export default router;

