import { request } from "./apiClient";
import type { EstadisticasDashboard } from "../types/estadisticas";

export const estadisticasService = {
  obtenerDashboard: async (): Promise<EstadisticasDashboard> => {
    const respuesta = await request<EstadisticasDashboard>(
      "/estadisticas/dashboard"
    );

    return respuesta.data!;
  },
};
