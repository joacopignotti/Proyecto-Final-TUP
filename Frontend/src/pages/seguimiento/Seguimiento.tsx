import { useEffect, useState, type SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

export type EstadoOrden =
  | "recibido"
  | "en_diagnostico"
  | "esperando_aprobacion"
  | "en_taller"
  | "finalizado"
  | "entregado"
  | "cancelada";

export const ESTADOS_ORDEN: EstadoOrden[] = [
  "recibido",
  "en_diagnostico",
  "esperando_aprobacion",
  "en_taller",
  "finalizado",
  "entregado",
  "cancelada",
];

export interface BitacoraPublicaDTO {
  id: number;
  fecha: string;
  descripcion: string;
}

export interface EquipoPublicoDTO {
  tipo: string;
  marca: string;
  modelo: string;
  condicion: string;
}

export interface PresupuestoPublicoDTO {
  id: number;
  estado: "pendiente" | "aprobado" | "rechazado";
  manoDeObra: number;
  total: number;
  items: Array<{
    repuesto: string;
    cantidad: number;
    costoUnitario: number;
  }>;
}

export interface SeguimientoPublicoDTO {
  codigo: string;
  estado: EstadoOrden;
  equipo: EquipoPublicoDTO;
  fallas: string;
  diagnostico: string;
  trabajoRealizado: string;
  fechaIngreso: string;
  fechaEntrega: string | null;
  bitacora: BitacoraPublicaDTO[];
  presupuesto: PresupuestoPublicoDTO | null;
}

const ETIQUETAS_ESTADO: Record<EstadoOrden, string> = {
  recibido: "Recibido",
  en_diagnostico: "En diagnóstico",
  esperando_aprobacion: "Esperando aprobación",
  en_taller: "En taller",
  finalizado: "Finalizado",
  entregado: "Entregado",
  cancelada: "Cancelada",
};

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

/** Consulta pública del cliente por código de seguimiento (no requiere login). */
export default function Seguimiento() {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();

  const [texto, setTexto] = useState(codigo ?? "");
  const [orden, setOrden] = useState<SeguimientoPublicoDTO | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTexto(codigo ?? "");

    if (!codigo || !codigo.trim()) {
      setOrden(null);
      setError(null);
      setCargando(false);
      return;
    }

    const controller = new AbortController();
    const codigoLimpio = codigo.trim();

    const consultar = async () => {
      setCargando(true);
      setError(null);
      setOrden(null);

      try {
        const resp = await fetch(
          `${API_BASE}/seguimiento/${encodeURIComponent(codigoLimpio)}`,
          { signal: controller.signal }
        );
        const body = await resp.json().catch(() => null);

        if (!resp.ok) {
          const mensaje =
            body && typeof body.message === "string"
              ? body.message
              : resp.status === 404
                ? "No se encontró ninguna orden con ese código."
                : "No se pudo consultar el seguimiento.";
          throw new Error(mensaje);
        }

        setOrden(body as SeguimientoPublicoDTO);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError((err as Error).message || "Error inesperado al consultar.");
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    };

    void consultar();

    return () => controller.abort();
  }, [codigo]);

  const buscar = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const limpio = texto.trim();
    if (!limpio) return;
    navigate(`/seguimiento/${encodeURIComponent(limpio)}`);
  };

  if (!orden) {
    return (
      <section className="auth">
        <h1>Seguimiento de tu equipo</h1>
        <form onSubmit={buscar} className="form">
          <label>
            Código de orden
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Ej: OT-2026-0001"
              required
            />
          </label>
          {error && <p className="aviso aviso--error">{error}</p>}
          <button type="submit" className="btn" disabled={cargando}>
            {cargando ? "Consultando…" : "Consultar"}
          </button>
        </form>
        {cargando && <p className="aviso">Buscando orden…</p>}
      </section>
    );
  }

  const indiceActual = ESTADOS_ORDEN.indexOf(orden.estado);
  const nombreEquipo =
    [orden.equipo.tipo, orden.equipo.marca, orden.equipo.modelo]
      .filter(Boolean)
      .join(" ") || "Sin especificar";

  return (
    <div className="seg-marco">
      <header className="seg-marco__top">
        <p className="seg-marco__brand">
          Taller <span>Gestión</span>
        </p>
        <button
          type="button"
          className="seg-marco__nueva"
          onClick={() => navigate("/seguimiento")}
        >
          Consultar otro código
        </button>
      </header>

      <div className="seg-marco__cuerpo">
        <aside className="seg-marco__aside" aria-label="Etapas de la orden">
          <div className="seg-marco__aside-titulo">Etapas</div>
          <ul className="seg-marco__nav">
            {ESTADOS_ORDEN.map((etapa, idx) => {
              const activa = etapa === orden.estado;
              const pasada = indiceActual >= 0 && idx < indiceActual;
              return (
                <li
                  key={etapa}
                  className={activa ? "is-activa" : pasada ? "is-pasada" : ""}
                >
                  <span>{ETIQUETAS_ESTADO[etapa]}</span>
                  {activa && <small>Actual</small>}
                </li>
              );
            })}
          </ul>
        </aside>

        <main className="seg-marco__contenido">
          <h1>Orden #{orden.codigo}</h1>
          <p className="estado-api estado-api--ok">
            Estado: {ETIQUETAS_ESTADO[orden.estado]}
          </p>

          <form onSubmit={buscar} className="form">
            <label>
              Consultar otro código
              <input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Ej: OT-2026-0001"
                required
              />
            </label>
            <button type="submit" className="btn" disabled={cargando}>
              {cargando ? "Consultando…" : "Buscar"}
            </button>
          </form>

          {error && <p className="aviso aviso--error">{error}</p>}

          <h2>Resumen</h2>
          <div className="dashboard__resumen">
            <article className="dashboard__tarjeta">
              <span>Equipo</span>
              <strong>{nombreEquipo}</strong>
            </article>

            <article className="dashboard__tarjeta">
              <span>Fecha de ingreso</span>
              <strong>{orden.fechaIngreso}</strong>
            </article>

            <article className="dashboard__tarjeta">
              <span>Presupuesto</span>
              <strong>
                {orden.presupuesto ? `$${orden.presupuesto.total}` : "Sin emitir"}
              </strong>
            </article>
          </div>

          <div className="dashboard__secciones">
            <section className="dashboard__panel">
              <h3>Línea de tiempo</h3>

              {ESTADOS_ORDEN.map((etapa, idx) => {
                const completada = indiceActual >= 0 && idx <= indiceActual;
                const actual = etapa === orden.estado;
                const valorBarra = actual || completada ? 100 : 0;

                return (
                  <div className="dashboard__fila" key={etapa}>
                    <div className="dashboard__detalle">
                      <span>{ETIQUETAS_ESTADO[etapa]}</span>
                      <strong>
                        {actual ? "Actual" : completada ? "Completado" : "Pendiente"}
                      </strong>
                    </div>

                    <div className="dashboard__barra">
                      <div
                        className="dashboard__barra-valor"
                        style={{ width: `${valorBarra}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="dashboard__panel">
              <h3>Diagnóstico y detalle</h3>

              <div className="dashboard__fila">
                <div className="dashboard__detalle">
                  <span>Condición al ingreso</span>
                  <strong>{orden.equipo.condicion || "—"}</strong>
                </div>
              </div>

              <div className="dashboard__fila">
                <div className="dashboard__detalle">
                  <span>Fallas reportadas</span>
                  <strong>{orden.fallas || "Sin registrar"}</strong>
                </div>
              </div>

              <div className="dashboard__fila">
                <div className="dashboard__detalle">
                  <span>Diagnóstico</span>
                  <strong>{orden.diagnostico || "Pendiente"}</strong>
                </div>
              </div>

              <div className="dashboard__fila">
                <div className="dashboard__detalle">
                  <span>Trabajo realizado</span>
                  <strong>{orden.trabajoRealizado || "Sin registro aún"}</strong>
                </div>
              </div>

              {orden.fechaEntrega && (
                <div className="dashboard__fila">
                  <div className="dashboard__detalle">
                    <span>Fecha de entrega</span>
                    <strong>{orden.fechaEntrega}</strong>
                  </div>
                </div>
              )}

              {orden.presupuesto && (
                <>
                  <h3>Presupuesto ({orden.presupuesto.estado})</h3>
                  <div className="dashboard__fila">
                    <div className="dashboard__detalle">
                      <span>Mano de obra</span>
                      <strong>${orden.presupuesto.manoDeObra}</strong>
                    </div>
                  </div>
                  {orden.presupuesto.items.map((item, idx) => (
                    <div className="dashboard__fila" key={`${item.repuesto}-${idx}`}>
                      <div className="dashboard__detalle">
                        <span>
                          {item.repuesto} × {item.cantidad}
                        </span>
                        <strong>${item.costoUnitario * item.cantidad}</strong>
                      </div>
                    </div>
                  ))}
                  <div className="dashboard__fila">
                    <div className="dashboard__detalle">
                      <span>Total</span>
                      <strong>${orden.presupuesto.total}</strong>
                    </div>
                  </div>
                </>
              )}

              <h3>Bitácora ({orden.bitacora.length})</h3>
              {orden.bitacora.length === 0 ? (
                <p>No hay movimientos registrados.</p>
              ) : (
                orden.bitacora.map((entrada) => (
                  <div className="dashboard__fila" key={entrada.id}>
                    <div className="dashboard__detalle">
                      <span>
                        {entrada.fecha} — {entrada.descripcion}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}