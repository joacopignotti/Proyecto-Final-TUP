import { Request, Response } from "express";
import { estadisticasService } from "../services/estadisticasService";
import { ok } from "../utils/apiResponse";

export const estadisticasController = (_req: Request, res: Response): void => {
  const estadisticas = estadisticasService.obtenerDashboard();

  ok(res, estadisticas, "Estadísticas del dashboard obtenidas correctamente");
};


