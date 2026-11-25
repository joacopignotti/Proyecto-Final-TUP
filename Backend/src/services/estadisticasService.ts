
import { ordenRepository } from "../repositories/ordenRepository";
import { equipoRepository } from "../repositories/equipoRepository";
import { presupuestoRepository } from "../repositories/presupuestoRepository";
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

    const presupuestos = presupuestoRepository.list({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
      order: "asc",
    }).data;

    const ordenesPorEstado = ESTADOS_ORDEN.map((estado) => ({
      estado,
      cantidad: ordenes.filter((orden) => orden.estado === estado).length,
    }));

    const tecnicos = usuariosMock.filter(
      (usuario) => usuario.rol === "tecnico" && usuario.activo
    );

    const ordenesPorTecnico = tecnicos.map((tecnico) => {
      const ordenesAsignadas = ordenes.filter(
        (orden) => orden.tecnicoId === tecnico.id
      );

      return {
        tecnicoId: tecnico.id,
        tecnicoNombre: `${tecnico.nombre} ${tecnico.apellido}`,
        cantidad: ordenesAsignadas.length,
        finalizadas: ordenesAsignadas.filter(
          (orden) =>
            orden.estado === "finalizado" || orden.estado === "entregado"
        ).length,
      };
    });

    const presupuestosPorEstado = {
      pendientes: presupuestos.filter((p) => p.estado === "pendiente").length,
      aprobados: presupuestos.filter((p) => p.estado === "aprobado").length,
      rechazados: presupuestos.filter((p) => p.estado === "rechazado").length,
    };

    const facturacionAprobada = presupuestos
      .filter((p) => p.estado === "aprobado")
      .reduce((total, p) => total + p.total, 0);

    const ordenesEntregadas = ordenes.filter(
      (orden) => orden.fechaEntrega !== null
    );

    const tiempoPromedioReparacion =
      ordenesEntregadas.length === 0
        ? 0
        : ordenesEntregadas.reduce((total, orden) => {
            const ingreso = new Date(orden.fechaIngreso).getTime();
            const entrega = new Date(orden.fechaEntrega!).getTime();

            return total + (entrega - ingreso);
          }, 0) /
          ordenesEntregadas.length /
          (1000 * 60 * 60 * 24);

    const ordenesSinAsignar = ordenes.filter(
      (orden) => orden.tecnicoId === null
    ).length;

    return {
      totalOrdenes: ordenes.length,
      totalEquipos: equipos.length,
      ordenesPorEstado,
      ordenesPorTecnico,
      ordenesSinAsignar,
      presupuestosPorEstado,
      facturacionAprobada,
      tiempoPromedioReparacion: Number(
        tiempoPromedioReparacion.toFixed(1)
      ),
      ordenesEntregadas: ordenesEntregadas.length,
    };
  },
};


