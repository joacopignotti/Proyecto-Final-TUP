import express from "express";
import pruebaRoutes from "./routes/pruebaRoutes";

import cors from "cors";
import path from "path";




const app = express();
app.use(cors());

app.use(express.json());

app.use("/api", pruebaRoutes);

const frontendPath = path.join(__dirname, "../../Frontend/dist");

app.use(express.static(frontendPath));

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

