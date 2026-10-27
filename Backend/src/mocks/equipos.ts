import { Equipo } from "../models/Equipo";

// TODO (dueño de Equipos): sumar más registros de prueba.
export const equiposMock: Equipo[] = [
  {
    id: 1,
    clienteId: 1,
    tipo: "Celular",
    marca: "Motorola",
    modelo: "G32",
    identificador: "IMEI 356789012345678",
    condicion: "Pantalla rota",
    observaciones: "Trae cargador",
    createdAt: "2026-10-02T11:30:00.000Z",
  },
];
