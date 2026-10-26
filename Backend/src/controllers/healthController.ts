import { Request, Response } from "express";
import { ok } from "../utils/apiResponse";

export const healthController = (_req: Request, res: Response): void => {
  ok(res, { status: "up", timestamp: new Date().toISOString() }, "API funcionando");
};
