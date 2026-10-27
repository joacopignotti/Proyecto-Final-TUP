import { Router } from "express";
import { healthController } from "../../controllers/healthController";
import authRoutes from "./authRoutes";
import clienteRoutes from "./clienteRoutes";
import equipoRoutes from "./equipoRoutes";
import ordenRoutes from "./ordenRoutes";
import presupuestoRoutes from "./presupuestoRoutes";
import repuestoRoutes from "./repuestoRoutes";

const router = Router();

router.get("/health", healthController);
router.use("/auth", authRoutes);

router.use("/clientes", clienteRoutes);
router.use("/equipos", equipoRoutes);
router.use("/ordenes", ordenRoutes);
router.use("/repuestos", repuestoRoutes);
router.use("/presupuestos", presupuestoRoutes);

export default router;
