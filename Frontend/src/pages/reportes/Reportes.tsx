
import { useEffect, useState } from "react";
import { estadisticasService } from "../../services/estadisticasService";
import type { EstadisticasDashboard } from "../../types/estadisticas";


import "./Reportes.css";


const formatoMoneda = (valor: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);

const nombresEstados: Record<string, string> = {
  recibido: "Recibidas",
  en_diagnostico: "En diagnóstico",
  esperando_aprobacion: "Esperando aprobación",
  en_taller: "En taller",
  finalizado: "Finalizadas",
  entregado: "Entregadas",
  cancelada: "Canceladas",
};

export default function Reportes() {
  const [estadisticas, setEstadisticas] =
    useState<EstadisticasDashboard | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarEstadisticas = async () => {
    try {
      setCargando(true);
      setError("");

      const datos = await estadisticasService.obtenerDashboard();
      setEstadisticas(datos);
    } catch {
      setError("No se pudieron cargar los reportes.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  if (cargando) {
    return <div className="p-4">Cargando reportes...</div>;
  }

  if (error || !estadisticas) {
    return (
      <div className="p-4">
        <p>{error || "No hay información disponible."}</p>
        <button className="btn btn-primary" onClick={cargarEstadisticas}>
          Reintentar
        </button>
      </div>
    );
  }

  const maxOrdenes = Math.max(
    ...estadisticas.ordenesPorEstado.map((item) => item.cantidad),
    1
  );

  return (
    <div className="reportes">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Reportes</h2>
          <p className="text-muted mb-0">
            Resumen general de la actividad del taller
          </p>
        </div>

        <button className="btn btn-outline-primary" onClick={cargarEstadisticas}>
          Actualizar datos
        </button>
      </div>

      {/* Indicadores principales */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Total de órdenes</p>
              <h3 className="fw-bold">{estadisticas.totalOrdenes}</h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Equipos registrados</p>
              <h3 className="fw-bold">{estadisticas.totalEquipos}</h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Órdenes sin asignar</p>
              <h3 className="fw-bold text-warning">
                {estadisticas.ordenesSinAsignar}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Órdenes entregadas</p>
              <h3 className="fw-bold text-success">
                {estadisticas.ordenesEntregadas}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Facturación y reparación */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Facturación aprobada</p>
              <h3 className="fw-bold text-success">
                {formatoMoneda(estadisticas.facturacionAprobada)}
              </h3>
              <small className="text-muted">
                Total de presupuestos aprobados
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">
                Tiempo promedio de reparación
              </p>
              <h3 className="fw-bold">
                {estadisticas.tiempoPromedioReparacion} días
              </h3>
              <small className="text-muted">
                Según las órdenes que tienen fecha de entrega
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Órdenes por estado */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-4">Órdenes por estado</h5>

              {estadisticas.ordenesPorEstado.length === 0 ? (
                <p className="text-muted">No hay órdenes registradas.</p>
              ) : (
                estadisticas.ordenesPorEstado.map((item) => (
                  <div key={item.estado} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>
                        {nombresEstados[item.estado] || item.estado}
                      </span>
                      <strong>{item.cantidad}</strong>
                    </div>

                    <div
                      className="progress"
                      style={{ height: "10px" }}
                    >
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${(item.cantidad / maxOrdenes) * 100}%`,
                        }}
                        aria-valuenow={item.cantidad}
                        aria-valuemin={0}
                        aria-valuemax={maxOrdenes}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Presupuestos */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-4">Estado de presupuestos</h5>

              <div className="d-flex justify-content-between mb-3">
                <span>Pendientes</span>
                <strong className="text-warning">
                  {estadisticas.presupuestosPorEstado.pendientes}
                </strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Aprobados</span>
                <strong className="text-success">
                  {estadisticas.presupuestosPorEstado.aprobados}
                </strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Rechazados</span>
                <strong className="text-danger">
                  {estadisticas.presupuestosPorEstado.rechazados}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Rendimiento por técnico */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Rendimiento por técnico</h5>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Técnico</th>
                      <th>Órdenes asignadas</th>
                      <th>Órdenes finalizadas</th>
                    </tr>
                  </thead>

                  <tbody>
                    {estadisticas.ordenesPorTecnico.map((tecnico) => (
                      <tr key={tecnico.tecnicoId}>
                        <td className="fw-semibold">
                          {tecnico.tecnicoNombre}
                        </td>
                        <td>{tecnico.cantidad}</td>
                        <td>
                          <span className="badge bg-success">
                            {tecnico.finalizadas}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {estadisticas.ordenesPorTecnico.length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center text-muted">
                          No hay técnicos con órdenes asignadas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

