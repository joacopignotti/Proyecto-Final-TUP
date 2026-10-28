import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { MODULOS } from '../../router/modulos'
import { getHealth } from '../../services/healthService'


import { estadisticasService } from '../../services/estadisticasService'
import type { EstadisticasDashboard } from '../../types/estadisticas'


export default function Home() {
  const { usuario } = useAuth()
  const [api, setApi] = useState<'cargando' | 'ok' | 'error'>('cargando')
  const [estadisticas, setEstadisticas] = useState<EstadisticasDashboard | null>(null)
  const [errorEstadisticas, setErrorEstadisticas] = useState(false)


  const nombresEstados: Record<string, string> = {
  recibido: 'Recibido',
  en_diagnostico: 'En diagnóstico',
  esperando_aprobacion: 'Esperando aprobación',
  en_taller: 'En taller',
  finalizado: 'Finalizado',
  entregado: 'Entregado',
  cancelada: 'Cancelada',
  }



  useEffect(() => {
    getHealth()
      .then(() => setApi('ok'))
      .catch(() => setApi('error'))


    estadisticasService.obtenerDashboard()
    .then((datos) => setEstadisticas(datos))
    .catch(() => setErrorEstadisticas(true))


  }, [])

  if (!usuario) return null
  const accesos = MODULOS.filter((m) => m.roles.includes(usuario.rol))

  const maxOrdenesEstado = Math.max(
  1,
  ...(estadisticas?.ordenesPorEstado.map((e) => e.cantidad) ?? [])
)

const maxOrdenesTecnico = Math.max(
  1,
  ...(estadisticas?.ordenesPorTecnico.map((t) => t.cantidad) ?? [])
)



  return (
    <>
      <h1>Hola, {usuario.nombre}</h1>
      <p className={`estado-api estado-api--${api}`}>
        API: {api === 'ok' ? 'conectada' : api === 'error' ? 'sin conexión' : 'verificando…'}
      </p>
       

      <h2>Dashboard</h2>

{errorEstadisticas && (
  <p>No se pudieron cargar las estadísticas.</p>
)}

{!estadisticas && !errorEstadisticas && (
  <p>Cargando estadísticas...</p>
)}

{estadisticas && (
  <div className="dashboard__resumen">
    <article className="dashboard__tarjeta">
      <span>Total de órdenes</span>
      <strong>{estadisticas.totalOrdenes}</strong>
    </article>

    <article className="dashboard__tarjeta">
      <span>Equipos registrados</span>
      <strong>{estadisticas.totalEquipos}</strong>
    </article>

    <article className="dashboard__tarjeta">
      <span>Órdenes sin asignar</span>
      <strong>{estadisticas.ordenesSinAsignar}</strong>
    </article>
  </div>
)}

  {estadisticas && (
  <div className="dashboard__secciones">

    <section className="dashboard__panel">
      <h3>Órdenes por estado</h3>

      {estadisticas.ordenesPorEstado.map((item) => (
        <div className="dashboard__fila" key={item.estado}>
          <div className="dashboard__detalle">
            <span>{nombresEstados[item.estado] ?? item.estado}</span>
            <strong>{item.cantidad}</strong>
          </div>

          <div className="dashboard__barra">
            <div
              className="dashboard__barra-valor"
              style={{
                width: `${(item.cantidad / maxOrdenesEstado) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </section>

    <section className="dashboard__panel">
      <h3>Órdenes por técnico</h3>

      {estadisticas.ordenesPorTecnico.length === 0 ? (
        <p>No hay técnicos registrados.</p>
      ) : (
        estadisticas.ordenesPorTecnico.map((tecnico) => (
          <div className="dashboard__fila" key={tecnico.tecnicoId}>
            <div className="dashboard__detalle">
              <span>{tecnico.tecnicoNombre}</span>
              <strong>{tecnico.cantidad}</strong>
            </div>

            <div className="dashboard__barra">
              <div
                className="dashboard__barra-valor"
                style={{
                  width: `${(tecnico.cantidad / maxOrdenesTecnico) * 100}%`,
                }}
              />
            </div>
          </div>
        ))
      )}
    </section>

  </div>
)}

      


      <h2>Accesos rápidos</h2>
      <div className="accesos">
        {accesos.map((m) => (
          <Link key={m.path} to={m.path} className="acceso">
            <strong>{m.titulo}</strong>
            <span>{m.descripcion}</span>
          </Link>
        ))}
      </div>

      {/* TODO (Sprint 3): dashboard con estadísticas — órdenes por estado y por técnico */}
    </>
  )
}
