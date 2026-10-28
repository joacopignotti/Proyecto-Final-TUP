import { ordenRepository } from "../repositories/ordenRepository";
import { equipoRepository } from "../repositories/equipoRepository";
import { usuariosMock } from "../mocks/usuarios";
import { ESTADOS_ORDEN } from "../models/Orden";

export const estadisticasService = {
  obtenerDashboard: () => {
    
    const ordenes = ordenRepository.list({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
      order: "asc",
    }).data;

    const equipos = equipoRepository.list({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
      order: "asc",
    }).data;

    // Cantidad de órdenes agrupadas por estado.
    const ordenesPorEstado = ESTADOS_ORDEN.map((estado) => ({
      estado,
      cantidad: ordenes.filter((orden) => orden.estado === estado).length,
    }));

    
    const tecnicos = usuariosMock.filter(
      (usuario) => usuario.rol === "tecnico" && usuario.activo
    );

    const ordenesPorTecnico = tecnicos.map((tecnico) => ({
      tecnicoId: tecnico.id,
      tecnicoNombre: `${tecnico.nombre} ${tecnico.apellido}`,
      cantidad: ordenes.filter((orden) => orden.tecnicoId === tecnico.id).length,
    }));

   
    const sinAsignar = ordenes.filter(
      (orden) => orden.tecnicoId === null
    ).length;

    return {
      totalOrdenes: ordenes.length,
      totalEquipos: equipos.length,
      ordenesPorEstado,
      ordenesPorTecnico,
      ordenesSinAsignar: sinAsignar,
    };
  },
};
