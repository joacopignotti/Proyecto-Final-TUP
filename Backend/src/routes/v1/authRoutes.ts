import { Router } from "express";
import {
  loginController,
  recuperarPasswordController,
  registerController,
} from "../../controllers/authController";

const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/recuperar-password", recuperarPasswordController);

export default router;
