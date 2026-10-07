import express from "express";
import pruebaRoutes from "./routes/pruebaRoutes";

const app = express();

app.use(express.json());

app.use("/api", pruebaRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

