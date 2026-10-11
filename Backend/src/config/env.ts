import dotenv from "dotenv";

// Lee Backend/.env (si existe). En Render las variables se cargan desde el panel.
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT) || 3000,
  // Origen permitido por CORS. Vacío = se permite cualquiera (solo desarrollo).
  corsOrigin: process.env.CORS_ORIGIN ?? "",
};

export const isProduction = env.nodeEnv === "production";
