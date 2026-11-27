import type { Request, Response, NextFunction } from "express";
import { usuarioService } from "../services/usuarioService";
import { Rol } from "../models/Usuario";

export const usuarioController = {
  listar: (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const usuarios = usuarioService.listar();
      res.status(200).json({
        success: true,
        message: "Usuarios obtenidos correctamente",
        data: usuarios,
      });
    } catch (error) {
      next(error);
    }
  },

  obtenerPorId: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const usuario = usuarioService.obtenerPorId(id);
      res.status(200).json({
        success: true,
        message: "Usuario obtenido correctamente",
        data: usuario,
      });
    } catch (error) {
      next(error);
    }
  },

  crear: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const creado = usuarioService.crear(req.body);
      res.status(201).json({
        success: true,
        message: "Usuario creado correctamente",
        data: creado,
      });
    } catch (error) {
      next(error);
    }
  },

  actualizar: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const actualizado = usuarioService.actualizar(id, req.body);
      res.status(200).json({
        success: true,
        message: "Usuario actualizado correctamente",
        data: actualizado,
      });
    } catch (error) {
      next(error);
    }
  },

  asignarRol: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const rol = req.body?.rol as Rol;
      const actualizado = usuarioService.asignarRol(id, rol);
      res.status(200).json({
        success: true,
        message: "Rol actualizado correctamente",
        data: actualizado,
      });
    } catch (error) {
      next(error);
    }
  },

  eliminar: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const eliminado = usuarioService.eliminar(id);
      res.status(200).json({
        success: true,
        message: "Usuario eliminado correctamente",
        data: eliminado,
      });
    } catch (error) {
      next(error);
    }
  },
};