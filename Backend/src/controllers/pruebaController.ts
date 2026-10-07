import { Request, Response } from "express";
import { obtenerPrueba } from "../services/pruebaService";

export const obtenerPruebaController = (
  _req: Request,
  res: Response
): void => {
  const mensaje = obtenerPrueba();

  res.json({
    mensaje,
  });
};

