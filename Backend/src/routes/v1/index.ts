import { Router } from "express";
import { healthController } from "../../controllers/healthController";
import authRoutes from "./authRoutes";

const router = Router();

router.get("/health", healthController);
router.use("/auth", authRoutes);

// Cada integrante registra acá el router de su entidad, por ejemplo:
// router.use("/clientes", clientesRoutes);
// router.use("/equipos", equiposRoutes);
// router.use("/ordenes", ordenesRoutes);
// router.use("/repuestos", repuestosRoutes);
// router.use("/presupuestos", presupuestosRoutes);

export default router;
