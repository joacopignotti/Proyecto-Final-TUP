import type { Request, Response, NextFunction } from "express";
import { seguimientoService } from "../services/seguimientoService";

export const seguimientoController = {
  obtenerPorCodigo: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const codigo = typeof req.params.codigo === "string" ? req.params.codigo : "";
      const data = seguimientoService.obtenerPorCodigo(codigo);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
};