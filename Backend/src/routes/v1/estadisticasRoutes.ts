import { Router } from "express";
import { estadisticasController } from "../../controllers/estadisticasController";

const router = Router();

router.get("/dashboard", estadisticasController);

export default router;
