import type { Request, Response, NextFunction } from "express";
import { usuarioService } from "../services/usuarioService";
import { Rol } from "../models/Usuario";

export const usuarioController = {
  listar: (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const usuarios = usuarioService.listar();
      res.status(200).json(usuarios);
    } catch (error) {
      next(error);
    }
  },

  asignarRol: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const rol = req.body?.rol as Rol;
      const actualizado = usuarioService.asignarRol(id, rol);
      res.status(200).json(actualizado);
    } catch (error) {
      next(error);
    }
  },
};