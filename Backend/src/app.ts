import express from "express";
import cors from "cors";
import path from "path";
import { env } from "./config/env";
import { errorHandler, notFound } from "./middlewares/errorHandler";
import v1Routes from "./routes/v1";

const app = express();

// CORS: en producción se restringe al origen definido en CORS_ORIGIN.
// Si el front se sirve desde este mismo servidor (como en Render hoy) no hace falta.
app.use(cors(env.corsOrigin ? { origin: env.corsOrigin } : undefined));
app.use(express.json());

// API
app.use("/api/v1", v1Routes);
app.use("/api", notFound);

// Front (build de Vite) servido por el mismo servidor
const frontendPath = path.join(__dirname, "../../Frontend/dist");
app.use(express.static(frontendPath));
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Siempre al final
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Servidor corriendo en http://localhost:${env.port}`);
});
