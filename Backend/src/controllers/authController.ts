import { Request, Response } from "express";
import * as authService from "../services/authService";
import { created, ok } from "../utils/apiResponse";
import { HttpError } from "../utils/httpError";

const str = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

export const loginController = (req: Request, res: Response): void => {
  const email = str(req.body?.email);
  const password = str(req.body?.password);
  if (!email || !password) throw HttpError.badRequest("Email y contraseña son obligatorios");

  ok(res, authService.login(email, password), "Sesión iniciada");
};

export const registerController = (req: Request, res: Response): void => {
  const nombre = str(req.body?.nombre);
  const apellido = str(req.body?.apellido);
  const email = str(req.body?.email);
  const password = str(req.body?.password);
  if (!nombre || !apellido || !email || !password) {
    throw HttpError.badRequest("Nombre, apellido, email y contraseña son obligatorios");
  }

  created(res, authService.register({ nombre, apellido, email, password }), "Usuario registrado (mock)");
};

export const recuperarPasswordController = (req: Request, res: Response): void => {
  const email = str(req.body?.email);
  if (!email) throw HttpError.badRequest("El email es obligatorio");

  authService.recuperarPassword(email);
  ok(res, null, "Si el email existe, vas a recibir las instrucciones (mock)");
};
